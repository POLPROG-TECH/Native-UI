import { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';
import { getResponsiveSpacing, type ResponsiveSpacing } from '../tokens/responsive';

export function useResponsiveSpacing(): ResponsiveSpacing {
  const [rs, setRs] = useState(getResponsiveSpacing);

  useEffect(() => {
    const sub = Dimensions.addEventListener('change', () => {
      setRs(getResponsiveSpacing());
    });
    return () => sub.remove();
  }, []);

  return rs;
}
