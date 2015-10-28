starter.controller('LoginCtrl',
function($scope, $http, $state, $ionicPopup, localStorage, $ionicHistory, $ionicPush, $ionicLoading, $timeout, $rootScope) {
  $scope.albums =  localStorage.getObject("albums");
  $scope.fb_user = localStorage.getObject("fb_user");
  $scope.checkLoginState = function(){
    if (!facebookConnectPlugin || !Utils.checkConnection($ionicPopup)) return;
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
    $ionicLoading.show({ template: 'Please wait...' });
    facebookConnectPlugin.api('me/?fields=picture.height(250).width(250),email,birthday,name,gender',
          ["public_profile", "user_birthday", "email"], 
          function (success) {
            console.log("success: " + JSON.stringify(success));
            if (success && !success.error) {             
              
              $scope.fb_user.profile_picture = success.picture.data.url;
              $scope.fb_user.name = success.name;
              $scope.fb_user.email = Utils.getUserDate(success, 'email');
              $scope.fb_user.birthday = Utils.getUserDate(success, 'birthday');
              $scope.fb_user.gender = Utils.getUserDate(success, 'gender');
              $scope.fb_user.id = success.id;
              localStorage.setObject("fb_user", $scope.fb_user);
              $scope.isExist();
              $scope.registerForPush(success);
            }
          },
          function (error) {
            console.log("FB get /me error: " + JSON.stringify(error));
          });
  };
  
  $scope.registerForPush  = function(user){
    Ionic.io();
    var ionicUser = Ionic.User.current();
    $ionicPush.init({
      "debug": false,
      "onNotification": function(notification) {
        var payload = notification.payload;
        $rootScope.$broadcast('event:push', notification);
      },
      "onRegister": function(token) {
          console.log("Device token: " + token.token);
          ionicUser.id = user.id;
          ionicUser.set('name', user.name);
          ionicUser.set('image', user.picture.data.url);
          ionicUser.addPushToken(token.token);
          ionicUser.save();
        }
    });
    
    $ionicPush.register();
  };

  $scope.getFbAlbums = function(){
    facebookConnectPlugin.api('me?fields=albums{id,name,count,description,picture{url}}',
          ["public_profile", "user_photos"], function(response) {
      
      $scope.albums = response.albums.data;
      localStorage.setObject("albums", $scope.albums);
      $state.go('loginAlbums');
    });
  };

  $scope.isExist = function(){
    $http.get(API_URL + "salamiusers/search?facebook_id=" + $scope.fb_user.id).then(function(data) {
      console.log('isExist data   ', JSON.stringify(data));
      if(data.data.length>0){
        console.log('IIIIIIIIIIIIIIIIIIIIIIIIDDDDDDDDDDDDDDDDDDD', data.data[0].id);
        localStorage.set('myId', data.data[0].id);
        localStorage.setObject("salami_user", data.data[0]);
        $ionicLoading.hide();
        $state.go('app.userlist');
      }else{
        $ionicLoading.hide();
        $state.go('loginProfile');
      }
    }, function(err) {
      console.error('ERR', err);
      $ionicLoading.hide();
      $state.go('loginProfile');
    });
  };

  $scope.getPhotos = function(){
    facebookConnectPlugin.api( ''+$scope.fb_user.currentAlb.id+'/photos?fields=source', 
      ["public_profile", "user_photos"], function(response) {
        $scope.fb_user.photos = response.data;
        $scope.fb_user.collection_type = Utils.getCollectionType(localStorage.getObject('collection_type'));
        localStorage.setObject("fb_user", $scope.fb_user);
      });
    window.history.back();
  };

  $scope.selectAlbum = function(selectedAlb){
    $scope.fb_user.currentAlb = JSON.parse(selectedAlb);
    localStorage.setObject("selectedAlbum", selectedAlb);
    document.getElementById('currAlbum').innerHTML = JSON.parse(selectedAlb).name;
    $scope.getPhotos();
  };

  $scope.goToAlbums = function(){
    $scope.getFbAlbums();
  };

  $scope.itemsList = ITEMSLIST;

  $scope.goToMap = function(){
    $scope.temp = localStorage.getObject("fb_user");
    console.log("temp photos" + JSON.stringify($scope.temp.photos));
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
    $ionicPush.unregister();
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