import React, { useState, useRef } from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import axios from 'axios';
import Loader from './common/loader';
import { getCookie } from './common/utility';


import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';

import {
    useHistory,
    Link as RouterLink
} from "react-router-dom";

const getStyles = makeStyles((theme) => ({
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    multiField: {
        marginTop: '30px'
    }
}));

const NewQuestion = () => {
    const classes = getStyles();
    const [question, setQuestion] = useState('');
    const [questionBody, setQuestionBody] = useState('');
    const [loader, setLoader] = useState('');
    const formEl = useRef(null);

    const history = useHistory();

    const submitQuestion = async () => {
        setLoader(true);
        const body = {
            title: question,
            qbody: questionBody
        };

        try {
            const headers = {
                headers: {
                    'authorization': getCookie('loginToken')
                }
            };

            let res = await axios.post('https://still-woodland-82685.herokuapp.com/questions/save', body, headers);
            const { data } = res;
            setLoader(false);

            history.push(`/questions/${data._id}`);
        }
        catch(e) {
            setLoader(false);
            if( e.response.status === 401 ) {
                history.push('/', {customLoginMessage: true});
            }
        }
    };

    return (
        <Container component="main">
            <Loader show={loader}/>
            <Box component="h2">Ask a public question</Box>
            <ValidatorForm
                ref={formEl}
                className={classes.form}
                onSubmit={submitQuestion}
                >
                    <TextValidator
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        id="question"
                        label="Question"
                        name="question"
                        autoComplete="off"
                        autoFocus
                        value={question}
                        validators={['required']}
                        errorMessages={['this field is required']}
                        onChange={(e) => setQuestion(e.target.value)}
                    />
                    <TextValidator
                        id="outlined-multiline-static"
                        label="Description"
                        multiline
                        rows={4}
                        defaultValue="Default Value"
                        variant="outlined"
                        fullWidth
                        onChange={(e) => setQuestion(e.target.value)}
                        className={classes.multiField}
                        value={questionBody}
                        onChange={(e) => setQuestionBody(e.target.value)}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        margin="normal"
                        color="primary"
                        className={classes.submit}
                    >
                        Submit Question
                    </Button>
                </ValidatorForm>
        </Container>
    );
};

export default NewQuestion;