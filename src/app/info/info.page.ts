import { Component } from '@angular/core';
import {Map,tileLayer,marker} from 'leaflet';
import { Router } from '@angular/router';

declare var L: any;

@Component({
  selector: 'app-info',
  templateUrl: './info.page.html',
  styleUrls: ['./info.page.scss'],
})
export class InfoPage  {
map:Map;
  newMarker:any;
  address:string[];
constructor(private router:Router) { }
  
  // The below function is added
  ionViewDidEnter(){
    this.loadMap();
  }
 // The below function is added
  loadMap(){
    this.map = new Map("mapId").setView([36.7754292,-5.5608807], 13);
    tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        { attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'})
        .addTo(this.map); // This line is added to add the Tile Layer to our map
        
        // añadiremos un marcador
        // podemos añadir un marcador por defecto de la siguiente manera:
        // marker ([36.7754292,-5.5608807]).addTo(this.map)
        // Lo podemos hacer de forma personalizada declarando L como any
        var myIcon = L.icon({
          iconUrl: 'https://lh3.googleusercontent.com/proxy/c2nSaNKduQ3svBxpPf8pqS6VOYcWs1svJXz_98RfGjt_DUsr1Id492un-LtRu_SjS0-qfBRbC6yxdKt2oX0SI7GMoWBncH0DRPS-rGY1pEEW5dshKD82XY4',
          iconSize: [50, 50],
          popupAnchor: [-3, -76],
          shadowSize: [68, 95],
          shadowAnchor: [22, 94]
        });
      marker([36.7754292, -5.5608807], {icon: myIcon}).addTo(this.map);

      // mensaje
      // .bindPopup("mensaje").openPopup();
        
      }
      goBack(){
        this.router.navigate(["home"]);
      }
}