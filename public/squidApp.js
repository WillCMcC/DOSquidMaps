
var app = angular.module('squidApp', ['ngRoute', 'uiGmapgoogle-maps', 'ngFileUpload']);

app.service('location', function () {
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
            setMap: function(value){
              map = value;
            },
            getMap: function(){
              return map;
            },
            getMarkers: function(){
              return markers;
            },
            setMarkers: function(value){
              markers = value;
            },
            showButton: false,
        };
    });
    app.service('markerInfo', function () {
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
                },


            };
        });

app.controller('MainCtrl', [
'$scope',
'$http',
'Upload',
'$window',
'location',
'markerInfo',
'uiGmapIsReady',
function($scope, $http, Upload, $window, location, markerInfo, uiGmapIsReady){
$scope.map = {
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


};


$scope.zoomUpload = true;


$scope.markerControl = {};



uiGmapIsReady.promise()
    .then(function (map_instances) {
      location.setMap($scope.map)
      location.setMarkers($scope.markerControl)

    });


$window.MY_SCOPE = $scope;

var userLoc = {};
$scope.refresh = false;

$scope.currImage = "";

$scope.notification = "Turn Location On!"

$scope.test = function(){
  $scope.show = false;
}

$scope.zoomer= true;
$scope.explore = "Explore";
$scope.newMarker = "+ Squid"
$scope.myLocationText = "Enable Location"
$scope.uploadButtonText = "Take Picture"



$scope.showMarkers = function(){
  $scope.showCamera = false;

    // $( "#markerButton" ).removeClass( " darken-3" );

  var markers = location.getMarkers()
  markers.updateModels($scope.markers)

}
$scope.showPicker = function(){
  $scope.showCamera = true;



  $scope.newMarker = "+ Squid"


  var markers = location.getMarkers()
  var realMap = location.getMap().control.getGMap()
  var obj = {
    id: 1,
    coords: {
      latitude: realMap.getCenter().lat(),
      longitude: realMap.getCenter().lng(),
    },
    options: {
      draggable: true,
      title: "Set Location"
     },
  }

  markers.newModels([obj])
}


$scope.addClick = function(){
  $scope.notificationColor = {background: "red"}
  $scope.notification = "Getting Location"
  $scope.notificationShow = true;
  setTimeout(function(){
    $scope.notificationShow = false;
    $scope.$apply()
  },3000);
  navigator.geolocation.getCurrentPosition(function(position) {
    console.log(position);
    var realMap = location.getMap().control.getGMap()
    var markers = location.getMarkers()

    userLoc.lat = position.coords.latitude;
    userLoc.lng = position.coords.longitude;
    location.setLocation(userLoc);
    realMap.setZoom(16);
    realMap.setCenter(userLoc);
    $scope.notification = "Success!";
    $scope.notificationColor = {background: "#8bc34a"}
    setTimeout(function(){
      $scope.notificationShow = false;
      $scope.$apply()
    },3000);

    if($scope.showCamera){
      var markers = location.getMarkers()
      var realMap = location.getMap().control.getGMap()
      var obj = {
        id: 1,
        coords: {
          latitude: realMap.getCenter().lat(),
          longitude: realMap.getCenter().lng(),
        },
        options: {
          draggable: true,
          title: "Set Location"
         },
      }

      markers.newModels([obj])
    }


  }, showError);
}
  $scope.$watch('files', function (newValue) {
    if (newValue != undefined && newValue[0]){
      console.log("mama")
      uploadUsingUpload($scope.files);
      $scope.notificationColor = {background: "#2196f3"}
      $scope.notification = "Uploading ??..."
      $scope.notificationShow = true;
    }
  });

  function showError(error) {
      switch(error.code) {
          case error.PERMISSION_DENIED:
              $scope.notification = "Turn On Location"
              $scope.notificationShow = true;
              $scope.$apply();
              break;
          case error.POSITION_UNAVAILABLE:
              $scope.notification = "Location information is unavailable."
              $scope.notificationShow = true;
              $scope.$apply();
              break;
          case error.TIMEOUT:
            $scope.notification = "Request to get location timed out."
            $scope.notificationShow = true;
            $scope.$apply();
              break;
          case error.UNKNOWN_ERROR:
              $scope.notification = "An unknown error occurred."
              $scope.notificationShow = true;
              $scope.$apply();
              break;
      }
  }





  function uploadUsingUpload(files) {
    console.log("upload")
    var streetname = "";
        var file = files[0];
        var geocoder = new google.maps.Geocoder;
        console.log(geocoder)
        geocoder.geocode({'location': latlng}, function(results, status) {
          console.log("in geocode")
          if (status === google.maps.GeocoderStatus.OK) {
          if (results[1]) {
          streetname = results[1].formatted_address;
          console.log(streetname);
        } else {
          streetname = "unspecified location";
          console.log(streetname);
        }
        }
        });
        file.upload = Upload.upload({
            url: '/api/new_squid',
            fields: {
                'latitude': location.getMarkers().getGMarkers()[0].model.coords.latitude,
                'longitude': location.getMarkers().getGMarkers()[0].model.coords.longitude,
            },
            file: file
        });
        file.upload.progress(function (evt) {
        });
        file.upload.success(function (data, status, headers, config) {
          $(".notifications").css("background", "#8bc34a");
          $scope.notification = "Success!"
          setTimeout(function(){
            $scope.notificationShow = false;
          },3000);
          $http.get('/api/markers').
          success(function(data, status, headers, config) {
            if(data.length != 0){
              for(squid in data){
              var obj = {
                id: squid,
                coords: {
                  latitude: data[squid].lat,
                  longitude: data[squid].long,
                },
                images: data[squid].images,
                show: false,

              }
                obj.onClick = function(a,b,c){
                      var counter = 0;
                      var maxLength = a.model.images.length ;
                      $scope.activeCoordinates = a.model.coords;
                      $scope.currImage = a.model.images[counter];
                      $scope.nextImage = function(){
                          counter ++;
                          if(counter < maxLength){
                            $scope.currImage = a.model.images[counter]
                          }else{
                            counter = 0;
                            $scope.currImage = a.model.images[counter]
                          }
                      }
                      a.model.show = true;
                      var latLng = {
                        lat: a.model.coords.latitude,
                        long: a.model.coords.longitude,
                      }
                      markerInfo.setSquid(latLng);
                      $('#modal1').openModal()
                }
                $scope.markers.push(obj);
              }
              }

          }).
          error(function(data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
          });
          $scope.showMarkers();
        });
  };


  navigator.geolocation.getCurrentPosition(function(position) {
    $scope.myLocationText = "Zoom To Me"
    userLoc.lat = position.coords.latitude;
    userLoc.lng = position.coords.longitude;
    location.setLocation(userLoc);
  });







$scope.squid = {};
$scope.show = false;
$scope.markers = [];




  $http.get('/api/markers').
  success(function(data, status, headers, config) {
    if(data.length != 0){
      for(squid in data){
      var obj = {
        id: squid,
        coords: {
          latitude: data[squid].lat,
          longitude: data[squid].long,
        },
        images: data[squid].images,
        show: false,

      }
        obj.onClick = function(a,b,c){
              var counter = 0;
              var maxLength = a.model.images.length ;
              $scope.activeCoordinates = a.model.coords;
              $scope.currImage = a.model.images[counter];
              $scope.nextImage = function(){
                  counter ++;
                  if(counter < maxLength){
                    $scope.currImage = a.model.images[counter]
                  }else{
                    counter = 0;
                    $scope.currImage = a.model.images[counter]
                  }
              }
              a.model.show = true;
              var latLng = {
                lat: a.model.coords.latitude,
                long: a.model.coords.longitude,
              }
              markerInfo.setSquid(latLng);
              $('#modal1').openModal()
        }
        $scope.markers.push(obj);
      }
      }

  }).
  error(function(data, status, headers, config) {
    // called asynchronously if an error occurs
    // or server returns response with an error status.
  });




}

]);

app.controller('buttonCtrl', [
'$scope',
'$http',
'Upload',
'$window',
'location',
 '$route',
function($scope, $http, Upload, $window, location, $route){








  $scope.controlText = 'Add Squid';
  $scope.refresh = true;

}
]);

app.controller('addPictureCtrl', [
'$scope',
'$http',
'Upload',
'$window',
'location',
 '$route',
 'markerInfo',
function($scope, $http, Upload, $window, location, $route, markerInfo){

  $scope.controlText = 'Add Squid';

  $scope.showMarkers = function(){
    var markers = location.getMarkers()
    markers.updateModels($scope.markers)
    $scope.newMarker = "Add Squid"
  }




    $scope.$watch('albums', function(newValue, oldValue) {
      if (newValue != undefined && newValue[0]) {
        $('#loadingModal').openModal();
        addToAlbum($scope.albums);
      }
    });


  function addToAlbum(files) {
        var file = files;
        file.upload = Upload.upload({
            url: '/api/new_image',
            fields: {
                'lat': markerInfo.getSquid().lat,
                'long': markerInfo.getSquid().long
            },
            file: file
        });
        file.upload.progress(function (evt) {
            // Math.min is to fix IE which reports 200% sometimes
        });
        file.upload.success(function (data, status, headers, config) {
          $('#loadingModal').closeModal();
          $('#modal1').closeModal()
          $http.get('/api/markers').
          success(function(data, status, headers, config) {
            if(data.length != 0){
              for(squid in data){
              var obj = {
                id: squid,
                coords: {
                  latitude: data[squid].lat,
                  longitude: data[squid].long,
                },
                images: data[squid].images,
                show: false,

              }
                obj.onClick = function(a,b,c){
                      var counter = 0;
                      var maxLength = a.model.images.length ;
                      $scope.activeCoordinates = a.model.coords;
                      $scope.currImage = a.model.images[counter];
                      $scope.nextImage = function(){
                          counter ++;
                          if(counter < maxLength){
                            $scope.currImage = a.model.images[counter]
                          }else{
                            counter = 0;
                            $scope.currImage = a.model.images[counter]
                          }
                      }
                      a.model.show = true;
                      var latLng = {
                        lat: a.model.coords.latitude,
                        long: a.model.coords.longitude,
                      }
                      markerInfo.setSquid(latLng);
                      $('#modal1').openModal()
                }
                $scope.markers.push(obj);
              }
              }

          }).
          error(function(data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
          });
          $scope.showMarkers();
        });
  }   ;
}
]);
