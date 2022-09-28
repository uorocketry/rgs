import { Chart } from "chart.js/auto";
import { defaultChartOptions } from "$lib/common/chartUtils";

export class ScatterChart {
    private ctx: CanvasRenderingContext2D;
    private chart: Chart;

    constructor(canvas: HTMLCanvasElement) {
        let ctx = canvas.getContext("2d");
        if (ctx) {
            this.ctx = ctx
        } else {
            throw new Error("Could not get canvas context");
        }

        this.chart = new Chart(this.ctx, {
            type: 'scatter',
            data: {
                datasets: []
            }
        });
        this.chart.options = defaultChartOptions();
    }
}