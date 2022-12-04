const fs = require('fs');
const chalk = require('chalk');
const rimraf = require('rimraf');

const dusts = [
   'tsconfig.json',
   '.github',
   'tests',
   'src',
   'jest*',
   'babel*',
   '.env*'
];

console.log(chalk.yellow('Cleaning up dusts...'));

dusts.forEach(dust => {
   rimraf.sync(dust);
   console.log(chalk.green(`Removed ${dust}`));
});

console.log(chalk.green('Moving files...'));

fs.renameSync('dist', 'src');

console.log(chalk.yellow('Updating package.json...'));

const packageJson = require('../package.json');

packageJson.exports = {
   '.': {
      'import': "./src/index.js",
      'require': "./src/index.js",
      'types': "./src/index.d.ts"
   },
   './collection': {
      'import': "./src/collection.js",
      'require': "./src/collection.js",
      'types': "./src/collection.d.ts"
   },
   './package.json': "./package.json"
};

delete packageJson.devDependencies;

fs.writeFileSync(
    'package.json',
    JSON.stringify(packageJson, null, 2)
);

console.log(chalk.green('Done!'));
