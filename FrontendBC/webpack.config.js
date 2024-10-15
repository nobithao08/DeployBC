const webpack = require('webpack');

module.exports = {
    // Các cấu hình khác của Webpack
    resolve: {
        fallback: {
            buffer: require.resolve('buffer/')
        }
    },
    plugins: [
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
        }),
    ],
};
