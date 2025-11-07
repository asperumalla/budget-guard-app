/**
 * Configuration service for runtime configuration
 * Fetches configuration from backend at startup
 */

import { AppConfig } from './types';
import { logger } from '../lib/logger';

let config: AppConfig | null = null;
let configPromise: Promise<AppConfig> | null = null;

/**
 * Fetches configuration from backend
 * @param backendUrl Backend URL (required)
 * @returns Configuration object
 * @throws Error if config cannot be fetched
 */
export const fetchConfig = async (backendUrl: string): Promise<AppConfig> => {
  if (!backendUrl) {
    throw new Error('Backend URL is required to fetch configuration');
  }

  const configEndpoint = `${backendUrl.replace(/\/$/, '')}/api/config`;

  try {
    logger.log('Fetching configuration from:', configEndpoint);
    const response = await fetch(configEndpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch config: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    logger.log('Configuration loaded successfully:', data);
    return data as AppConfig;
  } catch (error) {
    logger.error('Failed to fetch configuration from backend:', error);
    throw new Error(`Configuration fetch failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Initializes configuration by fetching from backend
 * Caches the result for subsequent calls
 * @param backendUrl Backend URL (required)
 * @returns Configuration object
 * @throws Error if config cannot be fetched
 */
export const initializeConfig = async (backendUrl: string): Promise<AppConfig> => {
  if (config) {
    return config;
  }

  if (configPromise) {
    return configPromise;
  }

  configPromise = fetchConfig(backendUrl);
  config = await configPromise;
  return config;
};

/**
 * Gets the current configuration
 * Must call initializeConfig() first
 * @throws Error if config is not initialized
 */
export const getConfig = (): AppConfig => {
  if (!config) {
    throw new Error('Configuration not initialized. Call initializeConfig() first.');
  }
  return config;
};

/**
 * Resets configuration (useful for testing or re-fetching)
 */
export const resetConfig = (): void => {
  config = null;
  configPromise = null;
};

