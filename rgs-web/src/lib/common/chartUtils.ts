import Chart, { type ChartOptions } from "chart.js/auto";
import { isDarkTheme } from "./utils";

export function defaultChartOptions(): ChartOptions {
  let color = "black";
  Chart.defaults.borderColor = "black";
  if (isDarkTheme()) {
    Chart.defaults.borderColor = "white";
    color = "white";
  }

  return {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 200,
    },

    plugins: {
      tooltip: {
        mode: "nearest",
        intersect: false,
      },
    },
    // disable element insert animation
    // animation: false,
    elements: {
      line: {
        tension: 0.1,
      },
    },

    scales: {
      x: {
        ticks: {
          color: color,
        },
      },
      y: {
        ticks: {
          color: color,
        },
      },
    },
  };
}
