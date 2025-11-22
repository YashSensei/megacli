# MegaCLI

> Official command-line interface for MegaLLM - Access 70+ AI models from your terminal

[![npm version](https://img.shields.io/npm/v/megacli.svg)](https://www.npmjs.com/package/megacli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🚀 Quick Start

```bash
# Install globally
npm install -g megacli

# Or use with npx (no installation)
npx megacli

# Authenticate
megacli auth login

# Start chatting
megacli chat

# Get coding help
megacli code
```

## ✨ Features

- 🤖 **Interactive Chat** - Multi-turn conversations with 70+ AI models
- 🔐 **Secure Authentication** - System-level API key storage (no .env files)
- 🎯 **Model Management** - Browse, search, and switch between 22+ models
- 💻 **AI Code Assistant** - Claude-like assistant with file operations & command execution
- 🔒 **Workspace Trust** - Security prompts for file operations (like VS Code)
- 📝 **File Operations** - AI can read and write files automatically
- ⚡ **Command Execution** - AI runs PowerShell/bash commands autonomously
- 🎨 **Beautiful UI** - Gradients, spinners, tables, and formatted output
- 🧠 **Smart Responses** - GitHub Copilot-style concise, analytical answers
- 📊 **Token Usage** - Real-time tracking of input/output tokens
- 🔍 **Code Search** - Find patterns across your entire codebase
- 📂 **Project Analysis** - Auto-detect dependencies and structure

## 📖 Documentation

- [Development Plan](PLAN.md) - Complete development roadmap
- [Full Documentation](DOCUMENTATION.md) - User guide and API reference
- [Learning Guide](TEACHING.md) - Technical concepts explained

## 🏗️ Project Status

**Version:** 0.1.0 - Beta  
**Status:** Feature Complete ✅

### Completed Features

- ✅ **Phase 1:** TypeScript project setup & build pipeline
- ✅ **Phase 2:** Authentication system (4 commands)
- ✅ **Phase 3:** Interactive chat with message history
- ✅ **Phase 4:** Model management (list/info/search)
- ✅ **Phase 5:** UI polish with gradients & enhanced visuals
- ✅ **Phase 6:** AI coding assistant with file operations

### Coming Soon

- 📝 Unit tests with Jest
- 📦 NPM package publication
- 📚 Extended documentation

## 🎯 Usage

### Authentication

```bash
# Login with API key
megacli auth login

# Check authentication status
megacli auth status

# Test API connection
megacli auth test

# Logout
megacli auth logout
```

### Chat Commands

```bash
# Start chat with default model (Claude Haiku 4.5)
megacli chat

# Use specific model
megacli chat -m gpt-5.1

# Custom temperature (creativity: 0-2)
megacli chat -t 1.5

# Limit response length
megacli chat --max-tokens 500

# Combined options
megacli chat -m gemini-flash -t 0.8 --max-tokens 1000
```

### Special Commands in Chat

- `/help` - Show all commands
- `/info` - Show current settings and token usage
- `/models` - List all available models
- `/switch <model>` - Change to different model
- `/clear` - Clear conversation history
- `/exit` - Exit chat (or use Ctrl+C)

### Model Management

```bash
# List all models
megacli models list

# Filter by category
megacli models list --category fast      # Fast & efficient models
megacli models list --category premium   # Premium models (GPT-5, Claude Opus)
megacli models list --category balanced  # Balanced price/performance

# Filter by provider
megacli models list --provider anthropic # Claude models
megacli models list --provider openai    # GPT models
megacli models list --provider google    # Gemini models

# Get detailed model info
megacli models info gpt-5.1
megacli models info claude-haiku

# Search for models
megacli models search "claude"
megacli models search "reasoning"
```

### AI Coding Assistant

```bash
# Interactive coding mode
megacli code

# Execute a specific task
megacli code --task "analyze my project structure"
megacli code --task "find all TODO comments"
megacli code --task "explain the config.ts file"
```

#### 🚀 New: Claude-like Capabilities

The AI assistant now works like Claude Code:

- **🔒 Workspace Trust** - Security prompt on first run (remembers your choice)
- **📖 Auto File Reading** - AI reads files silently using `Get-Content`
- **✍️ Auto File Writing** - AI modifies files directly with `<write_file>` tags
- **⚡ Command Execution** - AI runs PowerShell/bash commands with `<execute_command>`
- **🧠 Smart Analysis** - GitHub Copilot-style responses (concise, analytical)
- **🎯 Proactive Actions** - AI acts immediately without asking permission

#### Available Commands in Code Mode

- `/read <file>` - Read and analyze a file
- `/search <text>` - Search for text across source files
- `/tree` - Show project file structure
- `/files` - List all source files
- `/reset` - Clear conversation history
- `/help` - Show all commands
- `/exit` - Exit code assistant

Or just describe what you want in natural language - the AI will read files, run commands, and make changes automatically!

## 🛠️ Development

```bash
# Clone the repository
git clone https://github.com/YashSensei/megacli.git
cd megacli

# Install dependencies
npm install

# Development mode (with hot reload)
npm run dev

# Build for production
npm run build

# Link locally for testing
npm link

# Run tests (coming soon)
npm test

# Lint code
npm run lint

# Format code
npm run format
```

## 🔧 Configuration

MegaCLI stores configuration at the system level:

- **Windows:** `%APPDATA%\megacli-nodejs\Config\config.json`
- **macOS:** `~/Library/Preferences/megacli-nodejs/`
- **Linux:** `~/.config/megacli-nodejs/`

Default settings:
```json
{
  "baseUrl": "https://ai.megallm.io/v1",
  "defaultModel": "claude-haiku-4-5-20251001",
  "temperature": 0.7,
  "maxTokens": 2048
}
```

## 📦 Available Commands

### Core Commands

| Command | Description |
|---------|-------------|
| `megacli auth login` | Authenticate with MegaLLM API key |
| `megacli auth status` | Check authentication status |
| `megacli auth test` | Test API connection |
| `megacli auth logout` | Remove stored credentials |
| `megacli chat` | Start interactive chat session |
| `megacli models list` | Browse available models |
| `megacli models info <id>` | Get detailed model information |
| `megacli models search <query>` | Search for models |
| `megacli code` | Launch AI coding assistant |
| `megacli code --task "<task>"` | Execute a coding task |

### Available Models (22+)

- **OpenAI:** GPT-5, GPT-5.1, GPT-5-Mini
- **Anthropic:** Claude Opus 4.1, Sonnet 4.5, Haiku 4.5
- **Google:** Gemini 2.5 Pro, Gemini 3 Pro, Gemini Flash
- **DeepSeek:** V3, V3.1, V3.2, R1
- **Others:** Qwen3, Llama3, Command R+, WizardLM, and more

## 📁 Project Structure

```
megacli/
├── src/
│   ├── commands/
│   │   ├── auth.ts          # Authentication commands
│   │   ├── chat.ts          # Interactive chat
│   │   ├── code.ts          # AI coding assistant
│   │   └── models.ts        # Model management
│   ├── lib/
│   │   ├── config.ts        # Config manager (Conf)
│   │   ├── models.ts        # Model registry
│   │   ├── ui.ts            # UI utilities
│   │   ├── filesystem.ts    # File operations
│   │   └── project-analyzer.ts  # Project context
│   ├── types/
│   │   └── index.ts         # TypeScript definitions
│   └── index.ts             # CLI entry point
├── bin/
│   └── megacli.js           # Executable
└── dist/                     # Compiled output
```

## 🎯 Tech Stack

- **CLI Framework:** Commander.js
- **AI SDK:** OpenAI (compatible with MegaLLM)
- **UI Components:** Chalk, Ora, Boxen, Inquirer, Figlet, Gradient-string
- **Config Storage:** Conf (system-level)
- **File Operations:** fs-extra, glob
- **Language:** TypeScript (strict mode)
- **Module System:** ES Modules
- **Runtime:** Node.js 18+

## 🎯 Roadmap

### ✅ Completed (v0.1.0)

- TypeScript project setup with strict mode
- Authentication system (4 commands)
- Interactive chat with 22+ models
- Model management (list/search/info)
- UI enhancements (gradients, spinners, tables)
- AI coding assistant with file operations

### 🚧 In Progress

- Unit test coverage with Jest
- NPM package publication
- Enhanced documentation

### 📋 Future Plans

- Conversation history export
- Custom model configurations
- Plugin system for extensions
- Multi-language support
- Web dashboard integration

## 📝 License

MIT

## 🤝 Contributing

See [PLAN.md](PLAN.md) for the complete development roadmap and contribution guidelines.

## 🔗 Links

- **MegaLLM:** https://megallm.io
- **Documentation:** https://docs.megallm.io
- **GitHub:** https://github.com/YashSensei/megacli_final
- **Discord:** https://discord.gg/devsindia

---

**Made with ❤️ for the MegaLLM community**
