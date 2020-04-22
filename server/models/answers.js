const connect = require('../db/connection');
const mongoose = require('mongoose');
const validator = require('validator');

const schema = mongoose.Schema({
    answer: {
        type: String,
        required: true
    },
    upVote: {
        type: Number,
        default: 0
    },
    downVote: {
        type: Number,
        default: 0
    },
    ownerQuestion: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'questions'
    },
    ownerUser: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    updated: { 
        type: Date, default: Date.now 
    },
    userDetails: {
        type: Object
    },
    questionText: {
        type: String
    }
});

const Answers = mongoose.model('answers', schema);

module.exports = Answers;