import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../../environments/environment';

const PLACEHOLDER = '/images/placeholder.svg';

@Pipe({
  name: 'productImage',
  standalone: true
})
export class ProductImagePipe implements PipeTransform {
  private readonly apiBaseUrl: string;

  constructor() {
    const url = environment.apiBaseUrl;
    this.apiBaseUrl = url.replace(/\/api$/, '');
  }

  transform(imageUrl: string | null | undefined): string {
    if (!imageUrl || !imageUrl.trim()) {
      return PLACEHOLDER;
    }

    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://') || imageUrl.startsWith('data:')) {
      if (imageUrl.includes('via.placeholder.com')) {
        return PLACEHOLDER;
      }
      return imageUrl;
    }

    const normalizedPath = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
    return `${this.apiBaseUrl}${normalizedPath}`;
  }
}
