myApp.controller("userBuyPageController",['$scope','$http','$state','$stateParams','isLoggedIn' ,function($scope,$http,$state,$stateParams,isLoggedIn){


var userData = isLoggedIn.data.userProfile;
$scope.username=userData.firstname;

console.log("Hello from buy page controller");
console.log("Hello from buy page "+JSON.stringify($stateParams)); 

$scope.adv = $stateParams.data.advertise;	

var user = $stateParams.data.user.data.data;

var advertise = $stateParams.data.advertise;


 $scope.totalPrice =advertise.fixedPrice;

  $scope.changedQuantity=function(quantity){

console.log("getting quantity");
 if(isNaN($scope.quantity))
 {
    $scope.totalPrice =advertise.fixedPrice;
 }
else
{
 $scope.totalPrice =(advertise.fixedPrice)*($scope.quantity);
}

}
 $http.post('/getItem',{"item":advertise.id}).success(function(res){

 }).error(function(err){

 })


$scope.getNumber = function(num) {
    	console.log("what is number =="+num);
    	item= [];

    	for (var i=0; i<num;i++)
    	{
    		item.push(i);
    	}
    	console.log(item.length);
    return item;   


}

$scope.addToCart = function ()
{
var quantity = $scope.quantity;

if(quantity=="")
{
    quantity=1;
}
 var data ={"adv":advertise ,"quantity":quantity};
	$scope.goTocart =1;
	$scope.cart =0;

	$http.post('/addToCart',data).success(function(res){


		console.log(JSON.stringify(res));
	})

}

$scope.userLogout= function(){


    $http.post('/logout').success(

        function(res)
        {
            $state.go("home");
        }

        )

    // console.log(auth.logout());
}       


$scope.checkout=function()

{   var quantity = $scope.quantity;

        if(quantity=="")
        {
        quantity=1;
         }

         updatedQuantity = advertise.fixedQuantity -quantity;
	$state.go("creditCard" ,{"data":{"status":"directBuy","item":{"id":advertise.id,"updatedQuantity":updatedQuantity,"boughtQuantity":quantity}}});

}



$scope.showCart= function()
{
    
	$state.go("myCart" );

}


}]);

