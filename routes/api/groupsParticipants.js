const express = require('express');
const router = express.Router();
const groupParticipantController = require('../../controllers/groupParticipantsController');

router.route('/:groupName/:participantName/messages')
    .get(groupParticipantController.getParticipantMessages)
    .post(groupParticipantController.addMessageToParticipant);

module.exports = router;
