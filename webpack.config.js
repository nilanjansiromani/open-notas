const path = require('path');

module.exports = [
  // Background Service Worker
  {
    name: 'background',
    mode: 'production',
    entry: './src/background/index.ts',
    output: {
      filename: 'background.js',
      path: path.resolve(__dirname, 'dist'),
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: 'babel-loader',
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.js'],
    },
  },
  // Content Script
  {
    name: 'content',
    mode: 'production',
    entry: './src/content/index.ts',
    output: {
      filename: 'content.js',
      path: path.resolve(__dirname, 'dist'),
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: 'babel-loader',
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.js'],
    },
  },
  // Overlay UI
  {
    name: 'overlay',
    mode: 'production',
    entry: './src/components/index.tsx',
    output: {
      filename: 'overlay.js',
      path: path.resolve(__dirname, 'dist'),
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          use: 'babel-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
  },
];
