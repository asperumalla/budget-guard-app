/**
 * Configuration types matching backend ConfigResponse
 */

export interface AppConfig {
  auth0: Auth0Config;
  api: ApiConfig;
  features: FeaturesConfig;
  ui: UiConfig;
}

export interface Auth0Config {
  domain: string;
  clientId: string;
  redirectUri: string;
  audience?: string;
}

export interface ApiConfig {
  baseUrl: string;
  plaidApiUrl: string;
}

export interface FeaturesConfig {
  enablePlaid: boolean;
  enableReports: boolean;
}

export interface UiConfig {
  appName: string;
  theme: ThemeConfig;
}

export interface ThemeConfig {
  primaryColor: string;
}

