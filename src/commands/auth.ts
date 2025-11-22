import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import OpenAI from 'openai';
import { configManager } from '../lib/config.js';
import { colors, showSuccess, showError, showInfo, createBox } from '../lib/ui.js';

// Validate API key format
function validateApiKeyFormat(key: string): boolean {
  return key.startsWith('sk-mega-') && key.length > 15;
}

// Test API key by making a simple request
async function testApiKey(apiKey: string): Promise<{ valid: boolean; error?: string }> {
  try {
    const client = new OpenAI({
      baseURL: configManager.get('baseUrl') || 'https://ai.megallm.io/v1',
      apiKey: apiKey,
    });

    // Make a minimal test request
    await client.models.list();

    return { valid: true };
  } catch (error) {
    if (error instanceof Error) {
      return { valid: false, error: error.message };
    }
    return { valid: false, error: 'Unknown error occurred' };
  }
}

// Login command - set up API key
async function loginCommand(options: { key?: string }) {
  console.log(createBox('🔐 MegaLLM Authentication Setup', 'Authentication'));

  let apiKey: string;

  // If key provided via flag, use it
  if (options.key) {
    apiKey = options.key;
  } else {
    // Interactive prompt
    const answers = await inquirer.prompt([
      {
        type: 'password',
        name: 'apiKey',
        message: 'Enter your MegaLLM API key:',
        validate: (input: string) => {
          if (!input) {
            return 'API key is required';
          }
          if (!validateApiKeyFormat(input)) {
            return 'Invalid key format. MegaLLM keys start with "sk-mega-"';
          }
          return true;
        },
      },
    ]);
    apiKey = answers.apiKey as string;
  }

  // Validate format
  if (!validateApiKeyFormat(apiKey)) {
    showError('Invalid API key format', 'MegaLLM keys must start with "sk-mega-"');
    console.log(colors.info('ℹ'), 'Get your API key from:', colors.primary('https://megallm.io/dashboard'));
    process.exit(1);
  }

  // Test the key
  const spinner = ora('Validating API key...').start();

  const result = await testApiKey(apiKey);

  if (result.valid) {
    spinner.succeed('API key validated successfully!');

    // Save the key
    configManager.setApiKey(apiKey);

    console.log();
    showSuccess('Authentication configured!');
    console.log();
    console.log(colors.muted('Your API key has been saved to:'));
    console.log(colors.primary(configManager.getConfigPath()));
    console.log();
    console.log(colors.muted('You can now use:'));
    console.log(colors.primary('  megacli chat'), colors.muted('- Start chatting'));
    console.log(colors.primary('  megacli models'), colors.muted('- List available models'));
    console.log(colors.primary('  megacli code'), colors.muted('- Start coding assistant'));
  } else {
    spinner.fail('API key validation failed');
    console.log();
    showError('Authentication failed', result.error);
    console.log();
    console.log(colors.muted('Please check:'));
    console.log(colors.muted('  • Your API key is correct'));
    console.log(colors.muted('  • Your subscription is active'));
    console.log(colors.muted('  • You have internet connection'));
    console.log();
    console.log(colors.info('ℹ'), 'Get help at:', colors.primary('https://discord.gg/devsindia'));
    process.exit(1);
  }
}

// Logout command - remove API key
async function logoutCommand() {
  if (!configManager.hasApiKey()) {
    showInfo('You are not logged in');
    return;
  }

  const answers = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: 'Are you sure you want to remove your API key?',
      default: false,
    },
  ]);

  if (answers.confirm) {
    configManager.removeApiKey();
    showSuccess('Logged out successfully');
    console.log(colors.muted('Your API key has been removed'));
  } else {
    console.log(colors.muted('Logout cancelled'));
  }
}

// Status command - check authentication status
async function statusCommand() {
  console.log(createBox('🔐 Authentication Status', 'Status'));

  if (!configManager.hasApiKey()) {
    showError('Not authenticated');
    console.log();
    console.log(colors.muted('Run'), colors.primary('megacli auth login'), colors.muted('to set up your API key'));
    console.log(colors.info('ℹ'), 'Get your API key from:', colors.primary('https://megallm.io/dashboard'));
    return;
  }

  console.log(colors.success('✓'), colors.muted('Authenticated'));
  console.log();
  console.log(colors.muted('API Key:'), colors.primary(configManager.getMaskedApiKey()));
  console.log(colors.muted('Config:'), colors.primary(configManager.getConfigPath()));
  console.log();

  // Show current settings
  const config = configManager.getAll();
  console.log(chalk.bold('Current Settings:'));
  console.log(colors.muted('  Base URL:'), config.baseUrl || 'default');
  console.log(colors.muted('  Default Model:'), config.defaultModel || 'claude-sonnet');
  console.log(colors.muted('  Temperature:'), config.temperature ?? 0.7);
  console.log(colors.muted('  Streaming:'), config.streaming ? 'enabled' : 'disabled');
}

// Test command - verify API key works
async function testCommand() {
  if (!configManager.hasApiKey()) {
    showError('Not authenticated');
    console.log(colors.muted('Run'), colors.primary('megacli auth login'), colors.muted('to set up your API key'));
    return;
  }

  const spinner = ora('Testing API connection...').start();

  const apiKey = configManager.getApiKey()!;
  const result = await testApiKey(apiKey);

  if (result.valid) {
    spinner.succeed('API connection successful!');
    console.log();
    showSuccess('Your API key is working correctly');
    console.log(colors.muted('You can now use all MegaCLI commands'));
  } else {
    spinner.fail('API connection failed');
    console.log();
    showError('Connection test failed', result.error);
    console.log();
    console.log(colors.muted('Possible issues:'));
    console.log(colors.muted('  • API key expired or revoked'));
    console.log(colors.muted('  • Subscription inactive'));
    console.log(colors.muted('  • Network connectivity issues'));
    console.log();
    console.log(colors.muted('Try running:'), colors.primary('megacli auth logout'), colors.muted('then'), colors.primary('megacli auth login'));
  }
}

// Create and export the auth command
export function createAuthCommand(): Command {
  const authCommand = new Command('auth');

  authCommand
    .description('Manage MegaLLM authentication')
    .addCommand(
      new Command('login')
        .description('Save your MegaLLM API key')
        .option('-k, --key <key>', 'Provide API key directly (non-interactive)')
        .action(loginCommand)
    )
    .addCommand(
      new Command('logout')
        .description('Remove saved API key')
        .action(logoutCommand)
    )
    .addCommand(
      new Command('status')
        .description('Check authentication status')
        .action(statusCommand)
    )
    .addCommand(
      new Command('test')
        .description('Test API key connection')
        .action(testCommand)
    );

  return authCommand;
}
