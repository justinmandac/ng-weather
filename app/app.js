(function(angular) {
  'use strict';
  var app = angular.module('ngTutorial', [
    'ngTutorial.services'
  ]);

  window.app = app;

  app.controller('mainController',
  function($scope, $geoLookupSvc, $weatherSvc, $appData) {

    $scope.location = '';
    $scope.loadingLocation = true;
    $scope.data = {};

    $geoLookupSvc.then((response) => {
      let {coords, address} = response.data;
      console.log(`Acquired lookup`, address, coords);

      $scope.$apply(() => {
        $scope.loadingLocation = false;
        $scope.location = address;
        $appData.address = address;
      });

      console.debug(`Retrieving weather for ${address}`);

       $weatherSvc(coords.latitude, coords.longitude)
       .then((response) => {
          console.log(response);

          $scope.$apply(() => {
            $scope.data = response;
            $appData.currently = response.currently;
            $appData.daily = response.daily;
            $appData.hourly = response.hourly;
          });
       },
       (response) => {
         console.error(response);
      });

    });


  });
}(angular));
