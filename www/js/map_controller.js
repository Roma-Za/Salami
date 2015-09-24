starter.controller('MapCtrl',
function($scope, $ionicPopup) {
  /*
  $scope.user = localStorage.getObject('user');
  $scope.trainers = [];
  $scope.gmapsMarkers = [];
*/
  $scope.centerOnMe = function () {
    if (!$scope.map) {
      return;
    }

    navigator.geolocation.getCurrentPosition(function (pos) {
      
      var tempUser = JSON.parse(window.localStorage.getItem("user"));
      tempUser.location = pos.coords;
      document.getElementById('status').innerHTML = JSON.stringify(tempUser.location);
      window.localStorage.removeItem("user");
      window.localStorage.setItem("user", JSON.stringify(tempUser));
      console.log("user____________locale________________ " + window.localStorage.getItem("user"));
      
      var location = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
      $scope.map.setCenter(location);
      $scope.map.setZoom(12);
      GeoMarker = new GeolocationMarker();
      GeoMarker.setCircleOptions({visible: false});
      var circle = new google.maps.Circle({
        strokeColor: '#0000FF',
        strokeOpacity: 0.4,
        strokeWeight: 1,
        fillColor: '#0000FF',
        fillOpacity: 0.35,
        map: $scope.map,
        center: location,
        radius: (1609.344 * 2)
      });
      GeoMarker.setMap($scope.map);
    }, function (error) {
      console.log("location error: " + JSON.stringify(error));
      $ionicPopup.alert( {
        title: 'Unable to get location',
        template: 'Please make sure Location Service is switched on'
      });
    }, { enableHighAccuracy: true, timeout:100000, maximumAge: 3600000 });
  };
/*
  // Sets the map on all markers in the array.
  $scope.setAllMap = function(map) {
    for (var i = 0; i < $scope.gmapsMarkers.length; i++) {
      $scope.gmapsMarkers[i].setMap(map);
    }
  };

  // Shows any markers currently in the array.
  $scope.showMarkers = function() {
    $scope.setAllMap($scope.map);
  };

  // Deletes all markers in the array by removing references to them.
  $scope.deleteMarkers = function() {
    $scope.setAllMap(null);
  };

  $scope.updateMarkers = function() {
    if ($scope.map && $scope.trainers) {
      $scope.deleteMarkers();
      $scope.gmapsMarkers = [];
      for (var i = 0; i < $scope.trainers.length; i++) {
        var trainer = $scope.trainers[i];
        var loc = new google.maps.LatLng(trainer.latitude, trainer.longitude);
        var marker = new google.maps.Marker({ position: loc, map: $scope.map, model: trainer });
        //console.log("map: make marker for " + trainer.name);
        google.maps.event.addListener(marker, 'click', function() {
          if ($scope.infoBubble) {
            google.maps.event.removeListener($scope.bubbleClickListener);
            $scope.infoBubble.close();
          }
          var trainer = this.model;
          $scope.infoBubble = new InfoBubble({
            map: $scope.map,
            content: '<div class="phoneytext popup" data-trainerid=' + trainer.id + ' style="color:#ffffff; text-align:center">' + trainer.first_name + " " + trainer.last_name + '</div>',
            position: new google.maps.LatLng(trainer.latitude, trainer.longitude),
            shadowStyle: 1,
            padding: 10,
            backgroundColor: 'rgba(98,105,148,0.9)',
            borderRadius: 5,
            arrowSize: 10,
            borderWidth: 1,
            borderColor: '#393e61',
            minHeight: 45,
            minWidth: 100,
            disableAutoPan: true,
            hideCloseButton: true,
            arrowPosition: 50,
            backgroundClassName: 'phoney',
            arrowStyle: 0
          });
          google.maps.event.addListenerOnce($scope.infoBubble, 'domready', function(){
            $scope.bubbleClickListener = google.maps.event.addDomListener($scope.infoBubble.bubble_, 'click', function(){
              var trainerId = this.getElementsByClassName("popup")[0].dataset.trainerid;
              $scope.showTrainerProfile(trainerId);
            });
          });
          $scope.infoBubble.open($scope.map, this);
        });
        $scope.gmapsMarkers.push(marker);
      }
      $scope.showMarkers();
    }
  };
*/
  $scope.mapCreated = function(map) {
    $scope.map = map;
    $scope.centerOnMe();
  };

});
