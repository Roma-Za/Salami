starter.controller('MapCtrl',
function($scope, $ionicPopup, localStorage, $http, $state) {

  $scope.tempUser = JSON.parse(localStorage.get("user"));
  $scope.tempUser.location =',';
  $scope.centerOnMe = function () {
    if (!$scope.map) {
      return;
    }

    navigator.geolocation.getCurrentPosition(function (pos) {   
      $scope.tempUser.location = pos.coords.latitude + ',' + pos.coords.longitude; 
      localStorage.set("user", JSON.stringify($scope.tempUser));
      console.log("user____________locale________________ " + localStorage.get("user"));
      
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
    }, { enableHighAccuracy: true, timeout:100000, maximumAge: 3600000 });
  };

  $scope.mapCreated = function(map) {
    $scope.map = map;
    $scope.centerOnMe();
  };


  $scope.createUser = function(){
    var user = {};
    user.email = $scope.tempUser.email;
    user.name = $scope.tempUser.name;
    user.birthday = $scope.tempUser.birthday;
    user.gender = $scope.tempUser.gender;
    user.facebook_id = $scope.tempUser.id;
    user.profile_picture = $scope.tempUser.avatar;
    user.collection_type = $scope.tempUser.collection_type;
    user.location = $scope.tempUser.location;

    var struser = JSON.stringify(user);
    console.log("oky---" + struser);

  $http.post(API_URL + "salamiusers", user).
  then(function(response) {
    // this callback will be called asynchronously
    // when the response is available
     $ionicPopup.alert({
      title: 'message1',
      template: JSON.stringify(response)
    });
  }, function(response) {
    // called asynchronously if an error occurs
    // or server returns response with an error status.
    $ionicPopup.alert({
      title: 'message2',
      template: JSON.stringify(response)
    });
  });

  $state.go('app.playlists');
  };

});
