import { Command } from 'commander';
import inquirer from 'inquirer';
import OpenAI from 'openai';
import chalk from 'chalk';
import ora from 'ora';
import boxen from 'boxen';
import { execSync } from 'child_process';
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
  commandsExecuted: Array<{ command: string; output: string }>;
}

const SYSTEM_PROMPT = `You are an expert coding assistant working in a CLI environment. Respond EXACTLY like a helpful developer would - concise, direct, and thoughtful.

CRITICAL MINDSET:
Think: "What does the user actually want to know?" → Get the info silently → Answer their question clearly in 1-3 sentences.

AVAILABLE TOOLS (all outputs are HIDDEN from user):

<execute_command>Get-Content path/to/file</execute_command>
<execute_command>Get-ChildItem path/</execute_command>
<execute_command>git status</execute_command>
<execute_command>npm install package</execute_command>

<write_file path="file.txt">
complete file content
</write_file>

RESPONSE STYLE (like a real developer):

User: "check types/index.ts for errors"
Think: Need to read the file and look for issues
[Run: Get-Content src/types/index.ts - OUTPUT HIDDEN]
[Analyze internally: check syntax, types, structure]
Response: "No issues found. The file defines 6 interfaces (MegaLLMConfig, ChatMessage, etc.) with proper TypeScript syntax."

User: "what's in my src folder?"
[Run: Get-ChildItem src/ - OUTPUT HIDDEN]
[See the results internally]
Response: "You have: commands/ (4 files), lib/ (5 files), types/ (1 file), and index.ts"

User: "add test.md to .gitignore"
[Run: Get-Content .gitignore - OUTPUT HIDDEN]
[Write updated file]
Response: "✓ Added test.md to .gitignore"

User: "why is my app crashing?"
[Run: Get-Content relevant-file - OUTPUT HIDDEN]
[Analyze the code]
Response: "Issue at line 42 - you're calling undefined function. Need to import it first."

RULES:
• Commands run silently - their output is NOT shown to user
• You see the output internally - analyze it - respond with YOUR conclusion
• Keep responses 1-3 sentences
• Be helpful like a teammate would be
• Don't say "Let me check..." - just check and answer
• Use ✓ ✗ symbols for success/failure

Remember: Act like YOU (GitHub Copilot) would respond - smart, concise, helpful.`;

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
      commandsExecuted: [],
    };
  }

  /**
   * Start interactive coding session
   */
  async startInteractive(): Promise<void> {
    console.clear();
    
    // Check workspace trust
    const workspacePath = process.cwd();
    if (!configManager.isWorkspaceTrusted(workspacePath)) {
      const trustPrompt = await this.promptWorkspaceTrust(workspacePath);
      if (!trustPrompt) {
        console.log(chalk.yellow('\n⚠ ') + chalk.gray('Workspace not trusted. Exiting...'));
        return;
      }
      configManager.trustWorkspace(workspacePath);
    }

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
        console.log(''); // Add spacing
        await this.processMessage(trimmed);
        console.log('\n' + chalk.gray('─'.repeat(90)));
      } catch (error) {
        if ((error as Error).name === 'ExitPromptError') {
          console.log('\n' + chalk.cyan('👋 ') + chalk.gray('Goodbye!'));
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
    
    if (this.session.commandsExecuted.length > 0) {
      console.log(chalk.green('✓') + ` Executed ${this.session.commandsExecuted.length} command(s)`);
      console.log(chalk.gray('Commands run:'));
      this.session.commandsExecuted.forEach(cmd => console.log(chalk.gray(`  - ${cmd.command}`)));
    }
  }

  /**
   * Process a message with the AI
   */
  private async processMessage(userMessage: string): Promise<void> {
    this.session.messages.push({ role: 'user', content: userMessage });

    const spinner = ora({ text: chalk.cyan('Thinking...'), color: 'cyan' }).start();
    try {
      const response = await this.session.client.chat.completions.create({
        model: configManager.get('defaultModel') as string,
        messages: this.session.messages,
        temperature: 0.7,
        max_tokens: 1024, // Reduced for more concise responses
      });

      const reply = response.choices[0]?.message?.content || 'No response';
      spinner.stop();

      // Check for file write requests
      const fileWrites = this.extractFileWrites(reply);
      
      // Check for command execution requests
      const commands = this.extractCommands(reply);
      
      if (fileWrites.length > 0 || commands.length > 0) {
        // Show AI message without tags
        let cleanMessage = reply;
        cleanMessage = this.removeFileWriteTags(cleanMessage);
        cleanMessage = this.removeCommandTags(cleanMessage);
        
        if (cleanMessage.trim()) {
          const lines = cleanMessage.split('\n');
          console.log('\n' + chalk.green('● ') + chalk.white(lines[0]));
          lines.slice(1).forEach(line => {
            if (line.trim()) console.log(chalk.gray('  ' + line));
          });
        }

        // Execute file writes first
        for (const write of fileWrites) {
          await this.writeFile(write.path, write.content);
        }

        // Then execute commands
        for (const cmd of commands) {
          await this.executeCommand(cmd);
        }
        console.log();
      } else {
        // Show normal message
        const lines = reply.split('\n');
        console.log('\n' + chalk.green('● ') + chalk.white(lines[0]));
        lines.slice(1).forEach(line => {
          if (line.trim()) console.log(chalk.gray('  ' + line));
        });
        console.log();
      }

      this.session.messages.push({ role: 'assistant', content: reply });
    } catch (error) {
      spinner.fail('Failed to get response');
      throw error;
    }
  }

  /**
   * Extract commands from AI response
   */
  private extractCommands(text: string): string[] {
    const regex = /<execute_command>([\s\S]*?)<\/execute_command>/g;
    const commands: string[] = [];
    let match;

    while ((match = regex.exec(text)) !== null) {
      const cmd = match[1]?.trim();
      if (cmd) commands.push(cmd);
    }

    return commands;
  }

  /**
   * Extract file write requests from AI response
   */
  private extractFileWrites(text: string): Array<{ path: string; content: string }> {
    const regex = /<write_file\s+path="([^"]+)">([\s\S]*?)<\/write_file>/g;
    const writes: Array<{ path: string; content: string }> = [];
    let match;

    while ((match = regex.exec(text)) !== null) {
      const path = match[1]?.trim();
      const content = match[2]?.trim();
      if (path && content !== undefined) {
        writes.push({ path, content });
      }
    }

    return writes;
  }

  /**
   * Remove command tags from text
   */
  private removeCommandTags(text: string): string {
    return text.replace(/<execute_command>[\s\S]*?<\/execute_command>/g, '').trim();
  }

  /**
   * Remove file write tags from text
   */
  private removeFileWriteTags(text: string): string {
    return text.replace(/<write_file\s+path="[^"]+">[\s\S]*?<\/write_file>/g, '').trim();
  }

  /**
   * Write content to a file
   */
  private async writeFile(filePath: string, content: string): Promise<void> {
    console.log(chalk.dim('  → Writing: ') + chalk.cyan(filePath));
    
    try {
      await this.session.fs.writeFile(filePath, content);
      console.log(chalk.dim('    ') + chalk.green('✓ File written'));

      // Track modified file
      this.session.filesModified.add(filePath);

      // Add to AI context
      this.session.messages.push({
        role: 'system',
        content: `File written: ${filePath}`,
      });
    } catch (error: any) {
      console.log(chalk.dim('    ') + chalk.red('✗ Write failed: ') + chalk.red(error.message));
      
      // Add error to AI context
      this.session.messages.push({
        role: 'system',
        content: `File write failed for ${filePath}: ${error.message}`,
      });
    }
  }

  /**
   * Execute a shell command
   */
  private async executeCommand(command: string): Promise<void> {
    // Check if this is a read-only command (don't show output)
    const isReadCommand = command.startsWith('Get-Content') || 
                          command.startsWith('cat ') ||
                          command.includes('Get-ChildItem') && !command.includes('| Select-Object');
    
    if (!isReadCommand) {
      console.log(chalk.dim('  → Running: ') + chalk.cyan(command));
    }
    
    try {
      let output: string;
      
      // On Windows, wrap command in PowerShell; on Unix, use directly
      if (process.platform === 'win32') {
        // Use PowerShell explicitly with -Command flag
        output = execSync(`powershell.exe -NoProfile -NonInteractive -Command "${command.replace(/"/g, '`"')}"`, {
          cwd: process.cwd(),
          encoding: 'utf-8',
          stdio: ['pipe', 'pipe', 'pipe'],
          maxBuffer: 10 * 1024 * 1024,
        });
      } else {
        // Unix systems
        output = execSync(command, {
          cwd: process.cwd(),
          encoding: 'utf-8',
          stdio: ['pipe', 'pipe', 'pipe'],
          maxBuffer: 10 * 1024 * 1024,
          shell: '/bin/sh',
        });
      }

      // Only show output for non-read commands
      if (!isReadCommand && output.trim()) {
        // Show output with indentation
        output.split('\n').forEach(line => {
          if (line.trim()) console.log(chalk.dim('    ' + line));
        });
      } else if (!isReadCommand && !output.trim()) {
        console.log(chalk.dim('    ') + chalk.green('✓ Done'));
      }

      // Store command history
      this.session.commandsExecuted.push({ command, output });

      // Add to AI context
      this.session.messages.push({
        role: 'system',
        content: `Command executed: ${command}\nOutput: ${output.slice(0, 1000)}`, // Limit output length
      });
    } catch (error: any) {
      const errorOutput = error.stderr?.toString() || error.message;
      console.log(chalk.red('✗ Command failed:'));
      console.log(chalk.red(errorOutput));

      // Add error to AI context
      this.session.messages.push({
        role: 'system',
        content: `Command failed: ${command}\nError: ${errorOutput}`,
      });
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
   * Prompt user to trust workspace
   */
  private async promptWorkspaceTrust(workspacePath: string): Promise<boolean> {
    console.log(chalk.yellow('\n─'.repeat(90)));
    console.log(chalk.bold.yellow('\nDo you trust the files in this folder?\n'));
    console.log(chalk.gray(workspacePath));
    console.log(chalk.dim('\nMegaCLI Code Assistant may read, write, or execute files in this directory.'));
    console.log(chalk.dim('This can pose security risks, so only use files from trusted sources.\n'));
    console.log(chalk.dim('Learn more: https://github.com/YashSensei/megacli#security'));
    
    const answer: { trust: string } = await inquirer.prompt([
      {
        type: 'list',
        name: 'trust',
        message: '',
        choices: [
          { name: 'Yes, proceed', value: 'yes' },
          { name: 'No, exit', value: 'no' },
        ],
        default: 'yes',
      },
    ]);

    console.log(chalk.yellow('─'.repeat(90)));
    return answer.trust === 'yes';
  }

  /**
   * Show welcome message
   */
  private async showWelcome(): Promise<void> {
    const box = boxen(
      chalk.bold('🤖 Code Assistant Mode\n\n') +
      chalk.gray('I can help you:') +
      '\n  • Read and analyze your code' +
      '\n  • Execute shell commands' +
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

${chalk.bold('AI Capabilities:')}
  ${chalk.gray('• Executes shell commands automatically when needed')}
  ${chalk.gray('• Reads and analyzes your code')}
  ${chalk.gray('• Provides concise, actionable suggestions')}

${chalk.gray('Just describe what you want to do in natural language!')}
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
