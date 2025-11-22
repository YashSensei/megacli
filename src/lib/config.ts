import Conf from 'conf';
import chalk from 'chalk';
import type { MegaLLMConfig } from '../types/index.js';

const CONFIG_DEFAULTS: Partial<MegaLLMConfig> = {
  baseUrl: 'https://ai.megallm.io/v1',
  defaultModel: 'claude-haiku-4-5-20251001',
  streaming: true,
  temperature: 0.7,
  maxTokens: 2048,
  theme: 'auto',
  saveHistory: true,
  trustedWorkspaces: [],
};

class ConfigManager {
  private config: Conf<MegaLLMConfig>;

  constructor() {
    this.config = new Conf<MegaLLMConfig>({
      projectName: 'megacli',
      defaults: CONFIG_DEFAULTS as MegaLLMConfig,
    });
  }

  // Get configuration value
  get<K extends keyof MegaLLMConfig>(key: K): MegaLLMConfig[K] | undefined {
    return this.config.get(key);
  }

  // Set configuration value
  set<K extends keyof MegaLLMConfig>(key: K, value: MegaLLMConfig[K]): void {
    this.config.set(key, value);
  }

  // Get all configuration
  getAll(): Partial<MegaLLMConfig> {
    return this.config.store;
  }

  // Check if API key exists
  hasApiKey(): boolean {
    const apiKey = this.getApiKey();
    return !!apiKey && apiKey.startsWith('sk-mega-');
  }

  // Get API key from config or environment
  getApiKey(): string | undefined {
    return this.config.get('apiKey') || process.env['MEGALLM_API_KEY'];
  }

  // Set API key
  setApiKey(apiKey: string): void {
    if (!apiKey.startsWith('sk-mega-')) {
      throw new Error('Invalid API key format. MegaLLM keys start with "sk-mega-"');
    }
    this.config.set('apiKey', apiKey);
  }

  // Remove API key
  removeApiKey(): void {
    this.config.delete('apiKey');
  }

  // Get masked API key for display
  getMaskedApiKey(): string {
    const apiKey = this.getApiKey();
    if (!apiKey) return 'Not set';
    
    const start = apiKey.substring(0, 11); // sk-mega-xxx
    const end = apiKey.substring(apiKey.length - 4);
    return `${start}***${end}`;
  }

  // Reset to defaults
  reset(): void {
    this.config.clear();
  }

  // Get config file path
  getConfigPath(): string {
    return this.config.path;
  }

  // Validate configuration
  validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.hasApiKey()) {
      errors.push('API key not configured');
    }

    const baseUrl = this.get('baseUrl');
    if (baseUrl && !baseUrl.startsWith('http')) {
      errors.push('Invalid base URL');
    }

    const temperature = this.get('temperature');
    if (temperature !== undefined && (temperature < 0 || temperature > 2)) {
      errors.push('Temperature must be between 0 and 2');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  // Check if workspace is trusted
  isWorkspaceTrusted(workspacePath: string): boolean {
    const trustedWorkspaces = this.get('trustedWorkspaces') as string[] || [];
    return trustedWorkspaces.includes(workspacePath);
  }

  // Add workspace to trusted list
  trustWorkspace(workspacePath: string): void {
    const trustedWorkspaces = this.get('trustedWorkspaces') as string[] || [];
    if (!trustedWorkspaces.includes(workspacePath)) {
      trustedWorkspaces.push(workspacePath);
      this.set('trustedWorkspaces', trustedWorkspaces);
    }
  }
}

// Export singleton instance
export const configManager = new ConfigManager();

// Helper to ensure user is authenticated
export function ensureAuthenticated(): void {
  if (!configManager.hasApiKey()) {
    console.error(chalk.red('❌ Not authenticated'));
    console.log(chalk.gray('Run'), chalk.cyan('megacli auth login'), chalk.gray('to set up your API key'));
    console.log(chalk.gray('Get your API key from:'), chalk.cyan('https://megallm.io/dashboard'));
    process.exit(1);
  }
}
