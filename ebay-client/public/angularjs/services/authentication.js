myApp.service("auth",['$rootScope','$http','$state',function($rootScope,$http,$state){

	this.logout =function()
	{
		$http.post('/logout').success(

		function(res)
		{
			$state.go("home");
		}

		)
	}

	// this.isLoggedIn = function($http,$q) {
	// 	  var deferred = $q.defer();
	// 	console.log("trying to resolve");
	// 			 $http.get('/userHomePage').success(function(response){
	// 				console.log("returning something"+JSON.stringify(response));
	// 				deferred.resolve(response) ; 
	// 			}).error(function(err){
	// 				console.log("returning erro something"+JSON.stringify(err));
	// 				deferred.resolve(err) ; 
	// 			})
	// 			return deferred.promise;
	// 		}


}]);



