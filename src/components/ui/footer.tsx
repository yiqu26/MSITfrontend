// src/components/Footer.js
import { Button } from './button';

const Footer = () => {
  return (
    <footer className="bg-black text-white py-8">
      <div className="max-w-7xl mx-auto text-center">
        <p>&copy; 2025 Taiwan Trails. All rights reserved.</p>
        <div className="mt-4 space-x-6">
          <Button variant="link" className="text-white">Service Locator</Button>
          <Button variant="link" className="text-white">Contact Us</Button>
          <Button variant="link" className="text-white">Work with us</Button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
export {}
