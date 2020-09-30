const fs = require('fs-extra');

// docs.json is > 100mb
// let's load it and filter it down to just what we need asap and only once
const PLUGINS = JSON.parse(fs.readFileSync('dist/plugins.json'));

export function getPluginApiData(name: string) {
  const plugins = PLUGINS.filter(plugin => plugin.name.toLowerCase().startsWith(name))[0];
  return {
    methodChildren: plugins.children.filter(m => m.name != 'addListener' && m.name != 'removeListener'),
    listenerChildren: plugins.children.filter(m => m.name == 'addListener' || m.name == 'removeListener'),
  }
}

export function getPluginApiIndexData(name: string) {
  const plugin = PLUGINS.filter(plugin => plugin.name.toLowerCase().startsWith(name))[0];

  // global.console.log(plugin);
  // debugger;
  if (!plugin || !plugin.children) {
    return {
      methodChildren: [],
      listenerChildren: [],
    }
  }
  
  // filter data down to just what we need so less is sent over the wire
  const methodChildren = plugin.children
    .filter(m => 
      m.name != 'addListener' && 
      m.name != 'removeListener' && 
      !!m.signatures
    )
    .map(m => { return {
      name: m.name
    }});

  const listenerChildren = plugin.children
    .filter(m => 
      (m.name == 'addListener' || m.name == 'removeListener') &&
      !!m.signatures
    )
    .map(m => { return {
      name: m.name,
      signatures: m.signatures?.map(signature => { return {
        eventNameParam: {
          type: signature.parameters[0].type.type,
          value: signature.parameters[0].type.value
        }
      }})
    }});

  return {methodChildren, listenerChildren};
}

