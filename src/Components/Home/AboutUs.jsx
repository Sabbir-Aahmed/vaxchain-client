import React from 'react';
import Hero from './AboutUs/Hero';
import Mission from './AboutUs/Mission';
import ProviderFeatures from './AboutUs/ProviderFeatures';
import PatientFeatures from './AboutUs/PatientFeatures';
import Trust from './AboutUs/Trust';

const AboutUs = () => {
    return (
    <div className="min-h-screen bg-background">
      <Hero/>
      <Mission/>
      <ProviderFeatures/>
      <PatientFeatures/>
      <Trust/>
    </div>
    );
};

export default AboutUs;