import React from 'react';
import { Dictionary } from './types';

const Footer = ({ dictionary }: { dictionary: Dictionary }) => (
  <footer className="text-center mt-8 sm:mt-12 px-4 text-xs sm:text-sm text-slate-500">
    <p>{dictionary.copyright}</p>
  </footer>
);

export default Footer;