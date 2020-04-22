import React, { useState } from 'react';
import axios from 'axios';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Loader from './common/loader';
import { NavLink, useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { getCookie, deleteCookie, isLoggedIn } from './common/utility';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

const useStyles = makeStyles((theme) => ({
    link: {
        color: '#fff',
        textDecoration: 'none'
    },
    activeLink: {
        borderBottom: '2px solid #f50057'
    },
    navlinks: {
        flexGrow: 1,
        display: 'flex'
    },
    navbar: {
        maxWidth: '1200px',
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '100%'
    },
    popup: {
        display: 'flex'
    }
}));

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const Header = () => {
    const classes = useStyles();
    const [loader, setLoader] = useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const username = getCookie('userName');
    const history = useHistory();

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const goToAccount = ()=> {
        history.push('/myaccount');
        setAnchorEl(null);
    };

    const logout = async () => {
        setLoader(true);
        const headers = {
            headers: {
                'authorization': getCookie('loginToken')
            }
        };

        try {
            let result = await axios('http://localhost:8080/users/logout', headers);

            setLoader(false);
            deleteCookie('loginToken');
            deleteCookie('userName');
            deleteCookie('userId');
            history.push('/');
            setAnchorEl(null);
            sessionStorage.removeItem('isLoggedIn');
            sessionStorage.removeItem('userData');
        }
        catch (e) {
            setLoader(false);
            setAnchorEl(null);
        }
    }

    return (
        <AppBar position="static">
            <Loader show={loader} />
            <Box className={classes.navbar}>
                <Tabs aria-label="Header tabs">
                    {isLoggedIn() &&
                        <Box component="span" className={classes.navlinks}>
                            <NavLink activeClassName={classes.activeLink} className={classes.link} to="/myaccount">
                                <Tab label="My Account" {...a11yProps(0)} />
                            </NavLink>
                            <NavLink activeClassName={classes.activeLink} className={classes.link} to="/questions">
                                <Tab label="Questions" {...a11yProps(1)} />
                            </NavLink>
                            <NavLink activeClassName={classes.activeLink} className={classes.link} to="/newQuestion">
                                <Tab label="Ask Question" {...a11yProps(1)} />
                            </NavLink>
                        </Box>
                    }
                    {isLoggedIn() &&
                        <Box className={classes.popup}>
                            <Button
                                aria-controls="simple-menu"
                                aria-haspopup="true"
                                onClick={handleClick}
                                color="inherit"
                            >
                                {`Hello ${username}`}

                            </Button>
                            <Menu
                                id="simple-menu"
                                anchorEl={anchorEl}
                                keepMounted
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                            >
                                <MenuItem onClick={goToAccount}>My account</MenuItem>
                                <MenuItem onClick={logout}>Logout</MenuItem>
                            </Menu>
                        </Box>
                    }
                    {!isLoggedIn() &&
                        <NavLink activeClassName={classes.activeLink} className={classes.link} to="/">
                            <Tab label="Home" {...a11yProps(0)} />
                        </NavLink>
                    }
                </Tabs>
            </Box>
        </AppBar>
    )
}

export default Header;