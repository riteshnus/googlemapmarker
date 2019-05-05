import {Component, OnInit, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
declare var google: any;
declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';

  uluru: Object = {lat: 1.3516, lng: 103.808};
  map: Object;
  markers = [];
  icons = {
    iss_test: {
      icon: 'http://maps.google.com/mapfiles/kml/pal3/icon56.png'
    },
    distribution_center: {
      icon: 'http://maps.google.com/mapfiles/kml/pal4/icon5.png'
    },
    polyclinic: {
      icon: 'http://maps.google.com/mapfiles/kml/pal3/icon38.png'
    },
    patient: {
      icon: 'http://maps.google.com/mapfiles/kml/pal5/icon14.png'
    }
  }
  zoom: number;
  @ViewChild('map') mapRef: ElementRef;

  ngOnInit() {
    setTimeout(() => {
      this.map = new google.maps.Map(this.mapRef.nativeElement, {
        zoom: 11,
        center: this.uluru
      });
    }, 2000);
  }

  addMarker(marker_lat, marker_lng, type) {
    const pos = {lat: marker_lat, lng: marker_lng};
    const marker = new google.maps.Marker({
      position: pos,
      icon: this.icons[type].icon,
      map: this.map,
      title: type
    });
    this.markers.push(marker);
    this.refreshMarkerTable();
  }

  setMapOnAll(map) {
    for (let i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(map);
    }
  }

  // Removes the markers from the map, but keeps them in the array.
  clearMarkers() {
    this.setMapOnAll({});
    this.refreshMarkerTable();
  }

  // Shows any markers currently in the array.
  showMarkers() {
    this.setMapOnAll(this.map);
  }

  deleteMarkers() {
    this.clearMarkers();
    this.markers = [];
    this.refreshMarkerTable();
  }

  refreshMarkerTable() {
    $('#marker_table_body').empty();
    console.log(this.markers);
    this.markers.forEach(function (m) {
      $('#marker_table_body').append($('<tr>')
        .append($('<td>')
        .append(m.getTitle())).append($('<td>')
        .append(m.getPosition().lat()))
        .append($('<td>').append(m.getPosition().lng())));
    });
  }

  importFile() {
    // this.markers = new google.maps.Marker({
    //     position: this.uluru,
    //     map: this.map
    // })
    const regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv)$/;
    const excelmarker = [];
    const maps = this.map;
    const icons = {
      iss_test: {
        icon: 'http://maps.google.com/mapfiles/kml/pal3/icon56.png'
      },
      distribution_center: {
        icon: 'http://maps.google.com/mapfiles/kml/pal4/icon5.png'
      },
      polyclinic: {
        icon: 'http://maps.google.com/mapfiles/kml/pal3/icon38.png'
      },
      patient: {
        icon: 'http://maps.google.com/mapfiles/kml/pal5/icon14.png'
      }
    }
    if (regex.test($('#csvfile').val().toLowerCase())) {
      if (typeof (FileReader) !== 'undefined') {
        // const reader = new FileReader();
        const fileReader: FileReader = new FileReader();
        fileReader.onload = function (e) {
          const table = $('#csvtable > tbody');
          const csvrows = fileReader.result.split('\n');
          for (let i = 1; i < csvrows.length; i++) {
            if (csvrows[i] !== '') {
              const row = '<tr>';
              const csvcols = csvrows[i].split(',');
              const pos = {lat: parseFloat(csvcols[7]), lng: parseFloat(csvcols[8])};
              const marker = new google.maps.Marker({
                  position: pos,
                  icon: icons['patient'].icon,
                  map: maps,
                  title: 'patient'
              });
              excelmarker.push(marker);
            }
          }
        }
        // console.log(excelmarker);
        excelmarker.map(ele => { ele['map'] = this.map; this.markers.push(ele); } );
        this.refreshMarkerTable();
        $('#csvtable').show();
        fileReader.readAsText($('#csvfile')[0].files[0]);
      } else {
        alert('Sorry! Your browser does not support HTML5!');
      }
    } else {
      alert('Please upload a valid CSV file!');
    }
  }

}
