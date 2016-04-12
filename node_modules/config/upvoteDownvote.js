var requests = require('config/requests');
var models = require('config/models');


exports.upvote = function(phone_number,report_id,callback) {

	var checked = 0;
	var delet = 0;

	models.User.find({phone_number : phone_number},function(error, users){

		//Checking if report id upvoted before?
		for (var i = users[0].upvoted_posts.length - 1; i >= 0; i--) {
			if(users[0].upvoted_posts[i] == report_id){
				callback({'response' : "Can only upvote once"});
				console.log({'response' : "Can only upvote once"});
				checked = 1;
			}
		}

		//deleting id of downvoted report
		for (var i = users[0].downvoted_posts.length - 1; i >= 0; i--) {
			if(users[0].downvoted_posts[i] == report_id){
				users[0].downvoted_posts.splice(i, 1);
				delet = 1;
			}
		}
    

		if(checked == 0){

			//report got upvoted
			models.Report.find({_id:report_id},function(error, reports){
			if(delet == 1){
				var b = reports[0].downvotes;
				reports[0].downvotes=b-1;
			}
			var a = reports[0].upvotes;
	      	reports[0].upvotes=a+1;
	      	reports[0].save(function(err,resp) {
	        	if(err) {
		            console.log(err);
	            
	        	} else {
		            console.log("done");
	        	}
	    	});
	      

	    	//User got upvoted
	      	var phone_number=reports[0].phone_number;
	      	models.User.find({phone_number:phone_number},function(err,users2){
		      	console.log(users2[0]);
	         	var up=users2[0].upvotes;
	         	if(delet == 1){
	         		var c = users2[0].downvotes;
	         		users2[0].downvotes=c-1;
	         	}
	         	users2[0].upvotes=up+1;
	         	users2[0].save(function(err,resp) {
	        		if(err) {
			            console.log(err);
	            		
	        		} else {
	        			//users upvoted_report get one id of upvoted event
						users[0].upvoted_posts.push(report_id);
						users[0].save();
			            console.log("done");
	        		}
	    		});
	      	});
		    callback({'response' : "upvote ho gya"});
		});
		}
	});

	//callback({'response' : "upvote ho gya"});
}


exports.downvote = function(phone_number,report_id,callback) {

	var checked = 0;
	var delet = 0;

	models.User.find({phone_number : phone_number},function(error, users){

		//Checking if report id downvoted before?
		for (var i = users[0].downvoted_posts.length - 1; i >= 0; i--) {
			if(users[0].downvoted_posts[i] == report_id){
				callback({'response' : "Can only downvote once"});
				console.log({'response' : "Can only downvote once"});
				checked = 1;
			}
		}

		//deleting id of upvoted report
		for (var i = users[0].upvoted_posts.length - 1; i >= 0; i--) {
			if(users[0].upvoted_posts[i] == report_id){
				users[0].upvoted_posts.splice(i, 1);
				delet = 1;
			}
		}
    

		if(checked == 0){
			//report got downvoted
			models.Report.find({_id:report_id},function(error, reports){
			if(delet === 1){
				var a = reports[0].upvotes;
				reports[0].upvotes=a-1;
			}
			var b = reports[0].downvotes;
	      	reports[0].downvotes=b+1;
	      	reports[0].save(function(err,resp) {
	        	if(err) {
		            console.log(err);
	            
	        	} else {
		            console.log("done");
	        	}
	    	});
	      

	    	//User got downvoted
	      	var phone_number=reports[0].phone_number;
	      	models.User.find({phone_number:phone_number},function(err,users2){
		      	console.log(users2[0]);
	         	var down=users2[0].downvotes;
	         	if(delet == 1){
	         		var c = users2[0].upvotes;
	         		users2[0].upvotes=c-1;
	         	}
	         	users2[0].downvotes=down+1;
	         	users2[0].save(function(err,resp) {
	        		if(err) {
			            console.log(err);
	            		
	        		} else {
	        			//users downvoted_report get one id of upvoted event
						users[0].downvoted_posts.push(report_id);
						users[0].save();
			            console.log("done");
	        		}
	    		});
	      	});
		    callback({'response' : "downvote ho gya"});
		    });
		}
	});
}
