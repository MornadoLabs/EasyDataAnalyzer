const path = require('path');
module.exports = {
    entry: {
        app: './Scripts/app.ts',
        import: './Scripts/import.ts',
        analysis: './Scripts/analysis.ts',
        analyzeSettings: './Scripts/analyzeSettings.ts',
        regressionResults: './Scripts/regressionResults.ts',
        clusteringResults: './Scripts/clusteringResults.ts',
        importHistory: './Scripts/importHistory.ts',
        analysisHistory: './Scripts/analysisHistory.ts',
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2VicGFjay5jb25maWcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi93ZWJwYWNrLmNvbmZpZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFFN0IsTUFBTSxDQUFDLE9BQU8sR0FBRztJQUNiLEtBQUssRUFBRTtRQUNILEdBQUcsRUFBRSxrQkFBa0I7UUFDdkIsTUFBTSxFQUFFLHFCQUFxQjtRQUM3QixRQUFRLEVBQUUsdUJBQXVCO1FBQ2pDLGVBQWUsRUFBRSw4QkFBOEI7UUFDL0MsaUJBQWlCLEVBQUUsZ0NBQWdDO1FBQ25ELGlCQUFpQixFQUFFLGdDQUFnQztRQUNuRCxhQUFhLEVBQUUsNEJBQTRCO1FBQzNDLGVBQWUsRUFBRSw4QkFBOEI7S0FDbEQ7SUFDRCxPQUFPLEVBQUUsWUFBWTtJQUNyQixNQUFNLEVBQUU7UUFDSixLQUFLLEVBQUU7WUFDSDtnQkFDSSxJQUFJLEVBQUUsU0FBUztnQkFDZixHQUFHLEVBQUUsV0FBVztnQkFDaEIsT0FBTyxFQUFFLGNBQWM7YUFDMUI7U0FDSjtLQUNKO0lBQ0QsT0FBTyxFQUFFO1FBQ0wsVUFBVSxFQUFFLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUM7S0FDckM7SUFDRCxNQUFNLEVBQUU7UUFDSixRQUFRLEVBQUUsV0FBVztRQUNyQixJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsYUFBYSxDQUFDO0tBQy9DO0lBQ0QsWUFBWSxFQUFFO1FBQ1YsT0FBTyxFQUFFLGNBQWM7S0FDMUI7Q0FDSixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gICAgZW50cnk6IHtcclxuICAgICAgICBhcHA6ICcuL1NjcmlwdHMvYXBwLnRzJyxcclxuICAgICAgICBpbXBvcnQ6ICcuL1NjcmlwdHMvaW1wb3J0LnRzJyxcclxuICAgICAgICBhbmFseXNpczogJy4vU2NyaXB0cy9hbmFseXNpcy50cycsXHJcbiAgICAgICAgYW5hbHl6ZVNldHRpbmdzOiAnLi9TY3JpcHRzL2FuYWx5emVTZXR0aW5ncy50cycsXHJcbiAgICAgICAgcmVncmVzc2lvblJlc3VsdHM6ICcuL1NjcmlwdHMvcmVncmVzc2lvblJlc3VsdHMudHMnLFxyXG4gICAgICAgIGNsdXN0ZXJpbmdSZXN1bHRzOiAnLi9TY3JpcHRzL2NsdXN0ZXJpbmdSZXN1bHRzLnRzJyxcclxuICAgICAgICBpbXBvcnRIaXN0b3J5OiAnLi9TY3JpcHRzL2ltcG9ydEhpc3RvcnkudHMnLFxyXG4gICAgICAgIGFuYWx5c2lzSGlzdG9yeTogJy4vU2NyaXB0cy9hbmFseXNpc0hpc3RvcnkudHMnLFxyXG4gICAgfSxcclxuICAgIGRldnRvb2w6ICdzb3VyY2UtbWFwJyxcclxuICAgIG1vZHVsZToge1xyXG4gICAgICAgIHJ1bGVzOiBbXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRlc3Q6IC9cXC50c3g/JC8sXHJcbiAgICAgICAgICAgICAgICB1c2U6ICd0cy1sb2FkZXInLFxyXG4gICAgICAgICAgICAgICAgZXhjbHVkZTogL25vZGVfbW9kdWxlcy9cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIF1cclxuICAgIH0sXHJcbiAgICByZXNvbHZlOiB7XHJcbiAgICAgICAgZXh0ZW5zaW9uczogWycudHN4JywgJy50cycsICcuanMnXVxyXG4gICAgfSxcclxuICAgIG91dHB1dDoge1xyXG4gICAgICAgIGZpbGVuYW1lOiAnW25hbWVdLmpzJyxcclxuICAgICAgICBwYXRoOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnd3d3cm9vdC9qcy8nKVxyXG4gICAgfSxcclxuICAgIHdhdGNoT3B0aW9uczoge1xyXG4gICAgICAgIGlnbm9yZWQ6IC9ub2RlX21vZHVsZXMvXHJcbiAgICB9XHJcbn07Il19