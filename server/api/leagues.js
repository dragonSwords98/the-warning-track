const mongo = require('mongodb')

const Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
var db = new Db('trackdb', server);

db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'trackdb' database - leagues");
        db.collection('leagues', {strict:true}, function(err, collection) {
            if (err) {
                console.log("The 'leagues' collection doesn't exist. Creating it with sample data...");
                populateLeaguesCollection();
            }
        });
    }
});

exports.findAll = function(req, res) {
  db.collection('leagues', function(err, collection) {
      collection.find().toArray(function(err, items) {
          res.send(items);
      });
  });
};

exports.findById = function(req, res) {
  var id = mongo.ObjectID(req.params.id);
  console.log('Retrieving league: ' + id);
  db.collection('leagues', function(err, collection) {
      collection.findOne({'_id':id}, function(err, item) {
          res.send(item);
      });
  });
};

exports.addLeague = function(req, res) {
  var league = req.body;
  console.log('Adding league: ' + JSON.stringify(league));
  db.collection('leagues', function(err, collection) {
      collection.insert(league, {safe:true}, function(err, result) {
          if (err) {
              res.send({'error':'An error has occurred'});
          } else {
              console.log('Success: ' + JSON.stringify(result));
              res.send({ _id: result.insertedIds[0]});
          }
      });
  });
};

exports.updateLeague = function(req, res) {
  var id = req.params.id;
  var league = req.body;
  console.log('Updating league: ' + id);
  console.log(JSON.stringify(league));
  db.collection('leagues', function(err, collection) {
     collection.update({'_id':new BSON.ObjectID(id)}, league, {safe:true}, function(err, result) {
         if (err) {
             console.log('Error updating league: ' + err);
             res.send({'error':'An error has occurred'});
         } else {
             console.log('' + result + ' document(s) updated');
             res.send(league);
         }
     });
  });
};

exports.deleteLeague = function(req, res) {
  var id = req.params.id;
  console.log('Deleting league: ' + id);
  db.collection('leagues', function(err, collection) {
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

populateLeaguesCollection = function () {
  const ObjectId = mongo.ObjectId
  const leagues = [
    {
        _id: ObjectId("22c92149873ad56fe00935df"),
        name: 'CCSA',
        innings: 7,
        positions: ['C', '1B', '2B', 'SS', '3B', 'LF', 'LR', 'CF', 'RR', 'RF'],
        homeRunRule: true,
        mercyRuns: 5,
        noMercyInningBegin: 6,
        sliding: true,
        coedRule: 'MMMF'
    },
    {
        _id: ObjectId("31c92149873ad56fe0093592"),
        name: 'Nations League',
        innings: 7,
        positions: ['C', '1B', '2B', 'SS', '3B', 'LF', 'LR', 'CF', 'RF'],
        homeRunRule: true,
        mercyRuns: 7,
        noMercyInningBegin: 5,
        sliding: true,
        coedRule: 'MMF'

    },
    {
        _id: ObjectId("24c92149873ad56fe0093e1e"),
        name: 'SSSL',
        innings: 7,
        positions: ['C', '1B', '2B', 'SS', '3B', 'LF', 'LR', 'CF', 'RF'],
        homeRunRule: true,
        mercyRuns: 5,
        noMercyInningBegin: 6,
        sliding: true,
        coedRule: 'MMF'
    }];

    db.collection('leagues', function(err, collection) {
        collection.insert(leagues, {safe:true}, function(err, result) {});
    });
}
