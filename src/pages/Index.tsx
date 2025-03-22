
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import GalleryContainer from '@/components/GalleryContainer';
import { LanguageProvider } from '@/hooks/use-language';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/components/AppSidebar';
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
      <SidebarProvider defaultOpen={true}>
        <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
          <div className="flex h-screen w-full overflow-hidden">
            <ResizablePanelGroup
              direction="horizontal"
              className="w-full"
            >
              {/* Sidebar Panel */}
              <ResizablePanel 
                defaultSize={20} 
                minSize={15}
                maxSize={30}
                className="border-r border-border"
              >
                <AppSidebar
                  selectedDirectoryId={selectedDirectoryId}
                  onSelectDirectory={setSelectedDirectoryId}
                />
              </ResizablePanel>

              {/* Resizable Handle */}
              <ResizableHandle withHandle />

              {/* Main Content Panel */}
              <ResizablePanel defaultSize={80} className="flex-1 overflow-hidden">
                <main className="relative overflow-auto h-full w-full">
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="w-full h-full p-6"
                  >
                    <GalleryContainer 
                      title="CFM" 
                      directory={selectedDirectoryId} 
                    />
                  </motion.div>
                </main>
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        </div>
      </SidebarProvider>
    </LanguageProvider>
  );
};

export default Index;
