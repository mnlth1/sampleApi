'use strict'

var aws = require('aws-sdk')

var config = require('../../config/config').get('dev')

const dbConfig = {
    region: config.awsdb.awsRegion,
    endpoint: config.awsdb.endpoint
}

aws.config.update(dbConfig)
var scanOrders = function(date,callback) {
    var documentClient = new aws.DynamoDB.DocumentClient();
        var params = {
            TableName: "Orders",
            ProjectionExpression: "#OrderID, #ItemType, #ItemName, #manufacturer, #amount",
            ExpressionAttributeNames: {
                "#OrderID": "OrderID",
                "#ItemType": "ItemType",
                "#ItemName": "ItemName",
                "#manufacturer": "manufacturer",
                "#amount": "amount"
            }
    };
    var orders = []
    var scanOrder = function(callback) {
        documentClient.scan(params,function(err, data) {
            if(err) {
                callback(err);
            } else {
                orders = orders.concat(data.Items);
                if(data.LastEvaluatedKey) {
                    params.ExclusiveStartKey = data.LastEvaluatedKey;
                    scanOrder(callback);
                } else {
                    callback(err, orders);
                }
            }
        });
    }
    scanOrder(callback);
};

var ordersModel = require("../model/Order")
var utility = require("../libs/utility")

var getOrders = function getAllOrders() {
    return new Promise((resolve, reject) => {
        const timeoutObj = utility.promiseTimeout(3000, reject, 'Model findAll operation timeout');
        ordersModel.scan().exec().then(results => {
            console.log("111111111")
            clearTimeout(timeoutObj)
            let result = []
            if(results && Array.isArray(results)) {
                console.log("2222222222")
                results.forEach(e => {
                    console.log("2222 ", e)
                    result.push(e)
                });
            } else {
                console.log("33333333333")
               result.push(results)     
            }
            console.log("4444444444444444 ", result)
            return result
        })
        .then(results => {
            resolve(results)
        })
        .catch(e => {
            clearTimeout()
            reject(utility.createError(500, 'DBError', 'getAllOrders - error occurred'))
        })
    });
}


module.exports = {scanOrders, getOrders}