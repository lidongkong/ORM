'use strict';

(function() {

  var app = angular.module('app', ['ngRoute', 'ngGrid', 'restangular']);

  
  
  
  app.config(['$routeProvider',
    function($routeProvider) {

      // This makes app/keywords/KeywordsController.js handle the http://localhost:8080/#/ URL
      $routeProvider.
        when('/', {
          templateUrl: 'app/search/partials/editor.html',
          controller: 'SearchController'
        })
		.when('/dept', {     //http://localhost:8083/index.html#/dept   http://localhost:8083/#/dept
          templateUrl: 'app/depts/partials/editor.html',
          controller: 'DeptsController'
        })
		.when('/container', {     //http://localhost:8083/index.html#/container   http://localhost:8083/#/container
          templateUrl: 'app/container/partials/editor.html',
          controller: 'ContainerController'
        })
		.when('/account', {     //http://localhost:8083/index.html#/container   http://localhost:8083/#/container
          templateUrl: 'app/account/partials/editor.html',
          controller: 'AccountController'
        })
		.when('/pict', {     //http://localhost:8083/index.html#/container   http://localhost:8083/#/container
          templateUrl: 'app/picture/partials/editor.html',
          controller: 'PictureController'
        })
		.when('/specimen', {     //http://localhost:8083/index.html#/container   http://localhost:8083/#/container
          templateUrl: 'app/specimen/partials/editor.html',
          controller: 'SpecimenController'
        })
		.when('/misword', {     //http://localhost:8083/index.html#/container   http://localhost:8083/#/container
          templateUrl: 'app/misword/partials/editor.html',
          controller: 'MiswordController'
        })
		.when('/keyword', {     //http://localhost:8083/index.html#/container   http://localhost:8083/#/container
          templateUrl: 'app/keyword/partials/editor.html',
          controller: 'KeywordController'
        })
		.when('/contpict', {     //http://localhost:8083/index.html#/container   http://localhost:8083/#/container
          templateUrl: 'app/contpict/partials/editor.html',
          controller: 'ContpictController'
        })
		.when('/search', {     //http://localhost:8083/index.html#/container   http://localhost:8083/#/container
          templateUrl: 'app/search/partials/editor.html',
          controller: 'SearchController'
        })
		.when('/test/:id', {     //http://localhost:8083/index.html#/container   http://localhost:8083/#/container
          templateUrl: 'app/test/partials/editor.html',
          controller: 'TestController'
        });

    }]);

})();