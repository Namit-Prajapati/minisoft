// controllers/userController.js
const User = require('../models/User');
const Account = require('../models/Account');
const { v4: uuidv4 } = require('uuid');

exports.createUser = async (req, res) => {
    const { name, mail, mobile } = req.body;

    if (!name || !mail || !mobile) {
        return res.status(400).json({ message: 'Invalid body' });
    }

    const emailRegex = /\S+@\S+\.\S+/;
    const mobileRegex = /^[0-9]{10}$/;

    if (!emailRegex.test(mail) || !mobileRegex.test(mobile)) {
        return res.status(400).json({ message: 'Invalid email or mobile' });
    }

    try {
        const existingUser = await User.findOne({ mail });
        if (existingUser) {
            return res.status(409).json({ message: 'Conflict' });
        }

        const user = new User({
            name,
            mail,
            mobile,
            // uuid: Math.floor(Math.random() * 1e10).toString().padStart(10, '0'),
            uuid: uuidv4(),
            contact: [mail, mobile],
        });

        await user.save();

        const account = new Account({
            user: {
                name,
                mail,
                uuid:user.uuid,
            },
            account: {
                number: Math.floor(Math.random() * 1e16).toString().padStart(16, '0'),
                branch: 'SBIN00000009',
                bank: 'State Bank of India',
            },
            balance: {
                number: '5000',
                currency: 'INR',
            },
        });

        await account.save();

        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.updateUser = async (req, res) => {
    const { uuid, name, mail, mobile } = req.body;

    try {
        const user = await User.findOne({ uuid });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!name && !mail && !mobile) {
            return res.status(400).json({ message: 'Nothing to update' });
        }

        if (mail && user.mail !== mail) {
            const existingUser = await User.findOne({ mail });
            if (existingUser) {
                return res.status(409).json({ message: 'Email already in use' });
            }
        }

        user.name = name || user.name;
        user.mail = mail || user.mail;
        user.mobile = mobile || user.mobile;
        user.contact = [user.mail, user.mobile];

        await user.save();

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.deleteUser = async (req, res) => {
    const { uuid } = req.body;

    try {
        const user = await User.findOne({ uuid });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await Account.deleteMany({ 'user.uuid': uuid });
        await user.deleteOne();

        res.status(200).json({ message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.listUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.getUserAccount = async (req, res) => {
    const { uuid } = req.query;
    console.log(uuid)

    try {
        const account = await Account.findOne({ 'user.uuid': uuid });
        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }

        res.status(200).json(account);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
