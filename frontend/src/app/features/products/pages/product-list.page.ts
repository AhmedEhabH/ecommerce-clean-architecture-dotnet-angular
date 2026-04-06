import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductGridComponent } from '../components/product-grid/product-grid.component';
import { ProductsService } from '../services/products.service';
import { Product } from '../models/product.model';
import { PaginatedResult } from '../models/pagination.model';

@Component({
  selector: 'app-product-list-page',
  standalone: true,
  imports: [CommonModule, ProductGridComponent],
  templateUrl: './product-list.page.html',
  styleUrl: './product-list.page.scss'
})
export class ProductListPage implements OnInit {
  private productsService = inject(ProductsService);

  products = signal<Product[]>([]);
  pagination = signal<PaginatedResult<Product> | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  currentPage = signal(1);

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(page: number = 1): void {
    this.loading.set(true);
    this.error.set(null);

    this.productsService.getProducts({ page, pageSize: 12 }).subscribe({
      next: (response) => {
        if (response.data) {
          this.products.set(response.data.items);
          this.pagination.set(response.data);
          this.currentPage.set(response.data.page);
        }
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load products. Please try again later.');
        this.loading.set(false);
      }
    });
  }

  goToPage(page: number): void {
    this.loadProducts(page);
  }

  nextPage(): void {
    const pag = this.pagination();
    if (pag?.hasNextPage) {
      this.loadProducts(this.currentPage() + 1);
    }
  }

  prevPage(): void {
    const pag = this.pagination();
    if (pag?.hasPreviousPage) {
      this.loadProducts(this.currentPage() - 1);
    }
  }
}
