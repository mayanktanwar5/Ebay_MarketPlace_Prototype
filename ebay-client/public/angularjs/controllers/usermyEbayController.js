myApp.controller("usermyEbayController",['$scope','$http','$state','$stateParams','isLoggedIn',
	function($scope,$http,$state,$stateParams,isLoggedIn){

console.log("Hello from userProfile Controller");


var userData = isLoggedIn.data.userProfile;
$scope.username=userData.firstname;




$http.post('/profile').success(function (res) {
	
	if(res =="noData")
	{
	console.log("response "+res);
	$scope.totalItems =0;
	}
	else
	{
		console.log("response "+JSON.stringify(res));
	
	$scope.userSaleData=res.product;

	$scope.totalItems =res.product.length;
	console.log("  length"+res.product.length);
	}

}).error(function (err) {
	

	console.log(err);
});



$http.post('/allBought').success(function (res) {
	
	if(res =="noData")
	{
	console.log("response  all Bought "+res);
	$scope.totalItems =0;
	}
	else
	{
		console.log("response  all Bought ",res);
	
	$scope.userBoughtData=res;

	$scope.totalItemsBought =res.length;
	
	console.log("  length"+res.length);
	}

}).error(function (err) {
	

	console.log(err);
});

$scope.showItems = function(item)
{
if(item=='all')
{
	$scope.allauctions=false;
	$scope.allBuy=false;
	$scope.allsale=true;
	$scope.selectedall='buttonSelected';
	$scope.selectedbuy=false;
	$scope.selectedauc=false;
}
else if(item=="auctions")
{

	$scope.allauctions=true;
	$scope.allBuy=false;
	$scope.allsale=false;
	$scope.selectedauc='buttonSelected';
	$scope.selectedall=false;
	$scope.selectedbuy=false;
	
}
else if(item =='buyItem')
{

	$scope.allauctions=false;
	$scope.allBuy=true;
	$scope.allsale=false;
	$scope.selectedbuy='buttonSelected';
	$scope.selectedall=false;
	$scope.selectedauc=false;
}

}
	

	$scope.toggleShow = function(item)
	{
		if(item=='sold')
		{
			$scope.showSale =true;
			$scope.allbids=false;
			$scope.allitemsbought = false;
			$scope.selectedbought =false;
			$scope.selectedsold='buttonSelected';
			$scope.selectedbid=false;
		}

		else if(item=='bought')
		{
			$scope.showSale =false;
			$scope.allbids=false;
			$scope.allitemsbought = true;
			$scope.selectedbought ='buttonSelected';
			$scope.selectedsold=false;
			$scope.selectedbid=false;

		}
		else if(item=='bid')
		{

			$scope.allbids=true;
			$scope.showSale =false;
			$scope.allitemsbought = false;
			$scope.selectedbought =false;
			$scope.selectedsold=false;
			$scope.selectedbid='buttonSelected';
		}
		


	}


// $scope.addDays=function (date) {
//     var result = new Date(date);
//     var currentDate = new Date();
//     result.setDate(result.getDate() + days);
//     $scope.continuesTill =result;
// }


$http.post('/myBids').success(function(res){

console.log("JSON  "+JSON.stringify(res));
$scope.userAllBids= res;
$scope.totalBids = res.length;
});



	$scope.userLogout= function(){


	$http.post('/logout').success(

		function(res)
		{
			$state.go("home");
		}

		)
		}

	}]);