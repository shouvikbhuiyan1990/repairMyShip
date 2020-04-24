import React, { useEffect, useState } from 'react';
import moment from 'moment';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import Divider from '@material-ui/core/Divider';
import Chip from '@material-ui/core/Chip';
import debounce from 'lodash/debounce';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import Loader from './loader';
import 'react-quill/dist/quill.snow.css';
import LoyaltyIcon from '@material-ui/icons/Loyalty';
import { Typography } from '@material-ui/core';
import { getCookie } from './utility';
import {
    useHistory
} from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    root: {
        marginTop: '10px',
        display: 'flex',
        alignItems: 'center',
        padding: '20px 10px'
    },
    paperRoot: {
        maxWidth: 350
    },
    feedbackWrap: {
        margin:'0 0 20px 0'
    },
    upVote: {
        marginRight: '12px'
    },
    avatar: {
        marginRight: '8px'
    },
    name: {
        textTransform: 'capitalize'
    },
    userIcon: {
        display: 'flex',
        alignItems: 'center'
    },
    userText: {
        flexGrow: 1,
        marginRight: '10px'
    },
    gold: {
        color: '#D4AF37'
    },
    silver: {
        color: '#C0C0C0'
    },
    platinum: {
        color: '#e5e4e2'
    },
    bronze: {
        color: '#cd7f32'
    }
}));

function createMarkup(value) {
    return { __html: value };
}


const Answer = ({data, index, upvotes, downvotes, userDetails={}, fetchData, updateAnswer}) => {
    const classes = useStyles();
    const [upVotes, setUpvotes] = useState(upvotes);
    const [loader, setLoader] = useState(false);
    const [downVotes, setDownvotes] = useState(downvotes);

    const history = useHistory();

    const handleUpvote = (id) => {
        setUpvotes(upVotes+1);
        const body = {
            id,
            newUpvotes: upVotes+1
        };

        debounce(async () => {
            try {
                let res = await axios.post('https://still-woodland-82685.herokuapp.com/answers/upvote', body);
                const { data } = res;
            }
            catch(e) {
                throw e;
            }
        }, 800)();
    };

    const handleDownvote = (id) => {
        setDownvotes(downVotes+1);
        const body = {
            id,
            newDownvotes: downVotes+1
        };

        debounce(async () => {
            try {
                let res = await axios.post('https://still-woodland-82685.herokuapp.com/answers/downvote', body);
                const { data } = res;
            }
            catch(e) {
                throw e;
            }
        }, 800)();
    };

    const handleDelete = (id) => {
        setLoader(true);
        const headers = {
            headers: {
                'authorization': getCookie('loginToken')
            }
        };
        const body = {
            id: data['_id']
        };

        debounce(async () => {
            try {
                setLoader(false);
                let res = await axios.post('https://still-woodland-82685.herokuapp.com/answers/deleteOne', body, headers);
                const { data } = res;
                fetchData();
            }
            catch(e) {
                if( e.response.status === 401 ) {
                    history.push('/', {customLoginMessage: true});
                }
                setLoader(false);
                throw e;
            }
        }, 800)();
    };
    

    const loadFeedBackButtons = (answer) => (
        <Box className={classes.feedbackWrap}>
            <Chip
                icon={<ThumbUpIcon />}
                className={classes.upVote}
                label={`${upVotes}`}
                clickable
                onClick={() => handleUpvote(answer['_id'])}
            />
            <Chip
                icon={<ThumbDownIcon />}
                label={`${downVotes}`}
                clickable
                onClick={() => handleDownvote(answer['_id'])}
            />
        </Box>
    );

    const getLoyalty = (loyalty) => {
        let loyaltyvar = '';
        switch (loyalty.toLowerCase()) {
            case 'bronze':
                loyaltyvar = 'bronze'
                break;
            case 'gold':
                loyaltyvar = 'gold'
                break;
            case 'silver':
                loyaltyvar = 'silver'
                break;
            case 'platinum':
                loyaltyvar = 'platinum'
                break;
            default:
                loyaltyvar = 'bronze'
                break;
        };
        return loyaltyvar;
    };

    return (
        <React.Fragment>
            <Loader show={loader}/>
            <Paper elevation={1} className={classes.paperRoot}>
                <Box className={classes.root}>
                    <Avatar aria-label="recipe" className={classes.avatar}>
                        {userDetails.firstname.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box className={classes.userIcon}>
                        <Box className={classes.userText}>
                            <Typography variant="body2" className={classes.name}>{`${userDetails.firstname} ${userDetails.lastname}`}</Typography>
                            <Typography variant="body2">{moment(data.updated).format('DD MMM YYYY')}</Typography>
                        </Box>
                        <Box className={classes.userIcon}>
                            <LoyaltyIcon className={classes[getLoyalty(userDetails.loyalty)]}/>
                            <Typography variant="body2" className={classes.name}>{getLoyalty(userDetails.loyalty)}</Typography>
                        </Box>
                    </Box>
                </Box>
                { userDetails._id === getCookie('userId') &&
                <Box>
                    <Button size="small" color="primary" onClick={handleDelete}>
                        Delete
                    </Button>
                    <Button size="small" color="primary" onClick={() => updateAnswer(data)}>
                        Edit
                    </Button>
                </Box>
                }
            </Paper>
            <Box dangerouslySetInnerHTML={createMarkup(data.answer)}></Box>
            {loadFeedBackButtons(data)}
            <Divider />
        </React.Fragment>
    );
};

export default Answer;