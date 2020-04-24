import React, {useState, useRef} from 'react';
import axios from 'axios';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/VpnKey';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Loader from './common/loader';
import Banner from './common/alert';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';

import { setLogIn, setUserData, setCookie } from './common/utility';

import {
    useHistory,
    Link as RouterLink
} from 'react-router-dom';


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

const SignUp = () => {
    const classes = getStyles();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstname, setFirstName] = useState('');
    const [lastname, setLastName] = useState('');
    const [loader, setLoader] = useState(false);
    const [error, setError] = useState('');
    const formEl = useRef(null);

    const history = useHistory();

    const signUp = async () => {
        setLoader(true);
        const body = {
            email,
            firstname,
            lastname,
            password
        };
        try {
            let res = await axios.post('https://still-woodland-82685.herokuapp.com/users/saveOne', body);
            setLoader(false);
            const { data } = res;
            setLogIn(true);

            setCookie('loginToken', data.token, 1);
            setUserData(data);
            setCookie('userId', data.user._id, 1);

            setCookie('userName', `${data.user.firstname || ''} ${data.user.lastname || ''}`, 1);
            history.push('/myaccount');
        }
        catch(e) {
            setError(e.response.data.message);
            setLoader(false);
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Loader show={loader}/>
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Create Account
                </Typography>
                <ValidatorForm
                    ref={formEl}
                    className={classes.form}
                    onSubmit={signUp}
                >
                    <Banner type="error" text={error} show={error && error.length > 0}/>
                    <TextValidator
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        validators={['required', 'isEmail']}
                        errorMessages={['this field is required', 'email is not valid']}
                        autoComplete="off"
                        autoFocus
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextValidator
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        id="firstname"
                        label="First Name"
                        name="firstname"
                        autoComplete="off"
                        value={firstname}
                        validators={['required']}
                        errorMessages={['this field is required']}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                    <TextValidator
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        id="lastname"
                        label="Last Name"
                        name="lastname"
                        autoComplete="off"
                        value={lastname}
                        validators={['required']}
                        errorMessages={['this field is required']}
                        onChange={(e) => setLastName(e.target.value)}
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
                        Sign Up
                    </Button>
                    <Grid container>
                        <Grid item>
                            <Link variant="body2">
                                <RouterLink to='/'>{"Already have an account? Sign In"}</RouterLink>
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

export default SignUp;