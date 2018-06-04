'use strict'

const config = {
    default: {
        awsdb: {
            awsRegion: 'ap-southeast-2',
            endpoint: 'http://localhost:8000',
            accessKeyId: 'default',
            secretAccessKey: 'default'
        }
    }
}

exports.get = function get(env) {
    return config[env] || config.default;
  }