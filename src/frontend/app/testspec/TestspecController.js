'use strict';

(function() {

  var app = angular.module('app');

  app.controller('ContpictController', function($scope, RepositoryFactory, resolveEntity) {

    /* == Frontend Initialization == */

	
    /* All of this happens as soon as the page loads */

    /* resolveEntity is a helper function which is used in partials/keywordCategoryGridCell.html
     in order to display the name of a keyword category based on its id */
    $scope.resolveEntity = resolveEntity;

    /* A repository is the connection between this controller and the REST Api.
     We use one for keyword categories... */
    var gridRepository = new RepositoryFactory({
      endpoint: 'contpict',
      retrieveItems: function (data) {
        return data._items;
      }
    });

    /* ...and one for keywords */
    var ContainersRepository = new RepositoryFactory({
      endpoint: 'containers',
      retrieveItems: function(data) {
        return data._items;
      }
    });
	
	/* ...and one for keywords */
    var PicturesRepository = new RepositoryFactory({
      endpoint: 'pictures',
      retrieveItems: function(data) {
        return data._items;
      }
    });

    /* When the frontend loads, we want the controller to immediately
     load all keyword categories and categories from the API */
    gridRepository.readAll().then(function(dataRows) {
      $scope.dataRows = dataRows;
      ContainersRepository.readAll().then(function(containers) {
        $scope.containers = containers;
      });
	  PicturesRepository.readAll().then(function(pictures) {
        $scope.pictures = pictures;
      });
    });

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
          width: '50px'
        },
        {
          /* The keyword category field does not use the build-in cell template, but our own */
          field: '1',
          displayName: 'Container',
          cellTemplate: 'app/contpict/partials/containerGridCell.html',
          editableCellTemplate: 'app/contpict/partials/containerGridCellEditor.html'
        },
		{
          /* The keyword category field does not use the build-in cell template, but our own */
          field: '2',
          displayName: 'Picture',
          cellTemplate: 'app/contpict/partials/pictureGridCell.html',
          editableCellTemplate: 'app/contpict/partials/pictureGridCellEditor.html'
        },
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
		//alert( 'aa: ' + JSON.stringify(newKeyword));
		
      $scope.$broadcast('ngGridEventEndCellEdit');
      if (newKeyword !== null && newKeyword !== undefined) {
        gridRepository.createOne(newKeyword)
			.then(
				function () {

					  gridRepository.readAll().then(function (dataRows) {
						$scope.dataRows = dataRows;
					  });
				},
				function (error) {

					// handle errors here
					alert(error.statusText + ": The record is already in database. Violation of PRIMARY KEY constraint. Cannot insert duplicate key.");
					for (var key in error) {
					  if (p.hasOwnProperty(key)) {
						alert(key + " -> " + p[key]);
					  }
					};
				}			
			);
      }
    };

    $scope.updateRow = function(keyword) {
		alert( 'updateRow: ' + JSON.stringify(keyword));
      $scope.$broadcast('ngGridEventEndCellEdit');
      gridRepository.updateOneRow(keyword);
    };

    $scope.deleteRow = function(keyword) {
      $scope.$broadcast('ngGridEventEndCellEdit');
	    
		//keyword[0] = keyword[2];
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
	
	$scope.stopEditingTagHeading = function() {
      $scope.$broadcast('ngGridEventEndCellEdit');
    };

    $scope.$on('ngGridEventRows', function(newRows) {
      $scope.$broadcast('ngGridEventEndCellEdit');
    });

  });

})();