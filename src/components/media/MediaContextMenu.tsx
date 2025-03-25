
import React from 'react';

interface MediaWrapperProps {
  children: React.ReactNode;
}

// Simplified wrapper component that just passes children through
const MediaWrapper: React.FC<MediaWrapperProps> = ({ children }) => {
  return <>{children}</>;
};

export default MediaWrapper;
