'use strict'

var aws = require('aws-sdk')
var fs = require('fs')

aws.config.update({
    region: "ap-southeast-2",
    endpoint: "http://localhost:8000"
})

var documentClient = new aws.DynamoDB.DocumentClient()

console.log("Importing Orders into DynamoDB. Please wait.");
var orders = JSON.parse(fs.readFileSync('../../config/ordersData.json', 'utf8'))

orders.forEach(function(order) {
    console.log(order)

    var params = {
        TableName: "Orders",
        Item: {
            "OrderID": order.OrderID,
            "ItemType": order.ItemType,
            "ItemName": order.ItemName,
            "Amount": order.amount,
            "manufacturer": order.manufacturer
        }
    }

    documentClient.put(params, function(err, data) {
        if (err) {
            console.log("Error loading data. Error - ", JSON.stringify(err, null, 2))
        } else {
            console.log("Order loaded for - ", order.OrderID)
        }
    })
});