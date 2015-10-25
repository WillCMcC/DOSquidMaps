app.controller('MainCtrl', mainSquid)

function mainSquid($scope, $http, $window, uiGmapIsReady, location, markerInfo, Upload, map){

$scope.map = map.map;
$scope.zoomUpload = true;
$scope.markerControl = {};
var userLoc = {};
$scope.refresh = false;
$scope.currImage;
$scope.zoomer= true;
$scope.explore = "Explore";
$scope.newMarker = "+ Squid"
$scope.myLocationText = "Enable Location"
$scope.uploadButtonText = "Take Picture"


uiGmapIsReady.promise()
    .then(function (map_instances) {
});

$scope.closeModal = function(){
  $scope.show = false;
}

$scope.showMarkers = function(){
  $scope.showCamera = false;
  var markers = $scope.markerControl
  markers.updateModels($scope.markers)

}
$scope.showPicker = function(){

  $scope.notificationColor = {background: "red"}
  $scope.notification = "Getting Location"
  $scope.notificationShow = true;
  setTimeout(function(){
    $scope.notificationShow = false;
    $scope.$apply()
  },3000);

  navigator.geolocation.getCurrentPosition(function(position) {
    var realMap = $scope.map.control.getGMap()
    var markers = $scope.markerControl
    userLoc.lat = position.coords.latitude;
    userLoc.lng = position.coords.longitude;
    location.setLocation(userLoc);
    realMap.setZoom(20);
    realMap.setCenter(userLoc);
    $scope.notification = "Success!";
    $scope.notificationColor = {background: "#8bc34a"}
    setTimeout(function(){
      $scope.notificationShow = false;
      $scope.$apply()
    },3000);

  $scope.showCamera = true;
  var markers = $scope.markerControl
  var realMap = $scope.map.control.getGMap()
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
  realMap.setZoom(20);
}, showError);
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
    var realMap = $scope.map.control.getGMap()
    var markers = $scope.markerControl
    userLoc.lat = position.coords.latitude;
    userLoc.lng = position.coords.longitude;
    location.setLocation(userLoc);
    realMap.setZoom(20);
    realMap.setCenter(userLoc);
    $scope.notification = "Success!";
    $scope.notificationColor = {background: "#8bc34a"}
    setTimeout(function(){
      $scope.notificationShow = false;
      $scope.$apply()
    },3000);

    if($scope.showCamera){
      var markers = $scope.markerControl
      var realMap = $scope.map.control.getGMap()
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
    var lat = $scope.markerControl.getGMarkers()[0].model.coords.latitude
    var long =  $scope.markerControl.getGMarkers()[0].model.coords.longitude
    if (newValue != undefined && newValue[0]){
      uploadUsingUpload($scope.files, lat, long);
      $scope.notificationColor = {background: "#2196f3"}
      $scope.notification = "Uploading Squid..."
      $scope.notificationShow = true;
    }
  });
  $scope.$watch('albums', function (newValue) {
    if (newValue != undefined && newValue[0]){
      uploadUsingUpload($scope.albums, markerInfo.getSquid().lat, markerInfo.getSquid().long);
      $scope.notificationColor = {background: "#2196f3"}
      $scope.notification = "Uploading Squid..."
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

  function uploadUsingUpload(files, lat, long) {
        var file = files[0];
        file.upload = Upload.upload({
            url: '/api/new_squid',
            fields: {
                'latitude': lat,
                'longitude': long,
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
