using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EasyDataAnalyzer.Models
{
    public class Point
    {
        public Point(double x, double y)
        {
            X = x;
            Y = y;
        }

        public double X { get; set; }
        public double Y { get; set; }

        public override bool Equals(object obj)
        {
            if (obj is Point)
            {
                var testPoint = obj as Point;
                return this.X == testPoint.X && this.Y == testPoint.Y;
            }
            else
            {
                return base.Equals(obj);
            }
        }

        public Point Clone()
        {
            return new Point(this.X, this.Y);
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(X, Y);
        }
    }
}
