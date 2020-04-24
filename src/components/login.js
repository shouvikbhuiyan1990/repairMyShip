import React, { useState, useRef } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import axios from 'axios';
import Loader from './common/loader';
import Banner from './common/alert';
import get from 'lodash/get';

import { setLogIn, setUserData, setCookie } from './common/utility';

import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';

import {
    useHistory,
    Link as RouterLink
} from "react-router-dom";

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://material-ui.com/">
                Repair My Ship
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const getStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

const Login = () => {
    const classes = getStyles();
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [loader, setLoader] = useState(false);
    const [error, setError] = useState('');
    const formEl = useRef(null);

    const history = useHistory();

    const signIn = async () => {
        setLoader(true);
        const body = {
            email,
            password
        };

        try {
            let res = await axios.post('https://still-woodland-82685.herokuapp.com/users/login', body);
            const { data } = res;
            setLoader(false);

            setLogIn(!!data.isValidUser);


            setUserData(data.user);

            setCookie('loginToken', data.token, 1);

            setCookie('userId', data.user._id, 1);

            setCookie('userName', `${data.user.firstname || ''} ${data.user.lastname || ''}`, 1);
    
            if (!!data.isValidUser) {
                history.push('/myaccount');
            }
        }
        catch(e) {
            setError(e.response.data.message);
            setLoader(false);
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Loader show={loader}/>
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <ValidatorForm
                ref={formEl}
                className={classes.form}
                onSubmit={signIn}
                >
                    <Banner type="error" text={error || 'Please Login to Continue'} show={error.length > 0 || get(history, 'location.state.customLoginMessage', false)}/>
                    <TextValidator
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="off"
                        autoFocus
                        value={email}
                        validators={['required', 'isEmail']}
                        errorMessages={['this field is required', 'email is not valid']}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextValidator
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        validators={['required']}
                        errorMessages={['this field is required']}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Sign In
                    </Button>
                    <Grid container>
                        <Grid item xs>
                            <Link variant="body2">
                                <RouterLink to='/forgotpassword'>{"Forgot Password?"}</RouterLink>
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link variant="body2">
                                <RouterLink to='/signup'>{"Don't have an account? Sign Up"}</RouterLink>
                            </Link>
                        </Grid>
                    </Grid>
                </ValidatorForm>
            </div>
            <Box mt={8}>
                <Copyright />
            </Box>
        </Container>
    );
}

export default Login;