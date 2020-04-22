import React from 'react';
import './App.css';

import Container from './components/container';
import Header from './components/header';
import { BrowserRouter } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Header />
        <Container />
      </div>
    </BrowserRouter>
  );
}

export default App;
