import React, {useState, useRef, useEffect} from 'react';
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

const ForgotPassword = () => {
    const classes = getStyles();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isError, setError] = useState(false);
    const [isSuccess, setSuccess] = useState(false);
    const [secondPassword, setSecondPassword] = useState('');
    const [loader, setLoader] = useState(false);
    const formEl = useRef(null);

    const history = useHistory();

    const changePassword = async () => {
        setLoader(true);
        const body = {
            email,
            newPassword: secondPassword
        };

        try {
            let res = await axios.put('http://localhost:8080/users/changepassword', body);
            setLoader(false);
            const { data } = res;
            setSuccess(true);
            setError(false)
            setTimeout(() => {
                history.push('/');
            }, 2000);
        }
        catch(e) {
            setError(true);
            setSuccess(false);
            setLoader(false);
        }
    };

    useEffect(() => {
        ValidatorForm.addValidationRule('isPasswordMatch', (value) => {
            if (value !== password) {
                return false;
            }
            return true;
        });
    });

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Loader show={loader}/>
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Reset Account
                </Typography>
                <ValidatorForm
                    ref={formEl}
                    className={classes.form}
                    onSubmit={changePassword}
                >
                    <Banner type="error" text={"Something Went Wrong"} show={isError} />
                    <Banner type="success" text={"Password Changed Successfully"} show={isSuccess} />
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
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        value={password}
                        validators={['required']}
                        errorMessages={['this field is required']}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <TextValidator
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        name="repassword"
                        label="Reenter Password"
                        type="password"
                        id="repassword"
                        value={secondPassword}
                        validators={['isPasswordMatch', 'required']}
                        errorMessages={['password mismatch', 'this field is required']}
                        onChange={(e) => setSecondPassword(e.target.value)}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Change Password
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

export default ForgotPassword;