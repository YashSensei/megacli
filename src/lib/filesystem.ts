import fs from 'fs/promises';
import path from 'path';
import { glob } from 'glob';

export interface FileInfo {
  path: string;
  name: string;
  extension: string;
  size: number;
  isDirectory: boolean;
}

export interface FileSearchResult {
  path: string;
  matches: Array<{
    line: number;
    content: string;
    column: number;
  }>;
}

export class FileSystemManager {
  private workingDirectory: string;

  constructor(workingDir: string = process.cwd()) {
    this.workingDirectory = path.resolve(workingDir);
  }

  /**
   * Validate that a path is within the working directory (security check)
   */
  private validatePath(filePath: string): string {
    const resolvedPath = path.resolve(this.workingDirectory, filePath);
    if (!resolvedPath.startsWith(this.workingDirectory)) {
      throw new Error('Access denied: Path is outside working directory');
    }
    return resolvedPath;
  }

  /**
   * Read file contents
   */
  async readFile(filePath: string): Promise<string> {
    const validPath = this.validatePath(filePath);
    try {
      return await fs.readFile(validPath, 'utf-8');
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        throw new Error(`File not found: ${filePath}`);
      }
      throw error;
    }
  }

  /**
   * Write content to file
   */
  async writeFile(filePath: string, content: string): Promise<void> {
    const validPath = this.validatePath(filePath);
    const dir = path.dirname(validPath);
    
    // Create directory if it doesn't exist
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(validPath, content, 'utf-8');
  }

  /**
   * Check if file or directory exists
   */
  async exists(filePath: string): Promise<boolean> {
    try {
      const validPath = this.validatePath(filePath);
      await fs.access(validPath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get file information
   */
  async getFileInfo(filePath: string): Promise<FileInfo> {
    const validPath = this.validatePath(filePath);
    const stats = await fs.stat(validPath);
    
    return {
      path: filePath,
      name: path.basename(filePath),
      extension: path.extname(filePath),
      size: stats.size,
      isDirectory: stats.isDirectory(),
    };
  }

  /**
   * List files in directory
   */
  async listDirectory(dirPath: string = '.'): Promise<FileInfo[]> {
    const validPath = this.validatePath(dirPath);
    const entries = await fs.readdir(validPath, { withFileTypes: true });
    
    const fileInfos: FileInfo[] = [];
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      try {
        const info = await this.getFileInfo(fullPath);
        fileInfos.push(info);
      } catch {
        // Skip files we can't access
        continue;
      }
    }
    
    return fileInfos;
  }

  /**
   * Search for files matching a pattern
   */
  async findFiles(pattern: string, options?: { ignore?: string[] }): Promise<string[]> {
    const ignorePatterns = options?.ignore || [
      '**/node_modules/**',
      '**/dist/**',
      '**/.git/**',
      '**/build/**',
    ];

    const files = await glob(pattern, {
      cwd: this.workingDirectory,
      ignore: ignorePatterns,
      nodir: true,
    });

    return files;
  }

  /**
   * Search for text within files
   */
  async searchInFiles(
    pattern: string,
    searchText: string,
    caseSensitive: boolean = false
  ): Promise<FileSearchResult[]> {
    const files = await this.findFiles(pattern);
    const results: FileSearchResult[] = [];

    for (const file of files) {
      try {
        const content = await this.readFile(file);
        const lines = content.split('\n');
        const matches: FileSearchResult['matches'] = [];

        const searchRegex = new RegExp(
          searchText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
          caseSensitive ? 'g' : 'gi'
        );

        lines.forEach((line, index) => {
          let match;
          while ((match = searchRegex.exec(line)) !== null) {
            matches.push({
              line: index + 1,
              content: line.trim(),
              column: match.index + 1,
            });
          }
        });

        if (matches.length > 0) {
          results.push({ path: file, matches });
        }
      } catch {
        // Skip files we can't read
        continue;
      }
    }

    return results;
  }

  /**
   * Create a backup of a file
   */
  async createBackup(filePath: string): Promise<string> {
    const validPath = this.validatePath(filePath);
    const backupPath = `${validPath}.backup`;
    
    try {
      const content = await fs.readFile(validPath);
      await fs.writeFile(backupPath, content);
      return backupPath;
    } catch (error) {
      throw new Error(`Failed to create backup: ${error}`);
    }
  }

  /**
   * Delete a file
   */
  async deleteFile(filePath: string): Promise<void> {
    const validPath = this.validatePath(filePath);
    await fs.unlink(validPath);
  }

  /**
   * Get the working directory
   */
  getWorkingDirectory(): string {
    return this.workingDirectory;
  }

  /**
   * Set a new working directory
   */
  setWorkingDirectory(dir: string): void {
    this.workingDirectory = path.resolve(dir);
  }
}
