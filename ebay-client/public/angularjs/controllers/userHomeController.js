myApp.controller("userHomeController",['$scope','$http','$state','$stateParams' ,'isLoggedIn' ,'auth', function($scope,$http,$state,$stateParams,isLoggedIn,auth ){

$scope.showLoggedIn=true;
console.log("data ",JSON.stringify(isLoggedIn));
 var userData = isLoggedIn.data;
 $scope.username=userData.userProfile.firstname;
// $scope.useremail=userData.userProfile.email;
 $scope.lastloggedin= userData.lastLoggedIn;
 $scope.atHome = true;


$http.post('/alladvertise').success(function(res){

console.log("getting all the advertisements");

$scope.advertisement= res;
var x =res[0].posted_date;

dt = new Date (res[0].posted_date);
var d= new Date();
}).error(function(err){

	console.log("getting the error"+err);
});

$scope.currentDate = function()
{
	return new Date();
}


$scope.checkWon =function(adv)
{

	if(adv.auctionPrice)
	{

		if(adv.bid_price)
		{
			return false;
		}
		else
		{
			return true;
		}

	}

}


$scope.buyItem = function (adv)
{

$state.go("buy",{"data":{'advertise':adv,'user':isLoggedIn }});


} 

$scope.bidPrice =function(adv)
{

console.log("all the bids items "+JSON.stringify(adv));
var bid_price =$scope.bid;
console.log(" bid price"+JSON.stringify(adv));
$state.go("bid",{"adv":{'advertise':adv,'user':isLoggedIn ,'bid_price':bid_price}});

}

$scope.goToCart = function(){

	$state.go("myCart");
}

$scope.userLogout= function(){

	auth.logout();	

}		

}]);


