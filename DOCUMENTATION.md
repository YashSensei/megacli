# MegaCLI - Complete Documentation

> Official command-line interface for MegaLLM - Access 70+ AI models from your terminal

---

## 📖 Table of Contents

1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Getting Started](#getting-started)
4. [Authentication](#authentication)
5. [Commands Reference](#commands-reference)
6. [Chat Interface](#chat-interface)
7. [Model Management](#model-management)
8. [Agentic Coding Mode](#agentic-coding-mode)
9. [Configuration](#configuration)
10. [Advanced Usage](#advanced-usage)
11. [Troubleshooting](#troubleshooting)
12. [API Reference](#api-reference)

---

## Introduction

### What is MegaCLI?

MegaCLI is the official command-line interface for MegaLLM, designed to give developers seamless access to 70+ large language models directly from their terminal. Whether you need quick answers, interactive conversations, or AI-powered coding assistance, MegaCLI provides a beautiful and intuitive interface.

### Key Features

- 🤖 **Access 70+ AI Models** - GPT-5, Claude Opus 4, Gemini 2.5 Pro, and more
- 💬 **Interactive Chat** - Natural conversations with streaming responses
- 🔄 **Model Switching** - Change models on the fly during conversations
- 🎨 **Beautiful UI** - Colorful, intuitive terminal interface
- 🛠️ **Agentic Coding** - AI assistant that can read and edit files
- ⚡ **Fast & Efficient** - Minimal overhead, maximum performance
- 🔐 **Secure** - API key encryption and secure storage
- 🌍 **Cross-Platform** - Works on Windows, macOS, and Linux

### Why Use MegaCLI?

- **Developer-First Design:** Built by developers, for developers
- **No Context Switching:** Stay in your terminal workflow
- **Unified Interface:** One tool for all AI models
- **Cost-Effective:** Pay only for what you use through MegaLLM
- **Open Source:** Transparent, community-driven development

---

## Installation

### Prerequisites

- **Node.js 18+** or higher
- **npm** or **yarn** package manager
- **MegaLLM API Key** ([Get one here](https://megallm.io/dashboard))

### Install Globally (Recommended)

```bash
npm install -g megacli

# Or with yarn
yarn global add megacli
```

### Install from Source

```bash
git clone https://github.com/YashSensei/megacli_final.git
cd megacli_final
npm install
npm run build
npm link
```

### Verify Installation

```bash
megacli --version
megacli --help
```

---

## Getting Started

### Quick Start (3 Steps)

#### 1. Get Your API Key

Visit [megallm.io/dashboard](https://megallm.io/dashboard) and create an API key.

#### 2. Authenticate

```bash
megacli auth login
```

You'll be prompted to enter your API key (starts with `sk-mega-`).

#### 3. Start Chatting

```bash
megacli chat
```

That's it! You're now chatting with AI.

### First Time Setup

```bash
# Step 1: Login
$ megacli auth login
? Enter your MegaLLM API key: sk-mega-xxxxx
✓ API key saved successfully!

# Step 2: Check available models
$ megacli models list

# Step 3: Start your first chat
$ megacli chat -m gpt-5
```

---

## Authentication

### Commands

#### Login
```bash
megacli auth login
```
Interactively set up your MegaLLM API key.

**Options:**
- `--key <api_key>` - Provide key directly (non-interactive)

**Example:**
```bash
megacli auth login --key sk-mega-abc123xyz
```

#### Logout
```bash
megacli auth logout
```
Remove stored API credentials.

#### Status
```bash
megacli auth status
```
Check if you're authenticated and view key details.

**Output Example:**
```
✓ Authenticated
API Key: sk-mega-***xyz (masked)
Config: ~/.config/megacli/config.json
```

#### Test
```bash
megacli auth test
```
Verify your API key works by making a test request.

### Environment Variables

You can also set your API key via environment variable:

**Linux/macOS:**
```bash
export MEGALLM_API_KEY="sk-mega-your-key-here"
```

**Windows PowerShell:**
```powershell
$env:MEGALLM_API_KEY="sk-mega-your-key-here"
```

**Windows CMD:**
```cmd
set MEGALLM_API_KEY=sk-mega-your-key-here
```

### Configuration Files

API keys are stored in:
- **Linux/macOS:** `~/.config/megacli/config.json`
- **Windows:** `%APPDATA%\megacli\config.json`

---

## Commands Reference

### Global Options

Available for all commands:

```bash
-V, --version              Output version number
-h, --help                 Display help
--no-color                 Disable colored output
--json                     Output in JSON format
-v, --verbose              Verbose output
```

### Command Overview

| Command | Description | Status |
|---------|-------------|--------|
| `megacli auth` | Authentication management | ✅ Complete |
| `megacli chat` | Interactive chat interface | ✅ Complete |
| `megacli models` | Model management | ✅ Complete |
| `megacli code` | Agentic coding assistant | 🚧 Coming Soon |
| `megacli ask` | One-shot questions | 🚧 Coming Soon |

---

## Chat Interface

### Starting a Chat

```bash
# Default model (gpt-4o-mini)
megacli chat

# Specific model
megacli chat -m gpt-5

# With custom system prompt
megacli chat --system "You are a Python expert"

# Enable streaming
megacli chat --stream
```

### Chat Options

```bash
-m, --model <model>          Model to use (default: claude-haiku-4-5-20251001)
-s, --system <prompt>        System prompt
-t, --temperature <number>   Temperature (0-2, default: 0.7)
--max-tokens <number>        Max response tokens (default: 2048)
```

### In-Chat Commands

While in chat mode, you can use special commands:

| Command | Description |
|---------|-------------|
| `/exit` or `/quit` | Exit chat gracefully |
| `/clear` | Clear conversation history |
| `/models` | List available models by category |
| `/switch <model>` | Change current model mid-conversation |
| `/help` | Show all available commands |
| `/info` | Show current settings and token usage |

### Example Session

```bash
$ megacli chat

   ╭───────────── MegaCLI Chat ──────────────╮
   │                                         │
   │   🤖 Interactive Chat Mode              │
   │                                         │
   │   Model: Claude Haiku 4.5 (Anthropic)   │
   │                                         │
   ╰─────────────────────────────────────────╯

Special commands:
  /exit - Exit chat
  /clear - Clear conversation history
  /models - List available models
  /switch <model> - Change model
  /help - Show commands
  /info - Show current settings

✔ You: Hello! Can you help me with TypeScript?

🤖 Assistant: Hello! I'd be happy to help you with TypeScript. 
TypeScript is a strongly typed programming language that builds 
on JavaScript. What specific aspect would you like to know about?

✔ You: /switch gpt-5.1
✓ Switched to GPT-5.1 (OpenAI)

✔ You: What's the difference between type and interface?

⠹ Thinking...

🤖 Assistant: Great question! Here are the key differences:

1. **Syntax & Declaration Merging**
   - Interfaces can be merged (multiple declarations combine)
   - Types cannot be reopened to add properties

2. **Extends vs Intersection**
   - Interfaces use `extends`
   - Types use `&` (intersection)
   
[... continued response]

✔ You: /info

   ╭───────────── Info ──────────────╮
   │                                 │
   │   Current Session Info          │
   │                                 │
   ╰─────────────────────────────────╯

Model: GPT-5.1 (OpenAI)
Temperature: 0.7
Max Tokens: 2048
Messages: 4
Tokens Used: 234

✔ You: /exit

──────────────────────────────────────────────────
👋 Thanks for using MegaCLI!
Total tokens used: 234
```

### Available Models

MegaCLI currently supports 22+ models across multiple providers:

**Premium Models:**
- GPT-5, GPT-5.1 (OpenAI)
- Claude Opus 4.1, Claude Opus 4.5 (Anthropic)
- Gemini 2.5 Pro, Gemini 3 Pro (Google)

**Balanced Models:**
- Claude Sonnet 4.5 (Anthropic)
- OpenAI GPT-OSS 120B
- DeepSeek V3, V3.5 (DeepSeek)

**Fast/Cost-Effective Models:**
- Claude Haiku 4.5 (Anthropic) - Default
- Gemini 2.5 Flash, Gemini 3 Flash (Google)
- OpenAI GPT-OSS 20B
- Llama 3.3 70B (Meta)

**Specialized Models:**
- DeepSeek R1 (reasoning)
- Qwen3 235B (multilingual)

Use `/models` in chat to see the full categorized list!

---

## Model Management

### List All Models

```bash
megacli models list
```

**Options:**
```bash
-p, --provider <provider>    Filter by provider (openai, anthropic, google, meta, deepseek)
-c, --category <category>    Filter by category (premium, balanced, fast, specialized)
```

**Example Output:**
```
╭──── MegaLLM Models ─────╮
│   22 Available Models   │
╰─────────────────────────╯

💎 PREMIUM (5)
────────────────────────────────────────────────────────
Model ID                  Provider    Aliases
────────────────────────────────────────────────────────
gpt-5                     OpenAI      gpt5, gpt-5
gpt-5.1                   OpenAI      gpt51, gpt-5.1
claude-opus-4-1-20250805  Anthropic   claude-opus, opus
...
```

### Model Information

```bash
megacli models info <model-id>
```

Shows detailed information about a specific model including ID, provider, category, aliases, description, and usage examples.

**Example:**
```bash
megacli models info gpt-5.1
```

### Search Models

```bash
megacli models search <query>
```

Search for models by name, provider, or description.

**Examples:**
```bash
megacli models search "claude"       # Find all Claude models
megacli models search "reasoning"    # Find reasoning-focused models
megacli models search "fast"         # Find fast/efficient models
```

---

## Agentic Coding Mode

> **Note:** Agentic coding mode is planned for Phase 6. This feature will provide an AI assistant that can read and edit files in your project.

### Planned Features

- Read files in your project
- Suggest code changes with diffs
- Edit multiple files
- Understand project context
- Generate boilerplate code

**Coming Soon!**
- Understand project context

### Starting Code Mode

```bash
# Start in current directory
megacli code

# Specify directory
megacli code --dir /path/to/project

# Choose model
megacli code -m gpt-5
```

### Code Mode Commands

| Command | Description |
|---------|-------------|
| `/read <file>` | Read file contents |
| `/edit <file>` | Propose edits to file |
| `/tree` | Show file structure |
| `/context` | Show current context |
| `/diff` | Show pending changes |
| `/apply` | Apply pending changes |
| `/undo` | Undo last change |
| `/search <query>` | Search in files |
| `/help` | Show commands |
| `/exit` | Exit code mode |

### Example Session

```bash
$ megacli code

╔═══════════════════════════════════════╗
║      🛠️ MegaCLI Coding Assistant      ║
║   Directory: ~/projects/my-app        ║
╚═══════════════════════════════════════╝

You: Show me the file structure

🤖 Assistant: Here's your project structure:

my-app/
├── src/
│   ├── index.ts
│   ├── utils.ts
│   └── api.ts
├── package.json
└── tsconfig.json

You: Read src/api.ts

🤖 Assistant: [Shows file contents with syntax highlighting]

You: Add error handling to the fetchUser function

🤖 Assistant: I'll add comprehensive error handling. Here's the diff:

[Shows colored diff]

You: /apply
✓ Changes applied to src/api.ts

You: /exit
```

### Safety Features

- **Confirmation Required:** All file changes require explicit approval
- **Diff Preview:** See exactly what will change before applying
- **Undo Support:** Revert changes if needed
- **Backup:** Automatic backups before modifications
- **Git Aware:** Won't modify .git or node_modules

---

## Configuration

### Config File Location

**Automatic locations:**
- Linux/macOS: `~/.config/megacli/config.json`
- Windows: `%APPDATA%\megacli\config.json`

### Configuration Options

```json
{
  "apiKey": "sk-mega-xxxxx",
  "defaultModel": "gpt-4o-mini",
  "streaming": true,
  "temperature": 0.7,
  "maxTokens": 2048,
  "theme": "auto",
  "saveHistory": true,
  "autoUpdate": true
}
```

### Update Configuration

```bash
# Set default model
megacli config set defaultModel gpt-5

# Enable streaming
megacli config set streaming true

# View all settings
megacli config list

# Reset to defaults
megacli config reset
```

---

## Advanced Usage

### One-Shot Questions

Quick queries without entering chat mode:

```bash
# Simple question
megacli ask "What is TypeScript?"

# With specific model
megacli -m claude-opus-4 ask "Explain quantum computing"

# Shorthand (no 'ask' needed)
megacli "Write a Python function to sort a list"
```

### Pipe Support

Use MegaCLI in Unix pipelines:

```bash
# Analyze command output
ls -la | megacli "Explain this directory structure"

# Code review
cat script.py | megacli "Review this code for bugs"

# Log analysis
tail -100 error.log | megacli "Summarize these errors"

# Generate from template
echo "API endpoint for user profile" | megacli "Generate OpenAPI spec"
```

### File Input

```bash
# Analyze a file
megacli ask --file README.md "Summarize this"

# Multiple files
megacli ask --file api.ts --file types.ts "Are these types correct?"
```

### JSON Output

For scripting and automation:

```bash
megacli ask "List 3 colors" --json
```

**Output:**
```json
{
  "model": "gpt-4o-mini",
  "response": "1. Blue\n2. Red\n3. Green",
  "tokens": {
    "prompt": 12,
    "completion": 15,
    "total": 27
  },
  "cost": 0.000081
}
```

### Batch Processing

Process multiple prompts:

```bash
# From file
megacli batch prompts.txt

# With different models
megacli batch prompts.txt --models gpt-5,claude-opus-4
```

**prompts.txt:**
```
Explain TypeScript
What is Node.js?
How does async/await work?
```

---

## Troubleshooting

### Common Issues

#### API Key Not Working

**Problem:** `Error: Invalid API key`

**Solutions:**
```bash
# Verify authentication
megacli auth status

# Test connection
megacli auth test

# Re-login
megacli auth logout
megacli auth login
```

#### Model Not Found

**Problem:** `Error: Model 'gpt-x' not found`

**Solutions:**
```bash
# List available models
megacli models list

# Check exact model name
megacli models info gpt-5
```

#### Rate Limiting

**Problem:** `Error: Rate limit exceeded`

**Solutions:**
- Wait a few seconds and retry
- Upgrade your MegaLLM plan
- Use a different model

#### Network Issues

**Problem:** `Error: Network timeout`

**Solutions:**
```bash
# Check connection
curl https://ai.megallm.io/v1/models

# Use verbose mode for debugging
megacli chat --verbose

# Check proxy settings
echo $HTTPS_PROXY
```

### Debug Mode

Enable detailed logging:

```bash
# Environment variable
export MEGACLI_DEBUG=true

# Or use verbose flag
megacli chat --verbose
```

### Getting Help

```bash
# Command help
megacli help
megacli chat --help

# Online documentation
megacli docs

# Report issues
megacli issue
```

---

## API Reference

### Programmatic Usage

You can use MegaCLI as a library in your Node.js projects:

```typescript
import { MegaCLI } from 'megacli';

// Initialize
const cli = new MegaCLI({
  apiKey: 'sk-mega-xxxxx',
  defaultModel: 'gpt-5'
});

// Chat completion
const response = await cli.chat({
  messages: [
    { role: 'user', content: 'Hello!' }
  ],
  model: 'gpt-5'
});

console.log(response.content);

// Streaming
const stream = await cli.chatStream({
  messages: [{ role: 'user', content: 'Write a story' }]
});

for await (const chunk of stream) {
  process.stdout.write(chunk.content);
}

// List models
const models = await cli.listModels();
console.log(models);
```

### TypeScript Types

```typescript
interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatOptions {
  messages: ChatMessage[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

interface ModelInfo {
  id: string;
  name: string;
  provider: string;
  contextLength: number;
  pricing: {
    input: number;
    output: number;
  };
}
```

---

## Tips & Best Practices

### Model Selection

- **Quick tasks:** Use `gpt-4o-mini` or `gemini-2.0-flash`
- **Complex reasoning:** Use `gpt-5` or `claude-opus-4`
- **Code generation:** Use `gpt-5` or `claude-3.7-sonnet`
- **Large context:** Use `gemini-2.5-pro` (1M tokens)
- **Cost-sensitive:** Use mini/flash models

### Optimizing Costs

1. Use appropriate models for the task
2. Set reasonable `max-tokens` limits
3. Enable streaming for better UX without extra cost
4. Cache responses when possible
5. Monitor usage with `megacli usage`

### Performance Tips

1. Use streaming for long responses
2. Keep conversation history reasonable
3. Use one-shot commands for quick queries
4. Prefer piping over file reading for large data

### Security Best Practices

1. Never commit API keys to git
2. Use environment variables in CI/CD
3. Rotate API keys regularly
4. Use separate keys for dev/prod
5. Enable key restrictions in dashboard

---

## FAQ

**Q: Is MegaCLI free?**
A: MegaCLI is free and open-source. You only pay for MegaLLM API usage.

**Q: Can I use my OpenAI/Anthropic API keys directly?**
A: No, MegaCLI requires a MegaLLM API key for unified access.

**Q: Does it work offline?**
A: No, MegaCLI requires internet connection to access AI models.

**Q: Can I contribute?**
A: Yes! Check our GitHub repository for contribution guidelines.

**Q: How do I update MegaCLI?**
A: Run `npm update -g megacli` to get the latest version.

---

## Support

- **Documentation:** [docs.megallm.io/cli](https://docs.megallm.io/cli)
- **GitHub Issues:** [github.com/YashSensei/megacli_final](https://github.com/YashSensei/megacli_final)
- **Discord:** [discord.gg/devsindia](https://discord.gg/devsindia)
- **Email:** support@megallm.io

---

## License

MIT License - see [LICENSE](LICENSE) file for details.

---

**Made with ❤️ by the MegaLLM Team**

*Last Updated: November 22, 2025*
