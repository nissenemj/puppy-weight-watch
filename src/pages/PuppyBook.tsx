import React from 'react';
import PuppyBook from '@/components/PuppyBook/PuppyBook';
import SEO from '@/components/SEO';

const PuppyBookPage: React.FC = () => {
  return (
    <>
      <SEO 
        title="Pentukirja - Tallenna pennun elämäntarina"
        description="Luo ainutlaatuinen muistokirja pennustasi. Tallenna virstanpylväitä, muistoja ja seuraa kasvua henkilökohtaisessa pentukirjassa."
        keywords="pentukirja, pentu, koira, muistot, virstanpylväät, kasvuseuranta"
      />
      <PuppyBook />
    </>
  );
};

export default PuppyBookPage;