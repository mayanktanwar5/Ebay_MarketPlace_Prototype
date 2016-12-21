myApp.controller("signupController",['$scope','$http','$state','$stateParams' ,function($scope,$http,$state,$stateParams){

console.log("Hello from controller signup");

$scope.passwordType="password";
$scope.pwdMsg="Show";
$scope.emailTaken= false;

$scope.hideShow =function()
{

	if($scope.passwordType=="text")
	{
		$scope.passwordType="password";
        $scope.pwdMsg="Show";
	}
	else
	{

		$scope.passwordType="text";
		$scope.pwdMsg="Hide";
	}
}

$scope.userRegister = function()

{

	$http.post('/signup',$scope.user).success( function(res)
{
	console.log("user  ====" +$scope.user);
	console.log("response " +JSON.stringify(res));

	if(res.code=="ER_DUP_ENTRY")
	{
		$scope.emailTaken= true;

	}
	else
	{

		$scope.emailTaken= false;
		$state.go('signupConfirm',{user:$scope.user.firstname});
	}
	

	
}).error(function(err)
{

	console.log("error "+err);
	if(err =="Unauthorized")
	{
		$scope.emailTaken = true;
	}
})
};


$scope.checkCount = function()
{
	

	var value = $scope.user.mobile;
	if(value!=""){
		var oldvalue = $scope.user.mobile;
		var x =oldvalue+"";
		  if(x.length>10)	
	{ 
		$scope.user.mobile =x.substr(0, 10);
	}
	}
	
}



}])