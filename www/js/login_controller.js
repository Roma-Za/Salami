starter.controller('LoginCtrl',
function($scope, $http, $state, $ionicPopup, localStorage) {
  $scope.user = localStorage.getObject('user');
  console.log('!!!!!!!!!!!  user ' + JSON.stringify($scope.user));

  $scope.message = "";
  
  $scope.checkLoginState = function(){
    console.log('!!!!!!!!!!!  checkLoginState');
    if (!facebookConnectPlugin || !Utils.checkConnection($ionicPopup)) return;
    console.log('checkLoginState');
    facebookConnectPlugin.getLoginStatus(function(response) {
      $scope.statusChangeCallback(response);
    });
  };
  
  $scope.statusChangeCallback = function(response){ 
    
    console.log('statusChangeCallback');
    console.log(response);
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
      // Logged into your app and Facebook.
      $scope.fetchFbInfo();
    } else if (response.status === 'not_authorized') {
      // The person is logged into Facebook, but not your app.
      document.getElementById('status').innerHTML = 'Please log ' +
        'into this app. not_authorized';
      $scope.fbLogin();
    } else {
      // The person is not logged into Facebook, so we're not sure if
      // they are logged into this app or not.
      document.getElementById('status').innerHTML = 'Please log ' +
        'into Facebook.';
      $scope.fbLogin();
    }
  };

  $scope.fbLogin = function() {
    console.log("fbLogin: " + facebookConnectPlugin);
    if (!facebookConnectPlugin || !Utils.checkConnection()) return;

    facebookConnectPlugin.login(['public_profile','email', 'user_birthday', 'user_photos'], function(data){
      $scope.statusChangeCallback(data);
    }, function(error){
      console.log("FB login error: " + JSON.stringify(error));
    })
  };
  
  $scope.fetchFbInfo = function(){
    facebookConnectPlugin.api('me/?fields=picture.height(250).width(250),email,birthday,name,gender',
          ["public_profile", "user_birthday", "email"], 
          function (success) {
            console.log("success: " + JSON.stringify(success));
            if (success && !success.error) {             
              $scope.user = {};
              //$scope.user.avatar = Utils.getUserPicture(response);
              $scope.user.avatar = success.picture.data.url;
              $scope.user.name = success.name;
              $scope.user.email = success.email;
              $scope.user.birthday = success.birthday;
              $scope.user.gender = success.gender;
              $scope.user.id = success.id;
              $scope.getFbAlbums(); 
              localStorage.setObject('user', $scope.user);
              $state.go('loginProfile');
            }
          },
          function (error) {
            console.log("FB get /me error: " + JSON.stringify(error));
          });
  };

  $scope.getFbAlbums = function(){
    facebookConnectPlugin.api('me?fields=albums{id,name,count,description,picture{url}}',
          ["public_profile", "user_photos"], function(response) {
      
      $scope.albums = response.albums.data;

      if(localStorage.get("selectedAlbum") || localStorage.get("selectedAlbum") !== ""){
        $scope.user.currentAlb = JSON.parse(localStorage.get("selectedAlbum"));
        localStorage.set("user", JSON.stringify($scope.user));
      }
      $state.go('loginProfile');
    });
  };

  $scope.getPhotos = function(){
    facebookConnectPlugin.api( ''+$scope.user.currentAlb.id+'/photos?fields=source', 
      ["public_profile", "user_photos"], function(response) {
        $scope.user.photos = response.data;
        localStorage.removeItem("user");
        localStorage.set("user", JSON.stringify($scope.user));
      });

  };

  $scope.selectAlbum = function(selectedAlb){
    $scope.user.currentAlb = selectedAlb;
    localStorage.set("selectedAlbum", selectedAlb);
    document.getElementById('currAlbum').innerHTML = JSON.parse(selectedAlb).name;
    $scope.getPhotos();
  };

  $scope.goToAlbums = function(){
    $state.go('loginAlbums');
  };
});
