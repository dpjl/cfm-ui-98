
import { useState } from 'react';

export function useSelectionState() {
  // Media selection state
  const [selectedIdsLeft, setSelectedIdsLeft] = useState<string[]>([]);
  const [selectedIdsRight, setSelectedIdsRight] = useState<string[]>([]);
  const [activeSide, setActiveSide] = useState<'left' | 'right'>('left');
  
  return {
    selectedIdsLeft,
    setSelectedIdsLeft,
    selectedIdsRight,
    setSelectedIdsRight,
    activeSide,
    setActiveSide
  };
}
