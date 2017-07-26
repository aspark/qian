const fs = require('fs');
const path = require('path')

let configFileName = path.join(__dirname, 'qian.config');

if (process.argv.indexOf('--dev')>0) {
    configFileName += '.dev';
}
configFileName += '.json'
console.log('use config file: ', configFileName);

let defaultConfig = {
    mail: {}
}

if (fs.existsSync(configFileName)) {
    let content = fs.readFileSync(configFileName, 'utf-8');
    let cfg = JSON.parse(content);

    Object.assign(defaultConfig, cfg);

    // console.log('load config', defaultConfig);
}

module.exports = defaultConfig;