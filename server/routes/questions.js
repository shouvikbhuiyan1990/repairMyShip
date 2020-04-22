const express = require('express');
const router = new express.Router();

const Questions = require('../models/questions');
const {getQuestionWithAnsLegth, getAnswerOwner} = require('../controller/questionCtrl');
const { auth } = require('../middleware/authenticate');

router.post('/questions/save', auth, async (req, res) => {
    const questionBody = { ...req.body, owner: req.user._id };
    const question = new Questions(questionBody);
    try {
        const qid = await question.save();
        res.status(201).send(qid);
    }
    catch(e) {
        res.status(400).send(e);
    }
});

router.get('/questions/getAll',auth, getQuestionWithAnsLegth, async (req, res) => {
    try {
        const questions = await Questions.find({}).sort({'updated': 'desc'});
        
        res.status(200).send(questions);
    }
    catch(e) {
        res.status(400).send(e);
    }
});


router.get('/question/getAnswersByQuestion/:id', auth, getAnswerOwner, async (req, res) => {
    try {
        const question = await Questions.findById(req.params.id);
        await question.populate('answers').execPopulate();
        await question.populate('answers', 'answer _id upVote downVote ownerQuestion ownerUser updated userDetails', null, { sort: { 'updated': -1 } }).execPopulate();
        res.send({
            question,
            answers: question.answers,
            userDetails: req.userDetails
        });
    }
    catch(e) {
        res.status(400).send(e);
    }
});


router.post('/questions/upvote', async (req, res) => {
    try {
        const questions = await Questions.update({_id: req.body.id}, { upVote : req.body.newUpvotes });

        res.status(200).send(questions);
    }
    catch(e) {
        res.status(400).send(e);
    }
});
 
router.post('/questions/downvote', async (req, res) => {
    try {
        const questions = await Questions.update({_id: req.body.id}, { downVote : req.body.newDownvotes });

        res.status(200).send(questions);
    }
    catch(e) {
        res.status(400).send(e);
    }
});

router.get('/question/answerlength/:id', async (req, res) => {
    try {
        const question = await Questions.findById(req.params.id);
        await question.populate('answers').execPopulate();
        res.send({
            length: question.answers.length
        });
    }
    catch(e) {
        res.status(400).send(e);
    }
});

module.exports = router;