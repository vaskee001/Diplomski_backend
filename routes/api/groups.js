const express = require('express');
const router = express.Router();
const groupsController = require('../../controllers/groupsController');
const groupParticipantController = require('../../controllers/groupParticipantsController');

router.route('/')
    .get(groupsController.getAllGroups)
    .post(groupsController.createGroup,groupParticipantController.addGroupParticipant)
    .delete(groupsController.deleteGroup);

router.route('/:participantName')
    .get(groupsController.getUserGroups)
    .post(groupParticipantController.addGroupParticipant, groupsController.addParticipantToGroup)

router.route('/:selectedGroup/participants')
    .get(groupsController.groupParticipants)

router.route('/:groupName/participants/:participantName')
    .delete(groupsController.removeParticipantFromGroup);


module.exports = router;
