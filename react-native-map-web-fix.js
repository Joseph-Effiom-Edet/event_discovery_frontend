const chalk = require('chalk');
const { readFile, writeFile, copyFile } = require('fs').promises;

// Check if chalk is installed, provide basic logging if not
const log = chalk ? (...args) => console.log(chalk.yellow('[react-native-maps]'), ...args) : console.log.bind(console, '[react-native-maps]');
const logError = chalk ? (...args) => console.error(chalk.red('[react-native-maps] Error:'), ...args) : console.error.bind(console, '[react-native-maps] Error:');

async function reactNativeMapsWebFix() {
  try {
    log('📦 Creating web compatibility stub for react-native-maps...');
    const modulePath = 'node_modules/react-native-maps';
    const webStubPath = `${modulePath}/lib/index.web.js`;
    const webStubContent = '// Stub for web compatibility\nmodule.exports = {};';

    // Create the empty web stub file
    await writeFile(webStubPath, webStubContent, 'utf-8');
    log(`  📝 Created empty module at ${webStubPath}`);

    // Copy typings if they exist
    try {
      await copyFile(`${modulePath}/lib/index.d.ts`, `${modulePath}/lib/index.web.d.ts`);
      log(`  📝 Copied types to index.web.d.ts`);
    } catch (copyError) {
      if (copyError.code !== 'ENOENT') {
        logError('Could not copy type definition file:', copyError);
      } // Ignore if source file doesn't exist
    }

    // Modify package.json
    const pkgPath = `${modulePath}/package.json`;
    const pkg = JSON.parse(await readFile(pkgPath, 'utf-8'));

    // Ensure correct entries exist
    if (pkg['react-native'] !== 'lib/index.js') {
        log(`  🔧 Setting 'react-native' entry to 'lib/index.js' in ${pkgPath}`);
        pkg['react-native'] = 'lib/index.js';
    }
    if (pkg['main'] !== 'lib/index.web.js') {
        log(`  🔧 Setting 'main' entry to 'lib/index.web.js' in ${pkgPath}`);
        pkg['main'] = 'lib/index.web.js';
    }

    await writeFile(pkgPath, JSON.stringify(pkg, null, 2), 'utf-8');
    log(`  🔧 Updated ${pkgPath} for web compatibility.`);

    log('✅ Web compatibility stub applied successfully.');
  } catch (error) {
    logError('Failed to apply react-native-maps web fix:', error);
    // Optionally exit with error code? process.exit(1);
  }
}

// Run the fix
reactNativeMapsWebFix(); 