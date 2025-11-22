# 📚 MegaCLI - Complete Technical Guide

> A comprehensive guide to understanding everything we built - from TypeScript basics to CLI architecture

**Current Status:** Phases 1-3 Complete ✅
- ✅ Foundation & Project Setup
- ✅ Authentication System
- ✅ Interactive Chat Interface

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [What We've Built So Far](#what-weve-built-so-far)
3. [Configuration Files Deep Dive](#configuration-files-deep-dive)
4. [TypeScript Fundamentals](#typescript-fundamentals)
5. [Node.js Modules Explained](#nodejs-modules-explained)
6. [CLI Architecture](#cli-architecture)
7. [Build Process & Tools](#build-process--tools)
8. [Development Workflow](#development-workflow)
9. [Key Libraries Explained](#key-libraries-explained)
10. [Best Practices](#best-practices)
11. [Common Issues & Solutions](#common-issues--solutions)

---

## Project Overview

### What is MegaCLI?

MegaCLI is a **command-line interface** (CLI) application that lets users access 70+ AI models from their terminal. Think of it like a terminal app for talking to GPT, Claude, Gemini, and other AI models through one unified interface.

### Current Features (Phases 1-3)

✅ **Authentication System**
- Secure API key storage
- Login/logout/status/test commands
- Environment variable support
- Cross-platform config management

✅ **Interactive Chat Interface**
- Full conversational AI with message history
- 22+ models (GPT-5, Claude 4, Gemini 3, DeepSeek, etc.)
- Model switching mid-conversation
- Token usage tracking
- Special commands (/help, /info, /models, /switch, /clear, /exit)
- Parameter validation (temperature, max-tokens)
- Graceful exit handling

✅ **Model Registry**
- 22 pre-configured models
- Alias support (e.g., "claude-sonnet", "gpt-5.1")
- Category-based organization (premium, balanced, fast, specialized)
- Provider filtering (OpenAI, Anthropic, Google, Meta, DeepSeek)

### The Tech Stack

```
TypeScript → Compiled to → JavaScript → Run by → Node.js
     ↓
  (Type Safety)
```

**Why Each Technology?**

- **TypeScript**: Adds types to JavaScript, catches bugs during development
- **Node.js**: JavaScript runtime that lets us run JS outside browsers
- **Commander.js**: Framework for building CLI apps (handles arguments, commands)
- **OpenAI SDK**: API client for making requests to MegaLLM (OpenAI-compatible)
- **Inquirer**: Interactive command-line prompts for user input
- **Conf**: Cross-platform configuration and storage management
- **Chalk, Ora, Boxen**: Make terminal output beautiful (colors, spinners, boxes)

---

## What We've Built So Far

### Phase 1: Foundation ✅

**Files Created:**
- `package.json` - Project manifest with ES module configuration
- `tsconfig.json` - TypeScript compiler configuration (strict mode)
- `bin/megacli.js` - Executable entry point
- `src/index.ts` - Main CLI with Commander.js setup
- `src/types/index.ts` - TypeScript type definitions
- `src/lib/ui.ts` - UI utilities (colors, spinners, boxes)

**Key Learnings:**
- ES Modules require `"type": "module"` in package.json
- TypeScript's strict mode catches many errors at compile time
- Commander.js provides clean CLI architecture with subcommands

### Phase 2: Authentication ✅

**Files Created:**
- `src/commands/auth.ts` - Login, logout, status, test commands
- `src/lib/config.ts` - ConfigManager singleton for secure storage
- `.env.example` - Environment variable template

**Implementation Highlights:**
```typescript
// Singleton pattern for config management
export const configManager = new ConfigManager();

// API key validation
function validateApiKeyFormat(key: string): boolean {
  return key.startsWith('sk-mega-');
}

// Secure storage location (cross-platform)
// Windows: %APPDATA%/megacli-nodejs/Config/config.json
// Linux/Mac: ~/.config/megacli-nodejs/config.json
```

**Key Learnings:**
- Conf library handles cross-platform config storage automatically
- Inquirer provides beautiful interactive prompts
- API key validation prevents common user errors
- Environment variables provide deployment flexibility

### Phase 3: Chat Interface ✅

**Files Created:**
- `src/commands/chat.ts` - Full interactive chat implementation
- `src/lib/models.ts` - Model registry with 22+ models

**Architecture:**
```typescript
// ChatSession class manages conversation state
class ChatSession {
  private client: OpenAI;                    // MegaLLM API client
  private messages: ChatMessage[] = [];      // Conversation history
  private currentModel: string;              // Active model
  private tokenUsage: { ... };               // Usage tracking
  
  async start() { ... }                      // Main chat loop
  async sendMessage(text: string) { ... }   // Send to API
  handleCommand(cmd: string) { ... }        // Process /commands
}
```

**Key Features Implemented:**
1. **Message History** - Maintains conversation context across turns
2. **Model Registry** - Organized collection of 22 models with metadata
3. **Token Tracking** - Accurate usage counting for cost awareness
4. **Parameter Validation** - Temperature (0-2), max-tokens (>0)
5. **Special Commands** - `/help`, `/info`, `/models`, `/switch`, `/clear`, `/exit`
6. **Graceful Exit** - Handles Ctrl+C without errors
7. **Error Handling** - User-friendly messages for invalid inputs

**Technical Challenges Solved:**
```typescript
// Challenge: Token usage wasn't tracked in streaming mode
// Solution: Use stream_options with fallback estimation
stream_options: { include_usage: true }

// Fallback estimation (1 token ≈ 4 characters)
const estimatedTokens = Math.ceil(content.length / 4);

// Challenge: Inquirer throws error on Ctrl+C
// Solution: Catch ExitPromptError and exit gracefully
catch (error) {
  if (error.message.includes('force closed')) {
    this.showGoodbye();
    process.exit(0);
  }
}
```

**Key Learnings:**
- Non-streaming responses provide accurate token counts
- Model aliases improve user experience (e.g., "claude-sonnet" vs full ID)
- Parameter validation prevents API errors and improves UX
- Singleton pattern works well for shared state (config, model registry)

---

## Configuration Files Deep Dive

### 1. package.json - The Project Manifest

This is the **heart** of every Node.js project. It's like a blueprint that describes your project.

```json
{
  "name": "megacli",
  "version": "0.1.0",
  "type": "module",
  "main": "dist/index.js",
  "bin": {
    "megacli": "./bin/megacli.js"
  },
  "scripts": { ... },
  "dependencies": { ... },
  "devDependencies": { ... }
}
```

#### Key Sections Explained:

**Basic Information:**
```json
"name": "megacli"        // Package name (used when publishing to npm)
"version": "0.1.0"       // Semantic versioning: MAJOR.MINOR.PATCH
"description": "..."     // Short description of the package
```

**Module System:**
```json
"type": "module"
```
This is **CRITICAL**! It tells Node.js to use ES Modules instead of CommonJS.

**What's the difference?**
```javascript
// CommonJS (old way)
const chalk = require('chalk');
module.exports = myFunction;

// ES Modules (modern way - what we use)
import chalk from 'chalk';
export default myFunction;
```

**Why ES Modules?**
- ✅ Modern JavaScript standard (used in browsers too)
- ✅ Static analysis (tools can understand imports before running)
- ✅ Better tree-shaking (removes unused code)
- ✅ Top-level `await` support
- ✅ Cleaner syntax

**Entry Points:**
```json
"main": "dist/index.js"     // Entry point when imported as a library
"bin": {
  "megacli": "./bin/megacli.js"  // Creates 'megacli' command globally
}
```

When you run `npm link`, npm creates a symlink so typing `megacli` runs `./bin/megacli.js`.

**Scripts:**
```json
"scripts": {
  "dev": "tsx src/index.ts",        // Run TypeScript directly (no build)
  "build": "tsc",                    // Compile TypeScript to JavaScript
  "watch": "tsc --watch",            // Auto-compile on file changes
  "start": "node dist/index.js"      // Run compiled JavaScript
}
```

Run these with `npm run <script-name>`, e.g., `npm run build`.

**Dependencies vs DevDependencies:**
```json
"dependencies": {
  "chalk": "^5.3.0"      // Needed to RUN the app
}
"devDependencies": {
  "typescript": "^5.7.2"  // Only needed for DEVELOPMENT
}
```

**Dependency Version Syntax:**
- `^5.3.0` - Allow updates: 5.3.0 to 5.9.9 (not 6.0.0)
- `~5.3.0` - Allow patches: 5.3.0 to 5.3.9 (not 5.4.0)
- `5.3.0` - Exact version only

---

### 2. tsconfig.json - TypeScript Compiler Configuration

This tells the TypeScript compiler **how** to compile your code.

```json
{
  "compilerOptions": {
    "target": "ES2022",              // Output JavaScript version
    "module": "NodeNext",            // Module system
    "outDir": "./dist",              // Where compiled JS goes
    "rootDir": "./src",              // Where TS source files are
    "strict": true,                  // Enable all strict checks
    ...
  },
  "include": ["src/**/*"],           // Which files to compile
  "exclude": ["node_modules", "dist"] // Which to ignore
}
```

#### Key Options Explained:

**Language & Environment:**
```json
"target": "ES2022"
```
This sets which JavaScript features the output will use. ES2022 includes:
- `async/await`
- `Promise.allSettled()`
- Class fields
- Top-level `await`
- And more modern features

**Module System:**
```json
"module": "NodeNext",
"moduleResolution": "NodeNext"
```
These tell TypeScript to use Node.js's module resolution. `NodeNext` is the latest and handles both CommonJS and ES Modules correctly.

**Output Configuration:**
```json
"outDir": "./dist",      // Compiled JS files go here
"rootDir": "./src",      // Source TS files live here
```

This keeps source and compiled code separate:
```
src/
  index.ts          →  compiles to  →  dist/
  lib/                                    index.js
    config.ts       →  compiles to  →    lib/
    ui.ts                                   config.js
                                            ui.js
```

**Type Checking (Strict Mode):**
```json
"strict": true
```

This enables ALL strict type checks. Individual flags included:

```json
"noImplicitAny": true          // No 'any' types without explicit annotation
"strictNullChecks": true       // null/undefined must be explicitly handled
"strictFunctionTypes": true    // Function types checked more carefully
"noImplicitThis": true         // 'this' must have explicit type
```

**Example of what strict mode catches:**

```typescript
// ❌ Without strict - compiles but dangerous!
function greet(name) {  // 'name' is implicitly 'any'
  return name.toUppercase();  // Typo! Will crash at runtime
}

// ✅ With strict - error at compile time!
function greet(name: string): string {
  return name.toUppercase();  
  // TS Error: Property 'toUppercase' does not exist on type 'string'
  // Did you mean 'toUpperCase'?
}
```

**Additional Quality Checks:**
```json
"noUnusedLocals": true         // Error on unused variables
"noUnusedParameters": true     // Error on unused function params
"noImplicitReturns": true      // All code paths must return
"noFallthroughCasesInSwitch": true  // Switch cases need break/return
```

**Source Maps:**
```json
"sourceMap": true
```
Creates `.js.map` files that link compiled JavaScript back to original TypeScript. This lets you debug TypeScript code even though Node.js runs JavaScript!

---

### 3. .gitignore - Version Control Exclusions

This tells Git which files to **never** track.

```gitignore
# Dependencies
node_modules/

# Build output
dist/

# Environment variables (contains secrets!)
.env

# Logs
*.log

# OS files
.DS_Store
Thumbs.db
```

#### Why Each Section?

**node_modules/**
- This folder contains ALL your dependencies (can be 500+ MB!)
- Everyone can recreate it by running `npm install`
- Committing it makes the repo huge and causes merge conflicts

**dist/**
- This is generated from `src/` by running `npm run build`
- Others can generate it themselves
- Tracking both source and compiled code leads to confusion

**.env**
- Contains API keys and secrets
- **NEVER commit this!** It exposes your credentials
- Instead, commit `.env.example` with fake values

**.log files**
- Debug/error logs that are only relevant locally
- Can grow very large

**OS files**
- `.DS_Store` (Mac), `Thumbs.db` (Windows)
- System-specific files that serve no purpose in the repo

---

### 4. .prettierignore - Formatting Exclusions

Tells Prettier which files NOT to auto-format.

```
dist/              # Generated code
node_modules/      # Third-party code
*.md               # Markdown has its own rules
.env               # Config files
```

**Why ignore these?**
- **dist/**: Generated code shouldn't be reformatted
- **node_modules/**: Third-party code, not yours to format
- **Markdown**: Has its own formatting conventions
- **Config files**: Specific syntax that Prettier might break

---

### 5. .env.example - Secret Template

This is a **template** showing what secrets are needed.

```bash
# .env.example (committed to Git)
MEGALLM_API_KEY=sk-mega-your-api-key-here
MEGALLM_BASE_URL=https://ai.megallm.io/v1
```

**Workflow:**
1. User clones repo
2. User copies `.env.example` to `.env`
3. User fills in real values in `.env`
4. Code reads from `.env` via `process.env`

```typescript
// Reading environment variables
const apiKey = process.env['MEGALLM_API_KEY'];
```

**With dotenv library:**
```typescript
import { config } from 'dotenv';
config();  // Loads .env file into process.env
```

---

## TypeScript Fundamentals

### What is TypeScript?

TypeScript = JavaScript + **Type System**

```typescript
// JavaScript - no types
function add(a, b) {
  return a + b;
}
add(1, 2);        // 3
add('1', '2');    // '12' - Oops! String concatenation

// TypeScript - with types
function add(a: number, b: number): number {
  return a + b;
}
add(1, 2);        // 3 ✅
add('1', '2');    // ❌ Error: Argument of type 'string' is not assignable to 'number'
```

### Basic Types

```typescript
// Primitives
let name: string = 'Alice';
let age: number = 25;
let isActive: boolean = true;

// Arrays
let numbers: number[] = [1, 2, 3];
let names: Array<string> = ['Alice', 'Bob'];

// Objects
let user: { name: string; age: number } = {
  name: 'Alice',
  age: 25
};

// Union types (either/or)
let id: string | number = 123;
id = 'abc123';  // Also valid

// Literal types (exact values)
let status: 'active' | 'inactive' | 'pending' = 'active';
status = 'deleted';  // ❌ Error
```

### Interfaces

Interfaces define the **shape** of objects:

```typescript
interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp?: number;  // Optional property (?)
}

// Usage
const message: ChatMessage = {
  role: 'user',
  content: 'Hello!'
  // timestamp is optional
};

// ❌ Error - missing required property
const bad: ChatMessage = {
  role: 'user'
  // Missing 'content'
};
```

### Type Aliases

Similar to interfaces but more flexible:

```typescript
type APIKey = string;
type ModelName = 'gpt-4' | 'claude-3' | 'gemini-pro';

type Config = {
  apiKey: APIKey;
  model: ModelName;
};
```

### Generics

Make types reusable:

```typescript
// Without generics - have to duplicate code
function getFirstString(arr: string[]): string {
  return arr[0];
}
function getFirstNumber(arr: number[]): number {
  return arr[0];
}

// With generics - one function handles all types
function getFirst<T>(arr: T[]): T {
  return arr[0];
}

const firstString = getFirst(['a', 'b', 'c']);  // type: string
const firstNumber = getFirst([1, 2, 3]);        // type: number
```

### Our Types Explained

```typescript
// src/types/index.ts

// Configuration type
export interface MegaLLMConfig {
  apiKey: string;
  baseUrl?: string;  // Optional (has default)
  defaultModel?: string;
  temperature?: number;
}

// Chat message structure
export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';  // Only these 3 values allowed
  content: string;
}

// Model information
export interface ModelInfo {
  id: string;
  name: string;
  provider: string;
  contextLength: number;
  pricing: {
    input: number;
    output: number;
  };
  capabilities: string[];
}
```

**Why we defined these:**
- **Autocomplete**: Your editor suggests valid properties
- **Type safety**: Catch typos and mistakes
- **Documentation**: Types explain what values are expected
- **Refactoring**: Change a type, find all affected code

---

## Node.js Modules Explained

### ES Modules vs CommonJS

Node.js supports two module systems:

#### CommonJS (Old)

```javascript
// Importing
const chalk = require('chalk');
const { Command } = require('commander');

// Exporting
module.exports = myFunction;
module.exports = { foo, bar };
```

#### ES Modules (Modern - What We Use)

```typescript
// Importing
import chalk from 'chalk';                  // Default import
import { Command } from 'commander';        // Named import
import * as fs from 'fs';                   // Namespace import

// Exporting
export default myFunction;                  // Default export
export { foo, bar };                        // Named exports
export const API_KEY = 'xxx';              // Direct export
```

### Module Resolution

When you write `import chalk from 'chalk'`, how does Node.js find it?

**Resolution order:**
1. Check if it's a core module (`fs`, `path`, `http`)
2. Look in `node_modules/chalk/`
3. Walk up directories checking `../node_modules/`, `../../node_modules/`, etc.

**For relative imports:**
```typescript
import { config } from './lib/config.js';  // Must include .js extension in ES modules!
import { ui } from '../ui.js';
```

**Key difference with ES modules:**
- Must include `.js` extension (even for `.ts` files!)
- TypeScript compiles `.ts` to `.js`, keeping the `.js` extension

---

## CLI Architecture

### How Commander.js Works

Commander is a framework for building CLI apps. It handles:
- Parsing command-line arguments
- Generating help text
- Handling subcommands
- Validating options

```typescript
import { Command } from 'commander';

const program = new Command();

program
  .name('megacli')                          // Command name
  .description('Access 70+ AI models')      // Shown in --help
  .version('0.1.0');                        // --version flag

// Global options (work for all commands)
program
  .option('--json', 'Output as JSON')
  .option('--verbose', 'Verbose logging');

// Subcommand: megacli auth
program
  .command('auth')
  .description('Manage authentication')
  .action(() => {
    console.log('Auth command called!');
  });

// Parse the command-line arguments
program.parse(process.argv);
```

### Command-Line Parsing

When user types:
```bash
megacli auth login --verbose
```

**What happens:**
1. `process.argv` contains: `['node', '/path/to/megacli', 'auth', 'login', '--verbose']`
2. Commander parses this array
3. Finds `auth` subcommand
4. Calls its `.action()` function
5. Makes `--verbose` available via `program.opts()`

### Our CLI Structure

```typescript
// src/index.ts

// Main program
program
  .name('megacli')
  .version('0.1.0');

// Subcommands
program
  .command('auth')
  .description('Manage authentication')
  .action(() => { /* auth logic */ });

program
  .command('chat')
  .option('-m, --model <model>', 'Model to use')
  .action((options) => {
    console.log('Model:', options.model);
  });

// megacli chat -m gpt-4
// Output: Model: gpt-4
```

---

## Build Process & Tools

### TypeScript Compilation

When you run `npm run build`:

```
src/                    tsc                    dist/
  index.ts         ----------->                 index.js
  lib/                                          lib/
    config.ts      ----------->                   config.js
    ui.ts          ----------->                   ui.js
  types/                                        types/
    index.ts       ----------->                   index.d.ts (type declarations)
```

**What TypeScript does:**
1. **Type Checking**: Verify all types are correct
2. **Transpilation**: Convert TS syntax to JS
3. **Source Maps**: Create `.map` files for debugging
4. **Declaration Files**: Generate `.d.ts` for type info

### Development vs Production

**Development (npm run dev):**
- Uses `tsx` to run TypeScript directly
- No compilation step
- Faster iteration
- Good for testing

**Production (npm run build + npm start):**
- Compiles TypeScript to JavaScript first
- Runs optimized JavaScript
- Smaller files, faster startup
- What users will run

### Watch Mode

```bash
npm run watch
```

TypeScript watches for file changes and auto-recompiles:
```
Watching for file changes...
File changed: src/lib/config.ts
Compiling...
✓ Compilation complete
```

---

## Development Workflow

### Daily Development Cycle

```bash
# 1. Pull latest changes
git pull

# 2. Install any new dependencies
npm install

# 3. Start development mode
npm run dev

# 4. Make changes, test immediately

# 5. Before committing, check quality
npm run lint        # Check code quality
npm run format      # Auto-fix formatting
npm run build       # Verify it compiles

# 6. Commit and push
git add .
git commit -m "Add new feature"
git push
```

### Testing Changes Globally

```bash
# Link your local version
npm link

# Now 'megacli' runs your local code
megacli --help

# Make changes, rebuild
npm run build

# Test again (no need to relink)
megacli --help

# Unlink when done
npm unlink -g megacli
```

---

## Key Libraries Explained

### 1. Commander.js - CLI Framework

**Purpose:** Parse commands and arguments, generate help text

**Basic usage:**
```typescript
import { Command } from 'commander';

const program = new Command();
program
  .command('greet <name>')
  .option('-e, --enthusiasm <level>', 'How enthusiastic', 'normal')
  .action((name, options) => {
    if (options.enthusiasm === 'high') {
      console.log(`HELLO ${name.toUpperCase()}!!!`);
    } else {
      console.log(`Hello ${name}`);
    }
  });

program.parse();
```

```bash
$ megacli greet Alice
Hello Alice

$ megacli greet Alice -e high
HELLO ALICE!!!
```

---

### 2. Chalk - Terminal Colors

**Purpose:** Add colors to terminal output

```typescript
import chalk from 'chalk';

console.log(chalk.green('Success!'));
console.log(chalk.red('Error!'));
console.log(chalk.blue.bold('Important'));
console.log(chalk.bgYellow.black('Warning'));

// Combine styles
console.log(
  chalk.green('✓') + ' ' + chalk.gray('Task completed')
);
```

**Our color scheme:**
```typescript
export const colors = {
  primary: chalk.cyan,      // Main accent color
  success: chalk.green,     // Success messages
  error: chalk.red,         // Error messages
  warning: chalk.yellow,    // Warnings
  info: chalk.blue,         // Information
  muted: chalk.gray,        // Less important text
};
```

---

### 3. Ora - Loading Spinners

**Purpose:** Show loading/progress indicators

```typescript
import ora from 'ora';

const spinner = ora('Loading data...').start();

// Do async work
await fetchData();

spinner.succeed('✓ Data loaded!');
// Or: spinner.fail('✗ Failed to load');
```

**Output:**
```
⠋ Loading data...
✓ Data loaded!
```

**Our wrapper:**
```typescript
export function createSpinner(text: string) {
  return ora({ text, color: 'cyan' });
}

// Usage
const spinner = createSpinner('Authenticating...');
spinner.start();
await validateKey();
spinner.succeed('✓ Authenticated');
```

---

### 4. Boxen - Terminal Boxes

**Purpose:** Draw boxes around text

```typescript
import boxen from 'boxen';

console.log(boxen('Hello World', {
  padding: 1,
  margin: 1,
  borderStyle: 'round',
  borderColor: 'cyan'
}));
```

**Output:**
```
╭───────────────╮
│               │
│  Hello World  │
│               │
╰───────────────╯
```

**Our wrapper:**
```typescript
export function createBox(content: string, title?: string) {
  return boxen(content, {
    padding: 1,
    margin: 1,
    borderStyle: 'round',
    borderColor: 'cyan',
    title,
    titleAlignment: 'center'
  });
}
```

---

### 5. Inquirer - Interactive Prompts

**Purpose:** Ask users questions in the terminal

```typescript
import inquirer from 'inquirer';

const answers = await inquirer.prompt([
  {
    type: 'input',
    name: 'apiKey',
    message: 'Enter your API key:',
    validate: (input) => {
      if (input.startsWith('sk-mega-')) {
        return true;
      }
      return 'API key must start with sk-mega-';
    }
  },
  {
    type: 'list',
    name: 'model',
    message: 'Choose a model:',
    choices: ['gpt-4', 'claude-3', 'gemini-pro']
  },
  {
    type: 'confirm',
    name: 'continue',
    message: 'Continue?',
    default: true
  }
]);

console.log(answers);
// { apiKey: 'sk-mega-xxx', model: 'gpt-4', continue: true }
```

---

### 6. Conf - Configuration Storage

**Purpose:** Save/load configuration to disk

```typescript
import Conf from 'conf';

const config = new Conf({
  projectName: 'megacli',
  defaults: {
    model: 'gpt-4o-mini',
    temperature: 0.7
  }
});

// Save
config.set('apiKey', 'sk-mega-xxx');
config.set('model', 'gpt-4');

// Load
const apiKey = config.get('apiKey');
const model = config.get('model');

// Check existence
if (config.has('apiKey')) {
  console.log('API key is configured');
}

// Delete
config.delete('apiKey');

// Clear all
config.clear();
```

**Where it stores data:**
- Windows: `%APPDATA%\megacli\config.json`
- Mac: `~/Library/Preferences/megacli-nodejs/config.json`
- Linux: `~/.config/megacli/config.json`

---

### 7. OpenAI SDK - API Client

**Purpose:** Make requests to MegaLLM API (OpenAI-compatible)

```typescript
import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://ai.megallm.io/v1',  // MegaLLM endpoint
  apiKey: 'sk-mega-xxx'
});

// Chat completion
const response = await client.chat.completions.create({
  model: 'gpt-4',
  messages: [
    { role: 'system', content: 'You are helpful' },
    { role: 'user', content: 'Hello!' }
  ],
  temperature: 0.7,
  max_tokens: 100
});

console.log(response.choices[0]?.message.content);
```

**Streaming responses:**
```typescript
const stream = await client.chat.completions.create({
  model: 'gpt-4',
  messages: [...],
  stream: true
});

for await (const chunk of stream) {
  const content = chunk.choices[0]?.delta?.content;
  if (content) {
    process.stdout.write(content);  // Print as it arrives
  }
}
```

---

## Best Practices

### 1. Error Handling

**Always handle errors gracefully:**

```typescript
// ❌ Bad - crashes the app
async function getConfig() {
  const data = await readFile('config.json');
  return JSON.parse(data);
}

// ✅ Good - handles errors
async function getConfig() {
  try {
    const data = await readFile('config.json');
    return JSON.parse(data);
  } catch (error) {
    console.error(chalk.red('✗ Failed to load config'));
    console.error(chalk.gray(error.message));
    process.exit(1);
  }
}
```

---

### 2. Type Safety

**Avoid `any`, use proper types:**

```typescript
// ❌ Bad
function processData(data: any) {
  return data.value.toUpperCase();  // Runtime error if data is wrong shape
}

// ✅ Good
interface Data {
  value: string;
}

function processData(data: Data): string {
  return data.value.toUpperCase();  // Type-checked!
}
```

---

### 3. Configuration Management

**Use environment variables for secrets:**

```typescript
// ❌ Bad - hardcoded secret
const apiKey = 'sk-mega-abc123';

// ✅ Good - from environment
const apiKey = process.env['MEGALLM_API_KEY'];
if (!apiKey) {
  throw new Error('MEGALLM_API_KEY not set');
}
```

---

### 4. User Feedback

**Always show what's happening:**

```typescript
// ❌ Bad - silent operation
await longRunningTask();

// ✅ Good - show progress
const spinner = ora('Processing...').start();
await longRunningTask();
spinner.succeed('✓ Complete!');
```

---

### 5. Input Validation

**Validate user input early:**

```typescript
// ❌ Bad - assume input is valid
function setTemperature(temp: number) {
  config.set('temperature', temp);
}

// ✅ Good - validate first
function setTemperature(temp: number) {
  if (temp < 0 || temp > 2) {
    throw new Error('Temperature must be between 0 and 2');
  }
  config.set('temperature', temp);
}
```

---

## Common Issues & Solutions

### Issue 1: Module Not Found

**Error:**
```
Cannot find module 'chalk'
```

**Solution:**
```bash
# Install missing dependency
npm install chalk

# Or install all dependencies
npm install
```

---

### Issue 2: TypeScript Compilation Errors

**Error:**
```
Property 'toUppercase' does not exist on type 'string'
```

**Solution:**
Check for typos (should be `toUpperCase`). TypeScript is helping you find bugs!

---

### Issue 3: Permission Denied (npm link)

**Error:**
```
EACCES: permission denied
```

**Solution:**
```bash
# Run with elevated permissions
sudo npm link

# Or on Windows (as Administrator)
npm link
```

---

### Issue 4: ESM vs CommonJS Issues

**Error:**
```
require() of ES Module not supported
```

**Solution:**
Make sure `"type": "module"` is in package.json and use `import` instead of `require`.

---

### Issue 5: Can't Find Global Command

**Error:**
```
'megacli' is not recognized
```

**Solution:**
```bash
# Link the package globally
npm link

# Or install globally
npm install -g .

# Check if it's linked
npm list -g megacli
```

---

## Summary

### What We Built (Phase 1)

✅ **Modern TypeScript CLI**
- Strict type checking
- ES Modules
- Professional project structure

✅ **CLI Framework**
- Commander.js for argument parsing
- Subcommands ready to implement
- Help text auto-generated

✅ **Configuration System**
- Secure key storage with Conf
- Environment variable support
- Cross-platform compatibility

✅ **UI Toolkit**
- Colors (Chalk)
- Spinners (Ora)
- Boxes (Boxen)
- Helper functions

✅ **Build Pipeline**
- TypeScript compilation
- Development mode
- Watch mode
- Global installation

### Next Phase Preview

**Phase 2: Authentication**
- Implement `megacli auth login`
- Interactive API key prompts
- Key validation against MegaLLM API
- Pretty success/error messages

---

## Learning Resources

### Documentation
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Commander.js Docs](https://github.com/tj/commander.js)
- [Node.js Docs](https://nodejs.org/docs/)

### Tutorials
- [TypeScript for JavaScript Programmers](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html)
- [Building CLI Tools with Node.js](https://nodejs.dev/learn/command-line-apps)

### Communities
- [MegaLLM Discord](https://discord.gg/devsindia)
- [TypeScript Community Discord](https://discord.gg/typescript)

---

**Questions?** Re-read relevant sections or ask for clarification on specific concepts!

**Ready to build Phase 2?** Let's implement authentication next! 🚀
