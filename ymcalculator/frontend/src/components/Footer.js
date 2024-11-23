import React from "react";

const Footer = () => {
  return (
    <footer className="py-4 mt-auto text-center text-white bg-gray-800">
      <p>
        &copy; {new Date().getFullYear()} YM Calculator. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
