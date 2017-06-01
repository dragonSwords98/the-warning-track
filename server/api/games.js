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
  console.log('Adding game: ' + JSON.stringify(game));
  db.collection('games', function(err, collection) {
      collection.insert(game, {safe:true}, function(err, result) {
          if (err) {
              res.send({'error':'An error has occurred'});
          } else {
              console.log('Success: ' + JSON.stringify(result[0]));
              res.send(result[0]);
          }
      });
  });
};

exports.updateGame = function(req, res) {
  var id = req.params.id;
  var game = req.body;
  console.log('Updating game: ' + id);
  console.log(JSON.stringify(game));
  db.collection('games', function(err, collection) {
     collection.update({'_id':new BSON.ObjectID(id)}, game, {safe:true}, function(err, result) {
         if (err) {
             console.log('Error updating game: ' + err);
             res.send({'error':'An error has occurred'});
         } else {
             console.log('' + result + ' document(s) updated');
             res.send(game);
         }
     });
  });
};

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
  const games = [
    {
        _id: mongo.ObjectId("3ab356a4defa1245327bbcdf"),
        leagueId: 'NL',
        teamId: mongo.ObjectId("7fdcc1ea928be969807aa7b0"),
        opposingTeam: 'Sons of Pitches',
        location: 'Muirhead',
        datetime: moment(),
        homeOrAway: 'Home',
        complete: true,
        currentInning: 7,
        lockedInnings: [],
        currentFrame: 1,
        homeBattingOrder: [
          mongo.ObjectId("d94d563a510cdedef2a06592"),
          mongo.ObjectId("58b17d15e9e4fb1c4d034e1e"),
          mongo.ObjectId("21c92149873ad56fe00935df")
        ],
        homeFieldingLineup: {
          'CF': mongo.ObjectId("58b17d15e9e4fb1c4d034e1e"),
          'LF': mongo.ObjectId("d94d563a510cdedef2a06592"),
          'RF': mongo.ObjectId("21c92149873ad56fe00935df")
        },
        homeEarnedRuns: 6,
        awayFieldingLineup: {},
        awayEarnedRuns: 5,
        awayBattingOrder: [],
    },
    {
        _id: mongo.ObjectId("3ab356a4defa1245327bbcaa"),
        leagueId: 'CCSA',
        teamId: mongo.ObjectId("7fdcc1ea928be969807aa7b0"),
        opposingTeam: 'Kattalage',
        location: 'Goldhawk',
        datetime: moment(),
        homeOrAway: 'Home',
        complete: true,
        currentInning: 8,
        lockedInnings: [],
        currentFrame: 1,
        homeBattingOrder: [
          mongo.ObjectId("d94d563a510cdedef2a06592"),
          mongo.ObjectId("58b17d15e9e4fb1c4d034e1e"),
          mongo.ObjectId("21c92149873ad56fe00935df")
        ],
        homeFieldingLineup: {
          'CF': mongo.ObjectId("58b17d15e9e4fb1c4d034e1e"),
          'LF': mongo.ObjectId("d94d563a510cdedef2a06592"),
          'RF': mongo.ObjectId("21c92149873ad56fe00935df")
        },
        homeEarnedRuns: 16,
        awayFieldingLineup: {},
        awayEarnedRuns: 12,
        awayBattingOrder: [],
    },
    {
        _id: mongo.ObjectId("3ab356a4defa1245327bbcbb"),
        leagueId: 'SSSL',
        teamId: mongo.ObjectId("7fdcc1ea928be969807aa7b0"),
        opposingTeam: 'Brew Jays',
        location: 'Glamorgan',
        datetime: moment(),
        homeOrAway: 'Away',
        complete: true,
        currentInning: 7,
        lockedInnings: [],
        currentFrame: 0,
        homeBattingOrder: [
          mongo.ObjectId("d94d563a510cdedef2a06592"),
          mongo.ObjectId("58b17d15e9e4fb1c4d034e1e"),
          mongo.ObjectId("21c92149873ad56fe00935df")
        ],
        homeFieldingLineup: {
          'CF': mongo.ObjectId("58b17d15e9e4fb1c4d034e1e"),
          'LF': mongo.ObjectId("d94d563a510cdedef2a06592"),
          'RF': mongo.ObjectId("21c92149873ad56fe00935df")
        },
        homeEarnedRuns: 6,
        awayFieldingLineup: {},
        awayEarnedRuns: 15,
        awayBattingOrder: [],
    }];

  db.collection('games', function(err, collection) {
      collection.insert(games, {safe:true}, function(err, result) {});
  });
}
