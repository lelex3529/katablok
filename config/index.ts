// /config/index.ts

// This file can be used to export consolidated configuration settings.
// For sensitive keys, always use environment variables.

// Example: OpenAI API Key (should be loaded from .env)
export const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY || 'your_openai_api_key_here_if_not_set_in_env';

// Example: Base URL for the API
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';

// Example: Application name
export const APP_NAME = 'Katalyx Proposals';

// Security-related configurations (e.g., for JWT, CSRF)
export const SECURITY_CONFIG = {
  jwtSecret: process.env.JWT_SECRET || 'your_super_secret_jwt_key',
  // Add other security-related settings
};

// Add other configurations as needed
// e.g., feature flags, third-party service keys (non-sensitive parts or references to env vars)

if (process.env.NODE_ENV === 'development' && OPENAI_API_KEY === 'your_openai_api_key_here_if_not_set_in_env') {
  console.warn("OpenAI API key is using a placeholder. Please set NEXT_PUBLIC_OPENAI_API_KEY in your .env file.");
}
if (process.env.NODE_ENV === 'development' && SECURITY_CONFIG.jwtSecret === 'your_super_secret_jwt_key') {
  console.warn("JWT Secret is using a placeholder. Please set JWT_SECRET in your .env file for production.");
}
