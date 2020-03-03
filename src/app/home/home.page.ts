import { Component } from '@angular/core';
import { Router } from "@angular/router";

import { FirestoreService } from '../firestore.service';
import { Pelicula } from '../pelicula';


import { AngularFireAuth } from '@angular/fire/auth';

import { AuthService } from '../services/auth.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  peliculaEditando: Pelicula;
  idPeliculaSelec: string;

  // mostrar inicio sesion
  userEmail: String = "";
  userUID: String = "";
  isLogged: boolean;


  arrayColeccionPeliculas: any = [{
    id: "",
    data: {} as Pelicula
   }];

  pickupLocation: string;
  constructor(private firestoreService: FirestoreService, private router: Router,  public loadingCtrl: LoadingController,
    private authService: AuthService, public afAuth: AngularFireAuth) {
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

  
  navigateToEditar() {
    this.router.navigate(["/editar/"+this.idPeliculaSelec]);
  }

  //Botones

  info() {
    this.router.navigate(['/info']);
  }

  volver() {
    this.router.navigate(["/home"]);
  }

  login() {
    this.router.navigate(["/mainlogin"]);
  }
  
  
  logout(){
    this.authService.doLogout()
    .then(res => {
      this.userEmail = "";
      this.userUID = "";
      this.isLogged = false;
      console.log(this.userEmail);
    }, err => console.log(err));
  }


  // Mostrar usuario registrado

  ionViewDidEnter() {
    this.isLogged = false;
    this.afAuth.user.subscribe(user => {
      if(user){
        this.userEmail = user.email;
        this.userUID = user.uid;
        this.isLogged = true;
        // mostrar dentro del div el correo
        document.getElementById("mostrarCorreo").innerHTML = "<p>"+user.email+"</p>";
      }else {
        // si no borrara el p
        document.getElementById("mostrarCorreo").innerHTML = "";

      }
    })
  }


 

  // ------------------------------------
}
