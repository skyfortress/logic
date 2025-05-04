import React from 'react';
import { Dictionary } from './types';

// Footer component
const Footer = ({ dictionary }: { dictionary: Dictionary }) => (
  <footer className="text-center mt-12 text-sm text-slate-500">
    <p>{dictionary.copyright}</p>
  </footer>
);

export default Footer;