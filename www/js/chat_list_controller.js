starter.controller('ChatListCtrl', function($scope, $state, localStorage, $http, $ionicPopup) {

  $scope.salami_user = localStorage.getObject('salami_user');
  $scope.myId = $scope.salami_user.id;

  $scope.checkingMail = function(){
    $scope.arrIds = [];
    $scope.conversations = [];
   
    $http.get(API_URL + "salamiusers/conversations?user_id=" + $scope.myId).then(function(data) {
      console.log("checkingMail__data__", JSON.stringify(data));

      for (var i = 0; i < data.data.length; i++) {
        var idx = $scope.arrIds.indexOf(data.data[i].id);
        if(idx===-1){
          $scope.arrIds.push(data.data[i].id);
          $scope.conversations.push(data.data[i]);
        }else{
          var dateAt1 = new Date($scope.conversations[idx].created_at);
          var dateAt2 = new Date(data.data[i].created_at);
          if(dateAt2>dateAt1){
            $scope.conversations[idx] = data.data[i];
          }
        }
      }

      console.log("arrIds ", JSON.stringify($scope.arrIds));
      console.log("conversations ", JSON.stringify($scope.conversations));

    }, function(err) {
      console.log("__err__", JSON.stringify(err));
    });
  }

  $scope.$on('event:push', function(e, data) {
    $scope.checkingMail();
  });

  $scope.$on('$ionicView.enter', function(){
    $scope.checkingMail();
  });

  $scope.selectChat = function(item){
    console.log("__", item);
    var id = JSON.parse(item).id;
    $http.get(API_URL + "salamiusers/" + id).then(function(resp) {
      console.log("selectChat__item_user_data", JSON.stringify(resp));

      $http.get(API_URL + "likes/search?user1_id=" + localStorage.get('myId') + "&user2_id="+ id + "&type=like").then(function(data) {
        console.log('sendMess1 data   ', JSON.stringify(data));
        $http.get(API_URL + "likes/search?user1_id=" + id + "&user2_id="+ localStorage.get('myId') + "&type=like").then(function(data) {
          console.log('sendMess2 data   ', JSON.stringify(data));

          localStorage.setObject("recipient", JSON.stringify(resp.data));
          $state.go('chat');

        }, function(err) {
          console.error('ERR1', err);
          $ionicPopup.alert({
            title: 'info',
            template: "You can not write messages until reciprocity Like."
          }); 
        });
      }, function(err) {
        console.error('ERR1', err);
        $ionicPopup.alert({
          title: 'info',
          template: "You can not write messages until reciprocity Like."
        });
      });

    }, function(err) {
      console.log("__err__", JSON.stringify(err));
    });    
  }
});