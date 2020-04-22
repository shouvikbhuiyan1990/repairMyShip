import React from 'react';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        '& > * + *': {
            marginTop: theme.spacing(2),
        },
    },
}));

const Alert = (props) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
};

const CustomBanner = ({ type, text, show }) => {
    const classes = useStyles();
    return (
        show ? (
        <div className={classes.root}>
            <Alert severity={type}>{text}</Alert>
        </div>
        ) : <React.Fragment></React.Fragment>
    );
}

export default CustomBanner;