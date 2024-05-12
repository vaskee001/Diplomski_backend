const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const groupSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true // Ensure group names are unique
  },
  participants: [{ type: String, ref: 'User' }] // Reference users by username
});

module.exports = mongoose.model('Group', groupSchema);
