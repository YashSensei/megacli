import chalk from 'chalk';
import ora, { Ora } from 'ora';
import boxen from 'boxen';
import gradient from 'gradient-string';

// Color theme
export const colors = {
  primary: chalk.cyan,
  success: chalk.green,
  error: chalk.red,
  warning: chalk.yellow,
  info: chalk.blue,
  muted: chalk.gray,
  highlight: chalk.magenta,
};

// Spinner utilities
export function createSpinner(text: string): Ora {
  return ora({
    text,
    color: 'cyan',
  });
}

// Box utilities
export function createBox(content: string, title?: string): string {
  return boxen(content, {
    padding: 1,
    margin: 1,
    borderStyle: 'round',
    borderColor: 'cyan',
    title,
    titleAlignment: 'center',
  });
}

// Header with gradient
export function createHeader(text: string): string {
  return gradient.pastel(text);
}

// Success message
export function showSuccess(message: string): void {
  console.log(colors.success('✓'), message);
}

// Error message
export function showError(message: string, details?: string): void {
  console.log(colors.error('✗'), message);
  if (details) {
    console.log(colors.muted(details));
  }
}

// Warning message
export function showWarning(message: string): void {
  console.log(colors.warning('⚠'), message);
}

// Info message
export function showInfo(message: string): void {
  console.log(colors.info('ℹ'), message);
}

// Format API error
export function formatAPIError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

// Progress indicator
export function showProgress(current: number, total: number, label: string): void {
  const percentage = Math.round((current / total) * 100);
  const filled = Math.round(percentage / 2);
  const bar = '█'.repeat(filled) + '░'.repeat(50 - filled);
  
  process.stdout.write(`\r${label}: [${bar}] ${percentage}%`);
  
  if (current === total) {
    process.stdout.write('\n');
  }
}

// Clear console
export function clearConsole(): void {
  process.stdout.write('\x1Bc');
}

// Divider
export function showDivider(): void {
  console.log(colors.muted('─'.repeat(50)));
}
