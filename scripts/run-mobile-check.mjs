import { scanDirectory, generateReport, printReport } from './mobile-check.js';

try {
  const results = scanDirectory('./src');
  const report = generateReport(results);
  printReport(report);
  process.exit(report.isOptimized ? 0 : 1);
} catch (err) {
  console.error('Error running mobile check:', err?.message || err);
  process.exit(1);
}

