const express = require('express');
const router = new express.Router();

const Questions = require('../models/questions');
const Answers = require('../models/answers');
const User = require('../models/users');

const getQuestionWithAnsLegth = async (req, res, next) => {
    try {

        const questions = await Questions.find({});
       
        Promise.all(
            questions.map(async (data, index) => {
                const anslength = await Questions.findById(data['_id']);
                await anslength.populate('answers').execPopulate();
                const length = anslength.answers.length;
                await Questions.update({_id: data['_id']}, { answerLength : length });
            })
        ).then((value) => {
            next();
        });
    }
    catch(e) {
        res.status(401).send({error: 'Athorization failed'});
    }
};


const getAnswerOwner = async (req, res, next) => {
    try {
        const question = await Questions.findById(req.params.id);
        await question.populate('answers').execPopulate();

       
        Promise.all(
            question.answers.map(async (data, index) => {
                const user = await User.findOne(data['ownerUser']);
                await Answers.update({_id: data['_id']}, { userDetails : user });
            })
        ).then((value) => {
            next();
        });
    }
    catch(e) {
        res.status(401).send({error: e});
    }
};


module.exports = { getQuestionWithAnsLegth, getAnswerOwner };