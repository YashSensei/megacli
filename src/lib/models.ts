// MegaLLM Model Registry
// Official list of supported models with their metadata

export interface ModelData {
  id: string;
  name: string;
  provider: string;
  aliases: string[];
  // Additional metadata (will be enhanced later with pricing, context length, etc.)
  category?: 'premium' | 'balanced' | 'fast' | 'specialized';
  description?: string;
}

// Official MegaLLM model list
export const MEGALLM_MODELS: ModelData[] = [
  {
    id: 'gpt-5',
    name: 'GPT-5',
    provider: 'OpenAI',
    aliases: ['gpt5', 'gpt-5'],
    category: 'premium',
    description: 'OpenAI\'s most advanced model for complex reasoning',
  },
  {
    id: 'gpt-5.1',
    name: 'GPT-5.1',
    provider: 'OpenAI',
    aliases: ['gpt51', 'gpt-5.1'],
    category: 'premium',
    description: 'Enhanced version of GPT-5 with improved capabilities',
  },
  {
    id: 'claude-opus-4-1-20250805',
    name: 'Claude Opus 4.1',
    provider: 'Anthropic',
    aliases: ['claude-opus', 'opus'],
    category: 'premium',
    description: 'Anthropic\'s most capable model for complex tasks',
  },
  {
    id: 'claude-sonnet-4-5-20250929',
    name: 'Claude Sonnet 4.5',
    provider: 'Anthropic',
    aliases: ['claude-sonnet', 'sonnet'],
    category: 'balanced',
    description: 'Balanced performance and cost for most tasks',
  },
  {
    id: 'claude-haiku-4-5-20251001',
    name: 'Claude Haiku 4.5',
    provider: 'Anthropic',
    aliases: ['claude-haiku', 'haiku'],
    category: 'fast',
    description: 'Fast and efficient for simple tasks',
  },
  {
    id: 'openai-gpt-oss-20b',
    name: 'OpenAI GPT-OSS 20B',
    provider: 'OpenAI',
    aliases: ['gpt-oss-20b'],
    category: 'fast',
    description: 'Open-source GPT model, 20B parameters',
  },
  {
    id: 'openai-gpt-oss-120b',
    name: 'OpenAI GPT-OSS 120B',
    provider: 'OpenAI',
    aliases: ['gpt-oss-120b'],
    category: 'balanced',
    description: 'Open-source GPT model, 120B parameters',
  },
  {
    id: 'deepseek-r1-distill-llama-70b',
    name: 'DeepSeek R1 Distill Llama 70B',
    provider: 'DeepSeek',
    aliases: ['deepseek-r1', 'r1-70b'],
    category: 'specialized',
    description: 'Distilled reasoning model based on Llama',
  },
  {
    id: 'alibaba-qwen3-32b',
    name: 'Alibaba Qwen3 32B',
    provider: 'Alibaba',
    aliases: ['qwen3-32b', 'alibaba-qwen'],
    category: 'balanced',
    description: 'Alibaba\'s Qwen3 model, 32B parameters',
  },
  {
    id: 'gemini-2.5-pro',
    name: 'Gemini 2.5 Pro',
    provider: 'Google',
    aliases: ['gemini-2-5', 'gemini25'],
    category: 'premium',
    description: 'Google\'s advanced multimodal model',
  },
  {
    id: 'llama3-8b-instruct',
    name: 'Llama3 8B Instruct',
    provider: 'Meta',
    aliases: ['llama3-8b', 'llama3'],
    category: 'fast',
    description: 'Meta\'s open-source Llama3 instruction-tuned model',
  },
  {
    id: 'moonshotai/kimi-k2-instruct-0905',
    name: 'Kimi K2 Instruct',
    provider: 'Moonshot AI',
    aliases: ['kimi-k2', 'moonshot-k2'],
    category: 'balanced',
    description: 'Moonshot\'s K2 instruction-following model',
  },
  {
    id: 'deepseek-ai/deepseek-v3.1-terminus',
    name: 'DeepSeek V3.1 Terminus',
    provider: 'DeepSeek',
    aliases: ['deepseek-v3-1-terminus'],
    category: 'specialized',
    description: 'DeepSeek V3.1 specialized variant',
  },
  {
    id: 'qwen/qwen3-next-80b-a3b-instruct',
    name: 'Qwen3 Next 80B A3B Instruct',
    provider: 'Alibaba',
    aliases: ['qwen3-next-80b'],
    category: 'balanced',
    description: 'Next-gen Qwen3 with 80B parameters',
  },
  {
    id: 'deepseek-ai/deepseek-v3.1',
    name: 'DeepSeek V3.1',
    provider: 'DeepSeek',
    aliases: ['deepseek-v3-1'],
    category: 'balanced',
    description: 'DeepSeek\'s latest V3.1 model',
  },
  {
    id: 'mistralai/mistral-nemotron',
    name: 'Mistral Nemotron',
    provider: 'Mistral AI',
    aliases: ['nemotron', 'mistral-nemotron'],
    category: 'specialized',
    description: 'Mistral\'s Nemotron specialized model',
  },
  {
    id: 'glm-4.6',
    name: 'GLM 4.6',
    provider: 'Zhipu AI',
    aliases: ['glm46'],
    category: 'balanced',
    description: 'General Language Model 4.6',
  },
  {
    id: 'minimaxai/minimax-m2',
    name: 'Minimax M2',
    provider: 'Minimax AI',
    aliases: ['minimax-m2'],
    category: 'balanced',
    description: 'Minimax\'s M2 model',
  },
  {
    id: 'deepseek-v3.2',
    name: 'DeepSeek V3.2',
    provider: 'DeepSeek',
    aliases: ['deepseek-v3-2'],
    category: 'balanced',
    description: 'Latest DeepSeek V3.2 release',
  },
  {
    id: 'gemini-3-pro-preview',
    name: 'Gemini 3 Pro Preview',
    provider: 'Google',
    aliases: ['gemini-3-pro'],
    category: 'premium',
    description: 'Preview of Google\'s next-gen Gemini',
  },
  {
    id: 'magnum-72b-v4',
    name: 'Magnum 72B V4',
    provider: 'Magnum',
    aliases: ['magnum-72b'],
    category: 'balanced',
    description: 'Magnum 72B parameters, version 4',
  },
  {
    id: 'moonshotai/kimi-k2-thinking',
    name: 'Kimi K2 Thinking',
    provider: 'Moonshot AI',
    aliases: ['kimi-k2-thinking'],
    category: 'specialized',
    description: 'Reasoning-optimized K2 model',
  },
];

// Model registry for quick lookups
class ModelRegistry {
  private modelsById: Map<string, ModelData>;
  private modelsByAlias: Map<string, ModelData>;

  constructor() {
    this.modelsById = new Map();
    this.modelsByAlias = new Map();
    this.initialize();
  }

  private initialize() {
    for (const model of MEGALLM_MODELS) {
      // Register by ID
      this.modelsById.set(model.id, model);

      // Register by aliases
      for (const alias of model.aliases) {
        this.modelsByAlias.set(alias.toLowerCase(), model);
      }
    }
  }

  // Get model by ID or alias
  getModel(idOrAlias: string): ModelData | undefined {
    const normalized = idOrAlias.toLowerCase();
    return this.modelsById.get(idOrAlias) || this.modelsByAlias.get(normalized);
  }

  // Check if model exists
  hasModel(idOrAlias: string): boolean {
    return this.getModel(idOrAlias) !== undefined;
  }

  // Get all models
  getAllModels(): ModelData[] {
    return [...MEGALLM_MODELS];
  }

  // Get models by category
  getModelsByCategory(category: ModelData['category']): ModelData[] {
    return MEGALLM_MODELS.filter((m) => m.category === category);
  }

  // Get models by provider
  getModelsByProvider(provider: string): ModelData[] {
    return MEGALLM_MODELS.filter(
      (m) => m.provider.toLowerCase() === provider.toLowerCase()
    );
  }

  // Search models by name or description
  searchModels(query: string): ModelData[] {
    const lowerQuery = query.toLowerCase();
    return MEGALLM_MODELS.filter(
      (m) =>
        m.name.toLowerCase().includes(lowerQuery) ||
        m.id.toLowerCase().includes(lowerQuery) ||
        m.description?.toLowerCase().includes(lowerQuery) ||
        m.aliases.some((a) => a.toLowerCase().includes(lowerQuery))
    );
  }

  // Get default model
  getDefaultModel(): ModelData {
    // Use Claude Sonnet as default (balanced performance/cost)
    return this.getModel('claude-sonnet')!;
  }
}

// Export singleton instance
export const modelRegistry = new ModelRegistry();

// Helper function to resolve model ID from alias
export function resolveModelId(idOrAlias: string): string | undefined {
  const model = modelRegistry.getModel(idOrAlias);
  return model?.id;
}

// Helper function to get model display name
export function getModelDisplayName(idOrAlias: string): string {
  const model = modelRegistry.getModel(idOrAlias);
  return model ? `${model.name} (${model.provider})` : idOrAlias;
}
