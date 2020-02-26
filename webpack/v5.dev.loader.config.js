
// eslint-disable-next-line
const webpack = require('webpack');
// eslint-disable-next-line
const merge = require('webpack-merge');
// eslint-disable-next-line
const ExtractTextPlugin = require('extract-text-webpack-plugin');
// eslint-disable-next-line
const HtmlWebpack = require('html-webpack-plugin');
const baseConfig = require('./base.config.js');
const path = require('path');

const CSSExtract = new ExtractTextPlugin('mos.1.0.5.Styles.css');

module.exports = merge(baseConfig, {
	entry: {
		// App: './hub.1.0.5/src/components/HcContainer/HcContainer.js',
		Loader: './hub.1.0.5/src/services/Loader.js',		
	},
	output: {
		path: path.join(__dirname, '../hub.1.0.5/dist'),
		filename: 'mos.1.0.5.[name].js',
	},
	module: {
		loaders: [
			{
				include: path.join(__dirname, '../hub.1.0.5/src'),
				test: /\.js$/,
				loader: 'babel-loader',
			}, {
				include: path.join(__dirname, '../hub.1.0.5/src'),
				test: /\.sass$/,
				use: CSSExtract.extract({
					use: [
						{
							loader: 'css-loader',
							options: {
								sourceMap: true,
							},
						}, {
							loader: 'postcss-loader',
							options: {
								sourceMap: true,
							},
						}, {
							loader: 'sass-loader',
							options: {
								sourceMap: true,
							},
						},
					],
				}),
			}, {
				include: path.join(__dirname, '../hub.1.0.5/src'),
				test: /\.(jpg|png)$/,
				use: {
					loader: 'file-loader',
					options: {
						name: '[name].[ext]',
						outputPath: 'img/',
						publicPath: 'img/',
					},
				},
			},
			{
				test: /\.(ttf|eot|woff|woff2)$/,
				use: {
					loader: 'file-loader',
					options: {
						name: 'fonts/[name].[ext]',
					},
				},
			},
		],
	},
	plugins: [
		CSSExtract,
		new HtmlWebpack({
			template: path.join(__dirname, '../hub.1.0.5/src', 'index.html'),
			hash: true,
		}),
		new webpack.HotModuleReplacementPlugin(),
	],
	devtool: 'inline-source-map',
	devServer: {
		contentBase: path.join(__dirname, '../hub.1.0.5/dist'),
		hot: true,
		host: '192.168.1.183', // set to VirtualBox IP so it can be accessed outside VBox
		port: 3001,
	},
});
