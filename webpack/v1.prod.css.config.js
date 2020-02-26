
// --- IMPORTS

// eslint-disable-next-line
const webpack = require('webpack');
// eslint-disable-next-line
const merge = require('webpack-merge');
// eslint-disable-next-line
const HtmlWebpack = require('html-webpack-plugin');
// eslint-disable-next-line
const ETP = require('extract-text-webpack-plugin');
const baseConfig = require('./base.config.js');
const path = require('path');

// --- CONFIG

module.exports = merge(baseConfig, {
	entry: {
		index: './hub.1.0.1/sass/mos.sass',
	},
	output: {
		path: path.join(__dirname, '../hub.1.0.1/css'),
		filename: 'mos.css.js',
	},
	module: {
		loaders: [
			{
				include: path.join(__dirname, '../hub.1.0.1/sass'),
				test: /\.sass$/,
				loader: ETP.extract({ fallback: 'style-loader', use: 'css-loader!postcss-loader!sass-loader' }),
			},
		],
	},
	plugins: [
		new ETP('mos.css'),
	],
});
