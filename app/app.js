(function(angular) {
  'use strict';
  var app = angular.module('ngTutorial', [
    'ngTutorial.services'
  ]);

  window.app = app;

  app.factory('coordsService', function() {
    let navigator = window.navigator;

    if(navigator.geolocation) {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve(position);
          },
          (arg0) => {
            reject(arg0);
          }
        );
      });
    }

    return null;
  });

  app.factory('geoLookupService', [
    '$http',
    function($http) {
      return function(latitude, longitude) {
        return new Promise((resolve, reject) => {
            $http.get(
              `http://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&sensor=true`
            ).then(
              (response) => {
                resolve(response);
              },
              (response) => {
                reject(response);
              }
            );
        });
      }
    }
  ]);

  app.factory('weatherAPI', function($http) {
    return '';
  });

  app.controller('mainController',
  function($scope, $http, weatherAPI, coordsService, geoLookupService) {

    $scope.coords = {};
    $scope.location = '';

    // check if Geolocation API is available
    if(coordsService) {

      if(window.localStorage.getItem('ngTutorial.lastLocation')) {
          let item;

          try {
             item = JSON.parse(window.localStorage.getItem('ngTutorial.lastLocation'));
          } catch(e) {
            item = null;
          }

          console.log(item);

          $scope.coords = item;
          geoLookupService(item.latitude, item.longitude)
          .then((response) => {
            console.debug(response);
          });
      }

      coordsService.then((position) => {
        console.log(position);
        const positionObj = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };

        $scope.coords = positionObj;
        console.debug(`Getting reverse lookup`);

        geoLookupService(position.coords.latitude, position.coords.longitude)
        .then((response) => {
          console.debug(response);
        });

        // cache location in local storage
        window.localStorage.setItem('ngTutorial.lastLocation', JSON.stringify(positionObj));

      });

    }




  });
}(angular));
