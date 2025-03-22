
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import GalleryContainer from '@/components/GalleryContainer';
import { LanguageProvider } from '@/hooks/use-language';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/components/AppSidebar';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LanguageToggle } from '@/components/LanguageToggle';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';

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
  // State to track the currently selected directory
  const [selectedDirectoryId, setSelectedDirectoryId] = useState<string>("directory1");

  return (
    <LanguageProvider>
      <SidebarProvider>
        <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
          <div className="absolute top-4 right-4 flex items-center space-x-2 z-10">
            <LanguageToggle />
            <ThemeToggle />
          </div>
          
          <ResizablePanelGroup direction="horizontal" className="min-h-screen">
            {/* Sidebar panel */}
            <ResizablePanel 
              defaultSize={20} 
              minSize={15} 
              maxSize={30}
              className="bg-sidebar text-sidebar-foreground"
            >
              <AppSidebar
                selectedDirectoryId={selectedDirectoryId}
                onSelectDirectory={setSelectedDirectoryId}
              />
            </ResizablePanel>
            
            <ResizableHandle withHandle />
            
            {/* Main content panel */}
            <ResizablePanel defaultSize={80}>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="max-w-7xl mx-auto p-6"
              >
                <GalleryContainer 
                  title="CFM media browser" 
                  directory={selectedDirectoryId} 
                />
              </motion.div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </SidebarProvider>
    </LanguageProvider>
  );
};

export default Index;
