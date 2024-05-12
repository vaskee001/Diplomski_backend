const GroupParticipant = require('../model/GroupParticipant');

const addGroupParticipant = async (req, res, next) => {
    try {
        const { selectedGroup, selectedNonParticipant } = req.body;

        // Check if selectedGroup is missing
        if (!selectedGroup) {
            // If selectedGroup is missing, use name and participants from req.body
            const { name, participants } = req.body;
            if (!name || !participants) {
                return res.status(400).json({ message: 'Both name and participants are required when selectedGroup is missing' });
            }
            const newParticipant = new GroupParticipant({ groupName: name, participantName: participants[0] });
            await newParticipant.save();
            return res.status(200).json({ message: 'Participant added successfully' });
        }

        // Check if selectedNonParticipant is missing
        if (!selectedNonParticipant) {
            // If selectedNonParticipant is missing, return error
            return res.status(400).json({ message: 'selectedNonParticipant is required' });
        }

        // Create a new participant with selectedGroup and selectedNonParticipant
        const newParticipant = new GroupParticipant({ groupName: selectedGroup, participantName: selectedNonParticipant });
        await newParticipant.save();
        
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};



const addMessageToParticipant = async (req, res) => {
    try {
        const { groupName, participantName } = req.params; // Extract params from URL
        const { message } = req.body; // Extract message from request body
        const participant = await GroupParticipant.findOne({ groupName, participantName });
        if (!participant) {
            return res.status(404).json({ 'message': 'Participant not found in the group' });
        }
        participant.messages.push(message);
        await participant.save();
        res.json(participant);
    } catch (error) {
        console.error(error);
        res.status(500).json({ 'message': 'Server Error' });
    }
};


const getParticipantMessages = async (req, res) => {
    try {
        const { groupName, participantName } = req.params;
        const participant = await GroupParticipant.findOne({ groupName, participantName });
        if (!participant) {
            return res.status(404).json({ 'message': 'Participant not found in the group' });
        }
        res.json({ messages: participant.messages });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 'message': 'Server Error' });
    }
};

module.exports = {
    addGroupParticipant,
    addMessageToParticipant,
    getParticipantMessages
};
