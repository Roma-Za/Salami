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
Utils.getCollectionType = function(type) {
  if (typeof type !== "string" || type.length === 0) {
    return "unknown";
  } else {
    return type;
  }
};
Utils.getUserDate = function(user, field) {
  switch(field){
    case 'birthday':
      if (typeof user.birthday !== "string" || user.birthday.length === 0) {
        return "unknown";
      } else {
        return user.birthday;
      }
    case 'email':
      if (typeof user.email !== "string" || user.email.length === 0) {
        return "unknown";
      } else {
        return user.email;
      }
    case 'gender':
      if (typeof user.gender !== "string" || user.gender.length === 0) {
        return "unknown";
      } else {
        return user.gender;
      }
    case 'collection_type':
      if (typeof user.collection_type !== "string" || user.collection_type.length === 0) {
        return "unknown";
      } else {
        return user.collection_type;
      }
    case 'description':
      if (typeof user.currentAlb.description !== "string" || user.currentAlb.description.length === 0) {
        return "unknown";
      } else {
        return user.currentAlb.description;
      }
    case 'picture_url':
      if (typeof user.currentAlb.picture.data.url !== "string" || user.currentAlb.picture.data.url.length === 0) {
        return DEFAULT_USER_PICTURE;
      } else {
        return user.currentAlb.picture.data.url;
      }
  }
};