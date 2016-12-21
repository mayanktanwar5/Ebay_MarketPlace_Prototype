myApp.controller("loginController",['$scope','$http','$state','$stateParams' ,function($scope,$http,$state,$stateParams){

console.log("Hello from controller  login");


$scope.userLogin =function(){


$http.post('/login',$scope.user).success( function(res)
{
	
	console.log("what is the response",res.msg);
	console.log("what is the response",res);
	if(res.msg=="404")
	{

		$scope.loginError =true;
		$scope.incorrectPassword = false;
		//$scope.incorrectCredentials = true;
	}

	else if(res.msg=="success")
	{
		console.log("response" +JSON.stringify(res));
		$scope.incorrectCredentials = true;
		$state.go("userHome" );

	}
	else if(res.msg=="IncorrectPassword")
	{
		$scope.incorrectPassword = true;
		//$scope.incorrectCredentials = true;
	}
	else if(res=="Timeout")
	{
		alert("Request Timeout, Please try again ");
	}
	
	
}).error(function(err)
{
		console.log(err);
	
	});
}





}])