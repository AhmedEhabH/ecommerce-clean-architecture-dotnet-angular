import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OrderService } from '../../core/services/order.service';
import { OrderDto, OrderItemDto } from '../../core/models/order.model';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe, DatePipe],
  template: `
    <div class="page">
      <div class="container">
        <a routerLink="/orders" class="back-link">&larr; Back to orders</a>

        @if (loading()) {
          <div class="loading-state">
            <p>Loading order...</p>
          </div>
        } @else if (error()) {
          <div class="error-state">
            <p>{{ error() }}</p>
            <button class="btn" (click)="loadOrder()">Try Again</button>
          </div>
        } @else if (order()) {
          <div class="order-details">
            <div class="order-details__header">
              <div class="order-details__title">
                <h1>Order #{{ order()!.orderNumber }}</h1>
                <span class="order-details__status order-details__status--{{ order()!.status.toLowerCase() }}">
                  {{ order()!.status }}
                </span>
              </div>
              <span class="order-details__date">Placed on {{ order()!.createdAt | date:'full' }}</span>
            </div>

            <div class="order-details__grid">
              <div class="order-details__items">
                <h2>Order Items</h2>
                <div class="items-list">
                  @for (item of order()!.items; track item.id) {
                    <div class="item-row">
                      <div class="item-row__info">
                        <span class="item-row__name">{{ item.productName }}</span>
                        <span class="item-row__sku">SKU: {{ item.sku }}</span>
                      </div>
                      <div class="item-row__price">
                        <span>{{ item.price | currency }} x {{ item.quantity }}</span>
                        <span class="item-row__total">{{ item.total | currency }}</span>
                      </div>
                    </div>
                  }
                </div>
              </div>

              <div class="order-details__summary">
                <h2>Order Summary</h2>
                <div class="summary-list">
                  <div class="summary-row">
                    <span>Subtotal</span>
                    <span>{{ order()!.subTotal | currency }}</span>
                  </div>
                  <div class="summary-row">
                    <span>Shipping</span>
                    <span>{{ order()!.shippingCost | currency }}</span>
                  </div>
                  <div class="summary-row">
                    <span>Tax</span>
                    <span>{{ order()!.taxAmount | currency }}</span>
                  </div>
                  @if (order()!.discountAmount && order()!.discountAmount > 0) {
                    <div class="summary-row summary-row--discount">
                      <span>Discount</span>
                      <span>-{{ order()!.discountAmount | currency }}</span>
                    </div>
                  }
                  <div class="summary-row summary-row--total">
                    <span>Total</span>
                    <span>{{ order()!.totalAmount | currency }}</span>
                  </div>
                </div>

                @if (order()!.shippingAddress || order()!.billingAddress) {
                  <div class="addresses">
                    @if (order()!.shippingAddress) {
                      <div class="address-block">
                        <h3>Shipping Address</h3>
                        <p>{{ order()!.shippingAddress!.street }}</p>
                        <p>{{ order()!.shippingAddress!.city }}, {{ order()!.shippingAddress!.state }} {{ order()!.shippingAddress!.postalCode }}</p>
                        <p>{{ order()!.shippingAddress!.country }}</p>
                      </div>
                    }
                    @if (order()!.billingAddress) {
                      <div class="address-block">
                        <h3>Billing Address</h3>
                        <p>{{ order()!.billingAddress!.street }}</p>
                        <p>{{ order()!.billingAddress!.city }}, {{ order()!.billingAddress!.state }} {{ order()!.billingAddress!.postalCode }}</p>
                        <p>{{ order()!.billingAddress!.country }}</p>
                      </div>
                    }
                  </div>
                }

                @if (order()!.notes) {
                  <div class="notes-block">
                    <h3>Notes</h3>
                    <p>{{ order()!.notes }}</p>
                  </div>
                }
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .back-link {
      display: inline-block;
      color: var(--color-primary);
      text-decoration: none;
      font-weight: 500;
      margin-bottom: var(--space-6);
    }
    .loading-state, .error-state {
      text-align: center;
      padding: var(--space-10);
    }
    .error-state p {
      color: var(--color-error);
      margin-bottom: var(--space-4);
    }
    .order-details__header {
      margin-bottom: var(--space-6);
    }
    .order-details__title {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      margin-bottom: var(--space-2);
    }
    .order-details__title h1 {
      margin: 0;
    }
    .order-details__status {
      padding: var(--space-1) var(--space-3);
      border-radius: var(--radius-full);
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
    }
    .order-details__status--pending { background: rgba(245, 158, 11, 0.1); color: #d97706; }
    .order-details__status--processing { background: rgba(59, 130, 246, 0.1); color: #2563eb; }
    .order-details__status--shipped { background: rgba(139, 92, 246, 0.1); color: #7c3aed; }
    .order-details__status--delivered { background: rgba(34, 197, 94, 0.1); color: #16a34a; }
    .order-details__status--cancelled { background: rgba(239, 68, 68, 0.1); color: #dc2626; }
    .order-details__status--completed { background: rgba(34, 197, 94, 0.1); color: #16a34a; }
    .order-details__date {
      color: var(--color-text-secondary);
    }
    .order-details__grid {
      display: grid;
      grid-template-columns: 1fr 360px;
      gap: var(--space-6);
    }
    .order-details__items h2, .order-details__summary h2 {
      font-size: 1.1rem;
      margin-bottom: var(--space-4);
      padding-bottom: var(--space-2);
      border-bottom: 1px solid var(--color-border);
    }
    .items-list {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      overflow: hidden;
    }
    .item-row {
      display: flex;
      justify-content: space-between;
      padding: var(--space-4);
      border-bottom: 1px solid var(--color-border);
    }
    .item-row:last-child {
      border-bottom: none;
    }
    .item-row__info {
      display: flex;
      flex-direction: column;
      gap: var(--space-1);
    }
    .item-row__name {
      font-weight: 500;
    }
    .item-row__sku {
      font-size: 0.8rem;
      color: var(--color-text-muted);
    }
    .item-row__price {
      text-align: right;
      display: flex;
      flex-direction: column;
      gap: var(--space-1);
    }
    .item-row__total {
      font-weight: 600;
      color: var(--color-primary);
    }
    .summary-list {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      padding: var(--space-4);
      margin-bottom: var(--space-4);
    }
    .summary-row {
      display: flex;
      justify-content: space-between;
      padding: var(--space-2) 0;
    }
    .summary-row--discount {
      color: var(--color-success);
    }
    .summary-row--total {
      font-size: 1.1rem;
      font-weight: 700;
      border-top: 1px solid var(--color-border);
      margin-top: var(--space-2);
      padding-top: var(--space-3);
    }
    .addresses {
      margin-bottom: var(--space-4);
    }
    .address-block {
      margin-bottom: var(--space-3);
    }
    .address-block h3 {
      font-size: 0.9rem;
      margin-bottom: var(--space-2);
      color: var(--color-text-secondary);
    }
    .address-block p {
      margin: 0;
      line-height: 1.4;
    }
    .notes-block {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      padding: var(--space-4);
    }
    .notes-block h3 {
      font-size: 0.9rem;
      margin-bottom: var(--space-2);
      color: var(--color-text-secondary);
    }
    .notes-block p {
      margin: 0;
      white-space: pre-wrap;
    }
    @media (max-width: 768px) {
      .order-details__grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class OrderDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private orderService = inject(OrderService);

  order = signal<OrderDto | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadOrder();
  }

  loadOrder(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error.set('Order ID is required.');
      this.loading.set(false);
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.orderService.getOrderById(id).subscribe({
      next: (order) => {
        this.order.set(order);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message || 'Failed to load order. Please try again.');
        this.loading.set(false);
      }
    });
  }
}