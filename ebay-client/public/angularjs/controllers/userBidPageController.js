myApp.controller("userBidPageController",['$scope','$http','$state','$stateParams' ,function($scope,$http,$state,$stateParams){

console.log("Hello from bid controller");
console.log("adv "+JSON.stringify($stateParams));
 var user = $stateParams.adv.advertise;
 var userData = $stateParams.adv.user.data.userProfile;
 console.log("user data"+JSON.stringify(userData));
 $scope.adv = user;

 var posted_by =user.posted_by;
 var adv_item =user.itemName;
 var adv_desc =user.description;
 $scope.username=userData.firstname;
 var auction_price =user.auctionPrice;
 var adv_id =user.id;





$scope.bidIt =function()
{
	var  bid_price =$scope.bid.price;
	console.log("===========bid price==============================="+bid_price);

	var data ={"adv_id":adv_id,"posted_by":posted_by,"auction_price":auction_price,"bid_price":bid_price,"adv_item":adv_item,"adv_desc":adv_desc};
	console.log("posting thr bidding data");

$http.post('/bid',data).success(function(res){

console.log("posting thr bidding data");
alert("you have successfully bid the item");
$state.go("userHome");


}).error(function(err){


	console.log(err);
})




	
}

}]);