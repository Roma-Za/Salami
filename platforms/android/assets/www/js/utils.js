function Utils () {}

Utils.analyticsLogin = function (user) {
  if (!user) return;
  var fullName = user.first_name + " " + user.last_name;
  var created_at = user.created_at * 1000;

  window.Intercom('boot', {
    app_id: AppSettings.intercomApiKey,
    name: fullName,
    email: user.email,
    created_at: created_at
  });
};

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
