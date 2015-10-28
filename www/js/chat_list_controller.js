starter.controller('ChatListCtrl', function($scope, $state, localStorage, $http) {

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
     console.log("__", JSON.stringify(item));
     var id = JSON.parse(item).id;
    $http.get(API_URL + "salamiusers/" + id).then(function(data) {
      console.log("selectChat__item_user_data", JSON.stringify(data));
      localStorage.setObject("recipient", JSON.stringify(data.data));
      $state.go('chat');
    }, function(err) {
      console.log("__err__", JSON.stringify(err));
    });    
  }
});