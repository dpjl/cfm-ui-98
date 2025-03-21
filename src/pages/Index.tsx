
import React from 'react';
import { motion } from 'framer-motion';
import GalleryContainer from '@/components/GalleryContainer';
import { LanguageProvider } from '@/hooks/use-language';

// Define container animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      when: "beforeChildren",
      staggerChildren: 0.1,
      duration: 0.3
    }
  }
};

const Index = () => {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 py-6 px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto"
        >
          <GalleryContainer title="CFM media browser" directory="directory1" />
        </motion.div>
      </div>
    </LanguageProvider>
  );
};

export default Index;
