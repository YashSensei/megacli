import { Command } from 'commander';
import inquirer from 'inquirer';
import OpenAI from 'openai';
import chalk from 'chalk';
import ora from 'ora';
import boxen from 'boxen';
import { configManager } from '../lib/config.js';
import { FileSystemManager } from '../lib/filesystem.js';
import { ProjectAnalyzer } from '../lib/project-analyzer.js';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

interface CodeSession {
  fs: FileSystemManager;
  analyzer: ProjectAnalyzer;
  client: OpenAI;
  messages: ChatCompletionMessageParam[];
  filesModified: Set<string>;
}

const SYSTEM_PROMPT = `You are an expert coding assistant integrated into a CLI tool. You can:
- Read and analyze files in the user's project
- Suggest code changes and improvements
- Write new files or modify existing ones
- Search for patterns across the codebase
- Understand project structure and dependencies

When the user asks you to modify code:
1. First, read the relevant files to understand the current code
2. Explain what changes you'll make and why
3. Show the actual code changes clearly
4. Always maintain code quality and follow best practices

If you need to see a file, ask the user or mention the file path.
Keep responses concise but informative. Format code blocks with proper syntax highlighting.`;

class CodeAssistant {
  private session: CodeSession;

  constructor() {
    const apiKey = configManager.getApiKey();
    if (!apiKey) {
      throw new Error('No API key configured. Run: megacli auth login');
    }

    this.session = {
      fs: new FileSystemManager(process.cwd()),
      analyzer: new ProjectAnalyzer(process.cwd()),
      client: new OpenAI({
        apiKey,
        baseURL: configManager.get('baseUrl'),
      }),
      messages: [{ role: 'system', content: SYSTEM_PROMPT }],
      filesModified: new Set(),
    };
  }

  /**
   * Start interactive coding session
   */
  async startInteractive(): Promise<void> {
    console.clear();
    await this.showWelcome();

    // Analyze project in background
    const spinner = ora('Analyzing project structure...').start();
    try {
      const context = await this.session.analyzer.buildAIContext();
      this.session.messages.push({
        role: 'system',
        content: `Current project context:\n${context}`,
      });
      spinner.succeed('Project analyzed');
    } catch (error) {
      spinner.fail('Could not analyze project');
    }

    // Main interaction loop
    while (true) {
      try {
        const answers: { input: string } = await inquirer.prompt([
          {
            type: 'input',
            name: 'input',
            message: chalk.cyan('You:'),
          },
        ]);

        const trimmed = answers.input.trim();
        if (!trimmed) continue;

        // Handle special commands
        if (trimmed.startsWith('/')) {
          const handled = await this.handleCommand(trimmed);
          if (handled === 'exit') break;
          continue;
        }

        // Send to AI
        await this.processMessage(trimmed);
      } catch (error) {
        if ((error as Error).name === 'ExitPromptError') {
          console.log('\n' + chalk.yellow('Goodbye! 👋'));
          break;
        }
        console.log(chalk.red(`✗ Error: ${(error as Error).message}`));
      }
    }
  }

  /**
   * Execute a single coding task
   */
  async executeTask(task: string): Promise<void> {
    console.clear();
    console.log(chalk.blue('ℹ') + ` Executing task: ${task}`);

    // Analyze project
    const spinner = ora('Analyzing project...').start();
    try {
      const context = await this.session.analyzer.buildAIContext();
      this.session.messages.push({
        role: 'system',
        content: `Current project context:\n${context}`,
      });
      spinner.succeed('Project analyzed');
    } catch (error) {
      spinner.warn('Could not fully analyze project');
    }

    // Execute task
    await this.processMessage(task);

    // Show summary
    if (this.session.filesModified.size > 0) {
      console.log(chalk.green('✓') + ` Modified ${this.session.filesModified.size} file(s)`);
      console.log(chalk.gray('Files changed:'));
      this.session.filesModified.forEach(f => console.log(chalk.gray(`  - ${f}`)));
    }
  }

  /**
   * Process a message with the AI
   */
  private async processMessage(userMessage: string): Promise<void> {
    this.session.messages.push({ role: 'user', content: userMessage });

    const spinner = ora('Thinking...').start();
    try {
      const response = await this.session.client.chat.completions.create({
        model: configManager.get('defaultModel') as string,
        messages: this.session.messages,
        temperature: 0.7,
        max_tokens: 4096,
      });

      const reply = response.choices[0]?.message?.content || 'No response';
      spinner.stop();

      console.log('\n' + chalk.green('Assistant:'));
      console.log(reply);
      console.log();

      this.session.messages.push({ role: 'assistant', content: reply });
    } catch (error) {
      spinner.fail('Failed to get response');
      throw error;
    }
  }

  /**
   * Handle special commands
   */
  private async handleCommand(command: string): Promise<string | void> {
    const [cmd, ...args] = command.slice(1).split(' ');

    switch (cmd) {
      case 'exit':
      case 'quit':
        console.log(chalk.yellow('\nGoodbye! 👋'));
        return 'exit';

      case 'clear':
        console.clear();
        await this.showWelcome();
        break;

      case 'read':
        await this.readFile(args.join(' '));
        break;

      case 'write':
        console.log(chalk.blue('ℹ') + ' Use natural language to ask me to write files');
        break;

      case 'search':
        await this.searchFiles(args.join(' '));
        break;

      case 'tree':
        await this.showTree();
        break;

      case 'files':
        await this.listSourceFiles();
        break;

      case 'reset':
        this.session.messages = [{ role: 'system', content: SYSTEM_PROMPT }];
        console.log(chalk.green('✓') + ' Conversation reset');
        break;

      case 'help':
        this.showHelp();
        break;

      default:
        console.log(chalk.red(`✗ Unknown command: /${cmd}`));
        console.log(chalk.gray('Type /help for available commands'));
    }
  }

  /**
   * Read and display a file
   */
  private async readFile(filePath: string): Promise<void> {
    if (!filePath) {
      console.log(chalk.red('✗ Usage: /read <file-path>'));
      return;
    }

    try {
      const content = await this.session.fs.readFile(filePath);
      console.log(chalk.cyan(`\n=== ${filePath} ===`));
      console.log(content);
      console.log(chalk.cyan('='.repeat(filePath.length + 8)) + '\n');

      // Add to AI context
      this.session.messages.push({
        role: 'system',
        content: `File content of ${filePath}:\n\`\`\`\n${content}\n\`\`\``,
      });
    } catch (error) {
      console.log(chalk.red(`✗ Could not read file: ${(error as Error).message}`));
    }
  }

  /**
   * Search for files
   */
  private async searchFiles(query: string): Promise<void> {
    if (!query) {
      console.log(chalk.red('✗ Usage: /search <text>'));
      return;
    }

    const spinner = ora('Searching...').start();
    try {
      const results = await this.session.fs.searchInFiles('**/*.{ts,js,tsx,jsx}', query);
      spinner.stop();

      if (results.length === 0) {
        console.log(chalk.blue('ℹ') + ' No results found');
        return;
      }

      console.log(chalk.cyan(`\nFound ${results.length} file(s):\n`));
      results.slice(0, 10).forEach(result => {
        console.log(chalk.bold(result.path));
        result.matches.slice(0, 3).forEach(match => {
          console.log(chalk.gray(`  Line ${match.line}: ${match.content}`));
        });
        console.log();
      });

      if (results.length > 10) {
        console.log(chalk.gray(`... and ${results.length - 10} more`));
      }
    } catch (error) {
      spinner.fail('Search failed');
      console.log(chalk.red((error as Error).message));
    }
  }

  /**
   * Show file tree
   */
  private async showTree(): Promise<void> {
    const spinner = ora('Building tree...').start();
    try {
      const tree = await this.session.analyzer.getFileTree('.', 3);
      spinner.stop();
      console.log('\n' + tree + '\n');
    } catch (error) {
      spinner.fail('Could not build tree');
    }
  }

  /**
   * List source files
   */
  private async listSourceFiles(): Promise<void> {
    const spinner = ora('Finding source files...').start();
    try {
      const files = await this.session.analyzer.findSourceFiles();
      spinner.stop();

      console.log(chalk.cyan(`\nFound ${files.length} source file(s):\n`));
      files.slice(0, 20).forEach(f => console.log(chalk.gray(`  ${f}`)));
      
      if (files.length > 20) {
        console.log(chalk.gray(`  ... and ${files.length - 20} more`));
      }
      console.log();
    } catch (error) {
      spinner.fail('Could not list files');
    }
  }

  /**
   * Show welcome message
   */
  private async showWelcome(): Promise<void> {
    const box = boxen(
      chalk.bold('🤖 Code Assistant Mode\n\n') +
      chalk.gray('I can help you:') +
      '\n  • Read and analyze your code' +
      '\n  • Suggest improvements' +
      '\n  • Write new features' +
      '\n  • Refactor existing code' +
      '\n\n' +
      chalk.gray('Type /help for commands'),
      {
        padding: 1,
        margin: 1,
        borderStyle: 'round',
        borderColor: 'cyan',
      }
    );
    console.log(box);
  }

  /**
   * Show help
   */
  private showHelp(): void {
    const help = `
${chalk.bold('Available Commands:')}

  ${chalk.cyan('/read <file>')}     Read a file and show its contents
  ${chalk.cyan('/search <text>')}   Search for text across source files
  ${chalk.cyan('/tree')}            Show project file tree
  ${chalk.cyan('/files')}           List all source files
  ${chalk.cyan('/reset')}           Reset conversation history
  ${chalk.cyan('/clear')}           Clear the screen
  ${chalk.cyan('/help')}            Show this help
  ${chalk.cyan('/exit')}            Exit code assistant

${chalk.gray('Or just describe what you want to do in natural language!')}
`;
    console.log(help);
  }
}

// Create command
export const codeCommand = new Command('code')
  .description('AI-powered coding assistant')
  .option('-t, --task <task>', 'Execute a specific coding task')
  .action(async (options) => {
    try {
      const assistant = new CodeAssistant();

      if (options.task) {
        await assistant.executeTask(options.task);
      } else {
        await assistant.startInteractive();
      }
    } catch (error) {
      console.log(chalk.red(`✗ ${(error as Error).message}`));
      process.exit(1);
    }
  });
