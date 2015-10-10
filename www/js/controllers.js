starter.controller('AppCtrl', function($scope, $ionicModal, $timeout, $ionicPopup, $http, localStorage) {
    localStorage.setObject("selectedAlbum", '{}');
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

    $scope.updateMyData = function(){

      facebookConnectPlugin.api('me/?fields=picture.height(250).width(250),email,birthday,name,gender',
        ["public_profile", "user_birthday", "email"], 
        function (success) {
          console.log("success__1: " + JSON.stringify(success));
          if (success && !success.error) {             
            $scope.new_user = {};
            $scope.new_user.avatar = Utils.getUserPicture(success);
            $scope.new_user.name = success.name;
            $scope.new_user.email = Utils.getUserDate(success, 'email');
            $scope.new_user.birthday = Utils.getUserDate(success, 'birthday');
            $scope.new_user.gender = Utils.getUserDate(success, 'gender');
            $scope.new_user.id = success.id;
          }
          },
          function (error) {
            console.log("FB get /me error: " + JSON.stringify(error));
        });
      if(localStorage.getObject("selectedAlbum")!='{}'){
        $scope.album = localStorage.getObject("selectedAlbum");
      }else{
        $scope.album = $scope.user.albums[0].name;
      }
      $scope.getPhotos();

      $http.get(API_URL + "salamiusers/search?facebook_id=" + $scope.new_user.id).then(function(data) {
        console.log('isExist data   ', JSON.stringify(data));
        console.log('server_user.name', data.data[0].name);
        console.log('new_user.name', $scope.new_user.name);
        var userTemp = {};
        if(data.data[0].name !== $scope.new_user.name){
          userTemp.name = $scope.new_user.name;
        }
        if(data.data[0].email !== $scope.new_user.email){
          userTemp.email = $scope.new_user.email;
        }
        if(data.data[0].birthday !== $scope.new_user.birthday){
          userTemp.birthday = $scope.new_user.birthday;
        }
        if(data.data[0].gender !== $scope.new_user.gender){
          userTemp.gender = $scope.new_user.gender;
        }
        if(data.data[0].profile_picture !== $scope.new_user.avatar){
          userTemp.profile_picture = $scope.new_user.avatar;
        }

        if(userTemp.property){
          $scope.updateUser("salamiusers/" + data.data[0].id, userTemp);
        }
        /*
        if(data.data[0].albums[0].facebook_album_id !== $scope.album.id){
          data.data[0].albums[0].album_id
        }
        */
      }, function(err) {
        console.error('ERR', err);
      });
    } 

    $scope.updateUser = function(strPath, new_data){
      
      $http({method:'PUT', url: API_URL + strPath, data: new_data})
        .then(function(resp){
          console.log("PUTresponse---" + JSON.stringify(resp));
        },
          function(err){
            console.log("PUTerr---" + JSON.stringify(err));
          })
    };

    $scope.getPhotos = function(){
      facebookConnectPlugin.api( '' + $scope.album.id + '/photos?fields=source', 
        ["public_profile", "user_photos"], function(response) {
          $scope.photos = response.data;
          console.log('photos', JSON.stringify(photos));
        });
    };
})

starter.controller('AlbumsCtrl', function($scope, $http, localStorage) {

  $scope.albums = localStorage.getObject("albums");

  $scope.selectAlbum = function(selectedAlb){
    console.log('album_ ', JSON.parse(selectedAlb));
    document.getElementById('currA').innerHTML = JSON.parse(selectedAlb).name;
    localStorage.setObject("selectedAlbum", selectedAlb);
    window.history.back();
  }

})

starter.controller('PlaylistsCtrl', function($scope, $http, $ionicHistory, $state, localStorage) {

  $ionicHistory.clearHistory();

  $http.get(API_URL + "salamiusers/search").then(function(data) {
    console.log('Success        list       ', JSON.stringify(data.data));
    $scope.playlists = data.data;
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
})

starter.controller('PhotosCtrl', function($scope, $state, $http, localStorage) {
  console.log('album_id___in localStorage___photos '+ localStorage.get('albId'));
  var albumId = localStorage.get('albId');
   $http.get(API_URL + "photos/search?album_id=" + albumId).then(function(data) {
      console.log("__photos__", JSON.stringify(data.data));
      $scope.photos = data.data;
    }, function(err) {
      console.log("__err__", JSON.stringify(err));
    });

})

starter.controller('PlaylistCtrl', function($scope, $stateParams) {
});
