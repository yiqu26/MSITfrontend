// src/components/Footer.js
import React from 'react';
import { Button } from './button';

const Footer = () => {
  return (
    <footer className="bg-black text-white py-8">
      <div className="max-w-7xl mx-auto text-center">
        <p>&copy; 2025 Marugame Udon. All rights reserved.</p>
        <div className="mt-4 space-x-6">
          <Button variant="link" className="text-white">Store Locator</Button>
          <Button variant="link" className="text-white">Sustainability</Button>
          <Button variant="link" className="text-white">Careers</Button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
export {}
