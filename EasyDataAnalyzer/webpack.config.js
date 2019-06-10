const path = require('path');

module.exports = {
    entry: { app: './Scripts/app.ts', import: './Scripts/import.ts', analysis: './Scripts/analysis.ts' },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'wwwroot/js/')
    },
    watchOptions: {
        ignored: /node_modules/
    }
};