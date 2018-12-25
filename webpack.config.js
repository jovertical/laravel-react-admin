/**
 * Generic
 */
const path = require('path');
const fs = require('fs');
const notifier = require('node-notifier');

/**
 * Plugins.
 */
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CleanObsoleteChunks = require('webpack-clean-obsolete-chunks');
const EventHooksPlugin = require('event-hooks-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

/**
 * Globals
 */
const inProduction = process.env.NODE_ENV === 'production';
const PUBLIC_DIR = path.resolve(__dirname, './public');
const SRC_DIR = path.resolve(__dirname, './resources/frontend');
const DIST_DIR = path.resolve(__dirname, './public');

module.exports = {
    mode: process.env.NODE_ENV,

    entry: {
        backoffice: path.join(SRC_DIR, '__backoffice/index.js'),
        frontend: path.join(SRC_DIR, '__frontend/index.js'),
        sw: path.join(SRC_DIR, 'core/serviceWorker.js'),
    },

    module: {
        rules: [
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },

            {
                test: /\.s(a|c)ss$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
            },

            {
                test: /\.(js|jsx)$/,
                exclude: '/node_modules/',
                use: 'babel-loader',
            },

            {
                test: /\.(eot|ttf|woff|woff2)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '/fonts/[name].[hash].[ext]',
                        },
                    },
                ],
            },

            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            name: '/img/[name].[hash].[ext]',
                            fallback: 'file-loader',
                        },
                    },

                    {
                        loader: 'img-loader',
                        options: {
                            plugins: [
                                require('imagemin-mozjpeg')(),
                                require('imagemin-pngquant')(),
                                require('imagemin-gifsicle')(),
                                require('imagemin-svgo')(),
                            ],
                        },
                    },
                ],
            },
        ],
    },

    plugins: [
        new MiniCssExtractPlugin({
            filename: 'css/[name].[contenthash].css',
        }),

        new CleanWebpackPlugin(['css/*', 'js/*', 'img/*', 'fonts/*'], {
            root: DIST_DIR,
            exclude: [],
            verbose: false,
            dry: false,
        }),

        new CleanObsoleteChunks({
            verbose: true,
            deep: true,
        }),

        new EventHooksPlugin({
            done: stats => {
                const { time, errors, assets } = stats.toJson();

                notifier.notify({
                    title:
                        errors.length > 0 ? 'Build Failed' : 'Build Successful',
                    message: `Completed in ${time}ms`,
                    icon: path.resolve(__dirname, './public/favicon-512.png'),
                    sound: true,
                    wait: true,
                });

                let assetCollection = {};

                assets.forEach(({ name }) => {
                    let ext = name.split('.').reverse()[0];
                    let key = `${name.substring(0, name.indexOf('.'))}.${ext}`;

                    Object.assign(assetCollection, {
                        [key]: name,
                    });
                });

                fs.writeFileSync(
                    path.resolve(DIST_DIR, './assets.json'),
                    JSON.stringify(assetCollection, null, 2),
                );
            },
        }),
    ],

    output: {
        path: DIST_DIR,
        publicPath: PUBLIC_DIR,
        filename: 'js/[name].[contenthash].js',
    },

    optimization: {
        minimize: inProduction,
        splitChunks: {
            automaticNameDelimiter: '-',
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendor',
                    chunks: 'all',
                    enforce: true,
                },
            },
        },
    },

    node: {
        __filename: true,
        __dirname: true,
    },
};

if (!inProduction) {
    module.exports.plugins.push(
        new BrowserSyncPlugin({
            host: 'localhost',
            proxy: 'http://hsbo.test',
            open: true,
            notify: false,
        }),
    );
}
