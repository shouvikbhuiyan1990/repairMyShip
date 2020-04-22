const express = require('express');
const router = new express.Router();
const graphql = require('graphql');
const Questions = require('../models/questions');
const {getQuestionWithAnsLegth, getAnswerOwner} = require('../controller/questionCtrl');
const { auth } = require('../middleware/authenticate');

const { 
    GraphQLObjectType, GraphQLString, 
    GraphQLID, GraphQLInt,GraphQLSchema, 
    GraphQLList,GraphQLNonNull 
} = graphql;


const QuestionType = new GraphQLObjectType({
    name: 'Question',
    //We are wrapping fields in the function as we dont want to execute this ultil 
    //everything is inilized. For example below code will throw error AuthorType not 
    //found if not wrapped in a function
    fields: () => ({
        id: { type: GraphQLID  },
        title: { type: GraphQLString },
        upVote: { type: GraphQLInt },
        downVote: { type: GraphQLInt },
        answerLength: { type: GraphQLInt }
    })
});

//RootQuery describe how users can use the graph and grab data.
//E.g Root query to get all authors, get all books, get a particular 
//book or get a particular author.
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        question: {
            type: QuestionType,
            //argument passed by the user while making the query
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                //Here we define how to get data from database source

                //this will return the book with id passed in argument 
                //by the user
                return Questions.findById(args.id);
            }
        },
        questions:{
            type: new GraphQLList(QuestionType),
            resolve(parent, args) {
                return Questions.find({});
            }
        }
    }
});

//Creating a new GraphQL Schema, with options query which defines query 
//we will allow users to use when they are making request.
module.exports = new GraphQLSchema({
    query: RootQuery
});