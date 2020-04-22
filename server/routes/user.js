const express = require('express');
const router = new express.Router();
const { auth } = require('../middleware/authenticate');
const { getLoyalty, getUserAnswers } = require('../controller/userCtrl');
const { getQuestionWithAnsLegth } = require('../controller/questionCtrl');

const Users = require('../models/users');

router.post('/users/saveOne', async (req, res) => {
    const user = new Users(req.body);
    const token = await user.generateToken();
    try {
        await user.save();
        
        res.status(201).send({
            user,
            token
        });
    }
    catch(e) {
        res.status(400).send(e);
    }
});

router.get('/users/getAll', async (req, res) => { 
    // const bakka = new Users();
    try {
        const users = await Users.find({});

        res.status(200).send(users);
    }
    catch(e) {
        res.status(400).send(e);
    }
});

router.get('/users/logout', auth, async (req, res) => { 
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        });

        await req.user.save();

        res.send();
    }
    catch(e) {
        res.status(400).send(e);
    }
});

router.get('/users/getQuestionsByUser', auth, getQuestionWithAnsLegth, getUserAnswers, async (req, res) => {
    try {
        const user = await Users.findById(req.user.id);
        await user.populate('questions', '_id title upVote downVote answerLength updated qbody', null, { sort: { 'updated': -1 } }).execPopulate();
        await user.populate('answers', 'answer _id upVote downVote ownerQuestion ownerUser updated userDetails questionText', null, { sort: { 'upVote': -1 } }).execPopulate();
        res.send({
            questions: user.questions,
            answers: user.answers
        });
    }
    catch(e) {
        res.status(400).send(e);
    }
});

router.get('/users/getLoyalty', auth, getLoyalty, async (req, res) => {
    try {
        const user = await Users.findById(req.user.id);
        res.send({tier: user.loyalty});
    }
    catch(e) {
        res.status(400).send(e);
    }
});

router.post('/users/login', async (req, res) => {
    try {
        const user = await Users.findByEmailPassword(req.body.email, req.body.password);
        const token = await user.generateToken();
        await user.save();
        res.send({isValidUser: true, user, token});
    }
    catch(e) {
        res.status(400).send({isValidUser: false, message: 'Username Password Mismatch'});
    }
});

router.put('/users/changepassword', async (req, res) => {
    try {
        const user = await Users.findOne( { email : req.body.email } );
        user.password = req.body.newPassword;
        user.save();
        res.send({success: true});
    }
    catch(e) {
        res.status(400).send({isValidUser: false, message: 'Username Password Mismatch'});
    }
});

module.exports = router;