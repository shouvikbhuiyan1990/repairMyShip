import React, { useEffect, useState } from 'react';
import Container from '@material-ui/core/Container';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Loader from './common/loader';
import Questions from './common/questions';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Fab from '@material-ui/core/Fab';
import EditIcon from '@material-ui/icons/Edit';
import Tooltip from '@material-ui/core/Tooltip';
import InfoIcon from '@material-ui/icons/Info';
import { getCookie } from './common/utility';

import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';

import axios from 'axios';
import {
    useHistory,
} from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 345
    },
    qaRoot: {
        paddingRight: '2em'
    },
    cardroot: {
        border: '1px solid #ccc'
    },
    media: {
        height: 140,
    },
    container: {
        display: 'flex',
        justifyContent: 'space-evenly',
        marginTop: theme.spacing(4),
    },
    ask: {
        marginBottom: '20px'
    },
    marginLeft: {
        marginLeft: '10px'
    },
    Qacontainer: {
        display: 'flex'
    },
    info: {
        display: 'flex',
        alignItems: 'center'
    },
    tooltip: {
        boxShadow: 'none',
        maxHeight: '260px'
    }
}));

const MyAccount = () => {
    const classes = useStyles();
    const [question, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [loyalty, setLoyalty] = useState('');
    const [loader, setLoader] = useState(false);
    const history = useHistory();

    useEffect(() => {
        setLoader(true);
        const headers = {
            headers: {
                'authorization': getCookie('loginToken')
            }
        };

        const fetchData = async () => {
            try {
                let result = await axios.get('https://still-woodland-82685.herokuapp.com/users/getQuestionsByUser', headers);
                setQuestions(result.data.questions);
                setAnswers(result.data.answers);
                setLoader(false);
            }
            catch (e) {
                setLoader(false);
                if (e.response.status === 401) {
                    history.push('/', { customLoginMessage: true });
                }
            }
        }
        fetchData();
    }, [history]);


    const HtmlTooltip = withStyles((theme) => ({
        tooltip: {
            backgroundColor: '#f50057',
            color: '#fff',
            fontSize: theme.typography.pxToRem(12)
        },
    }))(Tooltip);


    useEffect(() => {
        // setLoader(true);
        const headers = {
            headers: {
                'authorization': getCookie('loginToken')
            }
        };

        const fetchData = async () => {
            try {
                // setLoader(false);
                let result = await axios.get('https://still-woodland-82685.herokuapp.com/users/getLoyalty', headers);
                setLoyalty(result.data.tier);
            }
            catch (e) {
                // setLoader(false);
                if (e.response.status === 401) {
                    history.push('/', { customLoginMessage: true });
                }
            }
        }
        fetchData();
    }, [history]);

    return (
        <Container className={classes.container}>
            <Loader show={loader}/>
            <Box className={classes.qaRoot}>
                <Fab color="secondary"
                    aria-label="edit"
                    variant="extended"
                    className={classes.ask}
                    onClick={() => { history.push('/newQuestion') }}
                >
                    <EditIcon />
                    Ask Question
                </Fab>
                <List component="nav" aria-label="main mailbox folders">
                    <ListItem>
                        <QuestionAnswerIcon />
                        <ListItemText primary="My Questions and Answers" className={classes.marginLeft} />
                    </ListItem>
                </List>
                <Divider />
                <Box className={classes.Qacontainer}>
                    <Box>
                        { question && question.length > 0 && <Box component="h3">Questions</Box> }
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
                                    hideVoting
                                />
                            ))
                        }
                    </Box>
                    <Box>
                        { answers && answers.length > 0 && <Box component="h3">Answers</Box>}
                        {
                            answers && answers.length > 0 &&
                            answers.map((data, index) => (
                                <Questions
                                    title={data.questionText}
                                    showDivider={index !== (question.length - 1)}
                                    index={index}
                                    qid={data['ownerQuestion']}
                                    upvotes={data.upVote}
                                    downvotes={data.downVote}
                                    hideVoting
                                />
                            ))
                        }
                    </Box>
                    { answers && answers.length === 0 && question && question.length === 0 && <Box component="h3">Looks like you just Started, Start writing for exciting upgrades!</Box>}
                </Box>
            </Box>
            <HtmlTooltip
                title={
                <React.Fragment>
                    <Typography color="inherit">Reward Rules</Typography>
                        <b>{'Bronze:'}</b> {'Default Category Assigned to Every User' }<br /><br />
                        <b>{'Silver:'}</b> {'Ask minimum 2 questions and write minimum 3 answers to upgrade to this category' }<br /><br />
                        <b>{'Gold:'}</b> {'Ask minimum 6 questions and write minimum 7 answers to upgrade to this category' }<br /><br />
                        <b>{'Platinum:'}</b> {'Ask minimum 10 questions and write minimum 10 answers to upgrade to this category' }
                </React.Fragment>
                }
                className={classes.tooltip}
            >
                <Card className={classes.root}>
                    <CardActionArea className={classes.cardroot}>
                        <CardMedia
                            className={classes.media}
                            image="https://via.placeholder.com/350x200"
                            title="Contemplative Reptile"
                        />
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="h2" className={classes.info}>
                                {loyalty} user <InfoIcon />
                            </Typography>
                            <Typography variant="body2" color="textSecondary" component="p">
                                You are a {loyalty} user, write and post more to get an upgrade
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </HtmlTooltip>
        </Container>
    )
}

export default MyAccount;