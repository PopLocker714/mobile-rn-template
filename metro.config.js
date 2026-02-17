// const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

// /**
//  * Metro configuration
//  * https://reactnative.dev/docs/metro
//  *
//  * @type {import('@react-native/metro-config').MetroConfig}
//  */
// const config = { resolver: { sourceExts: [] } };

// const resultConfig = mergeConfig(getDefaultConfig(__dirname), config);

// config.resolver.sourceExts.push('sql');// for op-sqlite

// module.exports = resultConfig

const { getDefaultConfig } = require("@react-native/metro-config");
/** @type {import('@react-native/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);
config.resolver.sourceExts.push("sql");
module.exports = config;
