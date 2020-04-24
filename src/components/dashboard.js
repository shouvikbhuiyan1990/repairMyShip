import React, { useEffect, useState } from 'react';
import Container from '@material-ui/core/Container';
import axios from 'axios';
import Questions from './common/questions';
import Loader from './common/loader';
import { getCookie } from './common/utility';
import {
    useHistory,
} from "react-router-dom";

const Dashboard = () => {
    const [question, setQuestions] = useState([]);
    const [loader, setLoader] = useState(false);
    const history = useHistory();

    useEffect(() => {
        setLoader(true);
        const fetchData = async () => {
            const headers = {
                headers: {
                    'authorization': getCookie('loginToken')
                }
            };

            try {
                let result = await axios('https://still-woodland-82685.herokuapp.com/questions/getAll', headers);
                setQuestions(result.data);
                setLoader(false);
            }
            catch(e) {
                setLoader(false);
                if( e.response.status === 401 ) {
                    history.push('/', {customLoginMessage: true});
                }
            }
        }
        fetchData();
    }, [history]);


    return (
        <Container>
            <Loader show={loader}/>
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