
import React from 'react';

interface MediaWrapperProps {
  children: React.ReactNode;
}

// Simple wrapper component that just passes children through
// No more context menu functionality
const MediaWrapper: React.FC<MediaWrapperProps> = ({ children }) => {
  return <>{children}</>;
};

export default MediaWrapper;
