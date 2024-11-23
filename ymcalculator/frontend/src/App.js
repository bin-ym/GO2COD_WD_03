import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Calculator from "./components/Calculator";

const App = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Calculator />
      </main>
      <Footer />
    </div>
  );
};

export default App;
