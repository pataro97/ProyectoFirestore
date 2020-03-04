import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Pelicula } from '../pelicula';
import { FirestoreService } from '../firestore.service';
import { Router } from "@angular/router";
import { ToastController, LoadingController } from '@ionic/angular';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { CallNumber } from '@ionic-native/call-number/ngx';

import { AuthService } from '../services/auth.service';

import { AngularFireAuth } from '@angular/fire/auth';
@Component({
  selector: 'app-editar',
  templateUrl: './editar.page.html',
  styleUrls: ['./editar.page.scss'],
})
export class EditarPage implements OnInit {

  
  // mostrar inicio sesion
  userEmail: String = "";
  userUID: String = "";
  isLogged: boolean;
  btnId: boolean;

  document: any = {
    id: "",
    data: {} as Pelicula
  };

  id = null;
  constructor(private activatedRoute: ActivatedRoute,
    private loadingController: LoadingController,
    private toastController: ToastController, 
    private firestoreService: FirestoreService,
    private imagePicker: ImagePicker,
    private socialSharing: SocialSharing,
    private callNumber: CallNumber,
    public afAuth: AngularFireAuth,
    private authService: AuthService,
    private router: Router) {
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
        this.btnId = true;
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

  //-------------------------------------

  async alertImagen() {
    if (this.id == "Nuevo") {
      const alert = document.createElement('ion-alert');
      alert.header = 'Alerta!';
      alert.message = '¿Esta seguro de <strong>añadir</strong> una imagen para la película?';
      alert.buttons = [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Añadir',
          handler: () => {
            console.log('Confirm Okay');
            this.uploadImagePicker()
          }
        }
      ];
      document.body.appendChild(alert);
      return alert.present();
    } else {
      const alert = document.createElement('ion-alert');
      alert.header = 'Alerta!';
      alert.message = '¿Esta seguro de <strong>modificar</strong> la imagen para la película?';
      alert.buttons = [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Modificar',
          handler: () => {
            console.log('Confirm Okay');
            this.uploadImagePicker()
          }
        }
      ];
      document.body.appendChild(alert);
      return alert.present();
    }
   
  }


 //----------------------------------------
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
//-----------------------------------------------------------

  async uploadImagePicker(){
    // Mensaje de espera mientras se sube la imagen
    const loading = await this.loadingController.create({
      message: 'Please wait...'
    });
    // Mensaje de finalización de subida de la imagen
    const toast = await this.toastController.create({
      message: 'Image was updated successfully',
      duration: 3000
    });
    // Comprobar si la aplicación tiene permisos de lectura
    this.imagePicker.hasReadPermission().then(
      (result) => {
        // Si no tiene permiso de lectura se solicita al usuario
        if(result == false){
          this.imagePicker.requestReadPermission();
        }
        else {
          // Abrir selector de imágenes (ImagePicker)
          this.imagePicker.getPictures({
            maximumImagesCount: 1,  // Permitir sólo 1 imagen
            outputType: 1           // 1 = Base64
          }).then(
            (results) => {  // En la variable results se tienen las imágenes seleccionadas
              // Carpeta del Storage donde se almacenará la imagen
              let nombreCarpeta = "imagenes";
              // Recorrer todas las imágenes que haya seleccionado el usuario
              //  aunque realmente sólo será 1 como se ha indicado en las opciones
              for (var i = 0; i < results.length; i++) {      
                // Mostrar el mensaje de espera
                loading.present();
                // Asignar el nombre de la imagen en función de la hora actual para
                //  evitar duplicidades de nombres        
                let nombreImagen = `${new Date().getTime()}`;
                // Llamar al método que sube la imagen al Storage
                this.firestoreService.uploadImage(nombreCarpeta, nombreImagen, results[i])
                  .then(snapshot => {
                    snapshot.ref.getDownloadURL()
                      .then(downloadURL => {
                        // En la variable downloadURL se tiene la dirección de descarga de la imagen
                        console.log("downloadURL:" + downloadURL);
                        this.document.data.imagen = downloadURL;
                        // Mostrar el mensaje de finalización de la subida
                        toast.present();
                        // Ocultar mensaje de espera
                        loading.dismiss();
                      })
                  })
              }
            },
            (err) => {
              console.log(err)
            }
          );
        }
      }, (err) => {
        console.log(err);
      });
  }
//-----------------------------------------

async deleteFile(fileURL) {
  const toast = await this.toastController.create({
    message: 'File was deleted successfully',
    duration: 3000
  });
  this.firestoreService.deleteFileFromURL(fileURL)
    .then(() => {
      toast.present();
    }, (err) => {
      console.log(err);
    });
}


//Botones
inicio() {
  this.router.navigate(["/home"]);
}


volver() {
  this.router.navigate(["/home"]);
}

info() {
  this.router.navigate(['/info']);
}

login() {
  this.router.navigate(["/login"]);
}

//-------------------------Redes sociales
compilemsg(x):string{
  return x;
}

whatsappShare(ti, im){
  let men = "Mira esta pelicula: \n"+ti+"\n"+im;
  var msg  = this.compilemsg(men);
  this.socialSharing.shareViaWhatsApp(msg, null, null);
}

twitterShare(ti, im){
  let men = "Mira esta pelicula: \n"+ti+"\n"+im;
  var msg  = this.compilemsg(men);
  this.socialSharing.shareViaTwitter(msg, null, null);
}

facebookShare(ti, im){
  let men = "Mira esta pelicula: \n"+ti+"\n"+im;
  var msg  = this.compilemsg(men);
   this.socialSharing.shareViaFacebook(msg, null, null);
 }

 regularShare(ti, im){
  let men = "Mira esta pelicula: \n"+ti+"\n"+im;
  var msg = this.compilemsg(men);
  this.socialSharing.share(msg, null, null, null);
}

  // Log in
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

logout(){
  this.authService.doLogout()
  .then(res => {
    this.userEmail = "";
    this.userUID = "";
    this.isLogged = false;
    console.log(this.userEmail);
  }, err => console.log(err));
}

}