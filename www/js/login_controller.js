starter.controller('LoginCtrl',
function($scope, $http, $state, $ionicPopup, localStorage) {
  $scope.user = localStorage.getObject('user');
  $scope.albums =  localStorage.getObject("albums");
  $scope.message = "";
  
  $scope.checkLoginState = function(){
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
      localStorage.setObject("albums", $scope.albums);
      $scope.user.currentAlb = localStorage.getObject("selectedAlbum");
      localStorage.setObject('user', $scope.user);

      $scope.isExist();

      
    });
  };

  $scope.isExist = function(){
    $http.get(API_URL + "salamiusers").success(function(data) {
     $ionicPopup.alert({
        title: 'message',
        template: JSON.stringify(data)
      });
     var isIt = false;
    for (var i = 0; i < data.length; i++) {
      var idUsr = data[i].facebook_id;
      console.log("user id = "+idUsr);
      if(idUsr === $scope.user.id){
        isIt = true;
        console.log("true " + idUsr + '=' + $scope.user.id);  
      }
    };
    if(isIt){
        $state.go('app.playlists');
      }else{
        $state.go('loginProfile');
      }
    });
  };

  $scope.getPhotos = function(){
    facebookConnectPlugin.api( ''+$scope.user.currentAlb.id+'/photos?fields=source', 
      ["public_profile", "user_photos"], function(response) {
        $scope.user.photos = response.data;
        localStorage.setObject("user", $scope.user);
      });
    window.history.back();
  };

  $scope.selectAlbum = function(selectedAlb){
    $scope.user.currentAlb = JSON.parse(selectedAlb);
    localStorage.setObject("selectedAlbum", selectedAlb);
    document.getElementById('currAlbum').innerHTML = JSON.parse(selectedAlb).name;
    $scope.getPhotos();
  };

  $scope.goToAlbums = function(){
    console.log(localStorage.get("user"));
    $state.go('loginAlbums');
  };

  $scope.itemsList = [
    {'name': 'stamps'},
    {'name': 'medals'},
    {'name': 'coins'},
    {'name': 'banknotes'},
    {'name': 'beer caps'},
    {'name': 'bierdeckels'},
    {'name': 'flags'},
    {'name': 'pennants'}
  ];

  $scope.goToMap = function(){
    $scope.temp = localStorage.getObject("user");
    console.log("temp " + $scope.temp.photos);
    if($scope.temp.photos){
      $state.go('app.map');     
    }else{
      $ionicPopup.alert({
        title: 'message',
        template: "Album not selected!"
      });
    }
    
  };
});
