// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js

starter.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }

    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  
  .state('start', {
    url: "/start",
    templateUrl: "templates/start.html",
    controller: 'LoginCtrl'
  })

  .state('loginProfile', {
      url: '/loginProfile',
      templateUrl: 'templates/loginProfile.html',
      controller: 'LoginCtrl'
  })

  .state('loginAlbums', {
      url: '/loginAlbums',
      templateUrl: 'templates/loginAlbums.html',
      controller: 'LoginCtrl'
  })

  .state('chat', {
      url: '/chat',
      templateUrl: 'templates/chat.html',
      controller: 'Messages'
  })

  .state('findlocation', {
    url: "/findlocation",
    templateUrl: "templates/map.html",
    controller: 'MapCtrl'
  })

  .state('loginMap', {
    url: "/loginMap",
    templateUrl: "templates/loginMap.html",
    controller: 'LoginMapCtrl'
  })

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html',
        controller: 'SearchCtrl'
      }
    }
  })

  .state('app.profile', {
      url: '/profile',
      controller: 'AppCtrl',
      views: {
        'menuContent': {
          templateUrl: 'templates/profile.html'
        }
      }
    })

   .state('app.albums', {
      url: '/albums',
      views: {
        'menuContent': {
          templateUrl: 'templates/albums.html',
           controller: 'AlbumsCtrl'
        }
      }
    })

   .state('app.chatList', {
      url: '/chatList',
      views: {
        'menuContent': {
          templateUrl: 'templates/chatList.html',
           controller: 'ChatListCtrl'
        }
      }
    })

   .state('app.map', {
      url: '/map',
      views: {
        'menuContent': {
          templateUrl: 'templates/map.html',
           controller: 'MapCtrl'
        }
      }
    })

    .state('app.photos', {
      url: "/photos",
      views:{
        'menuContent': {
          templateUrl: "templates/photos.html",
          controller: 'PhotosCtrl'
        }
      }
      
    })

    .state('app.userlist', {
      url: '/userlist',
      views: {
        'menuContent': {
          templateUrl: 'templates/userlist.html',
          controller: 'UserlistCtrl'
        }
      }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/start');
});
