myApp.controller("userCartPageController",['$scope','$http','$state','$stateParams','isLoggedIn' ,function($scope,$http,$state,$stateParams,isLoggedIn){

console.log("Hello from cart controller");
var x ;
var userData = isLoggedIn.data.userProfile;
$scope.username=userData.firstname;

$http.get('/showCart').success(function(res){

		if(res=="NoItems")

		{

			$scope.noItems = true;	
		}
		else
		{
			$scope.advertise = res;
			x= res;
			$scope.haveItems =true;
			$scope.noItems = false;	
			getTotalPrice(res);
		}

	}).error(function(err)

	{
		console.log(err);
		//$scope.noItems = true;	
	});

function getTotalPrice (res)
{
	var price = 0;
	console.log("fixedPrice length "+res.length);
	for(var i = 0; i< res.length ;i++)
	{
		price = Number(x[i].fixedPrice)*Number(x[i].quantity) +price;
	}
	$scope.totalPrice =price;
	$scope.totalItems =res.length;
}

$scope.removeItem = function(adv)
{

console.log("id ======>"+adv.id)
 $http.post('/removeCartItem',{"email":userData.email,"id":adv.id}).success(function(res){


console.log(JSON.stringify(res));

showCart();

 }).error(function(err){


 	console.log(err);
 	
 });

}

$scope.checkout = function (){

$state.go("creditCard",{"data":"cart"});


};

$scope.userLogout= function(){


	$http.post('/logout').success(

		function(res)
		{
			$state.go("home");
		}

		)

	// console.log(auth.logout());
}		



function showCart()
{

	$http.get('/showCart').success(function(res){


		if(res=="NoItems")

		{
			console.log(JSON.stringify(res));

			$scope.noItems = true;	
		}
		else
		{
			$scope.advertise = res;
			x= res;
			$scope.haveItems =true;
			$scope.noItems = false;	
			getTotalPrice(res);
		}

	}).error(function(err)

	{

		console.log(err);
	});
}


}]);