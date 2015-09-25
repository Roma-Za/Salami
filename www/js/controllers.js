starter.controller('AppCtrl', function($scope, $ionicModal, $timeout, $ionicPopup) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
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
   
    facebookConnectPlugin.login(['public_profile','email', 'user_birthday', 'user_photos'], function(response) {
      $scope.statusChangeCallback(response);
    });
  };

  $scope.checkLoginState = function(){
    if (!facebookConnectPlugin || !Utils.checkConnection($ionicPopup)) return;
    console.log('checkLoginState');
    facebookConnectPlugin.getLoginStatus(function(response) {
      $scope.statusChangeCallback(response);
    });
  };

  $scope.fetchFbInfo = function(){
    facebookConnectPlugin.api('me/?fields=picture.height(250).width(250),email,birthday,name,gender',
          ["public_profile", "user_birthday", "email"], function(response) {
      $scope.user = {};
      $scope.user.avatar = Utils.getUserPicture(response);
      $scope.user.name = response.name;
      $scope.user.email = response.email;
      $scope.user.birthday = response.birthday;
      $scope.user.gender = response.gender;
      $scope.user.id = response.id;
      $scope.getFbAlbums(); 

    });
  };

  $scope.getFbAlbums = function(){
    facebookConnectPlugin.api('me?fields=albums{id,name,count,description,picture{url}}',
          ["public_profile", "user_photos"], function(response) {
      
     window.localStorage.setItem("albums", JSON.stringify(response.albums.data));

      if(window.localStorage.getItem("selectedAlbum") || window.localStorage.getItem("selectedAlbum") !== ""){
        $scope.user.currentAlb = JSON.parse(window.localStorage.getItem("selectedAlbum"));
        window.localStorage.setItem("user", JSON.stringify($scope.user));
      }
        
    });

  };
})

starter.controller('AlbumsCtrl', function($scope) {
  $scope.getPhotos = function(){
    var tempUser = JSON.parse(window.localStorage.getItem("user"));

    facebookConnectPlugin.api( ''+$scope.user.currentAlb.id+'/photos?fields=source', 
      ["public_profile", "user_photos"], function(response) {
        tempUser.photos = response.data;
        window.localStorage.removeItem("user");
        window.localStorage.setItem("user", JSON.stringify(tempUser));
      });
  };

  $scope.albums =  JSON.parse(window.localStorage.getItem("albums"));

  $scope.selectAlbum = function(selectedAlb){
  window.localStorage.setItem("selectedAlbum", selectedAlb);
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
