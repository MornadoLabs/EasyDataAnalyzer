const path = require('path');
module.exports = {
    entry: {
        app: './Scripts/app.ts',
        import: './Scripts/import.ts',
        analysis: './Scripts/analysis.ts',
        analyzeSettings: './Scripts/analyzeSettings.ts',
        regressionResults: './Scripts/regressionResults.ts',
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2VicGFjay5jb25maWcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi93ZWJwYWNrLmNvbmZpZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFFN0IsTUFBTSxDQUFDLE9BQU8sR0FBRztJQUNiLEtBQUssRUFBRTtRQUNILEdBQUcsRUFBRSxrQkFBa0I7UUFDdkIsTUFBTSxFQUFFLHFCQUFxQjtRQUM3QixRQUFRLEVBQUUsdUJBQXVCO1FBQ2pDLGVBQWUsRUFBRSw4QkFBOEI7UUFDL0MsaUJBQWlCLEVBQUUsZ0NBQWdDO1FBQ25ELGFBQWEsRUFBRSw0QkFBNEI7UUFDM0MsZUFBZSxFQUFFLDhCQUE4QjtLQUNsRDtJQUNELE9BQU8sRUFBRSxZQUFZO0lBQ3JCLE1BQU0sRUFBRTtRQUNKLEtBQUssRUFBRTtZQUNIO2dCQUNJLElBQUksRUFBRSxTQUFTO2dCQUNmLEdBQUcsRUFBRSxXQUFXO2dCQUNoQixPQUFPLEVBQUUsY0FBYzthQUMxQjtTQUNKO0tBQ0o7SUFDRCxPQUFPLEVBQUU7UUFDTCxVQUFVLEVBQUUsQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQztLQUNyQztJQUNELE1BQU0sRUFBRTtRQUNKLFFBQVEsRUFBRSxXQUFXO1FBQ3JCLElBQUksRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxhQUFhLENBQUM7S0FDL0M7SUFDRCxZQUFZLEVBQUU7UUFDVixPQUFPLEVBQUUsY0FBYztLQUMxQjtDQUNKLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBwYXRoID0gcmVxdWlyZSgncGF0aCcpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgICBlbnRyeToge1xyXG4gICAgICAgIGFwcDogJy4vU2NyaXB0cy9hcHAudHMnLFxyXG4gICAgICAgIGltcG9ydDogJy4vU2NyaXB0cy9pbXBvcnQudHMnLFxyXG4gICAgICAgIGFuYWx5c2lzOiAnLi9TY3JpcHRzL2FuYWx5c2lzLnRzJyxcclxuICAgICAgICBhbmFseXplU2V0dGluZ3M6ICcuL1NjcmlwdHMvYW5hbHl6ZVNldHRpbmdzLnRzJyxcclxuICAgICAgICByZWdyZXNzaW9uUmVzdWx0czogJy4vU2NyaXB0cy9yZWdyZXNzaW9uUmVzdWx0cy50cycsXHJcbiAgICAgICAgaW1wb3J0SGlzdG9yeTogJy4vU2NyaXB0cy9pbXBvcnRIaXN0b3J5LnRzJyxcclxuICAgICAgICBhbmFseXNpc0hpc3Rvcnk6ICcuL1NjcmlwdHMvYW5hbHlzaXNIaXN0b3J5LnRzJyxcclxuICAgIH0sXHJcbiAgICBkZXZ0b29sOiAnc291cmNlLW1hcCcsXHJcbiAgICBtb2R1bGU6IHtcclxuICAgICAgICBydWxlczogW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0ZXN0OiAvXFwudHN4PyQvLFxyXG4gICAgICAgICAgICAgICAgdXNlOiAndHMtbG9hZGVyJyxcclxuICAgICAgICAgICAgICAgIGV4Y2x1ZGU6IC9ub2RlX21vZHVsZXMvXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBdXHJcbiAgICB9LFxyXG4gICAgcmVzb2x2ZToge1xyXG4gICAgICAgIGV4dGVuc2lvbnM6IFsnLnRzeCcsICcudHMnLCAnLmpzJ11cclxuICAgIH0sXHJcbiAgICBvdXRwdXQ6IHtcclxuICAgICAgICBmaWxlbmFtZTogJ1tuYW1lXS5qcycsXHJcbiAgICAgICAgcGF0aDogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ3d3d3Jvb3QvanMvJylcclxuICAgIH0sXHJcbiAgICB3YXRjaE9wdGlvbnM6IHtcclxuICAgICAgICBpZ25vcmVkOiAvbm9kZV9tb2R1bGVzL1xyXG4gICAgfVxyXG59OyJdfQ==