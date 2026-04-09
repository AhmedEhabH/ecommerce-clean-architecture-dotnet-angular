import { Component, inject, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CurrencyPipe } from '@angular/common';
import { ProductImagePipe } from '../../shared/pipes/product-image.pipe';
import { CartService, CartState } from '../../core/services/cart.service';
import { CartItem } from '../../core/models/cart.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe, ProductImagePipe],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit, OnDestroy {
  private cartService = inject(CartService);
  private cdr = inject(ChangeDetectorRef);
  private cartSub?: Subscription;
  
  cartItems: CartItem[] = [];
  loading = true;
  error = null as string | null;
  totalItems = 0;
  subtotal = 0;
  updatingItems = new Set<string>();

  ngOnInit(): void {
    this.loadCart();
  }

  ngOnDestroy(): void {
    this.cartSub?.unsubscribe();
  }

  loadCart(): void {
    this.loading = true;
    this.error = null;
    
    this.cartSub?.unsubscribe();
    this.cartSub = this.cartService.cartState$.subscribe({
      next: (state: CartState) => {
        this.cartItems = state.items;
        this.totalItems = state.totalItems;
        this.subtotal = state.subTotal;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Failed to load cart. Please try again later.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  removeItem(itemId: string): void {
    if (this.updatingItems.has(itemId)) return;
    
    this.updatingItems.add(itemId);
    this.cartService.removeCartItem(itemId).subscribe({
      next: (response) => {
        if (!response.success) {
          this.error = response.message || 'Failed to remove item';
        }
        this.updatingItems.delete(itemId);
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Failed to remove item';
        this.updatingItems.delete(itemId);
        this.cdr.detectChanges();
      }
    });
  }

  updateQuantity(itemId: string, newQuantity: number): void {
    if (newQuantity < 1 || this.updatingItems.has(itemId)) return;
    
    this.updatingItems.add(itemId);
    this.cartService.updateCartItem(itemId, newQuantity).subscribe({
      next: (response) => {
        if (!response.success) {
          this.error = response.message || 'Failed to update quantity';
        }
        this.updatingItems.delete(itemId);
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Failed to update quantity';
        this.updatingItems.delete(itemId);
        this.cdr.detectChanges();
      }
    });
  }

  isItemUpdating(itemId: string): boolean {
    return this.updatingItems.has(itemId);
  }
}
