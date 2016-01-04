var path = require('path');

module.exports = {
    entry: {
        'quickHttp': path.join(__dirname, '../src/quick/quickHttp-browser.js')
    },
    output: {
        path: path.join(__dirname, '../browser'),
        filename: '[name].js',
        library: 'quickHttp',
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