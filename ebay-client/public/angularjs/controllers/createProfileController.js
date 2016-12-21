myApp.controller("createProfileController",['$scope','$http','$state','$stateParams',function($scope,$http,$state,$stateParams){

console.log("Hello from controller Profile creation");


$scope.userCreateProfile = function()
{

console.log("my bday ================>"+$scope.user.bday);

$http.post('/createProfile',$scope.user).success(

	function(res){
		console.log(JSON.stringify(res));
	$state.go("userHome");}
).error(
function(err){
console.log("Error aa gya bhai");
console.log(err)}
)

}



}]);