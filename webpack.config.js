const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: {
        index: './src/index.ts',
        settings: './src/settings.ts'
    },
    devtool: 'inline-source-map',
    mode: 'development',
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'src/views/index.ejs',
            chunks: ['index'],
            title: 'Колония муравьев',
            settings_title: 'Параметры',
            inject: 'body'
        }),
        new HtmlWebpackPlugin({
            filename: 'settings.html',
            template: 'src/views/settings.ejs',
            chunks: ['settings'],
            index_title: 'Колония муравьев',
            title: 'Параметры',
            inject: 'body'
        }),
        new CopyPlugin({
            patterns: [
                {from: "./src/images", to: "./images"},
            ]
        })
    ],
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    // Creates `style` nodes from JS strings
                    "style-loader",
                    // Translates CSS into CommonJS
                    "css-loader",
                    // Compiles Sass to CSS
                    "sass-loader",
                ]
            },
            {
                test: /\.(svg|woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource'
            }
        ],
    },
};