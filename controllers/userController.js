const User = require("../models/user");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const addUser = async (req, res) => {
    try {
        const { username, useremail, userpassword, userphone } = req.body;
        const checkUser = await User.findOne({ where: { useremail } });

        if (checkUser) {
            return res.status(409).send({ message: "User already exist", data: checkUser });
        };
        bcrypt.hash(userpassword, 10, async (err, hash) => {
            const user = await User.create({
                username: username,
                useremail: useremail,
                userphone: userphone,
                userpassword: hash
            });
            if (user) {
                res.status(201).send({ message: "User is successfully added", data: user });
            }
        })

    } catch (err) {
        res.status(500).send(err)
    }

};

const generateAccessToken = (id, email) => {
    return jwt.sign({ userId: id, email: email }, process.env.JWT_SECRET)
};

const loginUser = async (req, res) => {
    try {
        const { useremail, userpassword } = req.body;
        const checkUser = await User.findOne({ where: { useremail } });
        if (!checkUser) {
            return res.status(404).send({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(userpassword, checkUser.userpassword);

        if (isMatch) {
            const userObj = checkUser.get({ plain: true });
            delete userObj.userpassword;

            return res.status(200).send({ message: "User is successfully logged in", token: generateAccessToken(checkUser.id, useremail), userInfo: userObj });
        } else {
            return res.status(401).send({ message: "Invalid credentials" });
        }
    } catch (err) {
        res.status(500).send(err)
    }
};

module.exports = { addUser, loginUser }