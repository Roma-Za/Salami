starter.controller('AppCtrl', function($scope, $ionicModal, $timeout, $ionicPopup, $http, localStorage, $state, $ionicLoading) {
  localStorage.setObject("selectedAlbum", '{}');

  $scope.fbUser = localStorage.getObject('user');
  console.log("fbUser--- ", JSON.stringify($scope.fbUser));

  $scope.itemsList = ITEMSLIST;

  //Объявление функций
  $scope.getSalamiUser = function(){
    $http.get(API_URL + "salamiusers/search?facebook_id=" + $scope.fbUser.id).then(function(data) {
      console.log("__data__", JSON.stringify(data));
      $scope.salami_user = data.data[0];     
    }, function(err) {
      console.log("__err__", JSON.stringify(err));
    });
  }

  $scope.getSalamiUserByMod = function(){
    $http.get(API_URL + "salamiusers/search?facebook_id=" + $scope.fbUser.id).then(function(data) {
      console.log("__data__", JSON.stringify(data));
      $scope.salami_user = data.data[0];
      $scope.salamiUserModification();  

      $scope.album = {};
      if(localStorage.getObject("selectedAlbum")!='{}'){
        $scope.album = JSON.parse(localStorage.getObject("selectedAlbum"));
        console.log("album 1111111 "+ JSON.stringify($scope.album));
      }else{
        $scope.album = $scope.salami_user.albums[0];
        console.log("album 222222 "+ JSON.stringify($scope.album));
      }
      console.log("album 333333333 "+ JSON.stringify($scope.album));

      if($scope.salami_user.albums[0].facebook_album_id !== $scope.album.id){
        $scope.salamiAlbumMod();
      }
        
    }, function(err) {
      console.log("__err__", JSON.stringify(err));
    });
  }

  $scope.getFbAlbums = function(){
        facebookConnectPlugin.api('me?fields=albums{id,name,count,description,picture{url}}',
              ["public_profile", "user_photos"], function(response) {
          
          localStorage.setObject("fbAlbums", response.albums.data);
        });
    };

  $scope.salamiUserModification = function(){
    var userTemp = {};
    if($scope.salami_user.name !== $scope.fbUser.name){
      userTemp.name = $scope.fbUser.name;
    }
    if($scope.salami_user.email !== $scope.fbUser.email){
      userTemp.email = $scope.fbUser.email;
    }
    if($scope.salami_user.birthday !== $scope.fbUser.birthday){
      userTemp.birthday = $scope.fbUser.birthday;
    }
    if($scope.salami_user.gender !== $scope.fbUser.gender){
      userTemp.gender = $scope.fbUser.gender;
    }
    if($scope.salami_user.profile_picture !== $scope.fbUser.avatar){
      userTemp.profile_picture = $scope.fbUser.avatar;
    }
    if($scope.salami_user.collection_type !== localStorage.getObject('collection_type')){
      userTemp.collection_type = localStorage.getObject('collection_type');
      document.getElementById('colType').innerHTML = localStorage.getObject('collection_type');
    }
    if(JSON.stringify(userTemp) != '{}'){
      $scope.updateUser("salamiusers/" + $scope.salami_user.id, userTemp);
    }
  }

  $scope.updateUser = function(strPath, new_data){  
    $http({method:'PUT', url: API_URL + strPath, data: new_data})
    .then(function(resp){
      console.log("PUTresponse---" + JSON.stringify(resp));
    }), 
    function(err){
      console.log("PUTerr---" + JSON.stringify(err));
    }
  };

  $scope.salamiAlbumMod = function(){
    $http.delete(API_URL + "albums/" + $scope.salami_user.albums[0].album_id, { ignoreAuthModule: true })
            .finally(function(data) {
              console.log('delete finally ' + data);
              $scope.createAlbum($scope.salami_user.id);
            });         
  }

  $scope.createAlbum = function(userId){
    var user = {};
    user.currentAlb = $scope.album;
    console.log("description" + JSON.stringify(user.currentAlb.description));
    var alb = {};
    alb.facebook_album_id = user.currentAlb.id;
    alb.name = user.currentAlb.name;
    alb.description = Utils.getUserDate(user, 'description');
    alb.picture_url = Utils.getUserDate(user, 'picture_url');
    alb.user_id = userId;

    var stralb = JSON.stringify(alb);
    console.log("alb---" + stralb);

    $http.post(API_URL + "albums", alb).then(function(response) {
      console.log("response-alb--" + JSON.stringify(response));
      console.log("id---" + response.data.album_id);
      $scope.getPhotos(response.data.album_id);
      
      }, function(response) {
        console.log("err-" + response);
      });
  };

  $scope.getPhotos = function(salami_album_id){
    facebookConnectPlugin.api( '' + $scope.album.id + '/photos?fields=source', 
      ["public_profile", "user_photos"], function(response) {
        $scope.photos = response.data;
        console.log('photos', JSON.stringify($scope.photos));
        $scope.addPhotos(salami_album_id);
      });
  };

  $scope.addPhotos = function(albumId){
    var photosArr = $scope.photos;
    for (var i = 0; i < photosArr.length; i++) {
      var photo = {};
      photo.picture_url = photosArr[i].source;
      photo.album_id = albumId;
      $http.post(API_URL + "photos", photo).
        then(function(response) {
          console.log("response-photo--" + JSON.stringify(response));
        }, function(response) {
           console.log("err--" + JSON.stringify(response));
        });
    }
    $ionicLoading.hide();
  };

  //вызов
  $scope.getSalamiUser();
  $scope.getFbAlbums();

  $scope.updateMyData = function(){
    $ionicLoading.show({ template: 'Please wait...' });
    $scope.getSalamiUserByMod();

  }

  $scope.deleteMyData = function(){

    $http.delete(API_URL + "salamiusers/" + $scope.salami_user.id, { ignoreAuthModule: true })
      .success(function (data) {
        console.log('delete  ' + data);

        facebookConnectPlugin.logout(function(response) {
        $ionicHistory.clearCache();
        $ionicHistory.clearHistory();
        $ionicPopup.alert({
          title: 'message',
          template: "Delete and log out done."
      });
    });

        $state.go('start');
    });
  }
})

starter.controller('AlbumsCtrl', function($scope, $http, localStorage) {

  $scope.albums = localStorage.getObject("fbAlbums");

  $scope.selectAlbum = function(selectedAlb){
    console.log('album_ ', JSON.parse(selectedAlb));
    document.getElementById('currA').innerHTML = JSON.parse(selectedAlb).name;
    localStorage.setObject("selectedAlbum", selectedAlb);
    window.history.back();
  }

})

starter.controller('PlaylistsCtrl', function($scope, $http, $ionicHistory, $state, localStorage, $ionicLoading) {

  $ionicHistory.clearHistory();

  $http.get(API_URL + "salamiusers/search").then(function(data) {
    console.log('Success        list       ', JSON.stringify(data.data));
    $scope.userlists = data.data;
  }, function(err) {
    console.error('ERR     list      ', err);
  });

  $scope.showPhotos = function(selectedCard){
    var albumId = JSON.parse(selectedCard).albums[0].album_id;
    console.log('album_id___ '+ albumId);
    localStorage.set('albId', albumId);
    console.log('album_id___in localStorage '+ localStorage.get('albId'));
    $state.go('photos');
  }

  $scope.doDislike = function(item){
    console.log('doDislike  item '+ JSON.stringify(item));
    var objLike = {};
    objLike.type = "dislike";
    objLike.user1_id = localStorage.get('myId');
    objLike.user2_id = JSON.parse(item).id;
    if(objLike.user1_id!==objLike.user2_id){
      $scope.likesUpdate(objLike);
    }
    
  }

  $scope.doLike = function(item){
    console.log('doLike  item '+ JSON.stringify(item));
    var objLike = {};
    objLike.type = "like";
    objLike.user1_id = localStorage.get('myId');
    objLike.user2_id = JSON.parse(item).id;
    if(objLike.user1_id!==objLike.user2_id){
      $scope.likesUpdate(objLike);
    }
  }

  $scope.likesUpdate =function(obj){
    $http.get(API_URL + "likes/search?user1_id=" + obj.user1_id + "&user2_id=" + obj.user2_id).then(function(data) {
      console.log("__data__", JSON.stringify(data));
      if(data.data[0].type!==obj.type){
        var new_data = {};
        new_data.type = obj.type;
        $http({method:'PUT', url: API_URL + "likes/" + data.data[0].id, data: new_data})
        .then(function(resp){
          console.log("PUTresponse---" + JSON.stringify(resp));
        }), 
        function(err){
          console.log("PUTerr---" + JSON.stringify(err));
        }
      }
    }, function(err) {
      console.log("__err__", JSON.stringify(err));

      $http.post(API_URL + "likes", obj).then(function(response) {
        console.log("response-dislike--" + JSON.stringify(response));
      }, function(response) {
        console.log("err-" + JSON.stringify(response));
      });
    });

  }

})

starter.controller('PhotosCtrl', function($scope, $state, $http, localStorage, $ionicLoading) {
  $scope.$on('$ionicView.enter', function(){
    console.log('album_id___in localStorage___photos '+ localStorage.get('albId'));
    var albumId = localStorage.get('albId');
    $http.get(API_URL + "photos/search?album_id=" + albumId).then(function(data) {
      console.log("__photos__", JSON.stringify(data.data));
      $scope.photos = data.data;
    }, function(err) {
      console.log("__err__", JSON.stringify(err));
    });
  });
   

})

starter.controller('PlaylistCtrl', function($scope, $stateParams) {
});
