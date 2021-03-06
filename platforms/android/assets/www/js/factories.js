starter.factory('localStorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    }
  }
}]);
starter.factory("transformRequestAsFormPost", function() {               
// I prepare the request data for the form post.
  function transformRequest( data, getHeaders ) {
    var headers = getHeaders();
    headers[ "Content-type" ] = "application/x-www-form-urlencoded; charset=utf-8";
    return( serializeData( data ) );
  }
    // Return the factory value.
  return( transformRequest );
  
  function serializeData( data ) {
      // If this is not an object, defer to native stringification.
    if ( ! angular.isObject( data ) ) {
        return( ( data == null ) ? "" : data.toString() );
    }
    var buffer = [];
    // Serialize each key in the object.
    for ( var name in data ) {
        if ( ! data.hasOwnProperty( name ) ) {
            continue;
        }
        var value = data[ name ];
        buffer.push(encodeURIComponent( name ) + "=" +
          encodeURIComponent( ( value == null ) ? "" : value ));
    }
    // Serialize the buffer and clean it up for transportation.
    var source = buffer.join( "&" ).replace( /%20/g, "+" );
    return( source );
}
});
