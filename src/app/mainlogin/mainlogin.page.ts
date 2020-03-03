import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-mainlogin',
  templateUrl: './mainlogin.page.html',
  styleUrls: ['./mainlogin.page.scss'],
})
export class MainloginPage implements OnInit {
  
  userEmail: String = "";
  userUID: String = "";
  isLogged: boolean;
  constructor(
    public loadingCtrl: LoadingController,
    private authService: AuthService,
    private router: Router,
    public afAuth: AngularFireAuth
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.isLogged = false;
    this.afAuth.user.subscribe(user => {
      if(user){
        this.userEmail = user.email;
        this.userUID = user.uid;
        this.isLogged = true;
      }
    })
  }

  login() {
    this.router.navigate(["/login"]);
  }

  logout(){
    this.authService.doLogout()
    .then(res => {
      this.userEmail = "";
      this.userUID = "";
      this.isLogged = false;
      this.router.navigate(["/home"]);
      console.log(this.userEmail);
    }, err => console.log(err));
  }
}
