/* babel-preset-expo adds the Worklets plugin that Reanimated needs on its own. */
module.exports = function babelConfig(api) {
  api.cache(true);

  return { presets: ['babel-preset-expo'] };
};
