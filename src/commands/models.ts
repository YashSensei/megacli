import { Command } from 'commander';
import chalk from 'chalk';
import { modelRegistry, type ModelData } from '../lib/models.js';
import { colors, createBox, showError } from '../lib/ui.js';

// List all models
function listModels(options: { provider?: string; category?: string }) {
  const allModels = modelRegistry.getAllModels();
  
  // Filter by provider
  let models = options.provider
    ? modelRegistry.getModelsByProvider(options.provider)
    : allModels;

  // Filter by category
  if (options.category) {
    models = models.filter((m) => m.category === options.category);
  }

  if (models.length === 0) {
    showError('No models found', 'Try different filters');
    return;
  }

  // Display by category
  console.log(createBox(`${models.length} Available Models`, 'MegaLLM Models'));

  const categories = {
    premium: models.filter((m) => m.category === 'premium'),
    balanced: models.filter((m) => m.category === 'balanced'),
    fast: models.filter((m) => m.category === 'fast'),
    specialized: models.filter((m) => m.category === 'specialized'),
  };

  for (const [category, categoryModels] of Object.entries(categories)) {
    if (categoryModels.length === 0) continue;

    const icon = getCategoryIcon(category as ModelData['category']);
    console.log(`\n${icon} ${chalk.bold.cyan(category.toUpperCase())} ${colors.muted(`(${categoryModels.length})`)}`);
    console.log(colors.muted('─'.repeat(80)));

    // Table header
    console.log(
      `${colors.muted('Model ID').padEnd(35)} ${colors.muted('Provider').padEnd(15)} ${colors.muted('Aliases')}`
    );
    console.log(colors.muted('─'.repeat(80)));

    categoryModels.forEach((model) => {
      const id = colors.primary(model.id.padEnd(30));
      const provider = model.provider.padEnd(10);
      const aliases = model.aliases.length > 0 ? colors.muted(model.aliases.slice(0, 2).join(', ')) : colors.muted('-');
      
      console.log(`${id} ${provider} ${aliases}`);
    });
  }

  console.log(`\n${colors.muted('💡 Tip: Use')} megacli models info <model-id> ${colors.muted('for detailed information')}`);
  console.log(`${colors.muted('💡 Tip: Use')} megacli models search <query> ${colors.muted('to search models')}`);
}

// Show detailed model info
function modelInfo(modelId: string) {
  const model = modelRegistry.getModel(modelId);

  if (!model) {
    showError(`Model not found: ${modelId}`, 'Use "megacli models list" to see available models');
    process.exit(1);
  }

  console.log(createBox(`${model.name}`, 'Model Information'));
  
  console.log(colors.primary('Basic Information:'));
  console.log(`  ${colors.muted('ID:')} ${model.id}`);
  console.log(`  ${colors.muted('Name:')} ${model.name}`);
  console.log(`  ${colors.muted('Provider:')} ${model.provider}`);
  console.log(`  ${colors.muted('Category:')} ${getCategoryLabel(model.category)}`);
  
  if (model.aliases.length > 0) {
    console.log(`  ${colors.muted('Aliases:')} ${model.aliases.join(', ')}`);
  }

  if (model.description) {
    console.log(`\n${colors.primary('Description:')}`);
    console.log(`  ${model.description}`);
  }

  console.log(`\n${colors.primary('Usage:')}`);
  console.log(`  ${colors.muted('Chat:')} megacli chat -m ${model.id}`);
  console.log(`  ${colors.muted('Switch in chat:')} /switch ${model.id}`);
  
  if (model.aliases.length > 0) {
    console.log(`  ${colors.muted('Or use alias:')} megacli chat -m ${model.aliases[0]}`);
  }

  console.log();
}

// Search models
function searchModels(query: string) {
  const results = modelRegistry.searchModels(query);

  if (results.length === 0) {
    showError(`No models found matching: "${query}"`, 'Try a different search term');
    return;
  }

  console.log(createBox(`Search Results for "${query}"`, 'Models'));
  console.log(colors.muted(`Found ${results.length} model(s)\n`));

  results.forEach((model) => {
    const icon = getCategoryIcon(model.category);
    const aliases = model.aliases.length > 0 ? colors.muted(` (${model.aliases.join(', ')})`) : '';
    
    console.log(`${icon} ${colors.primary(model.id)} - ${model.name}`);
    console.log(`  ${colors.muted('Provider:')} ${model.provider} ${colors.muted('|')} ${colors.muted('Category:')} ${getCategoryLabel(model.category)}${aliases}`);
    if (model.description) {
      console.log(`  ${colors.muted(model.description)}`);
    }
    console.log();
  });

  console.log(colors.muted('Use "megacli models info <model-id>" for detailed information'));
}

// Helper: Get category icon
function getCategoryIcon(category?: ModelData['category']): string {
  switch (category) {
    case 'premium':
      return '💎';
    case 'balanced':
      return '⚖️';
    case 'fast':
      return '⚡';
    case 'specialized':
      return '🎯';
    default:
      return '📦';
  }
}

// Helper: Get category label
function getCategoryLabel(category?: ModelData['category']): string {
  switch (category) {
    case 'premium':
      return colors.success('Premium');
    case 'balanced':
      return colors.primary('Balanced');
    case 'fast':
      return colors.warning('Fast');
    case 'specialized':
      return chalk.magenta('Specialized');
    default:
      return 'Standard';
  }
}

// Create and export the models command
export function createModelsCommand(): Command {
  const modelsCmd = new Command('models');

  modelsCmd.description('Manage and explore AI models');

  // List subcommand
  modelsCmd
    .command('list')
    .description('List all available models')
    .option('-p, --provider <provider>', 'Filter by provider (openai, anthropic, google, meta, deepseek)')
    .option('-c, --category <category>', 'Filter by category (premium, balanced, fast, specialized)')
    .action(listModels);

  // Info subcommand
  modelsCmd
    .command('info <model>')
    .description('Show detailed information about a model')
    .action(modelInfo);

  // Search subcommand
  modelsCmd
    .command('search <query>')
    .description('Search for models by name, provider, or description')
    .action(searchModels);

  return modelsCmd;
}
