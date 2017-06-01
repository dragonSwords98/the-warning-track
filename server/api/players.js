const mongo = require('mongodb')

const Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
var db = new Db('trackdb', server);

db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'trackdb' database - players");
        db.collection('players', {strict:true}, function(err, collection) {
            if (err) {
                console.log("The 'players' collection doesn't exist. Creating it with sample data...");
                populatePlayersCollection();
            }
        });
    }
});

exports.findAll = function(req, res) {
  db.collection('players', function(err, collection) {
      collection.find().toArray(function(err, items) {
          res.send(items);
      });
  });
};

exports.findById = function(req, res) {
  var id = mongo.ObjectID(req.params.id);
  console.log('Retrieving player: ' + id);
  db.collection('players', function(err, collection) {
      collection.findOne({'_id':id}, function(err, item) {
          res.send(item);
      });
  });
};

exports.addPlayer = function(req, res) {
  var player = req.body;
  console.log('Adding player: ' + JSON.stringify(player));
  db.collection('players', function(err, collection) {
      collection.insert(player, {safe:true}, function(err, result) {
          if (err) {
              res.send({'error':'An error has occurred'});
          } else {
              console.log('Success: ' + JSON.stringify(result[0]));
              res.send(result[0]);
          }
      });
  });
};

exports.updatePlayer = function(req, res) {
  var id = req.params.id;
  var player = req.body;
  console.log('Updating player: ' + id);
  console.log(JSON.stringify(player));
  db.collection('players', function(err, collection) {
     collection.update({'_id':new BSON.ObjectID(id)}, player, {safe:true}, function(err, result) {
         if (err) {
             console.log('Error updating player: ' + err);
             res.send({'error':'An error has occurred'});
         } else {
             console.log('' + result + ' document(s) updated');
             res.send(player);
         }
     });
  });
};

exports.deletePlayer = function(req, res) {
  var id = req.params.id;
  console.log('Deleting player: ' + id);
  db.collection('players', function(err, collection) {
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

populatePlayersCollection = function () {
  const players = [
    {
        _id: mongo.ObjectId("21c92149873ad56fe00935df"),
        name: 'Bryan Ling',
        gender: 0,
        birthyear: 1991,
        jersey: 98,
        throws: 'Left',
        hits: 'Right',
        teams: [mongo.ObjectId("7fdcc1ea928be969807aa7b0"), mongo.ObjectId("4fe3f3865fa394d05880247c")]
    },
    {
        _id: mongo.ObjectId("58b17d15e9e4fb1c4d034e1e"),
        name: 'Sinto Ling',
        gender: 0,
        birthyear: 1989,
        jersey: 52,
        throws: 'Right',
        hits: 'Switch',
        teams: [mongo.ObjectId("7fdcc1ea928be969807aa7b0"), mongo.ObjectId("4fe3f3865fa394d05880247c")]
    },
    {
        _id: mongo.ObjectId("d94d563a510cdedef2a06592"),
        name: 'Chris Lo',
        gender: 0,
        birthyear: 1982,
        jersey: 6,
        throws: 'Right',
        hits: 'Right',
        teams: [mongo.ObjectId("4fe3f3865fa394d05880247c")]
    }];

    db.collection('players', function(err, collection) {
        collection.insert(players, {safe:true}, function(err, result) {});
    });
}
