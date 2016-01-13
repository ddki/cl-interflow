var path = require('path');

module.exports = {
    entry: {
        'ajaxCaller': path.join(__dirname, '../src/plainhttp/ajaxCaller.js')
    },
    output: {
        path: path.join(__dirname, '../browser'),
        filename: '[name].js',
        library: 'ajaxCaller',
        libraryTarget: 'this'
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            loader: 'babel-loader',
            query: {
                presets: ['es2015', 'stage-0']
            }
        }]
    }
};