const connect = require('../db/connection');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const schema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        dropDups: true,
        lowercase: true,
        trim: true,
        validate( input ) {
            if( !validator.isEmail(input) ) {
                throw new Error('Email is invalid');
            }
        }
    },
    firstname: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    lastname: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        validate(input) {
            if (input.toLowerCase().indexOf('password') !== -1) {
                throw new Error('password cannot contain the phrase password');
            }   
        }
    },
    loyalty: {
        type: String,
        default: 'bronze'
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    questionsLength: {
        type: Number,
        default: 0
    },
    totalAnswer: {
        type: Number,
        default: 0
    }
});


schema.virtual('questions', {
    ref: 'questions',
    localField: '_id',
    foreignField: 'owner'
});

schema.virtual('answers', {
    ref: 'answers',
    localField: '_id',
    foreignField: 'ownerUser'
});

schema.pre('save', async function (next) {
    const user = this;
    
    if( user.isModified('password') ) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
});

//methods add a function to each instances of the USER schena where as statics add the function directly on the schema level
schema.methods.generateToken = async function() {
    const user = this;
    const token = jwt.sign({ _id: user._id }, 'mysecretkey');
    user.tokens = user.tokens.concat({ token });
    return token;
}

schema.statics.findByEmailPassword = async function (email, password) {
    const user = await Users.findOne({ email: email });
    if(!user) {
        throw new Error('Unable to find the user!');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if( !isMatch ) {
        throw new Error('Mismatch!');
    }

    return user;
}

const Users = mongoose.model('users', schema);

module.exports = Users;