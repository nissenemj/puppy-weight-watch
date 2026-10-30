import React from 'react';
import PuppyBook from '@/components/PuppyBook/PuppyBook';
import SEO from '@/components/SEO';
import { MobileOptimizedLayout } from '@/components/MobileOptimizedLayout';

const PuppyBookPage: React.FC = () => {
  return (
    <MobileOptimizedLayout className="journal-book-page">
      <SEO 
        title="Pentukirja - Tallenna pennun elämäntarina"
        description="Luo ainutlaatuinen pentukirja pennustasi. Tallenna virstanpylväitä, muistoja ja seuraa kasvua henkilökohtaisessa pentukirjassa."
        keywords="pentukirja, pentu, koira, muistot, virstanpylväät, kasvuseuranta"
      />
      <PuppyBook />
    </MobileOptimizedLayout>
  );
};

export default PuppyBookPage;
