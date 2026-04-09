import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CartResponse, AddToCartRequest } from '../../core/models/cart.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl;

  getCart(): Observable<CartResponse> {
    return this.http.get<CartResponse>(`${this.baseUrl}/Cart`);
  }

  addToCart(request: AddToCartRequest): Observable<CartResponse> {
    return this.http.post<CartResponse>(`${this.baseUrl}/Cart/items`, request);
  }

  updateCartItem(itemId: string, quantity: number): Observable<CartResponse> {
    return this.http.put<CartResponse>(`${this.baseUrl}/Cart/items/${itemId}`, { quantity });
  }

  removeCartItem(itemId: string): Observable<CartResponse> {
    return this.http.delete<CartResponse>(`${this.baseUrl}/Cart/items/${itemId}`);
  }
}