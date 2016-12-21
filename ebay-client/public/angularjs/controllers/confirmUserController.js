myApp.controller("confirmUserController",['$scope','$http','$state','$stateParams','$rootScope'  ,function($scope,$http,$state,$stateParams,$rootScope){

console.log("Hello from controller confirmUserController");
	
  $scope.username=$stateParams.user;

}])