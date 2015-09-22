function Utils () {}

Utils.checkConnection = function($ionicPopup){
  if (navigator.connection.type.toUpperCase() === "none".toUpperCase()) {
    $ionicPopup.alert({
      title: 'Connection error',
      template: 'No network connection'
    });
    return false;
  }
  return true;
};

Utils.appendTransform = function(defaults, transform) {
  // We can't guarantee that the default transformation is an array
  defaults = angular.isArray(defaults) ? defaults : [defaults];
  // Append the new transformation to the defaults
  return defaults.concat(transform);
};

Utils.getUnknownDeviceId = function() {
  return "unknown" + Math.random().toString(36).substr(2, 10);
};

Utils.getUserPicture = function(user) {
  if (typeof user.picture.data.url !== "string" || user.picture.data.url.length === 0) {
    return DEFAULT_USER_PICTURE;
  } else {
    return user.picture.data.url;
  }
};
