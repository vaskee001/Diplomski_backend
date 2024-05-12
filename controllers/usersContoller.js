const User = require('../model/User');

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, 'username'); // Only fetch the username field
        if (!users || users.length === 0) {
            return res.status(204).json({ message: 'No users found' });
        }
        const usernames = users.map(user => user.username); // Extract usernames
        res.json(usernames); // Return just the array of usernames
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
}


const deleteUser = async (req, res) => {
    if (!req?.body?.id) return res.status(400).json({ "message": 'User ID required' });
    const user = await User.findOne({ _id: req.body.id }).exec();
    if (!user) {
        return res.status(204).json({ 'message': `User ID ${req.body.id} not found` });
    }
    const result = await user.deleteOne({ _id: req.body.id });
    res.json(result);
}

const getUser = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ "message": 'User ID required' });
    const user = await User.findOne({ _id: req.params.id }).exec();
    if (!user) {
        return res.status(204).json({ 'message': `User ID ${req.params.id} not found` });
    }
    res.json(user);
}

  

module.exports = {
    getAllUsers,
    deleteUser,
    getUser,
    // getAllUsersNotInGroup
}