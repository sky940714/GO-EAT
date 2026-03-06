const { getDefaultConfig } = require('expo/metro-config');
const config = getDefaultConfig(__dirname);

// 支援 .mjs 結尾的檔案
config.resolver.sourceExts.push('mjs', 'cjs');
// 開啟 package exports 解析 (專門解 tslib.default 問題的特效藥)
config.resolver.unstable_enablePackageExports = true;

module.exports = config;