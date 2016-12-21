myApp.controller("userSellPageController",['$scope','$http','$state','$stateParams',
	function($scope,$http,$state,$stateParams){

$scope.$parent.childShow=true;
console.log("Hello from  userSellPageController Controller " );


$scope.toggle = function(chck)
{

if(chck =="auction")
{

$scope.showauction=1;
$scope.showFixed =0;
$scope.classAuction ="buttonSelected";
$scope.classFixed="";
}
else if(chck == "fixed" )
{

	$scope.showFixed =1;
	$scope.showauction=0;
	$scope.classAuction="";
	$scope.classFixed = "buttonSelected";
}

}

$scope.goHome=function(){

console.log("goHOme is cleicked");
$scope.$parent.childShow=false;
	$state.go('^',{},{reload:true});
}


$scope.advertise = function()
{
console.log("category selected :"+$scope.sell.category);
$http.post('/sell',$scope.sell).success(

	function(res){
	//console.log(" response after advertisement "+JSON.stringify(res));
	
	if(res.msg=="success")
	{

		$scope.success = true;
	}
}
).error(
function(err){
console.log("Error aa gya bhai");
console.log(err)}
)

}


}]);