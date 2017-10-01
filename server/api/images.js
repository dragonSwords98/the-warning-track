'use strict'
const mongo = require('mongodb')
const fs = require('fs')

const Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
var db = new Db('trackdb', server);

const IMAGE_REPO_DIR = 'D://Bryan//proj//the-warning-track//public//images//'


// add, replaces existing
exports.uploadImage = function (req, res) {
  var image = req.body

  if (image.value.length > 1000000) {
    res.send({error:'image file size is too large', size: image.value.length});
  }

  // TODO: Verify the file matches an entry in the mongodb document before saving to file

  // TODO: do not overwrite a file, if you're overwriting a file, then replace it with the player's id to guarantee successful saving

  var imageData = image.value.replace(/^data:image\/[a-z]+;base64,/, "")
  fs.writeFile(IMAGE_REPO_DIR + image.name, imageData, 'base64', function(err) { if (err) console.log(err) })

  res.send(image);
}

// delete, doesn't care if not found - still successful
exports.deleteImage = function (req, res) {
  var image = req.body

  fs.unlink(IMAGE_REPO_DIR + image.name, function (err) { if (err) console.log(err) });
  res.send(image)

  // TODO: Delete image name reference from db, if exists
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