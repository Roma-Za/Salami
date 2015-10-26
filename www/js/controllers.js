starter.controller('AppCtrl', function($scope, $ionicModal, $timeout, $ionicPopup, $http, localStorage, $state, $ionicLoading, $ionicPush) {
  localStorage.setObject("selectedAlbum", '{}');

  $scope.fbUser = localStorage.getObject('fb_user');
  console.log("fbUser--- ", JSON.stringify($scope.fbUser));
  $scope.salami_user = localStorage.getObject('salami_user');
  console.log("salami_user--- ", JSON.stringify($scope.salami_user));

  $scope.itemsList = ITEMSLIST;

  //Объявление функций
  $scope.reSaveSalamiUser = function(){
     $http.get(API_URL + "salamiusers/search?facebook_id=" + $scope.fbUser.id).then(function(data) {
      console.log('isExist data   ', JSON.stringify(data));
        localStorage.setObject("salami_user", data.data[0]);
        $scope.salami_user = data.data[0];
    }, function(err) {
      console.error('ERR', err);
    });
  }

  $scope.getSalamiUserByMod = function(){
    $scope.salamiUserModification();  
    $scope.album = {};
    if(localStorage.getObject("selectedAlbum")!=='{}'){
      $scope.album = JSON.parse(localStorage.getObject("selectedAlbum"));
      console.log("album 1111111 "+ JSON.stringify($scope.album));

      if($scope.salami_user.albums[0].facebook_album_id !== $scope.album.id){
        $scope.salamiAlbumMod();
      }
    }    
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
    if($scope.salami_user.profile_picture !== $scope.fbUser.profile_picture){
      userTemp.profile_picture = $scope.fbUser.profile_picture;
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
      $scope.reSaveSalamiUser();
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
    var alb = {};
    alb.facebook_album_id = user.currentAlb.id;
    alb.name = user.currentAlb.name;
    alb.description = Utils.getUserDate(user, 'description');
    alb.picture_url = Utils.getUserDate(user, 'picture_url');
    alb.user_id = userId;

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

      $http.post(API_URL + "photos", photo, { ignoreAuthModule: true })
      .success(function (data) {
        console.log("data-photo--" + JSON.stringify(data));
 
      })
      .error(function (data) {
        console.log("data-err--" + JSON.stringify(data));
          
      });
    }
    $scope.reSaveSalamiUser();
  };

  //вызов
  $scope.getFbAlbums();

  $scope.updateMyData = function(){
    $ionicLoading.show({ template: 'Please wait...' });
    $scope.getSalamiUserByMod();
    $ionicLoading.hide();
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

starter.controller('UserlistCtrl', function($scope, $http, $ionicHistory, $state, localStorage, $ionicLoading, $timeout, $interval) {

  //$ionicHistory.clearHistory();
 
  $scope.buildUrl = function(settings){
    var strQuery = 'salamiusers/findusers?id=' + localStorage.get('myId');
    if(settings.distance!==-1){ 
      var dis = "distance=" + settings.distance;
    }

    if(settings.collection_type!=="_"){
      var type = "collection_type=" + settings.collection_type;
    }

    if(dis){
      strQuery = strQuery + "&" + dis;
      if(type){
        strQuery = strQuery + "&" + type;
      } 
    }else{
      if(type){
        strQuery = strQuery + "&" + type;
      } 
    }
    return strQuery;
  }


  $scope.$on('$ionicView.enter', function(){
    $http.get(API_URL + "settings/" + localStorage.get('myId')).then(function(data) {

      console.log("__data__settings", JSON.stringify(data));
      $scope.settings = data.data;
      var str =  $scope.buildUrl($scope.settings);
      console.log("STR__settings ", str);
      $http.get(API_URL + str).then(function(data) {

        console.log('Success        list       ', JSON.stringify(data.data));
        $scope.userlists = data.data;

      }, function(err) {
        console.error('ERR     list      ', err);
      });

    }, function(err) {

      console.log("__err__", JSON.stringify(err));
      $http.get(API_URL + "salamiusers/findusers?id=" + localStorage.get('myId')).then(function(data) {

        console.log('Success        list       ', JSON.stringify(data.data));
        $scope.userlists = data.data;

      }, function(err) {
        console.error('ERR     list      ', err);
      });

    });
  });
  
  $scope.showPhotos = function(selectedCard){
    var albumId = JSON.parse(selectedCard).albums[0].album_id;
    console.log('album_id___ '+ albumId);
    localStorage.set('albId', albumId);
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
        console.log("response-" + JSON.stringify(response));
      }, function(response) {
        console.log("err-" + JSON.stringify(response));
      });
    });

  }

  $scope.sendMess = function(item){
    localStorage.setObject("recipient", item);
    $state.go('chat');
  }

})

starter.controller('PhotosCtrl', function($scope, $state, $http, localStorage, $ionicLoading, $timeout) {
  $ionicLoading.show({ template: 'Please wait...' });
  $scope.$on('$ionicView.enter', function(){
    console.log('album_id___in localStorage___photos '+ localStorage.get('albId'));
    var albumId = localStorage.get('albId');
    $http.get(API_URL + "photos/search?album_id=" + albumId).then(function(data) {
      console.log("__photos__", JSON.stringify(data.data));
      $scope.photos = data.data;
      $ionicLoading.hide();
    }, function(err) {
      console.log("__err__", JSON.stringify(err));
      $ionicLoading.hide();
    });
  });
   

})

starter.controller('SearchCtrl', function($scope, $state, $http, localStorage) {
  $scope.itemsList = ITEMSLIST;
  $scope.settings = {};
  $scope.settings.salami_user_id = localStorage.get('myId');
  $scope.distance = -1;
  localStorage.setObject('collection_type', "_");
  $scope.placeholder_dis = "distance (km)";
  $scope.placeholder_type = "type of collection";

  $scope.$on('$ionicView.enter', function(){
    $http.get(API_URL + "settings/search?salami_user_id=" + $scope.settings.salami_user_id).then(function(data) {
        console.log("__data__", JSON.stringify(data));
        $scope.placeholder_dis = data.data.distance + " (km)";
        $scope.placeholder_type = data.data.collection_type;
        $scope.cType = data.data.collection_type;
    }, function(err) {
      console.log("__err__", JSON.stringify(err));
      $scope.cType = "_";
    });
  });


  $scope.closeKeyboard = function() {
    cordova.plugins.Keyboard.close();
    $scope.settings.distance = $scope.distance;
    localStorage.setObject('distance', $scope.distance);
    console.log(JSON.stringify($scope.distance));
  };

  $scope.goToUserList = function(){
    if($scope.distance!==-1){
      $scope.settings.distance = $scope.distance;
    }

    if(localStorage.getObject('collection_type') == ""){
      localStorage.setObject('collection_type', "_");
    }
    if(!(localStorage.getObject('collection_type') == "_" && $scope.cType == "_")){
      $scope.settings.collection_type = localStorage.getObject('collection_type');
    }
    console.log(JSON.stringify($scope.settings));

    $http.get(API_URL + "settings/search?salami_user_id=" + $scope.settings.salami_user_id).then(function(data) {
      console.log("__data__", JSON.stringify(data));
      $http({method:'PUT', url: API_URL + "settings/" + $scope.settings.salami_user_id, data: $scope.settings})
        .then(function(resp){
          console.log("PUTresponse---" + JSON.stringify(resp));
        }), 
        function(err){
          console.log("PUTerr---" + JSON.stringify(err));
        }

    }, function(err) {
      console.log("__err__", JSON.stringify(err));

      $http.post(API_URL + "settings", $scope.settings).then(function(response) {
        console.log("response-" + JSON.stringify(response));
      }, function(response) {
        console.log("err-" + JSON.stringify(response));
      });
    });
    localStorage.set('isChanged', true);
    $state.go('app.userlist');
  }

});
