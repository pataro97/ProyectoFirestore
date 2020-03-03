import { Component } from '@angular/core';
import {Map,tileLayer,marker} from 'leaflet';
import { Router } from '@angular/router';
import { CallNumber } from '@ionic-native/call-number/ngx';
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
constructor(private router:Router, private callNumber: CallNumber  ) { }
  
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
          iconUrl: 'https://icons.iconarchive.com/icons/icons-land/vista-map-markers/256/Map-Marker-Ball-Azure-icon.png',
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
      funCall() {
        this.callNumber.callNumber("684073639", true)
        .then(res => console.log('Launched dialer!', res))
        .catch(err => console.log('Error launching dialer', err));
      }

      inicio() {
        this.router.navigate(["/home"]);
      }
}