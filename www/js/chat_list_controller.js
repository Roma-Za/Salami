starter.controller('ChatListCtrl', function($scope, $state, localStorage, $http, $interval, $timeout) {

 
  $scope.checkingMail = function(){
    $scope.newMess = [];
    $scope.users = [];

    $http.get(API_URL + "messages/search?&recipient_id=" + $scope.myId + "&state=new").then(function(data) {
      console.log("checkingMail__data__", JSON.stringify(data));

      for (var i = 0; i < data.data.length; i++) {
        if($scope.newMess.indexOf(data.data[i].sender_id)===-1){
          $scope.newMess.push(data.data[i].sender_id);
        }
      }

      console.log("newMess", JSON.stringify($scope.newMess));

      for (var i = 0; i < $scope.newMess.length; i++) {
         $http.get(API_URL + "salamiusers/" + $scope.newMess[i]).then(function(data) {
            console.log('user   ', JSON.stringify(data));            
              $scope.users.push(data.data);
          }, function(err) {
            console.error('ERR', err);
          });
      }

    }, function(err) {
      console.log("__err__", JSON.stringify(err));
    });

  }

  $scope.selectChat = function(item){
    localStorage.setObject("recipient", item);
    $state.go('chat');
  }
  $scope.salami_user = localStorage.getObject('salami_user');
  $scope.myId = $scope.salami_user.id;
  $interval($scope.checkingMail, 60000);
  $timeout($scope.checkingMail, 0);
});