#!/usr/bin/env node

import { program } from 'commander';
import chalk from 'chalk';
import { orchestrate, ReportGenerator } from '../core/index';

program
  .name('julia')
  .description('Julia 3.0 - AI Orchestrator with RTK compression')
  .version('3.0.0');

program
  .command('orchestrate <intent>')
  .description('Orchestrate a task using Julia 3.0')
  .action(async (intent: string) => {
    try {
      console.log(chalk.cyan('\n🎼 Julia 3.0 Orchestrator\n'));
      const result = await orchestrate(intent);

      const generator = new ReportGenerator();
      console.log(generator.render(result.report));
      console.log('\n');
    } catch (error) {
      console.error(chalk.red(`Error: ${error}`));
      process.exit(1);
    }
  });

program
  .command('status')
  .description('Check Julia 3.0 status')
  .action(() => {
    console.log(chalk.green('✅ Julia 3.0 is running'));
    console.log('  Version: 3.0.0');
    console.log('  Status: Ready');
  });

program
  .command('agents')
  .description('List available agents')
  .action(() => {
    const agents = [
      'tech_lead',
      'backend_senior',
      'frontend_senior',
      'qa_engineer',
      'security_specialist',
      'devops_engineer',
    ];
    console.log(chalk.blue('\n👥 Available Agents:\n'));
    agents.forEach((agent) => console.log(`  • ${agent}`));
    console.log('\n');
  });

program.parse(process.argv);
