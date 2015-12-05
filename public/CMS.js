var app = angular.module('CMS', ['ngRoute', 'uiGmapgoogle-maps', 'ngFileUpload']);

app.controller('CMSControl', [
'$scope',
'$http',
'$window',
'$route',
'Upload',
'uiGmapIsReady',
function($scope, $http, $window, $route, Upload, uiGmapIsReady){

$('a[href^="#"]').on('click',function (e) {
    e.preventDefault();
    var target = this.hash,
    $target = $(target);
    $('html, body').stop().animate({
        'scrollTop': $target.offset().top
    }, 900, 'swing', function () {
        window.location.hash = target;
    });
});

$scope.showMe = true;
$scope.markerz = [];
console.log("loaded")
$scope.markers = [];
$http.get('/api/markers').
success(function(data, status, headers, config) {
  if(data.length != 0){
    for(squid in data){
      if(data[squid].lat){
    var obj = {
      id: squid,
      coords: {
        latitude: data[squid].lat,
        longitude: data[squid].long,
      },
      images: data[squid].images,
      show: false,
      options: {
        draggable: true,
        doCluster: true,
      }


    }
      obj.onClick = squidClicker;
      $scope.markers.push(obj);
      $scope.markerz.push(obj);



    }
  }
  }

}).
error(function(data, status, headers, config) {
  // called asynchronously if an error occurs
  // or server returns response with an error status.
});

$scope.map = {
  center: { latitude: 37.79, longitude: -122.420868 },
  zoom: 14,
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
$scope.currentSquid = {};

$scope.showMap = function(x){
  $scope.thisSquid = [];
  $scope.markerz = [];

  console.log(x)
  $scope.currentSquid = x;
  $scope.OGLoc = {};
  $scope.index = 0;
  $scope.showMe = true;

  for(var i=0; i<$scope.markers.length;i++)
  {
    marker = $scope.markers[i];
    if(marker.coords.latitude == x){
      console.log(marker)
      $scope.theMarker = marker;
      $scope.markerz = [marker]
      marker.show = true;
      var theMap = $scope.map.control.getGMap()
      var latLng = {
        lat: $scope.theMarker.coords.latitude,
        lng: $scope.theMarker.coords.longitude,
      }
      $scope.OGLoc = latLng;

      theMap.setCenter($scope.OGLoc)
      theMap.setZoom(16)
      $scope.showMapDiv = true;
    }
    else{
      marker.show = false;
    }







}}
uiGmapIsReady.promise()
    .then(function (map_instances) {
      console.log($scope.theMarker.coords)
      theMap = $scope.map.control.getGMap()

      theMap.setCenter($scope.theMarker.coords)
      theMap.setZoom(16)
    });

$scope.setLocation = function(x){
  var squidChanger = {}
  squidChanger.images = x.images;
  squidChanger.coords = $scope.theMarker.coords
var file = {};
  file.upload = Upload.upload({
      url: '/api/changeLocation',
      fields: {
          squidChanger: squidChanger,
      },
  });
  file.upload.progress(function (evt) {
  });
  file.upload.success(function (data, status, headers, config) {
    theMap = $scope.map.control.getGMap()
    $http.get('/api/markers').
    success(function(data, status, headers, config) {
      if(data.length != 0){
        for(squid in data){
          if(data[squid].lat){
        var obj = {
          id: squid,
          coords: {
            latitude: data[squid].lat,
            longitude: data[squid].long,
          },
          images: data[squid].images,
          show: false,
          options: {
            draggable: true,
          }


        }
          obj.onClick = squidClicker
          $scope.markers.push(obj);
          $scope.markerz.push(obj);

        }
      }
      }

    }).
    error(function(data, status, headers, config) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
    });

    var latLng = {
      lat: $scope.theMarker.coords.latitude,
      lng: $scope.theMarker.coords.longitude,
      }
    theMap.setCenter(latLng)
    location.reload();

  })

}
$scope.delete = function(x){
  console.log(x);
  $http.delete('/api/deletePicture/' + x.coords.latitude).then(function(){
      console.log("deleted")
      $scope.markers = [];
      $http.get('/api/markers').
      success(function(data, status, headers, config) {
        if(data.length != 0){
          for(squid in data){
            if(data[squid].lat){
          var obj = {
            id: squid,
            coords: {
              latitude: data[squid].lat,
              longitude: data[squid].long,
            },
            images: data[squid].images,
            show: false,
            options: {
              draggable: true,
            }


          }
            obj.onClick = squidClicker
            $scope.markers.push(obj);
            $scope.markerz.push(obj);
          }
        }
        }

      }).
      error(function(data, status, headers, config) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
      });
  })
}

$scope.showAll = function(){
  delete $scope.thisSquid
  console.log("test")
  $scope.dumbArr = []
  $http.get('/api/markers').
  success(function(data, status, headers, config) {
    if(data.length != 0){
      console.log(data)
      for(squid in data){
        if(data[squid].lat){
      var obj = {
        id: squid,
        coords: {
          latitude: data[squid].lat,
          longitude: data[squid].long,
        },
        images: data[squid].images,
        show: false,
        options: {
          draggable: true,
        }


      }
        obj.onClick = squidClicker;
        $scope.dumbArr.push(obj);
        $scope.markerz.push(obj);
      }
    }
    $scope.markers = $scope.dumbArr;
    }

  }).
  error(function(data, status, headers, config) {
    // called asynchronously if an error occurs
    // or server returns response with an error status.
  });
}

function squidClicker(a,b,c) {
  console.log(c.coords)
  var theMap = $scope.map.control.getGMap()
  var latLng = {
    lat: c.coords.latitude,
    lng: c.coords.longitude,
  }
  theMap.setCenter(latLng)

    for(var i=0;i<$scope.markers.length;i++){
      $scope.markers[i].show = false;
      if($scope.markers[i].coords == c.coords){
        window.location = "/view/cms/#" + c.coords.latitude;
      }


  }

}

}]);
