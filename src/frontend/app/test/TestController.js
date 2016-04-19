'use strict';

(function() {

  var app = angular.module('app');

  app.controller('TestController', function($scope, RepositoryFactory, resolveEntity) {

	var containersRepository = new RepositoryFactory({
      endpoint: 'containers',
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
	
	var keywordRepository = new RepositoryFactory({
      endpoint: 'keyword',
      retrieveItems: function(data) {
        return data._items;
	  }
    });
	
	var specimenRepository = new RepositoryFactory({
      endpoint: 'specimen',
      retrieveItems: function(data) {
        return data._items;
	  }
    });
	
	var panelRepository = new RepositoryFactory({
      endpoint: 'panel',
      retrieveItems: function(data) {
        return data._items;
	  }
    });
	
	var specialtyRepository = new RepositoryFactory({
      endpoint: 'specialty',
      retrieveItems: function(data) {
        return data._items;
	  }
    });
	
	
	var id = location.hash.lastIndexOf('/');
	id = location.hash.slice(id+1);

    /* When the frontend loads, we want the controller to immediately
     load all keyword categories and categories from the API */
    //KeywordCategoriesRepository.readAll().then(function(keywordCategories) {
    //  $scope.keywordCategories = keywordCategories;
     containersRepository.readAll().then(function(dataRows) {
		  
        $scope.containers = dataRows;
		
		$scope.transportTemps = [['Frozen', 'Frozen'], ['Refrigerated','Refrigerated'], ['Room Temperature','Room Temperature']];
     });
	 
	 keywordRepository.readOne(id).then(function(dataRows) {

        //$scope.keywords = dataRows;		
        $('#keywordSel').DualListBox( null, dataRows );
     });
	 
	 specimenRepository.readOne(id).then(function(dataRows) {

        $('#specimenSel').DualListBox( null, dataRows );
     });
	 
	 panelRepository.readOne(id).then(function(dataRows) {
		  	
        $('#panelSel').DualListBox( null, dataRows );
     });
	 
	 specialtyRepository.readOne(id).then(function(dataRows) {
		  	
        $('#specialtySel').DualListBox( null, dataRows );
     });
    //});
	

	testRepository.readOne(id).then(function(dataRow) {
		  
        $scope.test = dataRow;
		
		//alert(dataRow[0]);
		
		$scope.test.barcode = dataRow[0][2];
		$scope.test.mnemonic = dataRow[0][3];
		$scope.test.reviewed = dataRow[0][4];
		$scope.test.testName = dataRow[0][1];
		$scope.test.lisName = dataRow[0][5];
		$scope.test.alterName = (dataRow[0][6] === undefined || dataRow[0][6] === null)? '':dataRow[0][6];
		$scope.test.containerId = dataRow[0][7];
		
		$scope.test.transportTemp = dataRow[0][11];
		$scope.test.prefSpecimen = dataRow[0][12];
		$scope.test.minimumVolue = dataRow[0][13];
		$scope.test.monday = dataRow[0][14];
		$scope.test.tuesday = dataRow[0][15];
		$scope.test.wednesday = dataRow[0][16];
		$scope.test.thursday = dataRow[0][17];
		$scope.test.friday = dataRow[0][18];	
		$scope.test.saturday = dataRow[0][19];
		$scope.test.sunday = dataRow[0][20];
		$scope.test.reported = dataRow[0][21];
		$scope.test.roomStab = dataRow[0][22];
		$scope.test.refridgeStab = dataRow[0][23];	
		$scope.test.frozenStab = dataRow[0][24];
		
		$scope.test.collectNotes = dataRow[0][25];
		$scope.test.alsoAcceptable = dataRow[0][26];
		$scope.test.methodology = dataRow[0][27];
		$scope.test.referenceRange = dataRow[0][28];
		$scope.test.addendum = dataRow[0][29];
				
		$scope.test.CPT = dataRow[0][30];
		$scope.test.LOINC = dataRow[0][31];
		$scope.test.extraNotes = dataRow[0][32];
		
        $scope.test.isPanel = dataRow[0][8];
     });


    /* == Frontend Operations == */

    /* These functions are called when the frontend is operated, e.g., if a button is clicked */

	
	$scope.createRow = function(newTest, search) {
		//alert( 'createRow test: ' + JSON.stringify(newTest));
		
      $scope.$broadcast('ngGridEventEndCellEdit');
      if (newTest !== null && newTest !== undefined && newTest.BarcodeID != '' && newTest.Mnemonic != '') {
        testRepository.createOne(newTest)
			.then(
				function () {

					  gridRepository.readPartial(search).then(function (dataRows) {
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

    $scope.deleteRow = function(keyword) {
      $scope.$broadcast('ngGridEventEndCellEdit');
	    
      testRepository.deleteOne(keyword)
		.then(
			function() {		
			alert(JSON.stringify($scope.search));
				gridRepository.readPartial($scope.search).then(function (dataRows) {
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

  });

})();