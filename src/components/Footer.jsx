import React from 'react';
import Link from 'next/link';
import {  Mail } from 'lucide-react';
import { FaFacebook, FaInstagram } from 'react-icons/fa';
import { BsTwitter } from 'react-icons/bs';

const Footer = () => {
  return (
    <footer className="bg-gray-800 mt-4 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Daily Check-in</h3>
            <p className="lg:text-base text-sm text-gray-300">Stay connected, stay motivated.</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 lg:lg:text-base text-sm">
              <li><Link href="/about" className="text-gray-300 hover:text-white transition">About Us</Link></li>
              <li><Link href="/features" className="text-gray-300 hover:text-white transition">Features</Link></li>
              <li><Link href="/privacy" className="text-gray-300 hover:text-white transition">Privacy Policy</Link></li>
              <li><Link href="/terms-and-condition" className="text-gray-300 hover:text-white transition">Terms of Service</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-3">Contact</h4>
            <p className=" text-gray-300 lg:text-base text-sm ">
              Email:makindeolaitan01@gmail.com<br/>
              Phone: (234)8168043011
            </p>
          </div>
          <div>
            <h4 className="text-lg text-xsfont-semibold mb-3">Follow Us</h4>
            <div className="flex space-x-4 lg:lg:text-base text-sm">
              <a href="" className="text-gray-300 hover:text-white transition"><FaFacebook size={24} /></a>
              <a href="" className="text-gray-300 hover:text-white transition"><BsTwitter size={24} /></a>
              <a href="" className="text-gray-300 hover:text-white transition"><FaInstagram size={24} /></a>
              <a href="mailto:makindeolaitan01@gmail.com" className="text-gray-300 hover:text-white transition"><Mail size={24} /></a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center">
          <p className="lg:text-sm text-xs text-gray-300">&copy; {new Date().getFullYear()} Daily Check-in. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;