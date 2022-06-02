var mongoose = require('mongoose');
var schema = new mongoose.Schema({


    Password:  String,

    email: {
        type: String,
        required: true,
        unique: true
    },
    firstName: {
        type: String,
        default: ''
    },
    lastName:  String,
    phone: String,

});




var user = new mongoose.model('User', schema);

module.exports = user;


let userModel = new mongoose.model('User', schema);
module.exports = userModel;