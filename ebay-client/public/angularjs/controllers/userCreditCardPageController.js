myApp.controller("userCreditCardPageController",['$scope','$http','$state','$stateParams' ,function($scope,$http,$state,$stateParams){



console.log("Hello fro cart controller");
$scope.showcredit=true;


$scope.numberCheck =function()
{
	var value = $scope.payment.cardNumber;

	if(value!=""){
		var oldvalue = $scope.payment.cardNumber;
		var x =oldvalue+"";
		  if(x.length>16)	
	{ 
		
		$scope.payment.cardNumber =Number(x.substr(0, 16));

	}
	}
}

$scope.bought =function()
{

// $http.post('/bought',)

console.log("stateParams value "+$stateParams.data);

if($stateParams.data == 'cart')
{


console.log("YUp I am clicked");
$http.post('/allCart').success(function(res){




	if(res=="success")
	{

		$scope.success =true;
		$scope.showcredit=false;
	}
}).error(function(err){


	console.log(err);
})
	
}

else if($stateParams.data.status =="directBuy")
{


	$http.post('/buyItem',{"item":$stateParams.data.item}).success(function(res){

	if(res=="success")
	{

		$scope.success =true;
		$scope.showcredit=false;
	}


	}).error(function(err){


		console.log(err);
	});

}
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


$scope.codeCheck =function()
{
	var value = $scope.payment.securityCode;
	if(value!=""){
		var oldvalue = $scope.payment.securityCode;
		var x =oldvalue+"";
		  if(x.length>4)	
	{ 
		$scope.payment.securityCode =Number(x.substr(0, 4));
		
	}
	
	}
}

$scope.expireDate =function()
{
	var value = $scope.expirationDate;
	if(value!=""){
		var oldvalue = $scope.payment.expirationDate;
		var x =oldvalue+"";
		  if(x.length>4)	
	{ 
		$scope.payment.expirationDate =Number(x.substr(0, 4));
		$scope.securityMonth = false;
		$scope.securityYear = false;
	}
		if(Number(x.substr(0,2))>12)
		{
			console.log("Month not correct, Format MMYY "+Number(x.substr(0,2)));
			$scope.securityMonth = true;
		}


		

	}
}



}]);