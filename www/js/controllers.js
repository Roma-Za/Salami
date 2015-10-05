starter.controller('AppCtrl', function($scope, $ionicModal, $timeout, $ionicPopup, $http, transformRequestAsFormPost, localStorage) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});


  $scope.createUser = function(){
    var user = {};
    user.email = $scope.user.email;
    user.name = $scope.user.name;
    user.birthday = $scope.user.birthday;
    user.gender = $scope.user.gender;
    user.facebook_id = $scope.user.id;
    user.profile_picture = $scope.user.avatar;
    user.location = 'x3';
    var struser = JSON.stringify(user);
    console.log(struser);
    /*
    var request = $http({
                    method: "post",
                    url: API_URL + "salamiusers",
                    transformRequest: transformRequestAsFormPost,
                    data: user
                });

     $ionicPopup.alert({
      title: 'message0',
      template: JSON.stringify(request)
    });
*/

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

/*
$http.get(API_URL + "salamiusers", {params: { id: 1 }}).success(function(data) {
    alert(JSON.stringify(data));
});
*/
/*
$http.get(API_URL + "salamiusers/1").success(function(data) {
   $ionicPopup.alert({
      title: 'message',
      template: JSON.stringify(data)
    });
});
*/
/*
$http.get(API_URL + "salamiusers"+ "?id=1").success(function(data) {
    alert(JSON.stringify(data));
});
*/

  };
})

starter.controller('AlbumsCtrl', function($scope) {
  $scope.getPhotos = function(){
    var tempUser = JSON.parse(localStorage.get("user"));

    facebookConnectPlugin.api( ''+$scope.user.currentAlb.id+'/photos?fields=source', 
      ["public_profile", "user_photos"], function(response) {
        tempUser.photos = response.data;
        localStorage.removeItem("user");
        localStorage.set("user", JSON.stringify(tempUser));
      });
  };

  $scope.albums =  JSON.parse(localStorage.get("albums"));

  $scope.selectAlbum = function(selectedAlb){
  localStorage.set("selectedAlbum", selectedAlb);
  document.getElementById('currA').innerHTML = JSON.parse(selectedAlb).name;
  $scope.getPhotos();
  }
})

starter.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

starter.controller('PlaylistCtrl', function($scope, $stateParams) {
});
