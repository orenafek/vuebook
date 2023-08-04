const webpack = require('webpack');
const {VueLoaderPlugin} = require('vue-loader')

module.exports = (env, argv) => ({
    name: 'vuebook',
    mode: argv.mode || 'development',
    entry: './src/main.ts',
    devtool: argv.mode !== 'production' ? "source-map" : undefined,
    stats: {
        hash: false, version: false, modules: false  // reduce verbosity
    },
    output: {
        filename: 'index.js',
        path: `${__dirname}/dist`
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                options: {
                    appendTsSuffixTo: [/\.vue$/]
                }

            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.scss$/i,  /* Vue.js has some */
                use: ['style-loader', 'css-loader', 'sass-loader'],
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'img/[hash][ext][query]'
                }
            },
            {
                test: /\.vue$/,
                use: 'vue-loader'
            }
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    externals: {
        fs: '{}'
    },
    plugins: [new VueLoaderPlugin(),
        new webpack.DefinePlugin({
            'process': {browser: true, env: {}},
            __VUE_OPTIONS_API__: true,
            __VUE_PROD_DEVTOOLS__: true
        }),
        new webpack.ProvidePlugin({'Buffer': 'buffer'})
    ]
});
