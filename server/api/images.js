'use strict'
const mongo = require('mongodb')

const Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
var db = new Db('trackdb', server);


// add, replaces existing
exports.uploadImage = function (req, res) {
  var image = req.body

  console.log('lets save an image', image)

  // Save image to file

  // Add record to DB
  // db.collection(image.collection, function(err, collection) {
  //   collection.update({'_id':new BSON.ObjectID(id)}, {image: image}, {safe:true}, function(err, result) {
  //     if (err) {
  //       console.log('Error updating ' + image.collection + ': ' + err);
  //       res.send({'error':'An error has occurred'});
  //     } else {
  //       console.log('' + result + ' document(s) updated');
  //       res.send(image);
  //     }
  //   });
  // });
}

// delete, doesn't care if not found - still successful
exports.deleteImage = function (req, res) {
  var image = req.body

  console.log('lets delete an image', image)

  // Delete image from file

  // Delete record from db
  // db.collection(image.collection, function(err, collection) {
  //   collection.update({'_id':new BSON.ObjectID(id)}, {image: null}, {safe:true}, function(err, result) {
  //     if (err) {
  //       console.log('Error updating ' + image.collection + ': ' + err);
  //       res.send({'error':'An error has occurred - ' + err});
  //     } else {
  //       console.log('' + result + ' document(s) deleted');
  //       res.send(req.body);
  //     }
  //   });
  // });
}

// TODO: check this
const verifyImagesInFileInDB = function () {
  const images = [
    {
      name: 'bryan-ling.jpg',
      dir: 'public/images/bryan-ling.jpg',
      type: 'image/jpg',
      collection: 'players'
    },
    {
      name: 'sinto-ling.jpg',
      dir: 'public/images/sinto-ling.jpg',
      type: 'image/jpg',
      collection: 'players'
    },
    {
      name: 'looney-tunes.jpg',
      dir: 'public/images/looney-tunes.jpg',
      type: 'image/jpg',
      collection: 'teams'
    }
  ]
}