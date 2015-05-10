(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

angular.module('rimaDirectives', ['Config'])
	.directive('rimaWhats', ['$rootScope', 'WhatAmIService', 'WhatService',
		function($rootScope, WhatAmIService, WhatService){
		console.log("[rimaWhats] loading directive");
		return {
			restrict: 'AE',
			scope: {
				'readonly': '=',
				'node': "="
			},
			// ng-if directive: http://docs.angularjs.org/api/ng.directive:ngIf
			// expression: http://docs.angularjs.org/guide/expression
			templateUrl: '../components/rima/partials/rima-whats.tpl.html',
			controller: function ( $scope, $element) {
				$scope.bindings = {
					viewspec: 'viewspec_manual'
				};

				// $scope.items = WhatService.getWhats();
				$scope.items = ($scope.node && $scope.node.kNode.dataContent && $scope.node.kNode.dataContent.rima
					&& $scope.node.kNode.dataContent.rima.whats) ? $scope.node.kNode.dataContent.rima.whats : [];

				$scope.$watch("node", function(newVal, oldVal){
				    console.log('node changed');
					$scope.items = ($scope.node && $scope.node.kNode.dataContent && $scope.node.kNode.dataContent.rima
						&& $scope.node.kNode.dataContent.rima.whats) ? $scope.node.kNode.dataContent.rima.whats : [];
				}, false);


				$scope.getItems = function(value){
					var items = WhatAmIService.getByNameContains(value);
					// return items;
					return items.$promise;
					// return items.$promise.then(function(items_server){
					// 	console.log("getItems: ", JSON.stringify(items_server));
					// 	// return WhatService.getWhats();
					// 	return items_server;
					// });
				};

				$scope.enterPressed = function(value){
					console.log("Enter pressed. value: %s", value);
					$scope.addNewWhat(value);
				};

				$scope.addClicked = function(value){
					console.log("Add clicked. value: %s", value);
					$scope.addNewWhat(value);
				};

				$scope.addNewWhat = function(what){
					// not clicked on any item, but just type a string
					if(!$scope.node){
						console.log("Node is not selected");
						return;
					}
					var kNode = $scope.node.kNode;
					console.log("Adding new what to the node: %s", kNode._id);
					if(!kNode.dataContent) kNode.dataContent = {};
					if(!kNode.dataContent.rima) kNode.dataContent.rima = {};
					if(!kNode.dataContent.rima.whats){
						kNode.dataContent.rima.whats = [];
						// create binding in the case of creating a new list
						$scope.items = kNode.dataContent.rima.whats;
					}
					var newWhat = null;
					if(typeof what === 'string'){
						newWhat = new knalledge.WhatAmI();
						newWhat.name = what;
					}else{
						newWhat = what;
					}
					// TODO: it should be just _id;
					kNode.dataContent.rima.whats.push(newWhat);
					$scope.asyncSelected = "";
					var changeKnalledgeRimaEventName = "changeKnalledgeRimaEvent";
					$rootScope.$broadcast(changeKnalledgeRimaEventName, $scope.node);
				};

				$scope.newItemSelected = function($item, $model, $label){
					console.log("newItemSelected: $item: %s, $model: %s, $label: %s", JSON.stringify($item), JSON.stringify($model), JSON.stringify($label));
				};

				$scope.itemSelect = function(item){
					console.log("itemSelect: %s", item.name);
				};

				$scope.itemRemove = function(item){
					console.log("itemRemove: %s", item.name);
				};
			}
    	};
	}])

	.directive('rimaHows', ["$rootScope", "$timeout", "$location", "RimaService",
		function($rootScope, $timeout, $location, RimaService){
		console.log("[rimaHows] loading directive");
		return {
			restrict: 'AE',
			scope: {
			},
			// ng-if directive: http://docs.angularjs.org/api/ng.directive:ngIf
			// expression: http://docs.angularjs.org/guide/expression
			templateUrl: '../components/rima/partials/rima-hows.tpl.html',
			controller: function ( $scope, $element) {
				var init = function(){
					$scope.items = RimaService.getUsersHows(RimaService.getActiveUserId());
			    	//$scope.selectedItem = RimaService.getActiveUser();
				}
				$scope.items = null;
				$scope.selectedItem = null;

				//html-select:
				$scope.hows = RimaService.getHows();
				$scope.selectedHowOption= {id:1};

				$scope.createHow = function(){
					var how = new knalledge.HowAmI();
					how.whoAmI = RimaService.getActiveUserId();
					var selectedHow = RimaService.getHowForId($scope.selectedHowOption);
					how.how = selectedHow.title;
					how.whatAmI = $scope.whatInput; //TODO:
					RimaService.createHowAmI(how);
				}
				 //TODO: select from map.dataContent.mcm.authors list
				//RimaService.loadUsersFromList().$promise.then(init); //TODO: change to load from MAP
				init();
				$scope.selectItem = function(item) {
				    $scope.selectedItem = item;
				    console.log("$scope.selectedItem = " + $scope.selectedItem.displayName + ": " + $scope.selectedItem._id);
				};
				$scope.whatChanged = function(item) {
					
				}
    		}
    	};
	}])

	.directive('rimaWhat', ['$rootScope', 'RimaService',
		function($rootScope, RimaService){
		console.log("[rimaWhats] loading directive");
		return {
			restrict: 'AE',
			scope: {
				'readonly': '=',
				'item': '=',
				'itemSelect': '&',
				'itemRemove': '&'
			},
			// ng-if directive: http://docs.angularjs.org/api/ng.directive:ngIf
			// expression: http://docs.angularjs.org/guide/expression
			templateUrl: '../components/rima/partials/rima-what.tpl.html',
			controller: function ( $scope, $element) {
				$scope.bindings = {
				};

				$scope.select = function(){
					$scope.itemSelect();
				};

				$scope.remove = function(){
					$scope.itemRemove();
				};
			}
    	};
	}]);

}()); // end of 'use strict';
