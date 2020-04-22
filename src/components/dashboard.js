import React, { useEffect, useState } from 'react';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import Questions from './common/questions';
import { getCookie } from './common/utility';
import {
    useHistory,
} from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%'
    },
    inline: {
        display: 'inline',
    },
}));

const Dashboard = () => {
    const classes = useStyles();
    const [question, setQuestions] = useState([]);
    const history = useHistory();

    useEffect(() => {
        const fetchData = async () => {
            const headers = {
                headers: {
                    'authorization': getCookie('loginToken')
                }
            };

            try {
                let result = await axios('http://localhost:8080/questions/getAll', headers);
                setQuestions(result.data);
            }
            catch(e) {
                if( e.response.status === 401 ) {
                    history.push('/', {customLoginMessage: true});
                }
            }
        }
        fetchData();
    }, []);


    return (
        <Container>
            {
                question && question.length > 0 &&
                question.map((data, index) => (
                    <Questions
                        title={data.title}
                        showDivider={index !== (question.length - 1)}
                        index={index}
                        qid={data['_id']}
                        upvotes={data.upVote}
                        downvotes={data.downVote}
                        answerLength={data.answerLength}
                    />
                ))
            }
        </Container>
    );
};

export default Dashboard;