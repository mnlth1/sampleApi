'use strict'

var express = require("express")
var path = require("path")
var logger = require("morgan")
var bodyParser = require("body-parser")
var uuid = require("uuid")
var db = require('./db/Orders')
var aws = require('aws-sdk')

var config = require('../config/config').get('dev')

const dbConfig = {
    region: config.awsdb.awsRegion,
    endpoint: config.awsdb.endpoint
}

aws.config.update(dbConfig)

var documentClient = new aws.DynamoDB.DocumentClient();

var app = express()

app.listen(3000, () => console.log('OrdersApi listening on port 3000!'))

logger.token('id', function getId (req) {
    return req.id
  })
app.use(assignId)
app.use(logger(':id :method :url :response-time'))

//app.use(bodyParser.json)

app.set('view engine', 'jade')

app.get('/', function(req, res) {
    res.send({title: "OrdersApi Entry Point"})
})

app.get('/orders', function(req, res) {
    console.log("in get orders")
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
    }

    console.log("Scanning Orders Table!!")
    documentClient.scan(params, function(err, orders) {
        if(err) {
            console.error("Error: ", err)
        } else {
            res.send(orders)
            console.log("Table scanned with data: ", orders)
        }
    });
})

app.get('/orderDetails', function(req, res) {
    (function() {
        return db.getOrders()
    })().then((orderList) => {
        if(orderList && orderList.length > 0) {
            console.log('Order details fetched successfully!!')
            res.send(orderList)
        } else {
            console.log('No orders available!')
            res.send("")
        }
    }).catch(function(err) {
        console.error('Error fetching orders', err)
    })
})

function assignId (req, res, next) {
    req.id = uuid.v4()
    next()
}
