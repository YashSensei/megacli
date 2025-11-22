# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2025-11-22

### Added

#### Phase 1: Foundation
- TypeScript project setup with strict mode
- ES Modules configuration
- Commander.js CLI framework
- Build pipeline with TypeScript compiler
- NPM package structure

#### Phase 2: Authentication
- `megacli auth login` - Interactive API key setup
- `megacli auth status` - Check authentication status
- `megacli auth test` - Test API connection
- `megacli auth logout` - Remove stored credentials
- System-level config storage using Conf library
- Windows/macOS/Linux config path support

#### Phase 3: Interactive Chat
- `megacli chat` - Start chat sessions with AI models
- Multi-turn conversation support
- Message history management
- Token usage tracking (input/output)
- Special commands:
  - `/help` - Show available commands
  - `/info` - Display current settings
  - `/models` - List available models
  - `/switch` - Change model mid-conversation
  - `/clear` - Reset conversation
  - `/exit` - Exit chat
- Graceful Ctrl+C handling
- Non-streaming responses for accurate tokens

#### Phase 4: Model Management
- `megacli models list` - Browse 22+ available models
- `megacli models info <id>` - Detailed model information
- `megacli models search <query>` - Search models by name/provider
- Filter by category: `--category fast|balanced|premium|specialized`
- Filter by provider: `--provider openai|anthropic|google|deepseek`
- Beautiful table layout with model details
- Category-based organization with icons

#### Phase 5: UI Polish
- Gradient.passion banner with figlet ASCII art
- Enhanced chat welcome with parameter display
- Improved loading spinners and progress indicators
- Color-coded output (cyan/yellow/green/red)
- Boxed messages for important info
- Console.clear for clean interface

#### Phase 6: AI Coding Assistant
- `megacli code` - Interactive coding assistant
- `megacli code --task "<task>"` - One-off coding tasks
- Project analysis (package.json, tsconfig.json)
- File operations with path validation
- Special commands:
  - `/read <file>` - Read and analyze files
  - `/search <text>` - Search across codebase
  - `/tree` - Show project structure
  - `/files` - List all source files
  - `/reset` - Clear conversation
- Automatic project context building
- Concise terminal-friendly AI responses (max 15-20 lines)
- Reduced token limit (1024) for faster responses

### Technical Details

- **Language**: TypeScript 5.7.2 (strict mode)
- **Runtime**: Node.js 18+
- **Module System**: ES Modules
- **Config Storage**: System-level (Conf)
- **UI Libraries**: Chalk, Ora, Boxen, Inquirer, Figlet, Gradient-string
- **API Client**: OpenAI SDK (compatible with MegaLLM)
- **File Operations**: fs-extra, glob
- **Build Target**: ES2022

### Model Support

22+ models across 4 categories:

- **Premium**: GPT-5, GPT-5.1, Claude Opus 4.1, Gemini 2.5 Pro, DeepSeek V3.2
- **Balanced**: Claude Sonnet 4.5, Gemini 3 Pro, DeepSeek V3, Qwen3
- **Fast**: Claude Haiku 4.5, GPT-5 Mini, Gemini Flash, DeepSeek V3.1
- **Specialized**: DeepSeek R1 (reasoning), Command R+ (retrieval), WizardLM

### Configuration

Default settings:
- Base URL: `https://ai.megallm.io/v1`
- Default Model: `claude-haiku-4-5-20251001`
- Temperature: `0.7`
- Max Tokens: `2048`

Config locations:
- Windows: `%APPDATA%\megacli-nodejs\Config\config.json`
- macOS: `~/Library/Preferences/megacli-nodejs/`
- Linux: `~/.config/megacli-nodejs/`

## [Unreleased]

### Planned

- Unit test coverage with Jest
- Conversation history export
- Custom model configurations
- Plugin system for extensions
- Multi-language support
- Web dashboard integration

---

## Version History

- **0.1.0** (2025-11-22) - Initial beta release with 6 phases complete
