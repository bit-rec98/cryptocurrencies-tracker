import {
  Component,
  Input,
  OnChanges,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { PriceHistory } from '../../../../core/models/cryptocurrency.model';
import { CHART_DAYS, ChartDays, CURRENCY_SYMBOLS, Currency } from '../../../../core/config/api.config';

Chart.register(...registerables);

@Component({
  selector: 'app-price-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './price-chart.component.html',
  styleUrl: './price-chart.component.scss',
})
export class PriceChartComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() priceHistory: PriceHistory | null = null;
  @Input() selectedDays: ChartDays = 7;
  @Input() currency: Currency = 'usd';
  @Input() loading = false;

  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;

  readonly chartDays = CHART_DAYS;
  private chart: Chart | null = null;
  private renderPending = false;

  ngAfterViewInit(): void {
    // If a render was requested before the canvas existed, execute it now
    if (this.renderPending) {
      this.renderPending = false;
    }
    this.renderChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['priceHistory'] || changes['currency']) {
      if (this.chartCanvas) {
        this.renderChart();
      } else {
        // Canvas is not in the DOM yet (template is still showing the empty state).
        // Defer by one tick so Angular renders the <canvas> element first.
        this.renderPending = true;
        setTimeout(() => {
          if (this.renderPending) {
            this.renderPending = false;
            this.renderChart();
          }
        }, 0);
      }
    }
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }

  private renderChart(): void {
    if (!this.chartCanvas || !this.priceHistory) return;

    const prices = this.priceHistory.prices;
    const labels = prices.map(([ts]) => {
      const d = new Date(ts);
      return this.selectedDays <= 1
        ? d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });
    const data = prices.map(([, price]) => price);

    const isPositive = data.length >= 2 ? data[data.length - 1] >= data[0] : true;
    const color = isPositive ? '#10b981' : '#ef4444';

    this.chart?.destroy();

    const config: ChartConfiguration = {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            data,
            borderColor: color,
            backgroundColor: `${color}18`,
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: color,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { intersect: false, mode: 'index' },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#1a2234',
            borderColor: '#1e293b',
            borderWidth: 1,
            titleColor: '#94a3b8',
            bodyColor: '#f1f5f9',
            bodyFont: { weight: 'bold' },
            callbacks: {
              label: (ctx) =>
                ` ${CURRENCY_SYMBOLS[this.currency]}${(ctx.raw as number).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
            },
          },
        },
        scales: {
          x: {
            grid: { color: '#1e293b' },
            ticks: {
              color: '#64748b',
              maxTicksLimit: 8,
              maxRotation: 0,
              font: { size: 11 },
            },
          },
          y: {
            position: 'right',
            grid: { color: '#1e293b' },
            ticks: {
              color: '#64748b',
              font: { size: 11 },
              callback: (v) =>
                `${CURRENCY_SYMBOLS[this.currency]}${(v as number).toLocaleString('en-US', { notation: 'compact' })}`,
            },
          },
        },
      },
    };

    this.chart = new Chart(this.chartCanvas.nativeElement, config);
  }
}
