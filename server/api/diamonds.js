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
  var id = mongo.ObjectId(req.params.id);
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
              console.log('Success: ' + JSON.stringify(result));
              res.send({ _id: result.insertedIds[0]});
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
  const ObjectId = mongo.ObjectId
  const diamonds = [
    {
        _id: ObjectId("11c92149873ad56fe00935df"),
        name: 'Glamorgan Park',
        address: 'Kennedy Rd & Hwy 401',
        size: 'L',
        infield: 'dirt',
        lit: true,
        outfieldFence: false
    },
    {
        _id: ObjectId("11c92149873ad56fe0093e1e"),
        name: 'Goldhawk Park East',
        address: 'McCowan Rd & Steeles Ave East',
        size: 'M',
        infield: 'dirt',
        lit: false,
        outfieldFence: false
    },
    {
        _id: ObjectId("11c92149873ad56fe0093592"),
        name: 'L\'Amoreaux North',
        address: 'Kennedy Rd & Finch Ave East',
        size: 'L',
        infield: 'dirt',
        lit: true,
        outfieldFence: true
    },
    {
        _id: ObjectId("11c92149873ad56fe00ababa"),
        name: 'Wigmore Park',
        address: 'Victoria Park Rd & Lawrence Ave East',
        size: 'L',
        infield: 'dirt',
        lit: true,
        outfieldFence: false
    },
    {
        _id: ObjectId("11c92149873ad56fe00acbc7"),
        name: 'Fenside Park',
        address: 'York Mills Rd & Victoria Park Rd',
        size: 'S',
        infield: 'dirt',
        lit: true,
        outfieldFence: true
    },
    {
        _id: ObjectId("11c92149873ad56fe00acbc7"),
        name: 'Muirhead Park',
        address: 'Sheppard Ave East & Victoria Park Rd',
        size: 'M',
        infield: 'dirt',
        lit: true,
        outfieldFence: false
    },
    {
        _id: ObjectId("11c92149873ad56fe00acbc7"),
        name: 'Warden Park',
        address: 'McNicoll Ave & Warden Ave',
        size: 'L',
        infield: 'dirt',
        lit: false,
        outfieldFence: false
    }];

    db.collection('diamonds', function(err, collection) {
        collection.insert(diamonds, {safe:true}, function(err, result) {});
    });
}
