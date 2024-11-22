// src/App.js
import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Calculator from './components/Calculator';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow p-8">
        <Calculator />
      </main>
      <Footer />
    </div>
  );
}

export default App;
