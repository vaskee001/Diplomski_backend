const Group = require('../model/Group');

const getAllGroups = async (req, res) => {
    try {
        const groups = await Group.find();
        res.json(groups);
    } catch (error) {
        console.error(error);
        res.status(500).json({ 'message': 'Server Error' });
    }
};

const getUserGroups = async (req, res) => {
    try {
      const participantName = req.params.participantName;
      // Find all groups where the participant's name exists in the participants array
      const groups = await Group.find({ participants: participantName });
      res.json(groups);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Server Error' });
    }
  };

const createGroup = async (req, res,next) => {
    try {
        const { name, participants } = req.body;
        const existingGroup = await Group.findOne({ name });
        if (existingGroup) {
            return res.status(400).json({ 'message': 'Group already exists' });
        }
        const newGroup = new Group({ name, participants });
        await newGroup.save();
        // res.json(newGroup);
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ 'message': 'Server Error' });
    }
};

const deleteGroup = async (req, res) => {
    try {
        const groupId = req.params.id;
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ 'message': 'Group not found' });
        }
        await group.remove();
        res.json({ 'message': 'Group deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 'message': 'Server Error' });
    }
};

const groupParticipants = async (req, res) => {
    try {
      const selectedGroup = req.params.selectedGroup;
      // Fetch the group data from MongoDB based on the group name
      const group = await Group.findOne({ name: selectedGroup });
      if (!group) {
        return res.status(404).json({ message: 'Group not found' });
      }
      // Extract the participants' data from the group and send it to the client
      const participants = group.participants;
      res.json({ participants });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Server Error' });
    }
  }

  const addParticipantToGroup = async (req, res) => {
    try {
        const { selectedNonParticipant, selectedGroup } = req.body;

        // Find the group by name
        const group = await Group.findOne({ name: selectedGroup });
        if (!group) {
            return res.status(404).json({ 'message': 'Group not found' });
        }

        // Check if the participant is already in the group
        if (group.participants.includes(selectedNonParticipant)) {
            return res.status(400).json({ 'message': 'Participant is already in the group' });
        }

        // Add the participant to the group
        group.participants.push(selectedNonParticipant);
        await group.save();

        res.json(group);
    } catch (error) {
        console.error(error);
        res.status(500).json({ 'message': 'Server Error' });
    }
};

const removeParticipantFromGroup = async (req, res) => {
    try {
        const { participantName, groupName } = req.params;

        // Find the group by name
        const group = await Group.findOne({ name: groupName });
        if (!group) {
            return res.status(404).json({ 'message': 'Group not found' });
        }

        // Check if the participant is in the group
        const index = group.participants.indexOf(participantName);
        if (index === -1) {
            return res.status(400).json({ 'message': 'Participant is not in the group' });
        }

        // Remove the participant from the group
        group.participants.splice(index, 1);
        await group.save();

        res.json(group);
    } catch (error) {
        console.error(error);
        res.status(500).json({ 'message': 'Server Error' });
    }
};



module.exports = {
    getAllGroups,
    createGroup,
    deleteGroup,
    getUserGroups,
    groupParticipants,
    addParticipantToGroup,
    removeParticipantFromGroup
};
