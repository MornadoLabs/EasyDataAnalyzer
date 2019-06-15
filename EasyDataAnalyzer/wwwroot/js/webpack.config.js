const path = require('path');
module.exports = {
    entry: {
        app: './Scripts/app.ts',
        import: './Scripts/import.ts',
        analysis: './Scripts/analysis.ts',
        analyzeSettings: './Scripts/analyzeSettings.ts',
        regressionResults: './Scripts/regressionResults.ts'
    },
    devtool: 'source-map',
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2VicGFjay5jb25maWcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi93ZWJwYWNrLmNvbmZpZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFFN0IsTUFBTSxDQUFDLE9BQU8sR0FBRztJQUNiLEtBQUssRUFBRTtRQUNILEdBQUcsRUFBRSxrQkFBa0I7UUFDdkIsTUFBTSxFQUFFLHFCQUFxQjtRQUM3QixRQUFRLEVBQUUsdUJBQXVCO1FBQ2pDLGVBQWUsRUFBRSw4QkFBOEI7UUFDL0MsaUJBQWlCLEVBQUUsZ0NBQWdDO0tBQ3REO0lBQ0QsT0FBTyxFQUFFLFlBQVk7SUFDckIsTUFBTSxFQUFFO1FBQ0osS0FBSyxFQUFFO1lBQ0g7Z0JBQ0ksSUFBSSxFQUFFLFNBQVM7Z0JBQ2YsR0FBRyxFQUFFLFdBQVc7Z0JBQ2hCLE9BQU8sRUFBRSxjQUFjO2FBQzFCO1NBQ0o7S0FDSjtJQUNELE9BQU8sRUFBRTtRQUNMLFVBQVUsRUFBRSxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDO0tBQ3JDO0lBQ0QsTUFBTSxFQUFFO1FBQ0osUUFBUSxFQUFFLFdBQVc7UUFDckIsSUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLGFBQWEsQ0FBQztLQUMvQztJQUNELFlBQVksRUFBRTtRQUNWLE9BQU8sRUFBRSxjQUFjO0tBQzFCO0NBQ0osQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICAgIGVudHJ5OiB7XHJcbiAgICAgICAgYXBwOiAnLi9TY3JpcHRzL2FwcC50cycsXHJcbiAgICAgICAgaW1wb3J0OiAnLi9TY3JpcHRzL2ltcG9ydC50cycsXHJcbiAgICAgICAgYW5hbHlzaXM6ICcuL1NjcmlwdHMvYW5hbHlzaXMudHMnLFxyXG4gICAgICAgIGFuYWx5emVTZXR0aW5nczogJy4vU2NyaXB0cy9hbmFseXplU2V0dGluZ3MudHMnLFxyXG4gICAgICAgIHJlZ3Jlc3Npb25SZXN1bHRzOiAnLi9TY3JpcHRzL3JlZ3Jlc3Npb25SZXN1bHRzLnRzJ1xyXG4gICAgfSxcclxuICAgIGRldnRvb2w6ICdzb3VyY2UtbWFwJyxcclxuICAgIG1vZHVsZToge1xyXG4gICAgICAgIHJ1bGVzOiBbXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRlc3Q6IC9cXC50c3g/JC8sXHJcbiAgICAgICAgICAgICAgICB1c2U6ICd0cy1sb2FkZXInLFxyXG4gICAgICAgICAgICAgICAgZXhjbHVkZTogL25vZGVfbW9kdWxlcy9cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIF1cclxuICAgIH0sXHJcbiAgICByZXNvbHZlOiB7XHJcbiAgICAgICAgZXh0ZW5zaW9uczogWycudHN4JywgJy50cycsICcuanMnXVxyXG4gICAgfSxcclxuICAgIG91dHB1dDoge1xyXG4gICAgICAgIGZpbGVuYW1lOiAnW25hbWVdLmpzJyxcclxuICAgICAgICBwYXRoOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnd3d3cm9vdC9qcy8nKVxyXG4gICAgfSxcclxuICAgIHdhdGNoT3B0aW9uczoge1xyXG4gICAgICAgIGlnbm9yZWQ6IC9ub2RlX21vZHVsZXMvXHJcbiAgICB9XHJcbn07Il19