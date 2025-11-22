import { FileSystemManager } from './filesystem.js';

export interface ProjectContext {
  type: 'typescript' | 'javascript' | 'unknown';
  hasPackageJson: boolean;
  hasTsConfig: boolean;
  packageName?: string;
  dependencies: string[];
  devDependencies: string[];
  scripts: Record<string, string>;
  sourceDirectories: string[];
  entryPoints: string[];
}

export class ProjectAnalyzer {
  private fs: FileSystemManager;

  constructor(workingDir: string = process.cwd()) {
    this.fs = new FileSystemManager(workingDir);
  }

  /**
   * Analyze the current project structure
   */
  async analyzeProject(): Promise<ProjectContext> {
    const context: ProjectContext = {
      type: 'unknown',
      hasPackageJson: false,
      hasTsConfig: false,
      dependencies: [],
      devDependencies: [],
      scripts: {},
      sourceDirectories: [],
      entryPoints: [],
    };

    // Check for package.json
    if (await this.fs.exists('package.json')) {
      context.hasPackageJson = true;
      const packageContent = await this.fs.readFile('package.json');
      const packageJson = JSON.parse(packageContent);
      
      context.packageName = packageJson.name;
      context.dependencies = Object.keys(packageJson.dependencies || {});
      context.devDependencies = Object.keys(packageJson.devDependencies || {});
      context.scripts = packageJson.scripts || {};

      // Detect entry point
      if (packageJson.main) {
        context.entryPoints.push(packageJson.main);
      }
    }

    // Check for tsconfig.json
    if (await this.fs.exists('tsconfig.json')) {
      context.hasTsConfig = true;
      context.type = 'typescript';
    } else if (context.hasPackageJson) {
      context.type = 'javascript';
    }

    // Detect common source directories
    const commonDirs = ['src', 'lib', 'app', 'source'];
    for (const dir of commonDirs) {
      if (await this.fs.exists(dir)) {
        context.sourceDirectories.push(dir);
      }
    }

    return context;
  }

  /**
   * Get a summary of the project structure
   */
  async getProjectSummary(): Promise<string> {
    const context = await this.analyzeProject();
    const lines: string[] = [];

    lines.push(`Project Type: ${context.type}`);
    
    if (context.packageName) {
      lines.push(`Package: ${context.packageName}`);
    }

    if (context.sourceDirectories.length > 0) {
      lines.push(`Source Directories: ${context.sourceDirectories.join(', ')}`);
    }

    if (context.dependencies.length > 0) {
      lines.push(`Dependencies (${context.dependencies.length}): ${context.dependencies.slice(0, 5).join(', ')}${context.dependencies.length > 5 ? '...' : ''}`);
    }

    if (Object.keys(context.scripts).length > 0) {
      lines.push(`Available Scripts: ${Object.keys(context.scripts).join(', ')}`);
    }

    return lines.join('\n');
  }

  /**
   * Find all source files in the project
   */
  async findSourceFiles(): Promise<string[]> {
    const context = await this.analyzeProject();
    const patterns: string[] = [];

    if (context.type === 'typescript') {
      patterns.push('**/*.ts', '**/*.tsx');
    } else if (context.type === 'javascript') {
      patterns.push('**/*.js', '**/*.jsx');
    } else {
      patterns.push('**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx');
    }

    const allFiles: string[] = [];
    for (const pattern of patterns) {
      const files = await this.fs.findFiles(pattern);
      allFiles.push(...files);
    }

    return [...new Set(allFiles)]; // Remove duplicates
  }

  /**
   * Build context for AI about the project
   */
  async buildAIContext(): Promise<string> {
    const context = await this.analyzeProject();
    const summary = await this.getProjectSummary();
    
    const parts: string[] = [
      '# Project Context',
      '',
      summary,
      '',
    ];

    // Add key files if they exist
    if (context.hasPackageJson) {
      parts.push('## package.json');
      const packageContent = await this.fs.readFile('package.json');
      parts.push('```json');
      parts.push(packageContent);
      parts.push('```');
      parts.push('');
    }

    if (context.hasTsConfig) {
      parts.push('## tsconfig.json');
      const tsconfigContent = await this.fs.readFile('tsconfig.json');
      parts.push('```json');
      parts.push(tsconfigContent);
      parts.push('```');
      parts.push('');
    }

    return parts.join('\n');
  }

  /**
   * Get file tree structure
   */
  async getFileTree(dirPath: string = '.', depth: number = 2, currentDepth: number = 0): Promise<string> {
    if (currentDepth >= depth) return '';

    const files = await this.fs.listDirectory(dirPath);
    const lines: string[] = [];
    const indent = '  '.repeat(currentDepth);

    // Filter out common ignore patterns
    const ignorePatterns = ['node_modules', 'dist', '.git', 'build', '.next', 'coverage'];
    const filteredFiles = files.filter(f => !ignorePatterns.includes(f.name));

    for (const file of filteredFiles) {
      const icon = file.isDirectory ? '📁' : '📄';
      lines.push(`${indent}${icon} ${file.name}`);

      if (file.isDirectory && currentDepth < depth - 1) {
        const subTree = await this.getFileTree(file.path, depth, currentDepth + 1);
        if (subTree) lines.push(subTree);
      }
    }

    return lines.join('\n');
  }
}
