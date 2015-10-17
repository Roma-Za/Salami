starter.controller('Messages', function($scope, $timeout, $ionicScrollDelegate, $state, localStorage, $http, $interval) {

  $scope.hideTime = false;
  $scope.salami_user = localStorage.getObject('salami_user');
  $scope.recipient = JSON.parse(localStorage.getObject("recipient"));

  $scope.callAtInterval = function(){
    console.log("Interval occurred");
    $scope.recipient = JSON.parse(localStorage.getObject("recipient"));
    if(!$scope.users[$scope.recipient.id]){
      $scope.users[$scope.recipient.id] = [];
    }
    $scope.messages = $scope.users[$scope.recipient.id];
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

        $http({method:'PUT', url: API_URL + "messages/" + data.data[i].id, data: {state: 'read'}})
        .then(function(resp){
          console.log("PUTresponse---" + JSON.stringify(resp));
        }), 
        function(err){
          console.log("PUTerr---" + JSON.stringify(err));
        }
      }
    }, function(err) {
      console.log("__err__", JSON.stringify(err));
    });
    $scope.users[$scope.recipient.id] = $scope.messages;
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
    mes.text = $scope.data.message;
    var y = new Date();
    mes.created_at = y;
    mes.sender_id = $scope.myId;
    mes.recipient_id = $scope.recipient.id;
    mes.state = 'new';
    console.log('mes_____'+ JSON.stringify(mes));

    $http.post(API_URL + "messages", mes).then(function(response) {
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
  $timeout($scope.callAtInterval, 0);
  $interval($scope.callAtInterval, 5000);
  $scope.users = [];
  $scope.users[$scope.recipient.id] = [];
  $scope.data = {};
  $scope.myId = $scope.salami_user.id;
  $scope.messages = [];
  $scope.messages = $scope.users[$scope.recipient.id];
  
});