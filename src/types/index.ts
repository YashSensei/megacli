// Type definitions for MegaCLI

export interface MegaLLMConfig {
  apiKey: string;
  baseUrl?: string;
  defaultModel?: string;
  streaming?: boolean;
  temperature?: number;
  maxTokens?: number;
  theme?: 'auto' | 'light' | 'dark';
  saveHistory?: boolean;
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatCompletionOptions {
  model: string;
  messages: ChatMessage[];
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
}

export interface ModelInfo {
  id: string;
  name: string;
  provider: string;
  contextLength: number;
  maxOutput: number;
  pricing: {
    input: number;
    output: number;
  };
  capabilities: string[];
  description?: string;
}

export interface APIError {
  code: string;
  message: string;
  type: 'authentication' | 'rate_limit' | 'invalid_request' | 'server_error' | 'quota_exceeded';
  tier?: string;
  limit?: number;
  used?: number;
  resetTime?: Date;
  upgradeUrl?: string;
}

export interface UsageStats {
  tier: string;
  status: 'active' | 'inactive' | 'expired';
  tokensUsed: number;
  tokensLimit: number;
  requestsUsed: number;
  requestsLimit: number;
  cost: number;
  budget?: number;
  resetDate: Date;
  rateLimit: {
    requestsPerMinute: number;
    tokensPerMinute: number;
  };
}

export interface CommandOptions {
  model?: string;
  system?: string;
  stream?: boolean;
  temperature?: number;
  maxTokens?: number;
  json?: boolean;
  verbose?: boolean;
  file?: string;
}
