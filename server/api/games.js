const moment = require('moment')
const mongo = require('mongodb')

const Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
var db = new Db('trackdb', server);

db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'trackdb' database - games");
        db.collection('games', {strict:true}, function(err, collection) {
            if (err) {
                console.log("The 'games' collection doesn't exist. Creating it with sample data...");
                populateGamesCollection();
            }
        });
    }
});

exports.findAll = function(req, res) {
  db.collection('games', function(err, collection) {
      collection.find().toArray(function(err, items) {
          res.send(items);
      });
  });
};

exports.findById = function(req, res) {
  var id = mongo.ObjectID(req.params.id);
  console.log('Retrieving game: ' + id);
  db.collection('games', function(err, collection) {
      collection.findOne({'_id':id}, function(err, item) {
          res.send(item);
      });
  });
};

exports.addGame = function(req, res) {
  var game = req.body;
  game.league = mongo.ObjectId(game.league)
  game.diamond = mongo.ObjectId(game.diamond)
  game.ourTeam = mongo.ObjectId(game.ourTeam)
  game.ourBattingOrder = game.ourBattingOrder.map(o => mongo.ObjectId(o))
  game.ourFieldingLineup = game.ourFieldingLineup.map(lineup => {
    let keys = Object.keys(lineup)
    for (k in keys) {
      let pos = keys[k]
      lineup[pos] = mongo.ObjectId(lineup[pos])
    }
    return lineup
  })
  console.log('Adding game: ' + JSON.stringify(game));
  db.collection('games', function(err, collection) {
      collection.insert(game, {safe:true}, function(err, result) {
          if (err) {
              res.send({'error':'An error has occurred'});
          } else {
              console.log('Success: ' + JSON.stringify(result));
              res.send({ _id: result.insertedIds[0]});
          }
      });
  });
};
    // currentInning: game.currentInning,
    // currentFrame: game.currentFrame,
    // scoresheet: game.scoresheet,
    // statusGrid: game.statusGrid,
    // gameStatus: game.gameStatus

exports.updateGame = function(req, res) {
  var id = mongo.ObjectID(req.params.id);
  var game = req.body
  db.collection('games', function(err, collection) {
     collection.updateOne({'_id': id}, { $set: game }, {safe:true}, function(err, result) {
         if (err) {
             console.log('Error updating game: ' + err)
             res.send({'error':'An error has occurred'})
         } else {
             console.log('' + result + ' document(s) updated')
             res.send(game)
         }
     })
  })
}

exports.deleteGame = function(req, res) {
  var id = req.params.id;
  console.log('Deleting game: ' + id);
  db.collection('games', function(err, collection) {
     collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
         if (err) {
             res.send({'error':'An error has occurred - ' + err});
         } else {
             console.log('' + result + ' document(s) deleted');
             res.send(req.body);
         }
     });
  });
};

populateGamesCollection = function () {
  const ObjectId = mongo.ObjectId
  const games = [
    {
      _id: ObjectId("3ab356a4defa124532712345"),
      league: ObjectId("31c92149873ad56fe0093592"),
      ourTeam: ObjectId("7fdcc1ea928be969807aa7b0"),
      opposingTeam: 'Big Bunt Theory',
      diamond: ObjectId("11c92149873ad56fe00935df"),
      datetime: moment().format('LLLL'),
      homeOrAway: 1,
      currentInning: 1,
      lockedInnings: [],
      currentFrame: 0,
      ourBattingOrder: [
        ObjectId("d94d563a510cdedef2a06592"),
        ObjectId("58b17d15e9e4fb1c4d034e1e"),
        ObjectId("21c92149873ad56fe00935df"),
        ObjectId("15ad563a510c3f4cf2a06592"),
        ObjectId("a94e163a510aabbcf2106592"),
        ObjectId("15a727bcf035aaddf2106f92"),
        ObjectId("b44dc63a510519a3f2a077af"),
        ObjectId("b44dc63a510519a3f2a06592"),
        ObjectId("3f6ac632984319e3f2ac9cb1")
      ],
      ourFieldingLineup: 
      [
        {
          'C': ObjectId("d94d563a510cdedef2a06592"),
          '1B': ObjectId("58b17d15e9e4fb1c4d034e1e"),
          '2B': ObjectId("21c92149873ad56fe00935df"),
          'SS': ObjectId("15ad563a510c3f4cf2a06592"),
          '3B': ObjectId("a94e163a510aabbcf2106592"),
          'LF': ObjectId("15a727bcf035aaddf2106f92"),
          'LR': ObjectId("b44dc63a510519a3f2a077af"),
          'CF': ObjectId("b44dc63a510519a3f2a06592"),
          'RF': ObjectId("3f6ac632984319e3f2ac9cb1")
        },
        {
          'C': ObjectId("d94d563a510cdedef2a06592"),
          '1B': ObjectId("58b17d15e9e4fb1c4d034e1e"),
          '2B': ObjectId("21c92149873ad56fe00935df"),
          'SS': ObjectId("15ad563a510c3f4cf2a06592"),
          '3B': ObjectId("a94e163a510aabbcf2106592"),
          'LF': ObjectId("15a727bcf035aaddf2106f92"),
          'LR': ObjectId("b44dc63a510519a3f2a077af"),
          'CF': ObjectId("b44dc63a510519a3f2a06592"),
          'RF': ObjectId("3f6ac632984319e3f2ac9cb1")
        },
        {
          'C': ObjectId("d94d563a510cdedef2a06592"),
          '1B': ObjectId("58b17d15e9e4fb1c4d034e1e"),
          '2B': ObjectId("21c92149873ad56fe00935df"),
          'SS': ObjectId("15ad563a510c3f4cf2a06592"),
          '3B': ObjectId("a94e163a510aabbcf2106592"),
          'LF': ObjectId("15a727bcf035aaddf2106f92"),
          'LR': ObjectId("b44dc63a510519a3f2a077af"),
          'CF': ObjectId("b44dc63a510519a3f2a06592"),
          'RF': ObjectId("3f6ac632984319e3f2ac9cb1")
        },
        {
          'C': ObjectId("d94d563a510cdedef2a06592"),
          '1B': ObjectId("58b17d15e9e4fb1c4d034e1e"),
          '2B': ObjectId("21c92149873ad56fe00935df"),
          'SS': ObjectId("15ad563a510c3f4cf2a06592"),
          '3B': ObjectId("a94e163a510aabbcf2106592"),
          'LF': ObjectId("15a727bcf035aaddf2106f92"),
          'LR': ObjectId("b44dc63a510519a3f2a077af"),
          'CF': ObjectId("b44dc63a510519a3f2a06592"),
          'RF': ObjectId("3f6ac632984319e3f2ac9cb1")
        },
        {
          'C': ObjectId("d94d563a510cdedef2a06592"),
          '1B': ObjectId("58b17d15e9e4fb1c4d034e1e"),
          '2B': ObjectId("21c92149873ad56fe00935df"),
          'SS': ObjectId("15ad563a510c3f4cf2a06592"),
          '3B': ObjectId("a94e163a510aabbcf2106592"),
          'LF': ObjectId("15a727bcf035aaddf2106f92"),
          'LR': ObjectId("b44dc63a510519a3f2a077af"),
          'CF': ObjectId("b44dc63a510519a3f2a06592"),
          'RF': ObjectId("3f6ac632984319e3f2ac9cb1")
        },
        {
          'C': ObjectId("d94d563a510cdedef2a06592"),
          '1B': ObjectId("58b17d15e9e4fb1c4d034e1e"),
          '2B': ObjectId("21c92149873ad56fe00935df"),
          'SS': ObjectId("15ad563a510c3f4cf2a06592"),
          '3B': ObjectId("a94e163a510aabbcf2106592"),
          'LF': ObjectId("15a727bcf035aaddf2106f92"),
          'LR': ObjectId("b44dc63a510519a3f2a077af"),
          'CF': ObjectId("b44dc63a510519a3f2a06592"),
          'RF': ObjectId("3f6ac632984319e3f2ac9cb1")
        },
        {
          'C': ObjectId("d94d563a510cdedef2a06592"),
          '1B': ObjectId("58b17d15e9e4fb1c4d034e1e"),
          '2B': ObjectId("21c92149873ad56fe00935df"),
          'SS': ObjectId("15ad563a510c3f4cf2a06592"),
          '3B': ObjectId("a94e163a510aabbcf2106592"),
          'LF': ObjectId("15a727bcf035aaddf2106f92"),
          'LR': ObjectId("b44dc63a510519a3f2a077af"),
          'CF': ObjectId("b44dc63a510519a3f2a06592"),
          'RF': ObjectId("3f6ac632984319e3f2ac9cb1")
        }
      ],
      opposingBattingReport: [
        {
          name: '',
          number: 0,
          atBats: [
            {
              type: null,
              depth: null,
              lane: null
            }
          ]
        },
        {
          name: '',
          number: 0,
          atBats: [
            {
              type: null,
              depth: null,
              lane: null
            }
          ]
        },
        {
          name: '',
          number: 0,
          atBats: [
            {
              type: null,
              depth: null,
              lane: null
            }
          ]
        },
        {
          name: '',
          number: 0,
          atBats: [
            {
              type: null,
              depth: null,
              lane: null
            }
          ]
        },
        {
          name: '',
          number: 0,
          atBats: [
            {
              type: null,
              depth: null,
              lane: null
            }
          ]
        },
        {
          name: '',
          number: 0,
          atBats: [
            {
              type: null,
              depth: null,
              lane: null
            }
          ]
        },
        {
          name: '',
          number: 0,
          atBats: [
            {
              type: null,
              depth: null,
              lane: null
            }
          ]
        }
      ],
      statusGrid: // our offense status
      [ 
        [ 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }
        ], 
        [ 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }
        ], 
        [ 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }
        ], 
        [ 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }
        ], 
        [ 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }
        ], 
        [ 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }
        ], 
        [ 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }
        ]
      ],
      hitGrid : // our hit status
      [ 
          [ 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }
          ], 
          [ 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }
          ], 
          [ 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }
          ], 
          [ 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }
          ], 
          [ 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }
          ], 
          [ 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }
          ], 
          [ 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }
          ]
      ],
      scoresheet: // ours vs theirs
      {
        "ours" : {
            "runs" : [ 
                0, 
                0, 
                0, 
                0, 
                0, 
                0, 
                0
            ],
            "outs" : [ 
                0, 
                0, 
                0, 
                0, 
                0, 
                0, 
                0
            ]
        },
        "theirs" : {
            "runs" : [ 
                0, 
                0, 
                0, 
                0, 
                0, 
                0, 
                0
            ],
            "outs" : [ 
                0, 
                0, 
                0, 
                0, 
                0, 
                0, 
                0
            ]
        }
      },
      gameStatus: 0
    },
    {
      _id: ObjectId("3ab356a4defa12453275432a"),
      league: ObjectId("22c92149873ad56fe00935df"),
      ourTeam: ObjectId("4fe3f3865fa394d05880247c"),
      opposingTeam: 'Messengers',
      diamond: ObjectId("11c92149873ad56fe00ababa"),
      datetime: moment().format('LLLL'),
      homeOrAway: 0,
      currentInning: 1,
      lockedInnings: [],
      currentFrame: 0,
      ourBattingOrder: [
        ObjectId("d94d563a510cdedef2a06592"),
        ObjectId("58b17d15e9e4fb1c4d034e1e"),
        ObjectId("21c92149873ad56fe00935df"),
        ObjectId("15ad563a510c3f4cf2a06592"),
        ObjectId("a94e163a510aabbcf2106592"),
        ObjectId("15a727bcf035aaddf2106f92"),
        ObjectId("b44dc63a510519a3f2a077af"),
        ObjectId("b44dc63a510519a3f2a06592"),
        ObjectId("3f6ac632984319e3f2ac9cb1")
      ],
      ourFieldingLineup: [
        {
          'C': ObjectId("d94d563a510cdedef2a06592"),
          '1B': ObjectId("58b17d15e9e4fb1c4d034e1e"),
          '2B': ObjectId("21c92149873ad56fe00935df"),
          'SS': ObjectId("15ad563a510c3f4cf2a06592"),
          '3B': ObjectId("a94e163a510aabbcf2106592"),
          'LF': ObjectId("15a727bcf035aaddf2106f92"),
          'LR': ObjectId("b44dc63a510519a3f2a077af"),
          'CF': ObjectId("b44dc63a510519a3f2a06592"),
          'RF': ObjectId("3f6ac632984319e3f2ac9cb1")
        },
        {
          'C': ObjectId("d94d563a510cdedef2a06592"),
          '1B': ObjectId("58b17d15e9e4fb1c4d034e1e"),
          '2B': ObjectId("21c92149873ad56fe00935df"),
          'SS': ObjectId("15ad563a510c3f4cf2a06592"),
          '3B': ObjectId("a94e163a510aabbcf2106592"),
          'LF': ObjectId("15a727bcf035aaddf2106f92"),
          'LR': ObjectId("b44dc63a510519a3f2a077af"),
          'CF': ObjectId("b44dc63a510519a3f2a06592"),
          'RF': ObjectId("3f6ac632984319e3f2ac9cb1")
        },
        {
          'C': ObjectId("d94d563a510cdedef2a06592"),
          '1B': ObjectId("58b17d15e9e4fb1c4d034e1e"),
          '2B': ObjectId("21c92149873ad56fe00935df"),
          'SS': ObjectId("15ad563a510c3f4cf2a06592"),
          '3B': ObjectId("a94e163a510aabbcf2106592"),
          'LF': ObjectId("15a727bcf035aaddf2106f92"),
          'LR': ObjectId("b44dc63a510519a3f2a077af"),
          'CF': ObjectId("b44dc63a510519a3f2a06592"),
          'RF': ObjectId("3f6ac632984319e3f2ac9cb1")
        },
        {
          'C': ObjectId("d94d563a510cdedef2a06592"),
          '1B': ObjectId("58b17d15e9e4fb1c4d034e1e"),
          '2B': ObjectId("21c92149873ad56fe00935df"),
          'SS': ObjectId("15ad563a510c3f4cf2a06592"),
          '3B': ObjectId("a94e163a510aabbcf2106592"),
          'LF': ObjectId("15a727bcf035aaddf2106f92"),
          'LR': ObjectId("b44dc63a510519a3f2a077af"),
          'CF': ObjectId("b44dc63a510519a3f2a06592"),
          'RF': ObjectId("3f6ac632984319e3f2ac9cb1")
        },
        {
          'C': ObjectId("d94d563a510cdedef2a06592"),
          '1B': ObjectId("58b17d15e9e4fb1c4d034e1e"),
          '2B': ObjectId("21c92149873ad56fe00935df"),
          'SS': ObjectId("15ad563a510c3f4cf2a06592"),
          '3B': ObjectId("a94e163a510aabbcf2106592"),
          'LF': ObjectId("15a727bcf035aaddf2106f92"),
          'LR': ObjectId("b44dc63a510519a3f2a077af"),
          'CF': ObjectId("b44dc63a510519a3f2a06592"),
          'RF': ObjectId("3f6ac632984319e3f2ac9cb1")
        },
        {
          'C': ObjectId("d94d563a510cdedef2a06592"),
          '1B': ObjectId("58b17d15e9e4fb1c4d034e1e"),
          '2B': ObjectId("21c92149873ad56fe00935df"),
          'SS': ObjectId("15ad563a510c3f4cf2a06592"),
          '3B': ObjectId("a94e163a510aabbcf2106592"),
          'LF': ObjectId("15a727bcf035aaddf2106f92"),
          'LR': ObjectId("b44dc63a510519a3f2a077af"),
          'CF': ObjectId("b44dc63a510519a3f2a06592"),
          'RF': ObjectId("3f6ac632984319e3f2ac9cb1")
        },
        {
          'C': ObjectId("d94d563a510cdedef2a06592"),
          '1B': ObjectId("58b17d15e9e4fb1c4d034e1e"),
          '2B': ObjectId("21c92149873ad56fe00935df"),
          'SS': ObjectId("15ad563a510c3f4cf2a06592"),
          '3B': ObjectId("a94e163a510aabbcf2106592"),
          'LF': ObjectId("15a727bcf035aaddf2106f92"),
          'LR': ObjectId("b44dc63a510519a3f2a077af"),
          'CF': ObjectId("b44dc63a510519a3f2a06592"),
          'RF': ObjectId("3f6ac632984319e3f2ac9cb1")
        }
      ],
      opposingBattingReport: [
        {
          name: '',
          number: 0,
          atBats: [
            {
              type: null,
              depth: null,
              lane: null
            }
          ]
        },
        {
          name: '',
          number: 0,
          atBats: [
            {
              type: null,
              depth: null,
              lane: null
            }
          ]
        },
        {
          name: '',
          number: 0,
          atBats: [
            {
              type: null,
              depth: null,
              lane: null
            }
          ]
        },
        {
          name: '',
          number: 0,
          atBats: [
            {
              type: null,
              depth: null,
              lane: null
            }
          ]
        },
        {
          name: '',
          number: 0,
          atBats: [
            {
              type: null,
              depth: null,
              lane: null
            }
          ]
        },
        {
          name: '',
          number: 0,
          atBats: [
            {
              type: null,
              depth: null,
              lane: null
            }
          ]
        },
        {
          name: '',
          number: 0,
          atBats: [
            {
              type: null,
              depth: null,
              lane: null
            }
          ]
        }
      ],
      statusGrid: // our offense status
      [ 
        [ 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }
        ], 
        [ 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }
        ], 
        [ 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }
        ], 
        [ 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }
        ], 
        [ 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }
        ], 
        [ 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }
        ], 
        [ 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }, 
            {
                "name" : "BENCH",
                "label" : "Bench",
                "color" : "grey"
            }
        ]
      ],
      hitGrid : // our hit status
      [ 
          [ 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }
          ], 
          [ 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }
          ], 
          [ 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }
          ], 
          [ 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }
          ], 
          [ 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }
          ], 
          [ 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }
          ], 
          [ 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }, 
              {
                  "name" : "SINGLE",
                  "label" : "Single",
                  "_id" : "Single",
                  "color" : "olive",
                  "disabled" : true
              }
          ]
      ],
      scoresheet: // ours vs theirs
      {
        "ours" : {
            "runs" : [ 
                0, 
                0, 
                0, 
                0, 
                0, 
                0, 
                0
            ],
            "outs" : [ 
                0, 
                0, 
                0, 
                0, 
                0, 
                0, 
                0
            ]
        },
        "theirs" : {
            "runs" : [ 
                0, 
                0, 
                0, 
                0, 
                0, 
                0, 
                0
            ],
            "outs" : [ 
                0, 
                0, 
                0, 
                0, 
                0, 
                0, 
                0
            ]
        }
      },
      gameStatus: 0
    }
  ]

  db.collection('games', function(err, collection) {
      collection.insert(games, {safe:true}, function(err, result) {});
  });
}
