(function(app, angular) {
  'use strict';
  var module = angular.module('ngTutorial.services', []);

  module.factory('fooService', function() {
    return 'foo';
  });
  
}(window.app, angular));
