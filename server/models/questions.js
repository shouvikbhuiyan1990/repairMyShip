const connect = require('../db/connection');
const mongoose = require('mongoose');
const validator = require('validator');

const schema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    qbody: {
        type: String
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'users'
    },
    upVote: {
        type: Number,
        default: 0
    },
    downVote: {
        type: Number,
        default: 0
    },
    answerLength: {
        type: Number,
        default: 0
    },
    updated: { 
        type: Date, default: Date.now 
    }
});


schema.virtual('answers', {
    ref: 'answers',
    localField: '_id',
    foreignField: 'ownerQuestion'
});

const Questions = mongoose.model('questions', schema);

module.exports = Questions;