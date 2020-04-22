import React, { useState } from 'react';
import ProtectedRoute from './routes/protectedRoute';
import HomeRoute from './routes/homeRoute';
import Login from './login';
import Dashboard from './dashboard';
import SignUp from './signUp';
import MyAccount from './myAccount';
import QuestionDetail from './questionDetail';
import NewQuestion from './newQuestion';
import ForgotPassword from './forgotPassword';

import DashBoardQL from '../components/grapgQL/dashboard';


import {
    Switch,
    Route
} from "react-router-dom";

const Wrapper = () => {
    return (
        <Switch>
            <HomeRoute path='/' exact={true}>
                <Login />
            </HomeRoute>
            <Route path='/signup'>
                <SignUp />
            </Route>
            <Route path='/forgotpassword'>
                <ForgotPassword />
            </Route>
            <ProtectedRoute path='/questions' exact="true">
                <DashBoardQL />
            </ProtectedRoute>
            <ProtectedRoute  path='/myaccount'>
                <MyAccount />
            </ProtectedRoute>
            <ProtectedRoute  path='/questions/:qid'>
                <QuestionDetail />
            </ProtectedRoute>
            <ProtectedRoute  path='/newQuestion'>
                <NewQuestion />
            </ProtectedRoute>
        </Switch>
    );
}

export default Wrapper;