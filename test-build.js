import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧪 Testing build process...\n');

try {
  // Test 1: Check if client directory exists
  console.log('1. Checking client directory...');
  if (!fs.existsSync(path.join(__dirname, 'client'))) {
    throw new Error('Client directory not found');
  }
  console.log('✅ Client directory exists');

  // Test 2: Check if package.json exists
  console.log('2. Checking client package.json...');
  const packagePath = path.join(__dirname, 'client', 'package.json');
  if (!fs.existsSync(packagePath)) {
    throw new Error('Client package.json not found');
  }
  console.log('✅ Client package.json exists');

  // Test 3: Check if Tailwind config exists
  console.log('3. Checking Tailwind config...');
  const tailwindPath = path.join(__dirname, 'client', 'tailwind.config.js');
  if (!fs.existsSync(tailwindPath)) {
    throw new Error('Tailwind config not found');
  }
  console.log('✅ Tailwind config exists');

  // Test 4: Check if index.css exists
  console.log('4. Checking index.css...');
  const cssPath = path.join(__dirname, 'client', 'src', 'index.css');
  if (!fs.existsSync(cssPath)) {
    throw new Error('index.css not found');
  }
  console.log('✅ index.css exists');

  // Test 5: Check if main.jsx imports CSS
  console.log('5. Checking main.jsx...');
  const mainPath = path.join(__dirname, 'client', 'src', 'main.jsx');
  const mainContent = fs.readFileSync(mainPath, 'utf8');
  if (!mainContent.includes('import "./index.css"')) {
    throw new Error('main.jsx does not import index.css');
  }
  console.log('✅ main.jsx imports CSS');

  console.log('\n🎉 All checks passed! Build should work correctly.');
  console.log('\nTo test locally, run:');
  console.log('cd client && npm run build');
  console.log('Then check if client/dist/assets/index-[hash].css exists');

} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
