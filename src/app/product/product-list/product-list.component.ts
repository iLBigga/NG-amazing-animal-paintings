import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { Product } from 'src/app/models/product';
import { CartService } from 'src/app/cart/cart.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit{

  products: Product[] = [];
  filteredProucts: Product[] = [];
  sortOrder: string = "";

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private snackbar: MatSnackBar){}

  ngOnInit(): void {
    this.productService.getProducts().subscribe(data => {
      this.products = data;
      this.filteredProucts = data;
    });
  }

  addToCart(product: Product): void{
    this.cartService.addToCart(product).subscribe({
      next: () => {
        this.snackbar.open("Product added to cart!", "", {
          duration: 2000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
      }
    });
  }

  applyFilter(event: Event): void{
    let searchTerm = (event.target as HTMLInputElement).value.toLocaleLowerCase();
    this.filteredProucts = this.products.filter(
      product => product.name.toLocaleLowerCase().includes(searchTerm)
    );

    this.sortProducts(this.sortOrder);
  }

  sortProducts(sortValue: string){
    this.sortOrder = sortValue;

    if(this.sortOrder === "priceLowHigh"){
      this.filteredProucts.sort((a,b) => a.price - b.price);
    }else if(this.sortOrder === "priceHighLow"){
      this.filteredProucts.sort((a,b) => b.price - a.price);

    }
  }
}
