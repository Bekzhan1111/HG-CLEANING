const userModel = require("../models/user")

const bcrypt = require("bcryptjs");
const path = require("path")
const User = require("../models/user");
exports.create = async (req, res) => {
    const {firstName, lastName, email, password: plainTextPassword } = req.body
    if (plainTextPassword.length < 5) {
        return res.json({
            status:'error',
            error: "Invalid password, should be at least 6 characters"
        })
    }
    const conpass = req.body.repassword
    const password = await bcrypt.hash(plainTextPassword, 10)
    if (conpass !== plainTextPassword) {
        return res.send({
            status:'error',
            error: "Passwords are not the same"
        })
    }

    try {
        const response = await userModel.create({
            firstName,
            lastName,
            email,
            password
        })
        console.log("User has been created" + response)
    } catch (e) {
        if (e.code === 11000) {
            return res.json({
                status: 'error',
                error: "Email is already in use!"
            })
        }
        console.log(e)
        return res.json({status: 'error', error: "Something went wrong... Please try again"})
    }
    res.render(path.resolve("views/login.ejs"))
}


exports.login = async (req, res) => {
    const {email, password} = req.body
    const user= await User.findOne({email})


    if (!user) {
        return res.json({status:'error', error:"Invalid email/password"})
    }

    if (await bcrypt.compare(password, user.password)) {
        const users = await events.find({user: email, done: false})
        const account = await User.find({email: email})

        return res.render(path.resolve('views/index.ejs'), {users: users,account: account})
        return res.render(path.resolve('views/about.ejs'), {users: users,account: account})
        return res.render(path.resolve('views/contact.ejs'), {users: users,account: account})
        return res.render(path.resolve('views/portfolio.ejs'), {users: users,account: account})
        return res.render(path.resolve('views/service.ejs'), {users: users,account: account})
    }

    res.json({status:'error', error:"Invalid email/password2"})
}
exports.find = (req, res) => {
    User.find()
        .then(user=>{
            res.send(user)
        })
        .catch(err=>{
            res.status(500).send({message: err.message || "Error occurred while looking for a user"})
        })
};

exports.findOne = async (req, res) => {
    try {
        const user = await userModel.findById(req.params.id);
        res.status(200).json(user);
    } catch(error) {
        res.status(404).json({ message: error.message});
    }
};

exports.update = async (req, res) => {
    if(!req.body) {
        res.status(400).send({
            message: "Data to update can not be empty!"
        });
    }

    const id = req.params.id;

    await userModel.findByIdAndUpdate(id, req.body, { useFindAndModify: false }).then(data => {
        if (!data) {
            res.status(404).send({
                message: `User not found.`
            });
        }else{
            res.send({ message: "User updated successfully." })
        }
    }).catch(err => {
        res.status(500).send({
            message: err.message
        });
    });
};

exports.destroy = async (req, res) => {
    await userModel.findByIdAndRemove(req.params.id).then(data => {
        if (!data) {
            res.status(404).send({
                message: `User not found.`
            });
        } else {
            res.send({
                message: "User deleted successfully!"
            });
        }
    }).catch(err => {
        res.status(500).send({
            message: err.message
        });
    });
};