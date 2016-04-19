'use strict';

(function() {

  var app = angular.module('app');

  app.factory(
    'RepositoryFactory',
    ['Restangular', '$q', RepositoryFactory]
  );

  function RepositoryFactory(Restangular, $q) {

    Restangular.setBaseUrl('/api/');

    var Repository = function(options) {
      this.endpoint = options.endpoint;
      this.retrieveItems = options.retrieveItems;
    };

    Repository.prototype.readAll = function() {
      var self = this;
      var deferred = $q.defer();
	  
      Restangular.all(self.endpoint + '/').doGET().then(function(data) {
        var items = self.retrieveItems(data);
		
        deferred.resolve(items);
      });
      return deferred.promise;
    };
	
	Repository.prototype.readPartial = function(itemSearch) {
      var self = this;
      var deferred = $q.defer();
	  
	  //alert(JSON.stringify(item));

      Restangular.one(self.endpoint + '/', '').post('', itemSearch).then(function(data) {
        var items = self.retrieveItems(data);
		
        deferred.resolve(items);
      });
      return deferred.promise;
    };
	
	Repository.prototype.readOne = function(id) {
      var self = this;
      var deferred = $q.defer();
	 
      Restangular.one(self.endpoint + '/', id).doGET().then(function(data) {
        var items = self.retrieveItems(data);
		
        deferred.resolve(items);
      });
      return deferred.promise;
    };

    Repository.prototype.createOne = function(newItem) {
      var self = this;
      var deferred = $q.defer();
      Restangular.one(self.endpoint + '/', '').post('', newItem)
		.then(function(response) {
				deferred.resolve(response);
			}, function (response) {
                // the following line rejects the promise 
                deferred.reject(response);
            }
		);
      return deferred.promise;
    };

    Repository.prototype.updateOne = function(item) {
      var self = this;
      var deferred = $q.defer();
      Restangular.one(self.endpoint, item.id).post('', item).then(function(response) {
        deferred.resolve(response);
      });
      return deferred.promise;
    };
	
	Repository.prototype.validateLogin = function(item) {
      var self = this;
      var deferred = $q.defer();
      Restangular.one(self.endpoint + '/', '').post('', item).then(function(response) {

        deferred.resolve(response);
      });
	  
      return deferred.promise;
    };
	
	Repository.prototype.updateOneArray = function(item) {
			
      var self = this;
      var deferred = $q.defer();  
	  var it = {"value": item[1]};
	  
      Restangular.one(self.endpoint, item[0]).post('', it).then(function(response) {
        deferred.resolve(response);
      });
      return deferred.promise;
    };
	
	Repository.prototype.updateOneRow = function(item) {		
		
      var self = this;
      var deferred = $q.defer();  
	  
      Restangular.one(self.endpoint, item[0]).post('', item).then(function(response) {
        deferred.resolve(response);
      });
      return deferred.promise;
    };

    Repository.prototype.deleteOne = function(item) {
      var self = this;
      var deferred = $q.defer();
	  
	  alert(item[0]);
	  
      Restangular.one(self.endpoint, item[0]).remove()
		.then(function(response) {
				deferred.resolve(response);
			}, function (response) {
                // the following line rejects the promise 
                deferred.reject(response);
            }
		);
	  
      return deferred.promise;
    };

    return Repository;

  }

})();