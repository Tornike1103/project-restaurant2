import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { Api } from '../services/api';
import { FormsModule } from '@angular/forms';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule, NgTemplateOutlet],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  constructor(
    private api: Api,
    private cdr: ChangeDetectorRef,
    private alertService: AlertService,
  ) {}

  ngOnInit() {
    this.getAllCategorie();
  }

  newCatName = '';
  showCat = true;
  showinputCat = false;
  catList: any;
  textAddBtn = 'add category';
  catId = 0;

  getAllCategorie() {
    this.api.getCategories().subscribe({
      next: (resp: any) => {
        this.catList = resp.data;
        this.cdr.detectChanges();
      },
      error: (er) => this.alertService.error(er.message),
    });
  }

  showCatorProd(x: number) {
    if (x == 1) {
      this.showCat = true;
    } else {
      this.showCat = false;
      this.getAllProducts();
      if (!this.catList) this.getAllCategorie();
    }
  }

  postCat() {
    if (this.textAddBtn == 'add category') {
      if (this.newCatName != '') {
        this.api.createCategory({ name: this.newCatName }).subscribe({
          next: () => {
            this.alertService.success('Category created successfully!');
            this.cdr.detectChanges();
            this.getAllCategorie();
            this.resetCategoryForm();
          },
          error: (er) => this.alertService.error(er.message),
        });
      }
    } else {
      if (this.newCatName != '') {
        this.api.updateCategory(this.catId, { name: this.newCatName }).subscribe({
          next: () => {
            this.alertService.success('Category updated successfully!');
            this.cdr.detectChanges();
            this.getAllCategorie();
            this.resetCategoryForm();
          },
          error: (er) => this.alertService.error(er.message),
        });
      }
    }
  }

  resetCategoryForm() {
    this.showinputCat = false;
    this.newCatName = '';
    this.catId = 0;
    this.textAddBtn = 'add category';
  }

  openAddCategoryForm() {
    this.resetCategoryForm();
    this.showinputCat = true;
  }

  async deleteCat(x: any) {
    if (!x) return;

    const confirmed = await this.alertService.confirm(
      'Delete Category',
      'Are you sure you want to delete this category? This action cannot be undone.',
      'Delete',
      'Cancel',
    );

    if (!confirmed) return;

    this.api.deleteCategory(x).subscribe({
      next: () => {
        this.alertService.success('Category deleted.');
        this.cdr.detectChanges();
        this.getAllCategorie();
      },
      error: (er) => this.alertService.error(er.message),
    });
  }

  edit(id: number, name: string) {
    this.showinputCat = true;
    this.newCatName = name;
    this.catId = id;
    this.textAddBtn = 'save category';
  }

  showInputaDDcAT() {
    this.showinputCat = true;
  }

  ///////

  productList: any;
  showInputProd = false;

  newProduct: any = {
    name: '',
    description: '',
    vegetarian: false,
    spiciness: 0,
    price: 0,
    image: '',
    method: '',
    ingredients: '',
    categoryId: 0,
  };

  productId = '';
  productBtnText = 'add product';

  getAllProducts() {
    this.api.getProducts().subscribe({
      next: (resp: any) => {
        this.productList = resp.data.products;
        this.cdr.detectChanges();
      },
      error: (er) => this.alertService.error(er.message),
    });
  }

  openAddProductForm() {
    this.resetProductForm();
    this.showInputProd = true;
  }

  saveProduct() {
    const payload = {
      ...this.newProduct,
      spiciness: Number(this.newProduct.spiciness),
      price: Number(this.newProduct.price),
      categoryId: Number(this.newProduct.categoryId),
      vegetarian: Boolean(this.newProduct.vegetarian),
      method: 'N/A',
      ingredients: this.newProduct.ingredients
        ? this.newProduct.ingredients
            .split(',')
            .map((i: string) => i.trim())
            .filter(Boolean)
        : [],
    };

    if (this.productBtnText === 'add product') {
      this.api.createProduct(payload).subscribe({
        next: () => {
          this.alertService.success('Product created successfully!');
          this.getAllProducts();
          this.resetProductForm();
        },
        error: (er) => this.alertService.error(er.message),
      });
    } else {
      this.api.updateProduct(this.productId, payload).subscribe({
        next: () => {
          this.alertService.success('Product updated successfully!');
          this.getAllProducts();
          this.resetProductForm();
        },
        error: (er) => this.alertService.error(er.message),
      });
    }
  }

  resetProductForm() {
    this.showInputProd = false;
    this.productBtnText = 'add product';
    this.productId = '';
    this.newProduct = {
      name: '',
      description: '',
      vegetarian: false,
      spiciness: 0,
      price: 0,
      image: '',
      method: '',
      ingredients: '',
      categoryId: 0,
    };
  }

  async deleteProduct(id: string) {
    if (!id) return;

    const confirmed = await this.alertService.confirm(
      'Delete Product',
      'Are you sure you want to delete this product? This action cannot be undone.',
      'Delete',
      'Cancel',
    );

    if (!confirmed) return;

    this.api.deleteProduct(id).subscribe({
      next: () => {
        this.alertService.success('Product deleted.');
        this.getAllProducts();
      },
      error: (er) => this.alertService.error(er.message),
    });
  }

  editProduct(item: any) {
    this.showInputProd = true;
    this.productBtnText = 'save product';
    this.productId = item.id;

    this.newProduct = {
      ...item,
      ingredients: Array.isArray(item.ingredients)
        ? item.ingredients.join(',')
        : item.ingredients,
    };
  }
}