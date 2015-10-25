var app = angular.module('squidApp', ['ngRoute', 'uiGmapgoogle-maps', 'ngFileUpload']);

// factories

app.factory("location", function() {
    var loc = {};
    var map = {};
    var markers = {};
    return {
      getLocation: function () {
          return loc;
      },
      setLocation: function(value) {
          loc = value;
      },
      getMarkers: function(){
        return markers;
      },
      setMarkers: function(value){
        markers = value;
      }
    }
});

app.factory("markerInfo", function(){
  var album = {};
  var squid = {};
  return {
      getAlbum: function () {
          return album;
      },
      setAlbum: function(value) {
          album = value;
      },
      getSquid: function(){
        return squid;
      },
      setSquid: function(value){
        squid = value;
      }
    }
});
app.factory("map", function(){
  return {
    map: {
      center: { latitude: 37.79, longitude: -122.420868 },
      zoom: 13,
      options: {
        mapTypeControl: false,
        overviewMapControl: true,
        zoomControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false


      },
      control: {},


    }
  }
});

// app.factory("map", function(){});
