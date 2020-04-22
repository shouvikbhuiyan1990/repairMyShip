import React from 'react';
import { isLoggedIn } from '../common/utility';

import {
    Route,
    Redirect
  } from "react-router-dom";

const HomeRoute = ({children, ...rest}) => (
    <Route
      {...rest}
      render={() =>
        isLoggedIn() ? (
            <Redirect
                to={{
                pathname: "/myaccount",
                }}
            />
        ) : (
          children
        )
      }
    />
);

export default HomeRoute;