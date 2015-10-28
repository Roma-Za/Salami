starter.controller('Messages', function($scope, $ionicScrollDelegate, $state, localStorage, $http, $ionicPopup, $timeout, $rootScope) {

  $scope.hideTime = false;
  $scope.salami_user = localStorage.getObject('salami_user');
 

  $scope.receiveNewMessage = function(){
    console.log("receiveNewMessage");
    $http.get(API_URL + "messages/search?sender_id=" + $scope.recipient.id + "&recipient_id=" + $scope.myId + "&state=new").then(function(data) {
      console.log("__data__", JSON.stringify(data));

      for (var i = 0; i < data.data.length; i++) {
        var dateAt = new Date(data.data[i].created_at);
        time = dateAt.toLocaleString('en-US', DATE_TIME_OPTS);

        $scope.messages.push({
          userId: $scope.recipient.id,
          text: data.data[i].text,
          time: time
        });

        $ionicScrollDelegate.scrollBottom(true);
        if(data.data[i].state == 'new' && data.data[i].recipient_id == $scope.myId){
          $http({method:'PUT', url: API_URL + "messages/" + data.data[i].id, data: {state: 'read'}})
          .then(function(resp){
            console.log("PUTresponse---" + JSON.stringify(resp));
          }), 
          function(err){
            console.log("PUTerr---" + JSON.stringify(err));
          }
        }
      }
    }, function(err) {
      console.log("__err__", JSON.stringify(err));
    });
  }

  $scope.sendMessage = function() {

    var dateAt = new Date();
    time = dateAt.toLocaleString('en-US', DATE_TIME_OPTS);

    $scope.messages.push({
      userId: $scope.salami_user.id,
      text: $scope.data.message,
      time: time
    });

    var mes = {};
    mes.message = $scope.data.message;
    mes.sender_id = $scope.myId;
    mes.recipient_id = $scope.recipient.id;
    
    $http.post(API_URL + "messages/send", mes).then(function(response) {
      console.log("response-mes--" + JSON.stringify(response));
      }, function(response) {
        console.log("err-" + JSON.stringify(response));
      });

    delete $scope.data.message;
    $ionicScrollDelegate.scrollBottom(true);
  };


  $scope.inputUp = function() {
    $timeout(function() {
      $ionicScrollDelegate.scrollBottom(true);
    }, 300);

  };

  $scope.inputDown = function() {
    $ionicScrollDelegate.resize();
  };

  $scope.closeKeyboard = function() {
    cordova.plugins.Keyboard.close();
  };

  $scope.loadHistory = function(){
    $http.get(API_URL + "messages/history?user_id=" + $scope.recipient.id + "&buddy_id=" + $scope.myId).then(function(data) {
     
      for (var i = 0; i < data.data.length; i++) {
        var dateAt = new Date(data.data[i].created_at);
        time = dateAt.toLocaleString('en-US', DATE_TIME_OPTS);

        $scope.messages.push({
          userId: data.data[i].sender_id,
          text: data.data[i].text,
          time: time
        });
        if(data.data[i].state == 'new' && data.data[i].recipient_id == $scope.myId){
          $http({method:'PUT', url: API_URL + "messages/" + data.data[i].id, data: {state: 'read'}}).then(function(resp){
            console.log("PUTresponse---" + JSON.stringify(resp));
          }), 
          function(err){
            console.log("PUTerr---" + JSON.stringify(err));
          }
        }
      }
      $ionicScrollDelegate.scrollBottom(true);
    }, function(err) {
      console.log("__err__", JSON.stringify(err));
    });
  }

  $scope.$on('$ionicView.enter', function(){

    $scope.recipient = JSON.parse(localStorage.getObject("recipient"));
    $scope.data = {};
    $scope.myId = $scope.salami_user.id;
    $scope.messages = [];

    $scope.$on('event:push', function(e, data) {
      if(data.payload.sender === $scope.recipient.facebook_id){
        console.log("push data", JSON.stringify(data));
        $scope.receiveNewMessage();
      }
    });

    $scope.loadHistory();

  });
});