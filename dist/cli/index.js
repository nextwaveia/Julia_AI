#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const chalk_1 = __importDefault(require("chalk"));
const index_1 = require("../core/index");
commander_1.program
    .name('julia')
    .description('Julia 3.0 - AI Orchestrator with RTK compression')
    .version('3.0.0');
commander_1.program
    .command('orchestrate <intent>')
    .description('Orchestrate a task using Julia 3.0')
    .action(async (intent) => {
    try {
        console.log(chalk_1.default.cyan('\n🎼 Julia 3.0 Orchestrator\n'));
        const result = await (0, index_1.orchestrate)(intent);
        const generator = new index_1.ReportGenerator();
        console.log(generator.render(result.report));
        console.log('\n');
    }
    catch (error) {
        console.error(chalk_1.default.red(`Error: ${error}`));
        process.exit(1);
    }
});
commander_1.program
    .command('status')
    .description('Check Julia 3.0 status')
    .action(() => {
    console.log(chalk_1.default.green('✅ Julia 3.0 is running'));
    console.log('  Version: 3.0.0');
    console.log('  Status: Ready');
});
commander_1.program
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
    console.log(chalk_1.default.blue('\n👥 Available Agents:\n'));
    agents.forEach((agent) => console.log(`  • ${agent}`));
    console.log('\n');
});
commander_1.program.parse(process.argv);
//# sourceMappingURL=index.js.map