'use strict'

var aws = require('aws-sdk')
var dynamoose = require('dynamoose')

var config = require('../../config/config').get('dev')
/* dynamoose.AWS.config.update({
    //accessKeyId: config.awsdb.accessKeyId,
    //secretAccessKey: config.awsdb.secretAccessKey,
    region: config.awsdb.awsRegion
  }); */

dynamoose.local()

var Schema = dynamoose.Schema;

const ordersSchema = new Schema ({
    OrderID: {
        type: String,
        required: true,
        unique: true,
        hashKey: true
    },
    ItemName: {
        type: String,
        index: true,
        rangeKey: true
    },
    ItemType: {
        type: String
    },
    manufacturer: {
        type: String
    },
    amount: {
        type: Number
    },
    createdAt: {
        type: Date
    },
    updatedAt: {
        type: Date
    }
});

module.exports = dynamoose.model('Orders', ordersSchema);
