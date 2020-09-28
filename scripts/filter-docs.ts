const fs = require('fs-extra');

// docs.json is > 100mb
// let's load it and filter it down to just what we need asap and only once
const PLUGINS = JSON.parse(
  fs.readFileSync('dist/docs.json')
)['children'][0].children.filter(plugin => plugin.name.endsWith('Plugin'));

fs.writeFileSync('dist/plugins.json', JSON.stringify(PLUGINS));