/*
This module will accept input via API Gateway and check
if the user id entered already exists in the Table.
If User ID exists :
  a) It would check if Mobile number or Email id matches the input
     if it does, it would call the updateItem lambda function to update.
  b) If neither of them matches, it would not do anything.
If User ID not exist:
  a) It would call the WriteItem lambda function to make a new entry into
  the DynamoDB
*/ 

const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient({region:"us-east-2"});
var lambda = new AWS.Lambda();

exports.handle = function(e, ctx, callback){

    var params = {
        TableName : 'users',
        Key : {
          "user_id" : e.user_id
        },
        AttributesToGet: [
          "user_id",
          "username",
          "email_id",
          "mobile_number",
          "address",
          "company",
          "title",
          "sport",
          "food",
          "places",
          "media",
          "city",
          "quote"
        ]
     }

     var obj = {
       "user_id": e.user_id,
       "username": e.username,
       "email_id": e.email_id,
       "mobile_number": e.mobile_number,
       "address": e.address,
       "company": e.company,
       "title": e.title,
       "sport": e.sport,
       "food": e.food,
       "places": e.places,
       "media": e.media,
       "city": e.city,
       "quote": e.quote
     }

      // Finds the item in the Database
    	docClient.get(params,function(err,data){

            var updateParams = {
                  // the lambda function we are going to invoke for updating
                  // the item found
                  FunctionName: 'userUpdateOne',
                  InvocationType: 'Event',
                  LogType: 'Tail',
                  Payload: JSON.stringify(data)
            };

            var writeParams = {
                  // the lambda function we are going to invoke for creating
                  // new item
                  FunctionName: 'userWriteOne',
                  InvocationType: 'Event',
                  LogType: 'Tail',
                  Payload: JSON.stringify(obj)
            };

    	      if(err){
                // Key never matched. So make a new entry.
    	          lambda.invoke(writeParams, function(err, data) {
                        if (err) {
                          ctx.fail(err);
                        }
                        else {
                          console.log(data);
                          //ctx.succeed('Lambda_B said '+ data.Payload);
                        }
                });
    	      }
    	      else{
        	        //Key matched. Check if email id or mobile number entered already exists in the table.
        	        if(e.email_id == data.Item.email_id || e.mobile_number == data.Item.mobile_number){
          	         lambda.invoke(updateParams, function(err, data) {
                        if (err) {
                          ctx.fail(err);
                        }
                        else {
                          console.log(data);
                          //ctx.succeed('Lambda_B said '+ data.Payload);
                        }
                    });
    	            }
    	            //No match. We will not update anything.
        	        else{
                        console.log("Cannot be inserted.")
        	        }
    	      }
    	});

}
