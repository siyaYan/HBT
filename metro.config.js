const { getDefaultConfig } = require("@expo/metro-config");
const { withSentryConfig } = require("@sentry/react-native/metro");

const config = getDefaultConfig(__dirname);

// Optional: extend for cjs support if needed
config.resolver.assetExts.push("cjs");

// Wrap the Expo config with Sentry config — this is safe
// module.exports = withSentryConfig(config);
module.exports = withSentryConfig(config, {
  // Optional: disable rewriting source maps if you don't need it
  // rewriteSourceMapPaths: false,
});
