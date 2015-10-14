starter.controller('LoginCtrl',
function($scope, $http, $state, $ionicPopup, localStorage, $ionicHistory) {
  $scope.user = localStorage.getObject('user');
  $scope.albums =  localStorage.getObject("albums");
  $scope.message = "";
  $ionicHistory.clearHistory();

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
              $scope.user.avatar = Utils.getUserPicture(success);
              $scope.user.name = success.name;
              $scope.user.email = Utils.getUserDate(success, 'email');
              $scope.user.birthday = Utils.getUserDate(success, 'birthday');
              $scope.user.gender = Utils.getUserDate(success, 'gender');
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
    $http.get(API_URL + "salamiusers/search?facebook_id=" + $scope.user.id).then(function(data) {
      console.log('isExist data   ', JSON.stringify(data));
      if(data.data.length>0){
        console.log('IIIIIIIIIIIIIIIIIIIIIIIIDDDDDDDDDDDDDDDDDDD', data.data[0].id);
        localStorage.set('myId', data.data[0].id);
        $state.go('app.playlists');
      }else{
        $state.go('loginProfile');
      }
    }, function(err) {
      console.error('ERR', err);
      $state.go('loginProfile');
    });
  };

  $scope.getPhotos = function(){
    facebookConnectPlugin.api( ''+$scope.user.currentAlb.id+'/photos?fields=source', 
      ["public_profile", "user_photos"], function(response) {
        $scope.user.photos = response.data;
        $scope.user.collection_type = localStorage.getObject('collection_type');
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

  $scope.itemsList = ITEMSLIST;

  $scope.goToMap = function(){
    $scope.temp = localStorage.getObject("user");
    console.log("temp " + $scope.temp.photos);
    if($scope.temp.photos){
      $state.go('loginMap');     
    }else{
      $ionicPopup.alert({
        title: 'message',
        template: "Album not selected!"
      });
    }
    
  };

  $scope.logout = function(){
    facebookConnectPlugin.logout(function(response) {
      $ionicHistory.clearCache();
      $ionicHistory.clearHistory();
      $ionicPopup.alert({
        title: 'message',
        template: "Log out done."
      });
    });
  }


});
