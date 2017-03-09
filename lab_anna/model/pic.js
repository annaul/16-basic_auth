'use strict';

const mongoose = require('mongoose');
const Shema = mongoose.Schema;

const picSchema = Schema({
  name: { type: String, required: true },
  desc: { type: String, required: true },
  userID: { type: Schema.Types.ObjectId, required: true },
  galleryID: { type: Schema.Types.ObjectId, required: true},
  imageIRI: { type: String, required: true, unique: true},
  objectKey: { type: String, required: true, unique: true},
  created: { type: Date, default: Date.now}
});

module.exports = mongoose.model('pic', picSchema);