import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Pelicula } from '../pelicula';
import { FirestoreService } from '../firestore.service';

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
  constructor(private activatedRoute: ActivatedRoute, private firestoreService: FirestoreService) { 
    this.firestoreService.consultarPorId("pelicula", id).subscribe((resultado) => {
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
    });
  }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get("id");
  }
  
}