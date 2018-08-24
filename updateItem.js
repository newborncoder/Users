/*
This module is used for updating the Item that is present in the DynamoDB
table. This is a standalone lambda function which can be directly called
via API Gateway.
*/

const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient({region:"us-east-2"});

exports.handle = function(e, ctx, callback){

console.log('Lambda Recieved :', JSON.stringify(e, null, 2));

//Parameters needed for the update command 
var updateParams = {
  TableName: 'users',
  Key: { "user_id" : e.Item.user_id },
  UpdateExpression: "set \
  #a = :aa, \
  #b = :bb, \
  #c = :cc,\
  #d = :dd,\
  #e = :ee,\
  #f = :ff,\
  #g = :gg,\
  #h = :hh,\
  #i = :ii,\
  #j = :jj,\
  #k = :kk,\
  #l = :ll,\
  #m = :mm,\
  "
  ExpressionAttributeNames: {
      '#a' : 'user_id',
      '#b' : 'username',
      '#c' : 'email_id',
      '#d' : 'mobile_number'
      '#e' : 'address'
      '#f' : 'company'
      '#g' : 'title'
      '#h' : 'sport'
      '#i' : 'food'
      '#j' : 'places'
      '#k' : 'media'
      '#l' : 'city'
      '#m' : 'quote'
  },
  ExpressionAttributeValues: {
    ':aa' : e.Item.user_id,
    ':bb' : e.Item.username,
    ':cc' : e.Item.email_id,
    ':dd' : e.Item.mobile_number,
    ':ee' : e.Item.address,
    ':ff' : e.Item.company,
    ':gg' : e.Item.title,
    ':hh' : e.Item.sport,
    ':ii' : e.Item.food,
    ':jj' : e.Item.places,
    ':kk' : e.Item.media,
    ':ll' : e.Item.city,
    ':mm' : e.Item.quote
  }
};

//Update the item.
docClient.update(updateParams,function(err,data){
    if(err){
        callback(err,null);
    }
    else{
        console.log(data);
        //ctx.succeed('Update says : ' + e.Item.email_id);
        callback(null,data);
    }
});

}
