starter.controller('AppCtrl', function($scope, $ionicModal, $timeout, $ionicPopup, $http, localStorage) {
    var myUser = localStorage.getObject('user');
    console.log("myUser_id", JSON.stringify(myUser.id));
    $http.get(API_URL + "salamiusers/search?facebook_id=" + myUser.id).then(function(data) {
      console.log("__data__", JSON.stringify(data));
      $scope.user = data.data[0];
      $scope.getFbAlbums();
    }, function(err) {
      console.log("__err__", JSON.stringify(err));
    });

    $scope.getFbAlbums = function(){
        facebookConnectPlugin.api('me?fields=albums{id,name,count,description,picture{url}}',
              ["public_profile", "user_photos"], function(response) {
          
          localStorage.setObject("albums", response.albums.data);
        });
      };
})

starter.controller('AlbumsCtrl', function($scope, $http, localStorage) {

  $scope.getPhotos = function(album){
    var photos = {};
    facebookConnectPlugin.api( '' + album.id + '/photos?fields=source', 
      ["public_profile", "user_photos"], function(response) {
        photos = response.data;
        console.log('photos', JSON.stringify(photos));
      });
   window.history.back();
  };

  $scope.albums = localStorage.getObject("albums");

  $scope.selectAlbum = function(selectedAlb){
    console.log('album_ ', JSON.parse(selectedAlb));
    document.getElementById('currA').innerHTML = JSON.parse(selectedAlb).name;
    $scope.getPhotos(JSON.parse(selectedAlb));
  }

})

starter.controller('PlaylistsCtrl', function($scope, $http, $ionicHistory) {

  $ionicHistory.clearHistory();

  $http.get(API_URL + "salamiusers/search").then(function(data) {
    console.log('Success        list       ', JSON.stringify(data.data));
    $scope.playlists = data.data;
  }, function(err) {
    console.error('ERR     list      ', err);
  });
})

starter.controller('PlaylistCtrl', function($scope, $stateParams) {
});
