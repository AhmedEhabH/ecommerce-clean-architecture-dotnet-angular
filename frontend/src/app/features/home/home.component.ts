import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductsService } from '../products/services/products.service';
import { CategoriesService } from '../products/services/categories.service';
import { ProductCardComponent } from '../products/components/product-card/product-card.component';
import { Product } from '../products/models/product.model';
import { Category } from '../products/models/category.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, ProductCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  private productsService = inject(ProductsService);
  private categoriesService = inject(CategoriesService);

  featuredProducts = signal<Product[]>([]);
  allProducts = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.loading.set(true);

    this.productsService.getProducts({ isFeatured: true, pageSize: 8 }).subscribe({
      next: (res) => {
        if (res.data?.items) {
          this.featuredProducts.set(res.data.items);
        }
      }
    });

    this.productsService.getProducts({ pageSize: 12 }).subscribe({
      next: (res) => {
        if (res.data?.items) {
          this.allProducts.set(res.data.items);
        }
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });

    this.categoriesService.getCategories().subscribe({
      next: (res) => {
        if (res.data) {
          this.categories.set(res.data.slice(0, 6));
        }
      }
    });
  }
}
