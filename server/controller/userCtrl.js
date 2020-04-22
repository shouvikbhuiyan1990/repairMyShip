const express = require('express');
const Users = require('../models/users');
const Question = require('../models/questions');
const Answers = require('../models/answers');

const getLoyalty = async (req, res, next) => {
    try {
        let loyalty = 'Bronze';

        const user = await Users.findById(req.user.id);
        await user.populate('questions').execPopulate();
        await user.populate('answers').execPopulate();
        await Users.update({_id: req.user.id}, { questionsLength : user.questions.length});
        await Users.update({_id: req.user.id}, { totalAnswer : user.answers.length});
        if( user.questions.length >= 2 && user.answers.length >= 3 ) {
            loyalty = 'Silver';
        }
        if( user.questions.length >= 6 && user.answers.length >= 7 ) {
            loyalty = 'Gold';
        }
        if( user.questions.length >= 10 && user.answers.length >= 10 ) {
            loyalty = 'Platinum';
        }
        await Users.update({_id: req.user.id}, { loyalty });
        next();
    }
    catch(e) {
        res.status(401).send({error: 'Athorization failed'});
    }
};




const getUserAnswers = async (req, res, next) => {
    try {
        const user = await Users.findById(req.user.id);
        await user.populate('answers', '_id upVote downVote ownerQuestion', null, { sort: { 'updated': -1 } }).execPopulate();

        Promise.all(
            user.answers.map(async (data, index) => {
                const question = await Question.findOne(data['ownerQuestion']);
                await Answers.update({_id: data['_id']}, { questionText : question.title });
            })
        ).then((value) => {
            next();
        });
    }
    catch(e) {
        res.status(401).send({error: e});
    }
};

module.exports = { getLoyalty, getUserAnswers };