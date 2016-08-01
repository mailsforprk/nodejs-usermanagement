/**
 * Copyright (c) 2016, Topcoder Inc. All rights reserved.
 */

/**
 * This module creates db connection when requested.
 *
 * @author      TCSCODER
 * @version     1.0
 */


'use strict';


var MongoClient = require('mongodb').MongoClient,
    config = require('./config/config.js');

var mongoLoginUrl = 'mongodb://' + config.mongousername + ':' + config.mongopassword + '@' + config.mongodburi;

/**
 * Creates DB connection from supplied mongo DB url and returns the db connection object
 * @param callback
 */

exports.getDb = function (callback) {

    MongoClient.connect(mongoLoginUrl, function (err, db) {
        if (db) {
            callback(undefined, db);
        } else {
            callback(err, undefined);
        }
    });
}

