import React, {useState} from 'react';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import Chip from '@material-ui/core/Chip';
import axios from 'axios';
import debounce from 'lodash/debounce';
import { makeStyles } from '@material-ui/core/styles';

import { Link } from 'react-router-dom'
import { Box } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%'
    },
    inline: {
        display: 'inline',
    },
    vote: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        margin: '4px 5px 0 0'
    },
    font: {
        fontSize: '20px'
    },
    cursor: {
        cursor: 'pointer'
    },
    noPadding: {
        paddingLeft: 0
    }
}));

const Questions = ({title, showDivider, index, qid, upvotes, downvotes, answerLength, hideVoting}) => {
    const classes = useStyles();
    const [upVotes, setUpvotes] = useState(upvotes);
    const [downVotes, setDownvotes] = useState(downvotes);

    const handleUpvote = () => {
        setUpvotes(upVotes+1);
        const body = {
            id: qid,
            newUpvotes: upVotes+1
        };

        debounce(async () => {
            try {
                await axios.post('https://still-woodland-82685.herokuapp.com/questions/upvote', body);
            }
            catch(e) {
                throw e;
            }
        }, 800)();
    };

    const handleDownvote = () => {
        setDownvotes(downVotes+1);
        const body = {
            id: qid,
            newDownvotes: downVotes+1
        };

        debounce(async () => {
            try {
                await axios.post('https://still-woodland-82685.herokuapp.com/questions/downvote', body);
            }
            catch(e) {
                throw e;
            }
        }, 800)();
    };

    return(
        <List className={classes.root} key={index}>
            <ListItem alignItems="flex-start" className={classes.noPadding}>
                {   !hideVoting &&
                    <ListItemAvatar className={classes.vote}>
                        <Box onClick={handleUpvote} className={classes.cursor}>
                            <ArrowDropUpIcon classes={classes.font}/>
                        </Box>
                        <Box onClick={handleDownvote}  className={classes.cursor}>
                            <ArrowDropDownIcon classes={classes.font}/>
                        </Box>
                    </ListItemAvatar>
                }
                <ListItemText
                    primary={
                        <React.Fragment>
                            <Link to={`/questions/${qid}`}>
                                {title}
                            </Link>
                        </React.Fragment>
                    }
                    secondary={
                        <React.Fragment>
                            <Typography
                                component="span"
                                variant="body2"
                                className={classes.inline}
                                color="textPrimary"
                            >
                                <Chip
                                    label={`${upVotes} Likes`}
                                />
                                <Chip
                                    label={`${downVotes} Dislikes`}
                                />
                                { answerLength !== undefined &&
                                    <Chip
                                        label={`${answerLength} Answers`}
                                    />
                                }
                            </Typography>
                        </React.Fragment>
                    }
                />
            </ListItem>
            {showDivider &&
                <Divider variant="inset" component="li" />
            }
        </List>
    );
};

export default Questions;