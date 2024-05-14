import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ProductoService } from './_servicios/producto.service';
import { Producto } from './_modelo/Producto';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{

  form:FormGroup;
  modificar:boolean = false;
  
  constructor(private servicio: ProductoService) {this.form = new FormGroup({
    'id_producto': new FormControl(0),
    'nombreProducto': new FormControl(''),
    'stock': new FormControl(0),
    'precio':new FormControl(0),
  });}
  
  productos: Producto[] = [];
  ngOnInit(): void {
    this.listar();
  }

  listar(){
    this.servicio.listar().subscribe(datos => {this.productos = datos;})
  }

  eliminarProducto(id: number) {
      this.servicio.eliminarProducto(id).pipe(
        switchMap(() => this.servicio.listar())
      ).subscribe((data)=>{
        this.productos = data;
        this.listar();
      });
  }

  modificarProducto(id: number) {
      this.servicio.listarPorId(id).subscribe(datos => {this.form = new FormGroup({
          'id_producto': new FormControl(datos.id_producto),
          'nombreProducto': new FormControl(datos.nombre_producto),
          'stock': new FormControl(datos.stock),
          'precio': new FormControl(datos.precio_unitario)
        });
      })
      this.modificar = true;
  }

  useForm(){
    if(this.modificar){
      let p:Producto = {
        'id_producto' : this.form.value['id_producto'],
        'nombre_producto': this.form.value['nombreProducto'],
        'stock':this.form.value['stock'],
        'precio_unitario':this.form.value['precio']
      }

      this.servicio.modificar(p).pipe(
        switchMap(() => this.servicio.listar())
      ).subscribe((data)=>{
        this.productos = data;
        this.listar();
      });
      
    }else{
      let p:Producto = {
        'id_producto' : 0,
        'nombre_producto': this.form.value['nombreProducto'],
        'stock':this.form.value['stock'],
        'precio_unitario':this.form.value['precio']
      }

      this.servicio.alta(p).pipe(
        switchMap(() => this.servicio.listar())
      ).subscribe((data)=>{
        this.productos = data;
        this.listar();
      });
    }
  }
}
