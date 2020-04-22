import React from 'react';
import { ApolloProvider } from 'react-apollo';
import client from './apollo';
import Dash from './dash';

const Dashboard = () => {
    return (
        <ApolloProvider client={client}>
            <Dash />
        </ApolloProvider>
    )
};

export default Dashboard;