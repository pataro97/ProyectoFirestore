import { Component } from '@angular/core';
import { Router } from "@angular/router";

import { FirestoreService } from '../firestore.service';
import { Pelicula } from '../pelicula';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  peliculaEditando: Pelicula;
  idPeliculaSelec: string;
  arrayColeccionPeliculas: any = [{
    id: "",
    data: {} as Pelicula
   }];

  pickupLocation: string;
  constructor(private firestoreService: FirestoreService, private router: Router) {
    // Crear una pelicula vacía
    this.peliculaEditando = {} as Pelicula;
    this.obtenerListaPeliculas();
    
  }
  
  
  
  

  obtenerListaPeliculas(){
    this.firestoreService.consultar("pelicula").subscribe((resultadoConsultaPeliculas) => {
      this.arrayColeccionPeliculas = [];
      resultadoConsultaPeliculas.forEach((datosPelicula: any) => {
        this.arrayColeccionPeliculas.push({
          id: datosPelicula.payload.doc.id,
          data: datosPelicula.payload.doc.data()
        });
      })
    });
  }

  clicNuevo() {
    this.router.navigate(["/editar/Nuevo"]);
  }



  selecPelicula(peliculaSelec) {
    console.log("Pelicula seleccionada: ");
    console.log(peliculaSelec);
    this.idPeliculaSelec = peliculaSelec.id;
    this.peliculaEditando.titulo = peliculaSelec.data.titulo;
    this.peliculaEditando.descripcion = peliculaSelec.data.descripcion;
  }

  // clicBotonBorrar() {
  //   this.firestoreService.borrar("pelicula", this.idPeliculaSelec).then(() => {
  //     // Actualizar la lista completa
  //     this.obtenerListaPeliculas();
  //     // Limpiar datos de pantalla
  //     this.peliculaEditando = {} as Pelicula;
  //   })
  // }
  
  // clicBotonModificar() {
  //   this.firestoreService.actualizar("pelicula", this.idPeliculaSelec, this.peliculaEditando).then(() => {
  //     // Actualizar la lista completa
  //     this.obtenerListaPeliculas();
  //     // Limpiar datos de pantalla
  //     this.peliculaEditando = {} as Pelicula;
  //   })
  // }

  
  navigateToEditar() {
    this.router.navigate(["/editar/"+this.idPeliculaSelec]);
  }

  //Botones
  configurar() {
    this.router.navigate(["/configurar/"])
  }

  info() {
    this.router.navigate(['/info']);
  }

  volver() {
    this.router.navigate(["/home"]);
  }
  
}
