// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('@expo/metro-config');
const path = require('path');
const { fileURLToPath } = require('url');
const { dirname } = require('path');
const { createRequire } = require('module');

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const config = getDefaultConfig(__dirname);

const { transformer, resolver } = config;

config.transformer = {
  ...transformer,
  babelTransformerPath: require.resolve('react-native-svg-transformer'),
};
config.resolver = {
  ...resolver,
  assetExts: resolver.assetExts.filter((ext) => ext !== 'svg'),
  sourceExts: ['js', 'jsx', 'json', 'ts', 'tsx'],
};

config.maxWorkers = 2;
config.watchFolders = [__dirname];
config.watcher = {
  watchman: true,
  additionalExts: ['js', 'jsx', 'ts', 'tsx', 'json'],
};

module.exports = config; 