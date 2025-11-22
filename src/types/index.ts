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
  trustedWorkspaces?: string[];
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
  type: 'authentication' | 'rate_limit' | 'validation' | 'server';
  details?: Record<string, unknown>;
}

export interface ChatResponse {
  id: string;
  model: string;
  content: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  timestamp: Date;
}