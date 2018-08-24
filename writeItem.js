/*
This module is used for make a new entry(Item) in the DynamoDB
table. This is a standalone lambda function which can be directly called
via API Gateway.
*/


const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient({region:"us-east-2"});

exports.handle = function(e, ctx, callback){
 // Parameters needed for inserting elements into a
 // DynamoDB table using put method.
	var params = {
		Item: {
			user_id : e.user_id,
			username : e.username,
			email_id : e.email_id,
			mobile_number : e.mobile_number,
			address : e.address,
			company : e.company,
			sports : e.sports,
			food : e.food,
			places : e.places,
			media : e.media,
			city : e.city,
			title: e.title,
			quote : e.quote,
			date : Date.now(),
		},
		TableName: 'users'
	};

	// Inserting the element into DynamoDB Table.
	docClient.put(params, function(err,data){
		if(err){
			callback(err,null);
		}
		else{
			callback(null,data);
		}
	});
}
