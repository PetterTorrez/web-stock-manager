import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../core/services/product.service';
import { Product, BackendError } from '../../core/models/product.models';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-public-catalog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './public-catalog.component.html',
  styleUrls: ['./public-catalog.component.css'],
})
export class PublicCatalogComponent implements OnInit {
  products = signal<Product[]>([]);
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products.set(data);
        this.isLoading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading.set(false);
        if (err.status === 0) {
          this.errorMessage.set(
            'No se pudo establecer comunicación con el servidor. Verifica tu conexión.',
          );
        } else {
          const backendErr = err.error as BackendError;
          this.errorMessage.set(
            backendErr?.message || 'Ocurrió un error inesperado al recuperar los datos.',
          );
        }
      },
    });
  }
}
