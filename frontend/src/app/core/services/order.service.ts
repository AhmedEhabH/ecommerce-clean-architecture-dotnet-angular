import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { OrderResponse, CreateOrderRequest, OrderDto } from '../models/order.model';
import { ApiResponse } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl;

  placeOrder(request: CreateOrderRequest): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(`${this.baseUrl}/Checkout`, request).pipe(
      tap((response) => {
        if (response.success && response.data) {
          localStorage.setItem('lastOrder', JSON.stringify(response.data));
        }
      })
    );
  }

  getLastOrder(): OrderDto | null {
    const stored = localStorage.getItem('lastOrder');
    if (stored) {
      try {
        return JSON.parse(stored) as OrderDto;
      } catch {
        return null;
      }
    }
    return null;
  }

  clearLastOrder(): void {
    localStorage.removeItem('lastOrder');
  }

  getOrders(): Observable<OrderDto[]> {
    return this.http.get<ApiResponse<OrderDto[]>>(`${this.baseUrl}/orders`).pipe(
      map(response => response.data || [])
    );
  }

  getOrderById(id: string): Observable<OrderDto> {
    return this.http.get<ApiResponse<OrderDto>>(`${this.baseUrl}/orders/${id}`).pipe(
      map(response => {
        if (!response.data) {
          throw new Error(response.message || 'Order not found');
        }
        return response.data;
      })
    );
  }
}
