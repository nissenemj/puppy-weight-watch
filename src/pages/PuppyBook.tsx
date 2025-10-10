import React from 'react';
import PuppyBook from '@/components/PuppyBook/PuppyBook';
import SEO from '@/components/SEO';
import { MobileOptimizedLayout } from '@/components/MobileOptimizedLayout';

const PuppyBookPage: React.FC = () => {
  return (
    <MobileOptimizedLayout>
      <SEO 
        title="Pentukirja - Tallenna pennun elämäntarina"
        description="Luo ainutlaatuinen muistokirja pennustasi. Tallenna virstanpylväitä, muistoja ja seuraa kasvua henkilökohtaisessa pentukirjassa."
        keywords="pentukirja, pentu, koira, muistot, virstanpylväät, kasvuseuranta"
      />
      <div className="pt-20 md:pt-24">
        <PuppyBook />
      </div>
    </MobileOptimizedLayout>
  );
};

export default PuppyBookPage;