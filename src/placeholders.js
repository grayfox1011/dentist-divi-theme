/**
 * Demo logo for the header (src/assets/logo.png, 3x resolution). Swap the file to change it.
 * It is small enough to travel inside the layout, so the header needs no upload.
 */
function logo() {
  const file = require('path').join(__dirname, 'assets', 'logo.png');
  return `data:image/png;base64,${require('fs').readFileSync(file).toString('base64')}`;
}

module.exports = { logo };
