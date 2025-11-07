/**
 * React Context for application configuration
 */

import React, { createContext, useContext, ReactNode } from 'react';
import { AppConfig } from './types';
import { getConfig } from './config';

const ConfigContext = createContext<AppConfig | null>(null);

interface ConfigProviderProps {
  children: ReactNode;
}

export const ConfigProvider: React.FC<ConfigProviderProps> = ({ children }) => {
  const config = getConfig();
  
  return (
    <ConfigContext.Provider value={config}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = (): AppConfig => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within ConfigProvider');
  }
  return context;
};

