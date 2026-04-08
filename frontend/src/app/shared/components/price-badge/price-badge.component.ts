import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-price-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './price-badge.component.html',
  styleUrl: './price-badge.component.scss',
})
export class PriceBadgeComponent {
  @Input() value: number | null | undefined = null;
  @Input() showIcon = true;

  get isPositive(): boolean {
    return (this.value ?? 0) >= 0;
  }

  get formatted(): string {
    if (this.value == null) return '—';
    return `${Math.abs(this.value).toFixed(2)}%`;
  }
}
