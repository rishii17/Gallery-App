import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container mx-auto px-4 py-4 text-center text-sm">
        &copy; {new Date().getFullYear()} Media Gallery App. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;