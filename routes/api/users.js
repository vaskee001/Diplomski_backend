const express = require('express');
const router = express.Router();
const usersController = require('../../controllers/usersContoller');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');

router.route('/')
    .get(verifyRoles(ROLES_LIST.User), usersController.getAllUsers)
    .delete(verifyRoles(ROLES_LIST.User), usersController.deleteUser);

router.route('/:id')
    .get(verifyRoles(ROLES_LIST.User), usersController.getUser);

    // router.route('/:selectedGroup/notparticipants')
    // .get(verifyRoles(ROLES_LIST.User), usersController.getAllUsersNotInGroup);

module.exports = router;