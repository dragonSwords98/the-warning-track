const mongo = require('mongodb')

const Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
var db = new Db('trackdb', server);

db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'trackdb' database - teams");
        db.collection('teams', {strict:true}, function(err, collection) {
            if (err) {
                console.log("The 'teams' collection doesn't exist. Creating it with sample data...");
                populateTeamsCollection();
            }
        });
    }
});

exports.findAll = function(req, res) {
  db.collection('teams', function(err, collection) {
      collection.find().toArray(function(err, items) {
          res.send(items);
      });
  });
};

exports.findById = function(req, res) {
  var id = mongo.ObjectID(req.params.id);
  console.log('Retrieving team: ' + id);
  db.collection('teams', function(err, collection) {
      collection.findOne({'_id':id}, function(err, item) {
          res.send(item);
      });
  });
};

exports.addTeam = function(req, res) {
  console.log(req, res)
  var team = req.body;
  console.log('Adding team: ' + JSON.stringify(team));
  db.collection('teams', function(err, collection) {
    collection.insert(team, {safe:true}, function(err, result) {
      if (err) {
        res.send({'error':'An error has occurred'});
      } else {
        console.log('Success: ' + JSON.stringify(result));
        res.send({ _id: result.insertedIds[0]});
      }
    });
  });
};

exports.updateTeam = function(req, res) {
  var id = req.params.id;
  var team = req.body;
  console.log('Updating team: ' + id);
  console.log(JSON.stringify(team));
  db.collection('teams', function(err, collection) {
     collection.update({'_id':new BSON.ObjectID(id)}, team, {safe:true}, function(err, result) {
         if (err) {
             console.log('Error updating team: ' + err);
             res.send({'error':'An error has occurred'});
         } else {
             console.log('' + result + ' document(s) updated');
             res.send(team);
         }
     });
  });
};

exports.deleteTeam = function(req, res) {
  var id = req.params.id;
  console.log('Deleting team: ' + id);
  db.collection('teams', function(err, collection) {
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

populateTeamsCollection = function () {
  const ObjectId = mongo.ObjectId
  const teams = [
    {
      _id : ObjectId("7fdcc1ea928be969807aa7b0"),
      name: 'Looney Tunes',
      image: 'looney-tunes.jpg',
      leagues: [ObjectId("31c92149873ad56fe0093592")],
      description: 'We play on Wednesdays and Thursdays (6:30, 8, 9:30 PM time slots)',
      color: 'blue',
      size: 30 // should just use roster.length
    },
    {
      _id : ObjectId("4fe3f3865fa394d05880247c"),
      name: 'CCCF Bolders',
      image: 'bolders.jpg',
      leagues: [ObjectId("22c92149873ad56fe00935df")],
      description: 'We play on Saturdays and Sundays (2, 4, 6 PM time slots)',
      color: 'grey',
      size: 25
    },
    {
      _id : ObjectId("4fe3f3465fb394d05a81117c"),
      name: 'Katallage',
      image: 'katallage.jpg',
      leagues: [ObjectId("24c92149873ad56fe0093e1e")],
      description: 'We play on Saturdays and Sundays (2, 4, 6 PM time slots)',
      color: 'black',
      size: 25
    }];

    db.collection('teams', function(err, collection) {
        collection.insert(teams, {safe:true}, function(err, result) {});
    });
}
