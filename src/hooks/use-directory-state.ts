
import { useState } from 'react';

export function useDirectoryState() {
  // Directory selection state
  const [selectedDirectoryIdLeft, setSelectedDirectoryIdLeft] = useState<string>("directory1");
  const [selectedDirectoryIdRight, setSelectedDirectoryIdRight] = useState<string>("directory1");
  
  return {
    selectedDirectoryIdLeft,
    setSelectedDirectoryIdLeft,
    selectedDirectoryIdRight,
    setSelectedDirectoryIdRight,
  };
}
