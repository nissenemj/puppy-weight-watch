import { validateButtonComponent, validateMobileCss, validateButtonImplementations } from './validate-mobile-fixes.js';

function summarize(pass, name) {
  console.log(` - ${name}: ${pass ? 'PASS' : 'FAIL'}`);
}

try {
  console.log('Running comprehensive mobile optimization validation...');
  const buttonPass = validateButtonComponent();
  const cssPass = validateMobileCss();
  const implPass = validateButtonImplementations();

  console.log('\nSummary:');
  summarize(buttonPass, 'Button Component');
  summarize(cssPass, 'Mobile CSS');
  summarize(implPass, 'Button Implementations');

  const all = buttonPass && cssPass && implPass;
  process.exit(all ? 0 : 1);
} catch (err) {
  console.error('Validation error:', err?.message || err);
  process.exit(1);
}

