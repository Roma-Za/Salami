starter.controller('LoginMapCtrl',
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
    }, { enableHighAccuracy: true, timeout:10000, maximumAge: 3600000 });
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
    user.collection_type = Utils.getUserDate($scope.tempUser, 'collection_type');
    user.location = $scope.tempUser.location;
    
    var struser = JSON.stringify(user);
    console.log("oky---" + struser);

  $http.post(API_URL + "salamiusers", user).
  then(function(response) {
    // this callback will be called asynchronously
    // when the response is available
     console.log("response---" + JSON.stringify(response));
     console.log("id---" + response.data.id);
     localStorage.set('myId', response.data.id);
      localStorage.setObject("user", user);
     $scope.createAlbum(response.data.id);

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

  $scope.createAlbum = function(userId){
    var album = {};
    album.facebook_album_id = $scope.tempUser.currentAlb.id;
    album.name = $scope.tempUser.currentAlb.name;
    album.description = Utils.getUserDate($scope.tempUser, 'description');
    album.picture_url = Utils.getUserDate($scope.tempUser, 'picture_url');
    album.user_id = userId;

    var stralb = JSON.stringify(album);
    console.log("alb---" + stralb);

    $http.post(API_URL + "albums", album).then(function(response) {
      console.log("response-alb--" + JSON.stringify(response));
      console.log("id---" + response.data.album_id);
      $scope.addPhotos(response.data.album_id);
      }, function(response) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
        $ionicPopup.alert({
          title: 'message2',
          template: JSON.stringify(response)
        });
      });

  };

  $scope.addPhotos = function(albumId){
    var photosArr = $scope.tempUser.photos;
    for (var i = 0; i < photosArr.length; i++) {
      var photo = {};
      photo.picture_url = photosArr[i].source;
      photo.album_id = albumId;
      $http.post(API_URL + "photos", photo).
        then(function(response) {
          console.log("response-photo--" + JSON.stringify(response));
        }, function(response) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
          $ionicPopup.alert({
            title: 'message2',
            template: JSON.stringify(response)
          });
        });
    }
  };


});