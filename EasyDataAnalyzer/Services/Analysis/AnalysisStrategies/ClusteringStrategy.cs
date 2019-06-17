using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EasyDataAnalyzer.Data.Entities;
using EasyDataAnalyzer.Enums;
using EasyDataAnalyzer.Extensions;
using EasyDataAnalyzer.Models;
using EasyDataAnalyzer.Models.Analysis;

namespace EasyDataAnalyzer.Services.Analysis.AnalysisStrategies
{
    public class ClusteringStrategy : IAnalysisStrategy
    {
        private const double accuracy = 0.05;

        public IAnalysisResult AnalyzeData(List<ImportHeader> headers, List<ImportData> data, List<object> args)
        {
            if (args.Count < 1)
            {
                throw new Exception("Кількість кластерів не задано.");
            }

            if (headers.Any(h => h.DataType.Id != (int)ImportDataTypes.Numeric))
            {
                throw new Exception("Невідповідні типи даних змінних.");
            }

            var clustersCount = (int)args[0];
            var points = new List<Point>();
            var sequenceX = data.Where(id => id.Header.Id == headers[0].Id);
            foreach (var x in sequenceX)
            {
                var y = data.FirstOrDefault(
                    id => id.Header.Import.Id == x.Header.Import.Id
                    && id.Header.Id == headers[1].Id
                    && id.RowNumber == x.RowNumber);
                points.Add(new Point(double.Parse(x.Value), double.Parse(y.Value)));
            }

            var centers = GenerateCenters(
                clustersCount, 
                points.Min(p => p.X), 
                points.Max(p => p.X), 
                points.Min(p => p.Y), 
                points.Max(p => p.Y));
            var oldCenters = new List<Point>();
            var pointsInClusters = new List<Point>[clustersCount];

            while (!(centers.All(c => oldCenters.Any(oc => Math.Abs(c.X - oc.X) <= accuracy) && oldCenters.Any(oc => Math.Abs(c.Y - oc.Y) <= accuracy)) 
                && oldCenters.All(oc => centers.Any(c => Math.Abs(c.X - oc.X) <= accuracy) && centers.Any(c => Math.Abs(c.Y - oc.Y) <= accuracy))))
            {
                pointsInClusters = new List<Point>[clustersCount];

                foreach (var point in points)
                {
                    var clusterId = GetNearestCusterIndex(centers, point);

                    if (pointsInClusters[clusterId] == null)
                    {
                        pointsInClusters[clusterId] = new List<Point>();
                    }

                    pointsInClusters[clusterId].Add(point.Clone());
                }

                oldCenters = new List<Point>(centers);
                centers = GetNewCenters(pointsInClusters, oldCenters);
            }

            return new ClusteringResult
            {
                AnalysisMethod = AnalysisMethods.Clustering,
                Result = OperationResult.Success,
                Clusters = RoundClustersData(pointsInClusters),
                XLabel = headers[0].HeaderName,
                YLabel = headers[1].HeaderName
            };
        }

        public IChartResults LoadChartsData(List<ImportHeader> headers, List<ImportData> data, IAnalysisResult analysisResult)
        {
            var results = analysisResult as ClusteringResult;

            return new ClusteringChartModel
            {
                Clusters = results.Clusters,
                XLabel = headers[0].HeaderName,
                YLabel = headers[1].HeaderName,
            };
        }

        private List<Point> GenerateCenters(int clustersCount, double minX, double maxX, double minY, double maxY)
        {
            var random = new Random();
            var result = new List<Point>();
            for (int i = 0; i < clustersCount; i++)
            {
                result.Add(new Point(random.NextDouble(minX, maxX), random.NextDouble(minY, maxY)));
            }
            return result;
        }

        private int GetNearestCusterIndex(List<Point> centers, Point point)
        {
            var result = 0;
            var distance = Math.Sqrt(Math.Pow(centers[0].X - point.X, 2) + Math.Pow(centers[0].Y - point.Y, 2));
            for (int i = 1; i < centers.Count; i++)
            {
                var currentDistance = Math.Sqrt(Math.Pow(centers[i].X - point.X, 2) + Math.Pow(centers[i].Y - point.Y, 2));
                if (currentDistance < distance)
                {
                    distance = currentDistance;
                    result = i;
                }
            }

            return result;
        }

        private List<Point> GetNewCenters(List<Point>[] pointsInClusters, List<Point> centers)
        {
            var result = new List<Point>();
            for (int i = 0; i < pointsInClusters.Length; i++)
            {
                if (pointsInClusters[i] == null)
                {
                    pointsInClusters[i] = new List<Point>();
                }

                if (pointsInClusters[i].Count < 1)
                {
                    var centersWithoutCurrent = new List<Point>(centers);
                    centersWithoutCurrent.RemoveAt(i);
                    var nearestClusterId = GetNearestCusterIndex(centersWithoutCurrent, centers[i]);

                    pointsInClusters[i].Add(
                        new Point
                        (
                            (Math.Max(centers[i].X, centersWithoutCurrent[nearestClusterId].X) - Math.Min(centers[i].X, centersWithoutCurrent[nearestClusterId].X)) / 2,
                            (Math.Max(centers[i].Y, centersWithoutCurrent[nearestClusterId].Y) - Math.Min(centers[i].Y, centersWithoutCurrent[nearestClusterId].Y)) / 2
                        ));
                }

                result.Add(GetMiddleValue(pointsInClusters[i]));
            }

            return result;
        }

        private Point GetMiddleValue(List<Point> clusterPoints)
        {
            return new Point(clusterPoints.Sum(p => p.X) / clusterPoints.Count, clusterPoints.Sum(p => p.Y) / clusterPoints.Count);
        }

        private List<Point>[] RoundClustersData(List<Point>[] clusters)
        {
            foreach(var cluster in clusters)
            {
                foreach (var point in cluster)
                {
                    point.X = Math.Round(point.X, 2);
                    point.Y = Math.Round(point.Y, 2);
                }
            }
            return clusters;
        }

    }
}
