import { useState, useCallback } from 'react';

export interface CustomSettings {
  blur: number;
  brightness: number;
  contrast: number;
  saturation: number;
  grayscale: number;
  sepia: number;
}

const DEFAULT_SETTINGS: CustomSettings = {
  blur: 0,
  brightness: 100,
  contrast: 100,
  saturation: 100,
  grayscale: 0,
  sepia: 0,
};

export const useCustomization = () => {
  const [settings, setSettings] = useState<CustomSettings>(DEFAULT_SETTINGS);

  const updateSetting = useCallback((key: keyof CustomSettings, value: number) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
  }, []);

  const getFilterString = useCallback(() => {
    return `
      blur(${settings.blur}px) 
      brightness(${settings.brightness}%) 
      contrast(${settings.contrast}%) 
      saturate(${settings.saturation}%) 
      grayscale(${settings.grayscale}%) 
      sepia(${settings.sepia}%)
    `.replace(/\s+/g, ' ').trim();
  }, [settings]);

  return {
    settings,
    updateSetting,
    resetSettings,
    getFilterString
  };
};
