const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals'),
      nodeBuiltins = {fs: 'commonjs2 fs'};
const { VueLoaderPlugin } = require('vue-loader');

const opts = (argv) => ({
        mode: argv.mode || 'development',
        devtool: argv.mode !== 'production' ? "source-map" : undefined,
        stats: {
            hash: false, version: false, modules: false  // reduce verbosity
        },
    }),
    rules = [
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
            test: /\.(woff|woff2|eot|ttf|otf)$/i,
            type: 'asset/resource',
        },        
        {
            test: /\.vue$/,
            use: 'vue-loader'
        }
    ],
    plugins = [
        new VueLoaderPlugin(),
        new webpack.DefinePlugin({
            'process': {browser: true, env: {}},
            __VUE_OPTIONS_API__: true,
            __VUE_PROD_DEVTOOLS__: true
        }),
        new webpack.ProvidePlugin({'Buffer': 'buffer'})
    ];



module.exports = (env, argv) => [
{
    name: "sandbox-app",
    entry: './src/main.ts',
    ...opts(argv),
    output: {
        filename: 'sandbox-app.js',
        path: `${__dirname}/dist`
    },
    module: {rules},
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    plugins,
    externals: {
        fs: '{}'
    }
},
{
    name: 'vuebook',
    entry: './src/index.ts',
    ...opts(argv),
    output: {
        filename: 'index.js',
        path: `${__dirname}/dist`,
        library: {
            type: 'module'
        },
        publicPath: 'dist/'
    },
    module: {rules},
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    //externalsPresets: { node: true }, // note: this does not work as intended with `library.type: "module"`
    externals: [nodeExternals(), nodeBuiltins],
    plugins,
    experiments: {
        'outputModule': true
    }
}];
