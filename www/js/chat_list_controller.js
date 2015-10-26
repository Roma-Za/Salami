starter.controller('ChatListCtrl', function($scope, $state, localStorage, $http, $interval, $timeout) {

 
  $scope.checkingMail = function(){
    $scope.arrChats = [];
    $scope.users = [];
    $scope.arrIsNew = [];

    $http.get(API_URL + "messages/search?recipient_id=" + $scope.myId).then(function(data) {
      console.log("checkingMail__data__", JSON.stringify(data));

      for (var i = 0; i < data.data.length; i++) {
        if($scope.arrChats.indexOf(data.data[i].sender_id)===-1){
          $scope.arrChats.push(data.data[i].sender_id);
        }

        if(data.data[i].type === "new"){
          $scope.arrIsNew.push(data.data[i].sender_id);
        }
      }

      console.log("arrChats ", JSON.stringify($scope.arrChats));
      console.log("arrIsNew ", JSON.stringify($scope.arrIsNew));

      for (var i = 0; i < $scope.arrChats.length; i++) {
         $http.get(API_URL + "salamiusers/" + $scope.arrChats[i]).then(function(data) {
            console.log('user   ', JSON.stringify(data)); 
            var tempObj = data.data;  

            if($scope.arrIsNew.indexOf($scope.arrChats[i])===-1){
              tempObj.isNew = "New message!";
            }else{
              tempObj.isNew = " ";
            }
                     
            $scope.users.push(tempObj);
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