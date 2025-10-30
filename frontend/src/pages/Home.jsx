import React from 'react';
import ScrollAnimation from '../components/ScrollAnimation';
import FooterBanner from '../components/FooterBanner';

const Home = () => {
  return (
    <div className="dark:bg-gray-900 overflow-hidden">
      <ScrollAnimation />
      <FooterBanner />
    </div>
  );
};

export default Home;
