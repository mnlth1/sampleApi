'use strict'

var aws = require('aws-sdk')
var config = require('../../config/config').get('dev')

let dbConfig = {
    region: config.awsdb.awsRegion,
    endpoint: config.awsdb.endpoint
}

aws.config.update(dbConfig)

var ddb = new aws.DynamoDB()

var params = {
    AttributeDefinitions: [
        {
            AttributeName: "OrderID",
            AttributeType: "S"
        },
    ],
    KeySchema: [
        {
            AttributeName: "OrderID", 
            KeyType: "HASH"
        }
     ], 
    ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
    },
    TableName: "Orders"
};

ddb.createTable(params, function(err, data) {
    if(err) {
        console.log("Error creating table: "+err, err.stack)
    } else {
        console.log("Table successfully created!!")
    }
})