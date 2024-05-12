const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema for messages
const messageSchema = new Schema({
  text: {
    type: String,
    required: true
  }
  // You can add more fields here such as timestamp, etc.
});

// Schema for group participants
const groupParticipantSchema = new Schema({
  groupName: { type: String, required: true },
  participantName: { type: String, required: true },
  // messages: [messageSchema] // Array to store message texts
  messages: [{ type: String}] // Array to store message texts
});

// Model for group participants
const GroupParticipant = mongoose.model('GroupParticipant', groupParticipantSchema);

module.exports = GroupParticipant;
