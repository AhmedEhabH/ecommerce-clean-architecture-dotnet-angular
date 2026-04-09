export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  productImageUrl: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface CartResponse {
  success: boolean;
  message?: string;
  data?: {
    items: CartItem[];
    totalItems: number;
    subtotal: number;
  };
  errors?: string[];
}

export interface AddToCartRequest {
  productId: string;
  quantity?: number;
}