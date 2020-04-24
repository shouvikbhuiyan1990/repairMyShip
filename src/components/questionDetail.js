import React, { useEffect, useState, useRef } from 'react';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import Divider from '@material-ui/core/Divider';
import ReactQuill from 'react-quill';
import Button from '@material-ui/core/Button';
import Loader from './common/loader';
import Chip from '@material-ui/core/Chip';
import Answers from './common/answers';

import { getCookie } from './common/utility';
import 'react-quill/dist/quill.snow.css';

import {
    useParams,
    useHistory
} from "react-router-dom";
import { Typography, Avatar } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%'
    },
    inline: {
        display: 'inline',
    },
    customQuill: {
        height: '250px',
        marginBottom: theme.spacing(10)
    },
    customQuillBtn: {
        marginBottom: theme.spacing(10)
    },
    lastComment: {
        marginTop: theme.spacing(8)
    },
    questionWrap: {
        display: 'flex',
        alignItems: 'center',
        marginTop: '20px'
    },
    voteBox: {
        margin: '20px 0'
    },
    voteAvatar: {
        marginRight: '8px'
    },
    feedbackWrap: {
        margin:'0 0 20px 0'
    },
    upVote: {
        marginRight: '12px'
    },
    font: {
        fontSize: '20px'
    },
    cursor: {
        cursor: 'pointer'
    },
    qsn: {
        marginBottom: '2px',
        marginTop: '6px'
    },
    flexMiddle: {
        display: 'flex',
        alignItems: 'flex-start'
    },
    qbody: {
        margin: 0
    },
    verticalAlign: {
        display: 'flex',
        flexDirection: 'column'
    }
}));

const QuestionDetail = (props) => {
    const classes = useStyles();
    const [questionDetail, setQuestionDetail] = useState([]);
    const [richText, setRichText] = useState('');
    const [loader, setLoader] = useState(false);
    const [answer, setnswer] = useState(false);
    const [upVotes, setUpvotes] = useState(0);
    const [downVotes, setDownvotes] = useState(0);
    const [updateMode, setUpdateMode] = useState(0);
    const [answerid, setAnswerId] = useState(0);
    const history = useHistory();
    const textRef = useRef();

    let { qid } = useParams();

    useEffect(() => {
        if ( questionDetail && questionDetail.question ) {
            setUpvotes(questionDetail.question.upVote);
            setDownvotes(questionDetail.question.downVote);
        }
    }, [questionDetail]);

    const fetchData = async () => {
        const headers = {
            headers: {
                'authorization': getCookie('loginToken')
            }
        };
        try {
            let result = await axios(`https://still-woodland-82685.herokuapp.com/question/getAnswersByQuestion/${qid}`, headers);
            setQuestionDetail(result.data);
        }
        catch(e) {
            if( e.response.status === 401 ) {
                history.push('/', {customLoginMessage: true});
            }
        }
    }

    const updateAnswer = (answer) => {
        setRichText(answer.answer);
        setUpdateMode(true);
        setAnswerId(answer._id);
        textRef.current.focus();
    };

    useEffect(() => {
        fetchData();
    }, [answer]);

    const answers = questionDetail.answers;

    const submitAnswer = async () => {
        setLoader(true);

        const headers = {
            headers: {
                'authorization': getCookie('loginToken')
            }
        };
        try {
            if(!updateMode) {
                const body = {
                    answer: richText,
                    ownerQuestion: qid
                };
                let res = await axios.post('https://still-woodland-82685.herokuapp.com/answers/save', body, headers);
                setLoader(false);
                const { data } = res;
                setnswer(data);
                setRichText('');
            }
            else {
                const body = {
                    newAnswer: richText,
                    id: answerid,
                    ownerQuestion: qid
                };
                let res = await axios.put('https://still-woodland-82685.herokuapp.com/answers/updateAnswer', body, headers);
                setLoader(false);
                const { data } = res;
                setnswer(data);
                setRichText('');
                fetchData();
            }
        }
        catch(e) {
            if( e.response.status === 401 ) {
                history.push('/', {customLoginMessage: true});
            }
            setLoader(false);
            setRichText('');
            throw e;
        }
    };

    return (
        <Container>
            <Loader show={loader}/>
            <Box className={classes.questionWrap}>
                <Box>
                    <Box className={`${classes.flexMiddle} ${classes.qsn}`}>
                        <Avatar className={classes.voteAvatar}>Q</Avatar>
                        <Box className={classes.verticalAlign}>
                            <Box component="h2" className={classes.qbody}>{questionDetail.question ? questionDetail.question.title : ''}</Box>
                            <Typography variant="body2">
                                {questionDetail.question ? questionDetail.question.qbody : ''}
                            </Typography>
                        </Box>
                    </Box>

                    <Box className={classes.voteBox}>
                        <Chip
                            className={classes.upVote}
                            label={`${upVotes} Likes`}
                        />
                        <Chip
                            label={`${downVotes} Dislikes`}
                        />
                    </Box>
                </Box>
            </Box>
            <Divider />
            <Box component="h3">{`${answers ? answers.length : 0} Answers`}</Box>
            {
                answers && answers.length > 0 &&
                answers.map((data, index) => (
                   <Answers
                    data={data}
                    userDetails={data.userDetails}
                    index={index}
                    upvotes={data.upVote}
                    downvotes={data.downVote}
                    fetchData={fetchData}
                    updateAnswer={updateAnswer}
                    />
                ))
            }
            {
                answers && answers.length === 0 &&
                <Box component="h4">No Answers Found</Box>
            }
            <Box component="h4" className={classes.lastComment}>Your Answer</Box>
            <ReactQuill
                ref={textRef}
                className={classes.customQuill}
                value={richText}
                onChange={setRichText}
            />
            <Button
                variant="contained"
                color="primary"
                onClick={submitAnswer}
                className={classes.customQuillBtn}
                disabled={ richText.replace(/<(.|\n)*?>/g, '').trim().length === 0 }
            >
                Post Your Answer
            </Button>
        </Container>
    );
};

export default QuestionDetail;