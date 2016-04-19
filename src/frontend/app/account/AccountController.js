'use strict';

(function() {

  var app = angular.module('app');

  app.controller('AccountController', function($scope, RepositoryFactory, resolveEntity) {

    /* == Frontend Initialization == */

    /* All of this happens as soon as the page loads */

    /* A repository is the connection between this controller and the REST Api.
     We use one for keyword categories... */
    //var KeywordCategoriesRepository = new RepositoryFactory({
    //  endpoint: 'keywords/categories',
    //  retrieveItems: function (data) {
    //    return data._items;
    //  }
    //});

    /* ...and one for keywords */
    var userRepository = new RepositoryFactory({
      endpoint: 'account',
      retrieveItems: function(data) {
        return data._items;
		//return [{"id":1,"value":"AubergineZZZ","categoryID":1},{"id":2,"value":"Onion","categoryID":1},{"id":3,"value":"Knife","categoryID":2},{"id":4,"value":"wewewe","categoryID":1},{"id":5,"value":"Onion1","categoryID":1},{"id":6,"value":"Onion2","categoryID":1}];
        //return [[1,"Chemistry"],[2,"Cytology"],[3,"Hematology"],[4,"Histology"],[5,"Reference"],[6,"Toxicology"],[7,"Blood Bank"],[8,"Flow Cytometry"],[10,"Microbiology"],[11,"Molecular"]];
	  }
    });

    /* When the frontend loads, we want the controller to immediately
     load all keyword categories and categories from the API */
    //KeywordCategoriesRepository.readAll().then(function(keywordCategories) {
    //  $scope.keywordCategories = keywordCategories;
      userRepository.readAll().then(function(dataRows) {
		  
        $scope.dataRows = dataRows;
      });
    //});
	

    /* == Frontend Operations == */

    /* These functions are called when the frontend is operated, e.g., if a button is clicked */

	$scope.validateUser = function(account) {

      $scope.$broadcast('ngGridEventEndCellEdit');
	  
	  
      if (account.Username.length > 0) {
        userRepository.validateLogin(account).then(function ( data) {

		  if (data._items.ValidToken)
		  {
			window.location.href = '/#/search';
			
			$("#acmLogout").show();
			$("#acmSearch").show();
			$("#acmMenu").show();
		  }
		  else{
			  //alert("Invalid user name or password. Please try again.")
			  $('.errorMsg').css({"display":"block"});
		  }
        });
		
      }
    };
	
    $scope.createRow = function(newKeyword) {
      $scope.$broadcast('ngGridEventEndCellEdit');
      if (newKeyword.value.length > 0) {
        userRepository.createOne(newKeyword).then(function () {
          userRepository.readAll().then(function (dataRows) {
            $scope.dataRows = dataRows;
          });
        });
      }
    };

    $scope.updateRow = function(keyword) {
      $scope.$broadcast('ngGridEventEndCellEdit');
      userRepository.updateOneArray(keyword);
    };

    $scope.deleteRow = function(keyword) {
      $scope.$broadcast('ngGridEventEndCellEdit');
	    
      userRepository.deleteOne(keyword)
		.then(
			function() {		
				userRepository.readAll().then(function(dataRows) {
				  $scope.dataRows = dataRows;
				});
			},
			function (error) {
                // handle errors here
                alert(error.statusText + ": The record is in use. The DELETE statement conflicted with the REFERENCE constraint.");
				for (var key in error) {
				  if (p.hasOwnProperty(key)) {
					alert(key + " -> " + p[key]);
				  }
				};
            }
	    );
    };

    /* These are here to make the grid behave cleanly in regards to the keyword category select */
    $scope.stopEditingKeywordCategory = function() {
      $scope.$broadcast('ngGridEventEndCellEdit');
    };

    $scope.$on('ngGridEventRows', function(newRows) {
      $scope.$broadcast('ngGridEventEndCellEdit');
    });

  });

})();