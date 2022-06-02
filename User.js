const UserModel = require('../models/user')
// Create and Save a new user
exports.create = async (req, res) => {
    if (!req.body.yourName && !req.body.number) {
        res.status(400).send({ message: "Content can not be empty!" });
    }

    const user = new UserModel({
        yourName: req.body.yourName,
        number:req.body.number,
        service:req.body.service,
        comment:req.body.comment,
        email:req.body.email,
        // TableType:req.body.TableType,
        // Placement:req.body.Placement,
        // Date:req.body.Date,
        // time:req.body.Time,
        // Note:req.body.Note,
    });

    await user.save().then(data => {
        res.send({
            message:"User created successfully!!",
            user:data
        });
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating user"
        });
    });
};
// Retrieve all users from the database.
exports.findAll = async (req, res) => {
    try {
        const user = await UserModel.find();
        res.status(200).json(user);
    } catch(error) {
        res.status(404).json({message: error.message});
    }
};
// Find a single User with an id
exports.findOne = async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.id);
        res.status(200).json(user);
    } catch(error) {
        res.status(404).json({ message: error.message});
    }
};
// Update a user by the id in the request
exports.update = async (req, res) => {
    if(!req.body) {
        res.status(400).send({
            message: "Data to update can not be empty!"
        });
    }

    const id = req.params.id;

    await UserModel.findByIdAndUpdate(id, req.body, { useFindAndModify: false }).then(data => {
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
// Delete a user with the specified id in the request
exports.destroy = async (req, res) => {
    await UserModel.findByIdAndRemove(req.params.id).then(data => {
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
const mongoose = require('mongoose');
const { validationResult } = require('express-validator');
const userModel = require('../models/user')

exports.getUser = (req, res, next) => {
    const currentPage = req.query.page || 1;
    const perPage = 6;
    return userModel.find()
        .countDocuments()
        .then(count => {
            console.log({ count })
            userModel.find()
                .skip((currentPage - 1) * perPage)
                .limit(perPage)
                .then(cleans => {
                    res.status(200).json({
                        message: "user fetched",
                        cleans: cleans,
                    })
                })
                .catch(err => {
                    if (!err.statusCode) {
                        err.statusCode = 500;
                    }
                    next(err)
                });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err)
        })


};



exports.postUser = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        })
    }

    const cleanName = req.body.cleanName;
    const quantity = req.body.quantity;
    const createTillNow = req.body.createTillNow;
    const predicted = req.body.predicted;
    const status = req.body.status;
    const user = new userModel({
        cleanName: cleanName,
        quantity: quantity,
        createTillNow: createTillNow,
        predicted: predicted,
        status: status
    });
    user.save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "clean Added Successfully!",
            })
        })
        .catch(err => {
            console.log(err)
        })
};

exports.updateUser = (req, res, next) => {
    userModel.findByIdAndUpdate(
        // the id of the item to find
        req.params.userId,
        // the change to be made. Mongoose will smartly combine your existing
        // document with this change, which allows for partial updates too
        req.body,
        // an option that asks mongoose to return the updated version
        // of the document instead of the pre-updated one.
        { new: true },
        // the callback function

    ).then(clean => {
        if (!clean) {
            const error = new Error("No clean Found");
            error.statusCode = 404;
            throw error
        }
        res.status(200).json({
            message: "clean Item updated succesfully",
            user: user
        })
    }).catch(err => {
        console.log(err)

        if (!err.statusCode) {
            err.statusCode = 500
        }
        next(err)
    })

}

exports.deleteUser = (req, res, next) => {
    const userId = req.params.userId;

    userModel.findByIdAndRemove(userId, function (err) {
        if (err) return next(err);
        res.status(200).json({
            message: "clean deleted succesfully",
        })
    })
}
//--------------------------------------------------------------------------

