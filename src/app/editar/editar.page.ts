import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Pelicula } from '../pelicula';
import { FirestoreService } from '../firestore.service';
import { Router } from "@angular/router";
@Component({
  selector: 'app-editar',
  templateUrl: './editar.page.html',
  styleUrls: ['./editar.page.scss'],
})
export class EditarPage implements OnInit {
  document: any = {
    id: "",
    data: {} as Pelicula
  };

  id = null;
  constructor(private activatedRoute: ActivatedRoute, private firestoreService: FirestoreService, private router: Router) { 
    this.firestoreService.consultarPorId("pelicula", this.activatedRoute.snapshot.paramMap.get("id")).subscribe((resultado) => {
      // Preguntar si se hay encontrado un document con ese ID
      if(resultado.payload.data() != null) {
        this.document.id = resultado.payload.id
        this.document.data = resultado.payload.data();
        // Como ejemplo, mostrar el título de la tarea en consola
        console.log(this.document.data.titulo);
      } else {
        // No se ha encontrado un document con ese ID. Vaciar los datos que hubiera
        this.document.data = {} as Pelicula;
      } 
      if (this.id == "Nuevo"){
        document.getElementById("modificar").innerHTML = "Añadir";
        document.getElementById("borrar").setAttribute("class", "invisible");
      }
    });
  }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get("id");
  }
  
  
  obtenerListaPeliculas(){
    this.firestoreService.consultar("pelicula").subscribe((resultadoConsultaPeliculas) => {
      this.document = [];
      resultadoConsultaPeliculas.forEach((datosPelicula: any) => {
        this.document.push({
          id: datosPelicula.payload.doc.id,
          data: datosPelicula.payload.doc.data()
        });
      })
    });
  }

  clicBotonBorrar() {
    this.firestoreService.borrar("pelicula", this.document.id).then(() => {
      // Actualizar la lista completa
      this.obtenerListaPeliculas();
      // Limpiar datos de pantalla
      this.document.data = {} as Pelicula;
      //Volver a la pagina principal
      this.router.navigate(["/home"]);
    })
  }

  async clicAlertBorrar() {
    const alert = document.createElement('ion-alert');
    alert.header = 'Alerta!';
    alert.message = '¿Esta seguro de <strong>eliminar</strong> la película?';
    alert.buttons = [
      {
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'secondary',
        handler: (blah) => {
          console.log('Confirm Cancel: blah');
        }
      }, {
        text: 'Borrar',
        handler: () => {
          console.log('Confirm Okay');
          this.clicBotonBorrar()
        }
      }
    ];
    document.body.appendChild(alert);
    return alert.present();
  }

  clicBotonModificar() {
    if (this.id == "Nuevo") {
        this.firestoreService.insertar("pelicula", this.document.data).then(() => {
          console.log('Pelicula creada correctamente!');
          this.document.data= {} as Pelicula;
        }, (error) => {
          console.error(error);
        });
        //Volver a la pagina principal
        this.router.navigate(["/home"]);
    }else{
    this.firestoreService.actualizar("pelicula", this.document.id, this.document.data).then(() => {
      // Actualizar la lista completa
      this.obtenerListaPeliculas();
      // Limpiar datos de pantalla
      this.document.data = {} as Pelicula;
      //Volver a la pagina principal
      this.router.navigate(["/home"]);
    })
  }
  }


}