starter.controller('Messages', function($scope, $timeout, $ionicScrollDelegate, $state, localStorage, $http) {

  $scope.hideTime = true;
  $scope.salami_user = localStorage.getObject('salami_user');
  $scope.recipient = JSON.parse(localStorage.getObject("recipient"));
  $scope.sendMessage = function() {

    var d = new Date();
    d = d.toLocaleTimeString().replace(/:\d+ /, ' ');

    $scope.messages.push({
      userId: $scope.salami_user.id,
      text: $scope.data.message,
      time: d
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


  $scope.data = {};
  $scope.myId = $scope.salami_user.id;
  var t = new Date();
    t = t.toLocaleTimeString().replace(/:\d+ /, ' ');
  $scope.messages = [];

});