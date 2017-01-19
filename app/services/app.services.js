(function(app, angular) {
  'use strict';
  let module = angular.module('ngTutorial.services', []);



  module.factory('$coordSvc', [
    '$http',
    function($http) {
      let navigator = window.navigator;

      return new Promise((resolve, reject) => {
        if(navigator) {
          console.debug(`Getting coordinates`);

          navigator.geolocation
          .getCurrentPosition(
              position => resolve(position),
              error =>   reject(error)
          );
        } else {
          console.error(`Geolocation not supported.`);
          reject();
        }
      });

    }
  ]);

  module.factory('$geoLookupSvc', [
    '$http',
    '$coordSvc',
    function($http, $coords) {
      ;

      return new Promise((resolve, reject) => {
        $coords.then((position) => {
          let coords = position.coords;
          const latitude = coords.latitude;
          const longitude = coords.longitude;
          const url =   `http://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&sensor=true`;

          console.debug(`Acquired coordinates: ${latitude}, ${longitude}`);
          console.debug(`Getting reverse location lookup`);

          $http.get(url).then(
            (response) => {
              let data = {
                status: 0,
                data: {
                  coords,
                  address: response.data.results[2].formatted_address
                }
              };
              resolve(data);
            },
            (response) => {
              let data = {
                status: 1,
                data: response
              };
              reject(data);
            }
          );
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        });
      });
    }
  ]);

  module.factory('$weatherSvc', [
    '$http',
    function($http) {
      const DARK_SKY_KEY = `ca4ba6ff8a0484c29e41a7b3b20e69cd`;

      return function weatherSvcPromiseHandler(latitude, longitude) {
        return new Promise((resolve, reject) => {
          const url = `http://localhost:8888/weather?latlng=${latitude},${longitude}&units=si`;
          $http
          .get(url)
          .then(
                 response => resolve(response.data),
                 response => reject(response)
          )
          .catch(err => reject(err));
        });
      }
    }
  ]);

  module.factory(`$appData`, function() {
    return {
      address: '',
      currently: {},
      hourly: {},
      daily: {}
    };
  });


}(window.app, angular));
