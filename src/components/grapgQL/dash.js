import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import Questions from '../common/questions';
import {
    useHistory,
} from "react-router-dom";


export const GET_QUESTIONS = gql`
    query{
        questions {
        id
        title
        upVote
        downVote
        answerLength
        }
    }
`;


const Dash = () => {
    return (
        <Query query={GET_QUESTIONS}>
            
            {({ loading, data }) => !loading && (
                <Container>
                {
                    data.questions && data.questions.length > 0 &&
                    data.questions.map((qdata, index) => (
                        <Questions
                            title={qdata.title}
                            showDivider={index !== (data.questions.length - 1)}
                            index={index}
                            qid={qdata['id']}
                            upvotes={qdata.upVote}
                            downvotes={qdata.downVote}
                            answerLength={qdata.answerLength}
                        />
                    ))
                }
                </Container>
            )}
        </Query>
    )
};

export default Dash;