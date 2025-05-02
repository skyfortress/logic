import React from 'react';

// Footer component
const Footer = ({ dictionary }: { dictionary: any }) => (
  <footer className="text-center mt-12 text-sm text-slate-500">
    <p>{dictionary.copyright}</p>
  </footer>
);

export default Footer;