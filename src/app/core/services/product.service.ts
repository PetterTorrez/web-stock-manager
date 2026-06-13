import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { ApiResponse, Product } from '../models/product.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly apiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http
      .get<ApiResponse<Product[]>>(`${this.apiUrl}/all`)
      .pipe(map((response) => response.data));
  }
  createProduct(product: Product): Observable<Product> {
    return this.http
      .post<ApiResponse<Product>>(this.apiUrl, product)
      .pipe(map((response) => response.data));
  }

  updateProduct(product: Product): Observable<Product> {
    return this.http
      .put<ApiResponse<Product>>(this.apiUrl, product)
      .pipe(map((response) => response.data));
  }

  deleteProduct(id: number): Observable<void> {
    return this.http
      .delete<ApiResponse<void>>(`${this.apiUrl}/${id}`)
      .pipe(map((response) => response.data));
  }
}
