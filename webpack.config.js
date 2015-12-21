var path = require('path');
module.exports = {
  entry: {
    'planet-hunting': './js/planet-hunting/main.js',
    'light-intensity': './js/light-intensity/main.js',
    'wave-generator': './js/wave-generator/main.js'
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: "[name].js"
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|vendor)/,
        loader: 'babel',
        query: {
          presets: ['es2015'],
          plugins: ['transform-runtime']
        }
      }
    ]
  }
};
