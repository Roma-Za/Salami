starter.controller('LoginMapCtrl',
function($scope, $ionicPopup, localStorage, $http, $state) {

  $scope.tempUser = JSON.parse(localStorage.get("fb_user"));
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
    var temptype = {};
    var user = {};
    user.email = $scope.tempUser.email;
    user.name = $scope.tempUser.name;
    user.birthday = $scope.tempUser.birthday;
    user.gender = $scope.tempUser.gender;
    user.facebook_id = $scope.tempUser.id;
    user.profile_picture = $scope.tempUser.profile_picture;
    user.collection_type = $scope.tempUser.collection_type;
    user.location = $scope.tempUser.location;
    
    console.log("oky---" + JSON.stringify(user));

  $http.post(API_URL + "salamiusers", user).
  then(function(response) {
    // this callback will be called asynchronously
    // when the response is available
    console.log("response---" + JSON.stringify(response));
    console.log("id---" + response.data.id);
    localStorage.set('myId', response.data.id);
    localStorage.setObject("salami_user", user);
    $scope.createAlbum(response.data.id);

  }, function(response) {
    // called asynchronously if an error occurs
    // or server returns response with an error status.
    $ionicPopup.alert({
      title: 'message2',
      template: JSON.stringify(response)
    });
  });
  
  };

  $scope.createAlbum = function(userId){
    var album = {};
    album.facebook_album_id = $scope.tempUser.currentAlb.id;
    album.name = $scope.tempUser.currentAlb.name;
    album.description = Utils.getUserDate($scope.tempUser, 'description');
    album.picture_url = Utils.getUserDate($scope.tempUser, 'picture_url');
    album.user_id = userId;

    console.log("alb---" + JSON.stringify(album));

    $http.post(API_URL + "albums", album).then(function(response) {
      console.log("response-alb--" + JSON.stringify(response));
      console.log("id---" + response.data.album_id);
      //перепишу для использования объекта в дальнейшем в виде ответа с сервера, а не собранного в ручную
      $http.get(API_URL + "salamiusers/search?facebook_id=" + $scope.tempUser.id).then(function(data) {
            console.log('isExist data   ', JSON.stringify(data));
            localStorage.setObject("salami_user", data.data[0]);
          }, function(err) {
            console.error('ERR', err);
            
          }); 

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
    var i = 0;
    while(i < photosArr.length){
      var photo = {};
      photo.picture_url = photosArr[i].source;
      photo.album_id = albumId;
      console.log("i = "+i+" length = " + photosArr.length + "photo = " + JSON.stringify(photo));

      $http.post(API_URL + "photos", photo, { ignoreAuthModule: true })
      .success(function (data) {
        console.log("data-photo--" + JSON.stringify(data));
 
      })
      .error(function (data) {
        console.log("data-err--" + JSON.stringify(data));
          
      });
    i++;
    };
    $state.go('app.playlists');
  };

});