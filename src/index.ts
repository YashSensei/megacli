#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import gradient from 'gradient-string';
import figlet from 'figlet';
import { config } from 'dotenv';

// Load environment variables
config();

// Import commands
import { createAuthCommand } from './commands/auth.js';
import { createChatCommand } from './commands/chat.js';
import { createModelsCommand } from './commands/models.js';
import { codeCommand } from './commands/code.js';

const program = new Command();

// Display banner
function showBanner() {
  try {
    console.log(
      gradient.passion.multiline(
        figlet.textSync('MegaCLI', {
          font: 'ANSI Shadow',
          horizontalLayout: 'fitted',
        })
      )
    );
    console.log(chalk.cyan.bold('  🚀 Access 70+ AI Models from Your Terminal\n'));
    console.log(chalk.gray('  Official CLI for MegaLLM • https://megallm.io\n'));
  } catch (error) {
    // Fallback if figlet fails
    console.log(chalk.cyan.bold('\n  MegaCLI\n'));
    console.log(chalk.cyan('  Access 70+ AI models from your terminal\n'));
    console.log(chalk.gray('  Powered by MegaLLM • https://megallm.io\n'));
  }
}

// Main CLI setup
program
  .name('megacli')
  .description('Official CLI for MegaLLM - Access 70+ AI models from your terminal')
  .version('0.1.0', '-v, --version', 'Output the current version')
  .option('--no-color', 'Disable colored output')
  .option('--json', 'Output in JSON format')
  .option('--verbose', 'Enable verbose logging')
  .hook('preAction', (thisCommand) => {
    // Show banner for main command only
    if (thisCommand.args.length === 0) {
      showBanner();
    }
  });

// Add auth command
program.addCommand(createAuthCommand());

// Add chat command
program.addCommand(createChatCommand());

// Add models command
program.addCommand(createModelsCommand());

// Add code command
program.addCommand(codeCommand);

// Placeholder commands (will be implemented later)

program
  .command('ask <question>')
  .description('Ask a quick question')
  .action((question: string) => {
    console.log(chalk.yellow('⚠️  Ask command coming soon!'));
    console.log(chalk.gray(`Question: ${question}`));
  });

// Handle unknown commands
program.on('command:*', () => {
  console.error(chalk.red('❌ Invalid command'));
  console.log(chalk.gray('Run'), chalk.cyan('megacli --help'), chalk.gray('to see available commands'));
  process.exit(1);
});

// Parse arguments
program.parse(process.argv);

// Show help if no command provided
if (!process.argv.slice(2).length) {
  showBanner();
  program.outputHelp();
}
