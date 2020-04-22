const express = require('express');
const router = new express.Router();

const Answers = require('../models/answers');
const { auth } = require('../middleware/authenticate');

router.post('/answers/save', auth, async (req, res) => {
    const requestBody = {...req.body, ownerUser: req.user._id};
    const answer = new Answers(requestBody);
    try {
        await answer.save();
        res.status(201).send(answer);
    }
    catch(e) {
        res.status(400).send(e);
    }
});

router.get('/answers/getAll', async (req, res) => { 
    try {
        const answers = await Answers.find({}).sort({'updated': 'desc'});

        res.status(200).send(answers);
    }
    catch(e) {
        res.status(400).send(e);
    }
});


router.post('/answers/upvote', async (req, res) => {
    try {
        const answers = await Answers.update({_id: req.body.id}, { upVote : req.body.newUpvotes });

        res.status(200).send(answers);
    }
    catch(e) {
        res.status(400).send(e);
    }
});

router.post('/answers/downvote', async (req, res) => {
    try {
        const answers = await Answers.update({_id: req.body.id}, { downVote : req.body.newDownvotes });

        res.status(200).send(answers);
    }
    catch(e) {
        res.status(400).send(e);
    }
});


router.post('/answers/deleteOne', auth, async (req, res) => {
    try {
        const answers = await Answers.findOneAndRemove({_id: req.body.id});

        res.status(200).send(answers);
    }
    catch(e) {
        res.status(400).send(e);
    }
});


router.put('/answers/updateAnswer', auth, async (req, res) => {
    try {
        const answers = await Answers.update({_id: req.body.id}, { answer : req.body.newAnswer });

        res.status(200).send(answers);
    }
    catch(e) {
        res.status(400).send(e);
    }
});

module.exports = router;