starter.controller('MapCtrl',
function($scope, $ionicPopup, localStorage, $http, $state) {
  $scope.location =',';
  $scope.centerOnMe = function () {
    if (!$scope.map) {
      return;
    }

    navigator.geolocation.getCurrentPosition(function (pos) {   
      $scope.location = pos.coords.latitude + ',' + pos.coords.longitude; 
      
      var location = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
      $scope.map.setCenter(location);
      $scope.map.setZoom(12);
      GeoMarker = new GeolocationMarker();
      GeoMarker.setCircleOptions({visible: false});
      var circle = new google.maps.Circle({
        strokeColor: '#0000FF',
        strokeOpacity: 0.4,
        strokeWeight: 1,
        fillColor: '#0000FF',
        fillOpacity: 0.35,
        map: $scope.map,
        center: location,
        radius: (1609.344 * 2)
      });
      GeoMarker.setMap($scope.map);
    }, function (error) {
      console.log("location error: " + JSON.stringify(error));
      $ionicPopup.alert( {
        title: 'Unable to get location',
        template: 'Please make sure Location Service is switched on'
      });
    }, { enableHighAccuracy: true, timeout:10000, maximumAge: 3600000 });
  };

  $scope.mapCreated = function(map) {
    $scope.map = map;
    $scope.centerOnMe();
  };


  $scope.updateUser = function(){
    var user = {};
    user.location = $scope.location;
    var id = localStorage.get('myId');
    console.log('myid___________'+id);
    console.log("user---" + JSON.stringify(user));

    $http({method:'PUT', url: API_URL + "salamiusers/" + id, data: user})
      .then(function(resp){
        console.log("PUTresponse---" + JSON.stringify(resp));

        $http.get(API_URL + "salamiusers/search?id=" + id).then(function(data) {
            console.log('coord_update   ', JSON.stringify(data));
            localStorage.setObject("salami_user", data.data[0]);
          }, function(err) {
            console.error('ERR', err);       
          }); 

      },
        function(err){
          console.log("PUTerr---" + JSON.stringify(err));
        })
      $state.go('app.playlists');
    };

});
