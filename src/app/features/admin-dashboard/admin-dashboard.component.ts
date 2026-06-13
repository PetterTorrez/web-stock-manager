import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../core/models/product.model';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
})
export class AdminDashboardComponent implements OnInit {
  products = signal<Product[]>([]);
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  productForm!: FormGroup;
  isEditing = signal<boolean>(false);
  selectedProductId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private authService: AuthService,
    private router: Router,
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  public validationMessages: { [key: string]: { [key: string]: string } } = {
    sku: {
      required: 'El SKU es requerido.',
      minlength: 'El SKU debe tener al menos 6 caracteres.',
      maxlength: 'El SKU no debe sobrepasar los 15 caracteres.',
    },
    name: {
      required: 'El nombre es requerido.',
      minlength: 'El nombre debe tener al menos 6 caracteres.',
      maxlength: 'El nombre no debe sobrepasar los 150 caracteres.',
    },
    price: {
      required: 'El precio es requerido.',
      min: 'El precio mínimo debe ser de $1.',
      max: 'El precio máximo no debe sobrepasar los $999,999.',
    },
    description: {
      maxlength: 'La descripción no debe sobrepasar los 900 caracteres.',
    },
  };

  getFieldError(fieldName: string): string {
    const control = this.productForm.get(fieldName);
    if (!control || !control.errors) return '';

    const firstErrorKey = Object.keys(control.errors)[0];
    return this.validationMessages[fieldName]?.[firstErrorKey] || 'Campo inválido.';
  }

  private initForm(): void {
    this.productForm = this.fb.group({
      sku: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(15)]],
      name: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(150)]],
      price: [0, [Validators.required, Validators.min(1), Validators.max(999999)]],
      description: ['', [Validators.maxLength(900)]],
    });
  }

  loadProducts(): void {
    this.isLoading.set(true);
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.handleError(err);
        this.isLoading.set(false);
      },
    });
  }

  saveProduct(): void {
    if (this.productForm.invalid) {
      this.errorMessage.set('Por favor, corrige los errores del formulario antes de enviar.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const rawValues = this.productForm.value;
    const cleanedProduct: Product = {
      sku: rawValues.sku.trim(),
      name: rawValues.name.trim(),
      price: rawValues.price,
      description: rawValues.description ? rawValues.description.trim() : '',
    };

    if (cleanedProduct.sku.length < 6 || cleanedProduct.name.length < 6) {
      this.isLoading.set(false);
      this.errorMessage.set(
        'El SKU o Nombre no cumplen con la longitud mínima tras remover los espacios.',
      );
      return;
    }

    if (this.isEditing() && this.selectedProductId !== null) {
      this.productService
        .updateProduct({ ...cleanedProduct, id: this.selectedProductId })
        .subscribe({
          next: () => {
            this.resetForm();
            this.loadProducts();
          },
          error: (err) => this.handleError(err),
        });
    } else {
      this.productService.createProduct(cleanedProduct).subscribe({
        next: () => {
          this.resetForm();
          this.loadProducts();
        },
        error: (err) => this.handleError(err),
      });
    }
  }

  editMode(product: Product): void {
    this.isEditing.set(true);
    this.selectedProductId = product.id || null;

    this.productForm.patchValue({
      sku: product.sku,
      name: product.name,
      price: product.price,
      description: product.description,
    });
  }

  deleteProduct(id: number): void {
    if (confirm('¿Seguro que deseas eliminar este producto?')) {
      this.isLoading.set(true);
      this.productService.deleteProduct(id).subscribe({
        next: () => this.loadProducts(),
        error: (err) => this.handleError(err),
      });
    }
  }

  resetForm(): void {
    this.productForm.reset({ sku: '', name: '', price: 0, description: '' });
    this.isEditing.set(false);
    this.selectedProductId = null;
    this.isLoading.set(false);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  private handleError(err: HttpErrorResponse): void {
    this.isLoading.set(false);
    if (err.status === 0) {
      this.errorMessage.set('Error de red: No hay conexión con el servidor.');
    } else {
      this.errorMessage.set(err.error?.message || 'Ocurrió un fallo en la operación.');
    }
  }

  isFieldInvalid(field: string): boolean {
    const control = this.productForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}
