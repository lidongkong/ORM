'use strict';

(function() {

  var app = angular.module('app');

  app.controller('SearchController', function($scope, RepositoryFactory, resolveEntity) {
	  
	$scope.resolveEntity = resolveEntity;
	
	//$scope.filterOptions = { newTest.TestName: ''};

	var deptRepository = new RepositoryFactory({
      endpoint: 'departments',
      retrieveItems: function(data) {
        return data._items;
	  }
    });
	
	var searchRepository = new RepositoryFactory({
      endpoint: 'search',
      retrieveItems: function(data) {
        return data._items;
	  }
    });
	
	var testRepository = new RepositoryFactory({
      endpoint: 'test',
      retrieveItems: function(data) {
        return data._items;
	  }
    });

    /* When the frontend loads, we want the controller to immediately
     load all keyword categories and categories from the API */
    //KeywordCategoriesRepository.readAll().then(function(keywordCategories) {
    //  $scope.keywordCategories = keywordCategories;
     deptRepository.readAll().then(function(dataRows) {
		  
        $scope.departments = dataRows;
		
		$("#gridResult").hide();
     });
    //});
	

    /* The grid */
    $scope.dataRowsGridOptions = {
      data: 'dataRows', // This makes the grid use the data in $scope.dataRows
	  //filterOptions: {filterText: 'w', useExternalFilter: false},
	  showFilter: true,
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
          field: '1',
          displayName: 'Test Name'
        },
		{
          field: '2',
          displayName: 'Barcode',
		  width: '100px'
        },
		{
          field: '3',
          displayName: 'Mnemonic',
		  width: '100px'
        },
		{
          field: '4',
          displayName: 'Is Panel',
		  cellTemplate: '<input type="checkbox" ng-model="row.entity[4]" style="margin-left: 27px;">',
          width: '70px'
        },
		{
          field: '5',
          displayName: 'In Manual',
		  cellTemplate: '<input type="checkbox" ng-model="row.entity[5]" style="margin-left: 30px;">',
          width: '80px'
        },
		{
          /* The keyword category field does not use the build-in cell template, but our own */
          field: '6',
          displayName: 'Department',
          cellTemplate: 'app/search/partials/deptGridCell.html',
          editableCellTemplate: 'app/search/partials/deptGridCellEditor.html'
        },
        {
          /* Same goes for the operations column */
          field: '',
          displayName: 'Operations',
          cellTemplate: 'app/search/partials/operationsGridCell.html',
          enableCellEdit: false,
          sortable: false,
		  width: '90px'
        }
      ]
    };


    /* == Frontend Operations == */

    /* These functions are called when the frontend is operated, e.g., if a button is clicked */

    $scope.testSearch = function(search) {
      //alert(JSON.stringify(search));
	  
	  if(search === undefined || search === null) {
		  alert("please specify search criteria.");
		  return;
	  }
      //if (search.value.length > 0) {
		  
		  
	
          searchRepository.readPartial(search).then(function (dataRows) {
            $scope.dataRows = dataRows;
          });		  

		  
		
		
		  
		$("#gridResult").toggle();
		$("#searchPane").toggle();
		
		
		
		$scope.newTest.TestName = search.testName;
		$scope.newTest.BarcodeID = search.barcode;
		$scope.newTest.Mnemonic = search.mnemonic;
		
		$scope.newTest.isPanel = search.isPanel=='1'? true:false;
		$scope.newTest.isInManual = search.isInManual=='1'? true:false;
		$scope.newTest.deptId = search.deptId;
      //}
    };
	
	$scope.createRow = function(newTest, search) {
		alert( 'createRow test: ' + JSON.stringify(newTest));
		
      $scope.$broadcast('ngGridEventEndCellEdit');
      if (newTest !== null && newTest !== undefined && newTest.BarcodeID != '' && newTest.Mnemonic != '') {
        testRepository.createOne(newTest)
			.then(
				function () {
					
					  var insertSearch = {mnemonic: newTest.Mnemonic};
					  searchRepository.readPartial(insertSearch).then(function (dataRows) {
						$scope.dataRows = dataRows;
						
						$scope.newTest.isPanel = false;
						$scope.newTest.isInManual = false;
						$scope.newTest.TestName = '';
						$scope.newTest.BarcodeID = '';
						$scope.newTest.Mnemonic = '';
						$scope.newTest.deptId = '';
						
						
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
      $scope.$broadcast('ngGridEventEndCellEdit');
      testRepository.updateOneRow(keyword);
    };
	
	$scope.detail = function(keyword) {
      //alert(keyword[0]);
	  window.location.href="#/test/" + keyword[0];
    };	

    $scope.deleteRow = function(keyword) {
      $scope.$broadcast('ngGridEventEndCellEdit');
	    
      testRepository.deleteOne(keyword)
		.then(
			function() {		
			alert(JSON.stringify($scope.search));
				searchRepository.readPartial($scope.search).then(function (dataRows) {
					alert('delete.');
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

	
	

	  //called when key is pressed in textbox
	  $(".quantity").keypress(function (e) {
		 //if the letter is not digit then display error and don't type anything
		 if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
			//display error message
			alert("Digits Only");
				   return false;
		}
	   });

  });

})();