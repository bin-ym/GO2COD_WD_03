import React from 'react';
import Calculator from './components/Calculator';
import Header from './components/Header';
import Footer from './components/Footer';
import './App.css';

const App = () => {
  return (
    <div className="App">
      <Header />
      <Calculator />
      <Footer />
    </div>
  );
};

export default App;
