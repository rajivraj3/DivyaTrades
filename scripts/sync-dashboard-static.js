const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const dashboardSrc = path.join(root, 'dashboard', 'build');
const frontendBuild = path.join(root, 'frontend', 'build');
const dashboardOut = path.join(frontendBuild, 'dashboard');

if (!fs.existsSync(dashboardSrc)) {
  console.log('Dashboard build folder not found. Run dashboard build first.');
  process.exit(0);
}

fs.rmSync(dashboardOut, { recursive: true, force: true });
fs.mkdirSync(dashboardOut, { recursive: true });

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const item of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, item.name);
    const destPath = path.join(dest, item.name);
    if (item.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

copyDir(dashboardSrc, dashboardOut);
console.log('Dashboard static assets synced to frontend/build/dashboard');
