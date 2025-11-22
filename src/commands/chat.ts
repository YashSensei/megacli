import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import OpenAI from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import { configManager, ensureAuthenticated } from '../lib/config.js';
import { modelRegistry, getModelDisplayName } from '../lib/models.js';
import { colors, showSuccess, showError, createBox, showDivider } from '../lib/ui.js';
import type { ChatMessage } from '../types/index.js';

interface ChatOptions {
  model?: string;
  system?: string;
  temperature?: number;
  maxTokens?: number;
}

// Convert our ChatMessage to OpenAI format
function toOpenAIMessages(messages: ChatMessage[]): ChatCompletionMessageParam[] {
  return messages.map((msg) => ({
    role: msg.role,
    content: msg.content,
  }));
}

// Chat session class
class ChatSession {
  private client: OpenAI;
  private messages: ChatMessage[] = [];
  private currentModel: string;
  private temperature: number;
  private maxTokens: number;
  private tokenUsage = { prompt: 0, completion: 0, total: 0 };

  constructor(options: Required<ChatOptions>) {
    ensureAuthenticated();

    this.client = new OpenAI({
      baseURL: configManager.get('baseUrl') || 'https://ai.megallm.io/v1',
      apiKey: configManager.getApiKey()!,
    });

    this.currentModel = options.model;
    this.temperature = options.temperature;
    this.maxTokens = options.maxTokens;

    // Add system message if provided
    if (options.system) {
      this.messages.push({
        role: 'system',
        content: options.system,
      });
    }
  }

  // Show welcome message
  showWelcome() {
    console.log(
      createBox(
        `🤖 ${chalk.bold('Interactive Chat Mode')}\n\n` +
        `Model: ${chalk.cyan(getModelDisplayName(this.currentModel))}\n` +
        `Temperature: ${chalk.yellow(this.temperature.toString())} | ` +
        `Max Tokens: ${chalk.yellow(this.maxTokens.toString())}`,
        'MegaCLI Chat'
      )
    );
    console.log(colors.muted('Special commands:'));
    console.log(colors.primary('  /exit'), colors.muted('- Exit chat'));
    console.log(colors.primary('  /clear'), colors.muted('- Clear conversation history'));
    console.log(colors.primary('  /models'), colors.muted('- List available models'));
    console.log(colors.primary('  /switch <model>'), colors.muted('- Change model'));
    console.log(colors.primary('  /help'), colors.muted('- Show commands'));
    console.log(colors.primary('  /info'), colors.muted('- Show current settings'));
    console.log();
  }

  // Handle special commands
  async handleCommand(input: string): Promise<boolean> {
    const trimmed = input.trim();

    if (trimmed === '/exit' || trimmed === '/quit') {
      this.showGoodbye();
      return true;
    }

    if (trimmed === '/clear') {
      const systemMessages = this.messages.filter((m) => m.role === 'system');
      this.messages = systemMessages;
      showSuccess('Conversation history cleared');
      return false;
    }

    if (trimmed === '/models') {
      this.listModels();
      return false;
    }

    if (trimmed.startsWith('/switch ')) {
      const modelId = trimmed.substring(8).trim();
      this.switchModel(modelId);
      return false;
    }

    if (trimmed === '/help') {
      this.showHelp();
      return false;
    }

    if (trimmed === '/info') {
      this.showInfo();
      return false;
    }

    // Unknown command
    if (trimmed.startsWith('/')) {
      showError(`Unknown command: ${trimmed}`, 'Type /help for available commands');
      return false;
    }

    return false;
  }

  // List available models
  listModels() {
    console.log(createBox('Available Models', 'Models'));
    
    const categories = {
      premium: modelRegistry.getModelsByCategory('premium'),
      balanced: modelRegistry.getModelsByCategory('balanced'),
      fast: modelRegistry.getModelsByCategory('fast'),
      specialized: modelRegistry.getModelsByCategory('specialized'),
    };

    for (const [category, models] of Object.entries(categories)) {
      if (models.length > 0) {
        console.log(chalk.bold(`\n${category.toUpperCase()}:`));
        models.forEach((model) => {
          const isCurrent = model.id === this.currentModel;
          const marker = isCurrent ? colors.success('→') : ' ';
          console.log(`${marker} ${colors.primary(model.id)} - ${model.name} (${model.provider})`);
        });
      }
    }
    console.log();
    console.log(colors.muted('Use /switch <model-id> to change models'));
  }

  // Switch to different model
  switchModel(modelId: string) {
    const model = modelRegistry.getModel(modelId);
    if (!model) {
      showError(`Model not found: ${modelId}`, 'Use /models to see available models');
      return;
    }

    this.currentModel = model.id;
    showSuccess(`Switched to ${getModelDisplayName(model.id)}`);
  }

  // Show help
  showHelp() {
    console.log(createBox('Available Commands', 'Help'));
    console.log(colors.primary('  /exit, /quit'), colors.muted('- Exit chat'));
    console.log(colors.primary('  /clear'), colors.muted('- Clear conversation history'));
    console.log(colors.primary('  /models'), colors.muted('- List all available models'));
    console.log(colors.primary('  /switch <model>'), colors.muted('- Change to different model'));
    console.log(colors.primary('  /info'), colors.muted('- Show current settings and stats'));
    console.log(colors.primary('  /help'), colors.muted('- Show this help message'));
    console.log();
  }

  // Show current info
  showInfo() {
    console.log(createBox('Current Session Info', 'Info'));
    console.log(colors.muted('Model:'), colors.primary(getModelDisplayName(this.currentModel)));
    console.log(colors.muted('Temperature:'), this.temperature);
    console.log(colors.muted('Max Tokens:'), this.maxTokens);
    console.log(colors.muted('Messages:'), this.messages.filter((m) => m.role !== 'system').length);
    console.log(colors.muted('Tokens Used:'), this.tokenUsage.total);
    console.log();
  }

  // Show goodbye message
  showGoodbye() {
    console.log();
    showDivider();
    console.log(colors.success('👋 Thanks for using MegaCLI!'));
    console.log(colors.muted('Total tokens used:'), colors.primary(this.tokenUsage.total.toString()));
    console.log();
  }

  // Send message and get response
  async sendMessage(userMessage: string): Promise<void> {
    // Add user message
    this.messages.push({
      role: 'user',
      content: userMessage,
    });

    const spinner = ora('Thinking...').start();

    try {
      await this.getResponse(spinner);
    } catch (error) {
      spinner.fail('Failed to get response');
      if (error instanceof Error) {
        showError('API Error', error.message);
      }
    }
  }

  // Get non-streaming response
  async getResponse(spinner: ReturnType<typeof ora>) {
    const response = await this.client.chat.completions.create({
      model: this.currentModel,
      messages: toOpenAIMessages(this.messages),
      temperature: this.temperature,
      max_tokens: this.maxTokens,
    });

    const assistantMessage = response.choices[0]?.message.content || '';
    
    spinner.stop();
    console.log();
    console.log(colors.primary('🤖 Assistant:'));
    console.log(assistantMessage);
    console.log();

    // Save assistant message
    this.messages.push({
      role: 'assistant',
      content: assistantMessage,
    });

    // Update token usage
    if (response.usage) {
      this.tokenUsage.prompt += response.usage.prompt_tokens;
      this.tokenUsage.completion += response.usage.completion_tokens;
      this.tokenUsage.total += response.usage.total_tokens;
    }
  }

  // Get streaming response
  async streamResponse(spinner: ReturnType<typeof ora>) {
    const stream = await this.client.chat.completions.create({
      model: this.currentModel,
      messages: toOpenAIMessages(this.messages),
      temperature: this.temperature,
      max_tokens: this.maxTokens,
      stream: true,
      stream_options: { include_usage: true },
    });

    spinner.stop();
    console.log();
    console.log(colors.primary('🤖 Assistant:'));

    let fullContent = '';
    let usage: { prompt_tokens: number; completion_tokens: number; total_tokens: number } | undefined;

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        process.stdout.write(content);
        fullContent += content;
      }
      
      // Capture usage from final chunk
      if (chunk.usage) {
        usage = chunk.usage;
      }
    }

    console.log('\n');

    // Save assistant message
    this.messages.push({
      role: 'assistant',
      content: fullContent,
    });

    // Update token usage if available
    if (usage) {
      this.tokenUsage.prompt += usage.prompt_tokens;
      this.tokenUsage.completion += usage.completion_tokens;
      this.tokenUsage.total += usage.total_tokens;
    } else {
      // Fallback: estimate tokens (rough approximation: 1 token ≈ 4 characters)
      const estimatedCompletionTokens = Math.ceil(fullContent.length / 4);
      const estimatedPromptTokens = Math.ceil(
        this.messages
          .filter((m) => m.role !== 'assistant')
          .map((m) => m.content.length)
          .reduce((a, b) => a + b, 0) / 4
      );
      this.tokenUsage.prompt += estimatedPromptTokens;
      this.tokenUsage.completion += estimatedCompletionTokens;
      this.tokenUsage.total += estimatedPromptTokens + estimatedCompletionTokens;
    }
  }

  // Main chat loop
  async start() {
    this.showWelcome();

    // Handle Ctrl+C gracefully
    const handleExit = () => {
      this.showGoodbye();
      process.exit(0);
    };
    
    process.on('SIGINT', handleExit);

    try {
      while (true) {
        const { message } = await inquirer.prompt<{ message: string }>({
          type: 'input',
          name: 'message',
          message: 'You:',
        });

        const input = message;

        if (!input.trim()) {
          continue;
        }

        // Handle special commands
        if (input.startsWith('/')) {
          const shouldExit = await this.handleCommand(input);
          if (shouldExit) {
            break;
          }
          continue;
        }

        // Send message
        await this.sendMessage(input);
      }
    } catch (error) {
      // Handle user cancellation gracefully
      if (error && typeof error === 'object' && 'message' in error) {
        const errMsg = (error as Error).message;
        if (errMsg.includes('User force closed') || errMsg.includes('force closed')) {
          this.showGoodbye();
          process.exit(0);
        }
      }
      throw error;
    } finally {
      process.off('SIGINT', handleExit);
    }
  }
}

// Chat command action
async function chatCommand(options: ChatOptions) {
  ensureAuthenticated();

  // Validate temperature
  if (options.temperature !== undefined && (options.temperature < 0 || options.temperature > 2)) {
    showError('Invalid temperature', 'Temperature must be between 0 and 2');
    process.exit(1);
  }

  // Validate max tokens
  if (options.maxTokens !== undefined && options.maxTokens < 1) {
    showError('Invalid max tokens', 'Max tokens must be at least 1');
    process.exit(1);
  }

  // Resolve model
  let modelId = options.model || configManager.get('defaultModel') || 'claude-sonnet';
  const model = modelRegistry.getModel(modelId);
  
  if (!model) {
    showError(`Model not found: ${modelId}`, 'Use "megacli models list" to see available models');
    process.exit(1);
  }
  modelId = model.id;

  // Create session
  const session = new ChatSession({
    model: modelId,
    system: options.system || 'You are a helpful AI assistant.',
    temperature: options.temperature ?? configManager.get('temperature') ?? 0.7,
    maxTokens: options.maxTokens ?? configManager.get('maxTokens') ?? 2048,
  });

  // Start chat
  await session.start();
}

// Create and export the chat command
export function createChatCommand(): Command {
  const chatCmd = new Command('chat');

  chatCmd
    .description('Start interactive chat with AI models')
    .option('-m, --model <model>', 'Model to use (ID or alias)')
    .option('-s, --system <prompt>', 'System prompt')
    .option('-t, --temperature <number>', 'Temperature (0-2)', parseFloat)
    .option('--max-tokens <number>', 'Maximum tokens in response', parseInt)
    .action(chatCommand);

  return chatCmd;
}
