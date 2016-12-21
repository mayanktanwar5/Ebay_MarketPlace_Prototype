var myApp = angular.module("myApp",["ui.router"]);

myApp.config(function($stateProvider,$urlRouterProvider,$locationProvider){
	//$locationProvider.html5Mode(true).hashPrefix('!');


	$stateProvider.state('signup',{
	url:'/signup',
	templateUrl: "../angularjs/templates/signup.html",
	controller :"signupController",	
	controllerAs:"sinupctrl"	

	}).state('login',{
	url:'/login',
	templateUrl: "../angularjs/templates/login.html",
	controller :"loginController",
	controllerAs:"loginctrl"	

	}).state('home',{
	url:'/',
	templateUrl: "../angularjs/templates/home.html"
	}).state('signupConfirm',
	{
		url:'/signup/ConfirmUser',
		params:{user:null},
		templateUrl:"../angularjs/templates/userWelcome.html",
		controller:"confirmUserController",
		resolve: {
			isLoggedIn: function($http) {

				return $http.get('/userHomePage').success(function(response){

					return response; 
				}).error(function(err){

					console.log(err);
				})
			}

		}

	}).state('userHome' ,{

		url:'/userHomepage',
		templateUrl:"../angularjs/templates/userHomepage.html",
		controller:"userHomeController"	,
		resolve: {
			isLoggedIn: function($http) {

				return $http.get('/userHomePage').success(function(response){

					return response; 
				}).error(function(err){

					console.log(err);
				})
			}


			// isLoggedIn :['auth',function(auth){

			// 	return auth.isLoggedIn();
			// }]

		}

	}).state('createProfile',{

		url:'/createProfile',
		templateUrl:"../angularjs/templates/createProfile.html",
		controller:"createProfileController"
		

	}).state('userHome.sell',{

		url:'/sell',
		templateUrl:"../angularjs/templates/userSellPage.html",
		controller:"userSellPageController"
	   }).state('bid',{

		url:'/bid',
		templateUrl:"../angularjs/templates/bid.html",
		controller:"userBidPageController",
		params:{"adv":null}

		}).state('buy',{

		url:'/buy',
		templateUrl:"../angularjs/templates/buyPage.html",
		controller:"userBuyPageController",
		params:{"data":null},
		resolve: {
			isLoggedIn: function($http) {

				return $http.get('/userHomePage').success(function(response){
					console.log("response =="+response);
					return response; 
				})
			}

		}

		}).state('myCart',{

		url:'/myCart',
		templateUrl:"../angularjs/templates/cart.html",
		controller:"userCartPageController",
		params:{"data":null},
		resolve: {
			isLoggedIn: function($http) {

				return $http.get('/userHomePage').success(function(response){
					console.log("response =="+response);
					return response; 
				})
			}

		}

		}).state('ebayHandle',{

		url:'/myEbay',
		templateUrl:"../angularjs/templates/myebay.html",
		controller:"usermyEbayController",
		params:{"data":null},
		resolve: {
			isLoggedIn: function($http) {

				return $http.get('/userHomePage').success(function(response){
					console.log("response =="+response);
					return response; 
				})
			}

		}

		}).state('checkout',{

		url:'/checkout',
		templateUrl:"../angularjs/templates/checkout.html",
		controller:"userCheckoutPageController",
		params:{"data":null}

		}).state('userHome.userProfile',{

		url:'/myProfile',
		templateUrl:"../angularjs/templates/userprofile.html",
		controller:"userProfileController",
		 parent: 'userHome',
		params:{"data":null},
		resolve: {
			isLoggedIn: function($http) {

				return $http.get('/userHomePage').success(function(response){
					console.log("response =="+response);
					return response; 
				})
			}

		}


		}).state('creditCard',{

		url:'/creditCard',
		templateUrl:"../angularjs/templates/creditCard.html",
		controller:"userCreditCardPageController",
		params:{"data":null},
		resolve: {
			isLoggedIn: function($http) {

				return $http.get('/userHomePage').success(function(response){
					console.log("response =="+response);
					return response; 
				})
			}

		}
		});
		$urlRouterProvider.otherwise('/');

})
