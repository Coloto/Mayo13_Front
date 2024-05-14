import { Injectable } from '@angular/core';
import { Observable, Subject, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Producto } from '../_modelo/Producto';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private url: string = `http://localhost:8080/productos`;
  
  constructor(private http:HttpClient) { }
 
  listar(): Observable<Producto[]>{
    return this.http.get<Producto[]>(this.url);
  }
  listarPorId(id:number) {
    return this.http.get<Producto>(`${this.url}/${id}`)
  }

  alta(p:Producto){
    return this.http.post(this.url,p);
  }

  modificar(p: Producto) {
    return this.http.put(this.url,p);
  }

  eliminarProducto(id: number){
    return this.http.delete(`${this.url}/${id}`);
  }
}
