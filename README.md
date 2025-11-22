# MegaCLI

Official command-line interface for MegaLLM - Access 70+ AI models from your terminal

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Link globally
npm link

# Set up your API key
megacli auth login

# Start chatting!
megacli chat
```

## ✨ Features

- 🤖 **Interactive Chat** - Conversational AI in your terminal
- 🔐 **Secure Authentication** - API key management with encrypted storage
- 🎯 **70+ AI Models** - Access GPT-5, Claude 4, Gemini 3, DeepSeek, and more
- 🎨 **Beautiful UI** - Colors, spinners, and formatted output
- ⚡ **Fast & Efficient** - Non-streaming responses with accurate token tracking
- 🔄 **Model Switching** - Change models mid-conversation with `/switch`

## 📖 Documentation

- [Development Plan](PLAN.md) - Complete development roadmap
- [Full Documentation](DOCUMENTATION.md) - User guide and API reference
- [Learning Guide](TEACHING.md) - Technical concepts explained

## 🏗️ Project Status

**Current Phase:** Phase 3 - Basic Chat Interface ✅

- [x] TypeScript project setup
- [x] Package.json configuration
- [x] Build pipeline (TypeScript compilation)
- [x] CLI framework (Commander.js)
- [x] Authentication system (login/logout/status/test)
- [x] Configuration management
- [x] Model registry (22+ models)
- [x] UI utilities
- [x] Interactive chat interface
- [ ] Model management commands (Next Phase)

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

## 🛠️ Development

```bash
# Install dependencies
npm install

# Development mode (with hot reload)
npm run dev

# Build for production
npm run build

# Watch mode
npm run watch

# Lint code
npm run lint

# Format code
npm run format
```

## 📦 Available Commands (Coming Soon)

- `megacli auth` - Authentication management
- `megacli chat` - Interactive chat interface
- `megacli models` - List available models
- `megacli code` - Agentic coding assistant
- `megacli ask` - Quick questions

## 🔑 Features

- ✅ TypeScript with strict type checking
- ✅ ES Modules support
- ✅ Beautiful CLI UI (Chalk, Ora, Boxen)
- ✅ Configuration management
- ⏳ MegaLLM API integration (coming soon)
- ⏳ 70+ AI models access (coming soon)
- ⏳ Interactive chat (coming soon)
- ⏳ Agentic coding mode (coming soon)

## 📁 Project Structure

```
megacli/
├── src/
│   ├── commands/      # Command implementations
│   ├── lib/          # Core libraries (API, config, UI)
│   ├── types/        # TypeScript type definitions
│   └── index.ts      # Main CLI entry point
├── bin/
│   └── megacli.js    # Executable entry point
├── dist/             # Compiled JavaScript (generated)
├── PLAN.md           # Development roadmap
├── DOCUMENTATION.md  # Complete user guide
└── package.json
```

## 🎯 Roadmap

### Phase 1: Foundation ✅ (Current)
- Project setup and configuration
- CLI framework
- Build pipeline

### Phase 2: Authentication (Next)
- API key management
- Secure storage
- Key validation

### Phase 3: Basic Chat
- Interactive chat mode
- MegaLLM API integration
- Streaming support

### Phase 4: Model Management
- List models
- Model switching
- Model information

### Phase 5: Pretty UI
- Colors and formatting
- Loading spinners
- Beautiful output

### Phase 6: Agentic Coding
- File operations
- Code assistance
- Diff visualization

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
