'use strict';

(function() {

  var app = angular.module('app');

  app.controller('PictureController', function($scope, RepositoryFactory, resolveEntity) {

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
    var gridRepository = new RepositoryFactory({
      endpoint: 'pictures',		//api/pictures
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
      gridRepository.readAll().then(function(dataRows) {
		  
        $scope.dataRows = dataRows;
      });
    //});
	

    /* The grid */
    $scope.dataRowsGridOptions = {
      data: 'dataRows', // This makes the grid use the data in $scope.dataRows
      enableCellSelection: false, // breaks edit of cells with select element if true
      enableCellEdit: true,
      keepLastSelected: false,
      enableRowSelection: false,
      multiSelect: false,
      enableSorting: true,
      enableColumnResize: true,
      enableColumnReordering: true,
      showFilter: false,
      rowHeight: '35',
      columnDefs: [
        {
          field: '0',
          displayName: 'ID',
          enableCellEdit: false,
          width: '80px'
        },
        {
          field: '1',
          displayName: 'Name'
        },
        {
          field: '2',
          displayName: 'ImageName'
        },
        //{
        //  /* The keyword category field does not use the build-in cell template, but our own */
        //  field: 'keywordCategoryID',
        //  displayName: 'Category',
        //  cellTemplate: 'app/keywords/partials/keywordCategoryGridCell.html',
        //  editableCellTemplate: 'app/keywords/partials/keywordCategoryGridCellEditor.html'
        //},
        {
          /* Same goes for the operations column */
          field: '',
          displayName: 'Operations',
          cellTemplate: 'app/shared/partials/operationsGridCell.html',
          enableCellEdit: false,
          sortable: false,
		  width: '100px'
        }
      ]
    };


    /* == Frontend Operations == */

    /* These functions are called when the frontend is operated, e.g., if a button is clicked */

    $scope.createRow = function(newKeyword) {
      $scope.$broadcast('ngGridEventEndCellEdit');
      if (newKeyword.value.length > 0) {
        gridRepository.createOne(newKeyword).then(function () {
          gridRepository.readAll().then(function (dataRows) {
            $scope.dataRows = dataRows;
          });
        });
      }
    };

    $scope.updateRow = function(keyword) {
      $scope.$broadcast('ngGridEventEndCellEdit');
      gridRepository.updateOneRow(keyword);
    };

    $scope.deleteRow = function(keyword) {
      $scope.$broadcast('ngGridEventEndCellEdit');
	    
      gridRepository.deleteOne(keyword)
		.then(
			function() {		
				gridRepository.readAll().then(function(dataRows) {
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