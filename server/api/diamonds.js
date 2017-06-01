const mongo = require('mongodb')

const Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
var db = new Db('trackdb', server);

db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'trackdb' database - diamonds");
        db.collection('diamonds', {strict:true}, function(err, collection) {
            if (err) {
                console.log("The 'diamonds' collection doesn't exist. Creating it with sample data...");
                populateDiamondsCollection();
            }
        });
    }
});

exports.findAll = function(req, res) {
  db.collection('diamonds', function(err, collection) {
      collection.find().toArray(function(err, items) {
          res.send(items);
      });
  });
};

exports.findById = function(req, res) {
  var id = mongo.ObjectID(req.params.id);
  console.log('Retrieving diamond: ' + id);
  db.collection('diamonds', function(err, collection) {
      collection.findOne({'_id':id}, function(err, item) {
          res.send(item);
      });
  });
};

exports.addDiamond = function(req, res) {
  var diamond = req.body;
  console.log('Adding diamond: ' + JSON.stringify(diamond));
  db.collection('diamonds', function(err, collection) {
      collection.insert(diamond, {safe:true}, function(err, result) {
          if (err) {
              res.send({'error':'An error has occurred'});
          } else {
              console.log('Success: ' + JSON.stringify(result[0]));
              res.send(result[0]);
          }
      });
  });
};

exports.updateDiamond = function(req, res) {
  var id = req.params.id;
  var diamond = req.body;
  console.log('Updating diamond: ' + id);
  console.log(JSON.stringify(diamond));
  db.collection('diamonds', function(err, collection) {
     collection.update({'_id':new BSON.ObjectID(id)}, diamond, {safe:true}, function(err, result) {
         if (err) {
             console.log('Error updating diamond: ' + err);
             res.send({'error':'An error has occurred'});
         } else {
             console.log('' + result + ' document(s) updated');
             res.send(diamond);
         }
     });
  });
};

exports.deleteDiamond = function(req, res) {
  var id = req.params.id;
  console.log('Deleting diamond: ' + id);
  db.collection('diamonds', function(err, collection) {
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

populateDiamondsCollection = function () {
  const diamonds = [
    {
        _id: mongo.ObjectId("11c92149873ad56fe00935df"),
        name: 'Glamorgan',
        address: 'Kennedy & 401',
        size: 'L',
        infield: 'dirt',
        outfieldFence: false
    },
    {
        _id: mongo.ObjectId("11c92149873ad56fe0093e1e"),
        name: 'Goldhawk East',
        address: 'McCowan & Steeles',
        size: 'M',
        infield: 'dirt',
        outfieldFence: false
    },
    {
        _id: mongo.ObjectId("11c92149873ad56fe0093592"),
        name: 'L\'Amoreaux North',
        address: 'Kennedy & Finch',
        size: 'L',
        infield: 'dirt',
        outfieldFence: true
    }];

    db.collection('diamonds', function(err, collection) {
        collection.insert(diamonds, {safe:true}, function(err, result) {});
    });
}
