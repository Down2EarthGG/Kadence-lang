const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const stdlibDir = path.join(__dirname, '..', 'stdlib');
const files = fs.readdirSync(stdlibDir);

const kadeFiles = files.filter(f =>
    f.endsWith('.kade') && (f === 'test.kade' || !f.includes('test'))
);

console.log(`Found ${kadeFiles.length} stdlib files to compile\n`);

let successCount = 0;
let failCount = 0;
const failures = [];

for (const file of kadeFiles) {
    const filePath = path.join('stdlib', file);
    try {
        console.log(`Compiling ${file}...`);
        execSync(`node bin/kadence.js ${filePath}`, {
            cwd: path.join(__dirname, '..'),
            stdio: 'pipe'
        });
        successCount++;
        console.log(`  ✓ Success\n`);
    } catch (error) {
        failCount++;
        failures.push({ file, error: error.stderr.toString() });
        console.log(`  ✗ Failed\n`);
    }
}

console.log('\n=== COMPILATION SUMMARY ===');
console.log(`Success: ${successCount}/${kadeFiles.length}`);
console.log(`Failed: ${failCount}/${kadeFiles.length}`);

if (failures.length > 0) {
    console.log('\n=== FAILURES ===');
    failures.forEach(({ file, error }) => {
        console.log(`\n${file}:`);
        console.log(error.substring(0, 500));
    });
}
