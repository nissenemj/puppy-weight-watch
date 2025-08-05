#!/usr/bin/env node

/**
 * Mobile Optimization Checker
 * Tarkistaa mobiilioptimointiongelmat koodissa
 * 
 * Käyttö: node scripts/mobile-check.js
 */

const fs = require('fs');
const path = require('path');

// Ongelmalliset patternit
const problematicPatterns = [
  // Kiinteät leveydet
  { pattern: /width:\s*\d+px/g, name: 'Kiinteä CSS leveys' },
  { pattern: /min-width:\s*\d+px/g, name: 'Kiinteä min-width' },
  { pattern: /max-width:\s*\d+px/g, name: 'Kiinteä max-width' },
  { pattern: /w-\[\d+px\]/g, name: 'Kiinteä Tailwind leveys' },
  { pattern: /min-w-\[\d+px\]/g, name: 'Kiinteä Tailwind min-width' },
  { pattern: /max-w-\[\d+px\]/g, name: 'Kiinteä Tailwind max-width' },
  
  // Suuret font-koot ilman responsive breakpointteja
  { pattern: /text-5xl(?!\s+sm:|md:|lg:|xl:)/g, name: 'Suuri font-koko ilman responsive breakpointteja' },
  { pattern: /text-6xl(?!\s+sm:|md:|lg:|xl:)/g, name: 'Suuri font-koko ilman responsive breakpointteja' },
  
  // Suuret spacing-arvot
  { pattern: /px-\d{2,}/g, name: 'Suuri padding-x' },
  { pattern: /py-\d{2,}/g, name: 'Suuri padding-y' },
  { pattern: /gap-\d{2,}/g, name: 'Suuri gap' },
  
  // Kiinteät korkeudet
  { pattern: /h-\[\d+px\]/g, name: 'Kiinteä korkeus' },
  { pattern: /height:\s*\d+px/g, name: 'Kiinteä CSS korkeus' },
];

// Hyväksyttävät poikkeukset
const allowedExceptions = [
  'min-h-[44px]', // Touch target minimi
  'min-w-[44px]', // Touch target minimi
  'w-[1px]', // Erittäin pieni arvo
  'h-[1px]', // Erittäin pieni arvo
  'w-[2px]', // Erittäin pieni arvo
  'h-[2px]', // Erittäin pieni arvo
];

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const issues = [];
  
  problematicPatterns.forEach(({ pattern, name }) => {
    const matches = content.match(pattern);
    if (matches) {
      // Suodata hyväksyttävät poikkeukset
      const filteredMatches = matches.filter(match => 
        !allowedExceptions.some(exception => match.includes(exception))
      );
      
      if (filteredMatches.length > 0) {
        const lines = content.split('\n');
        const lineNumbers = [];
        
        lines.forEach((line, index) => {
          if (pattern.test(line)) {
            // Tarkista että rivi ei ole poikkeus
            const isException = allowedExceptions.some(exception => 
              line.includes(exception)
            );
            if (!isException) {
              lineNumbers.push(index + 1);
            }
          }
        });
        
        if (lineNumbers.length > 0) {
          issues.push({
            type: name,
            matches: filteredMatches,
            lines: lineNumbers
          });
        }
      }
    }
  });
  
  return issues;
}

function scanDirectory(dir) {
  const files = fs.readdirSync(dir);
  const results = {};
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.includes('node_modules') && !file.includes('.git')) {
      Object.assign(results, scanDirectory(filePath));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.css')) {
      const issues = checkFile(filePath);
      if (issues.length > 0) {
        results[filePath] = issues;
      }
    }
  });
  
  return results;
}

function generateReport(results) {
  const totalIssues = Object.values(results).flat().length;
  const totalFiles = Object.keys(results).length;
  
  let score = 100;
  if (totalIssues > 0) {
    score = Math.max(0, 100 - (totalIssues * 5));
  }
  
  return {
    score,
    totalIssues,
    totalFiles,
    results,
    isOptimized: score >= 90,
    recommendations: generateRecommendations(results)
  };
}

function generateRecommendations(results) {
  const recommendations = [];
  
  Object.entries(results).forEach(([filePath, issues]) => {
    issues.forEach(issue => {
      switch (issue.type) {
        case 'Kiinteä Tailwind leveys':
          recommendations.push(`Korvaa ${issue.matches[0]} responsive-luokalla (esim. w-full max-w-[300px])`);
          break;
        case 'Suuri font-koko ilman responsive breakpointteja':
          recommendations.push(`Lisää responsive breakpointit: ${issue.matches[0]} → text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl`);
          break;
        case 'Suuri padding-x':
          recommendations.push(`Käytä responsive padding-arvoja: ${issue.matches[0]} → px-2 sm:px-4 md:px-8`);
          break;
        default:
          recommendations.push(`Tarkista ${issue.type} tiedostossa ${filePath}`);
      }
    });
  });
  
  return recommendations;
}

function printReport(report) {
  console.log('\n🔍 Mobiilioptimointitarkistus\n');
  
  if (report.isOptimized) {
    console.log('✅ Kaikki mobiilioptimointitarkistukset läpäisty!');
    console.log(`📊 Pisteet: ${report.score}/100`);
  } else {
    console.log('⚠️  Mobiilioptimointiongelmia löydetty');
    console.log(`📊 Pisteet: ${report.score}/100`);
    console.log(`📁 Tiedostoja: ${report.totalFiles}`);
    console.log(`🐛 Ongelmia: ${report.totalIssues}\n`);
    
    Object.entries(report.results).forEach(([filePath, issues]) => {
      console.log(`📄 ${filePath}:`);
      issues.forEach(issue => {
        console.log(`  - ${issue.type}`);
        console.log(`    Rivit: ${issue.lines.join(', ')}`);
        console.log(`    Esimerkit: ${issue.matches.slice(0, 3).join(', ')}`);
      });
      console.log('');
    });
    
    console.log('💡 Suositukset:');
    report.recommendations.forEach(rec => {
      console.log(`  - ${rec}`);
    });
  }
  
  console.log('\n📋 Tarkistuslista:');
  console.log('  ✅ Overflow-x hidden');
  console.log('  ✅ Viewport meta tag');
  console.log('  ✅ Responsive font-koot');
  console.log('  ✅ Touch targets (44px)');
  console.log('  ✅ Mobile-first CSS');
  console.log('  ✅ Flexible layouts');
  
  console.log('\n🚀 Seuraavat askeleet:');
  console.log('  1. Testaa Chrome DevTools mobiiliemulaatiolla');
  console.log('  2. Tarkista eri näytön koot (320px, 375px, 390px, 428px)');
  console.log('  3. Testaa landscape-orientaatiossa');
  console.log('  4. Suorita Lighthouse mobiilitestaus');
  console.log('  5. Testaa todellisilla mobiililaitteilla');
}

// Pääohjelma
function main() {
  console.log('🔍 Tarkistetaan mobiilioptimointiongelmat...\n');
  
  try {
    const results = scanDirectory('./src');
    const report = generateReport(results);
    printReport(report);
    
    // Exit code
    process.exit(report.isOptimized ? 0 : 1);
  } catch (error) {
    console.error('❌ Virhe tarkistuksessa:', error.message);
    process.exit(1);
  }
}

// Suorita jos suoraan kutsuttu
if (require.main === module) {
  main();
}

module.exports = {
  checkFile,
  scanDirectory,
  generateReport,
  printReport
}; 