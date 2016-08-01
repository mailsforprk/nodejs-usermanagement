/**
 * Copyright (c) 2016, Topcoder Inc. All rights reserved.
 */

/**
 * This module provides methods to fetch data from db and write to file.
 *
 * @author      TCSCODER
 * @version     1.0
 */


'use strict';

var config = require('./../config/config.js'),
    dateformat = require('dateformat'),
    ds = require('./../datasource.js'),
    MongoClient = require('mongodb').MongoClient,
    fs = require('fs'),
    helperUtil = require('./../utils/HelperUtils.js'),
    logger = require('../logger').getLogger(),
    endOfLine = config.lineterminator;




/**
 * initializes csv file export activity.
 */
exports.initializeExport = function(cb){

    var playerInfoAndLog = {};
    var successfulLineCount = 0,
        failureLineCount = 0;
    /*Get DB connection and fetch player information*/
    ds.getDb(function (err, db) {
        logger.log("[INFO] Connecting to DB");
        if (db) {
            logger.info("Connection Obtained Successfully");
            var playerCollection = db.collection('players');
            var cursor = playerCollection.find();
            cursor.toArray(function (err, players) {
                if (err) {
                    logger.error("Failed to obtain player collection");
                    logger.error(err);
                    db.close();
                    cb(err,undefined);
                } else {
                    players.forEach(function (player) {
                        if (null != player.ibmId) {
                            playerInfoAndLog[player._id] = {ibmId: helperUtil.getUserName(player.ibmId), step: player.step};
                            successfulLineCount++;
                        } else {
                            logger.error(" Skipping row with out IBM ID ");
                            failureLineCount++;
                        }

                    })

                    fetchAccessLoginInfo(db,playerInfoAndLog,function(err,playerData){
                        if(playerData){
                            var csvFinal = convertToCSV(config.headings, playerData);
                            summery(successfulLineCount,failureLineCount,playerData);
                            cb(undefined,csvFinal);
                        }else{
                            cb(err,undefined);
                        }

                    });
                }
            });
        } else {
            logger.error("Failed to obtain DB connection");
            logger.error(err);
            cb(err,undefined);
        }
    });
}

/**
 *
 * @param heading heading to writtern in first line of CSV file
 * @param playerInfoAndLog  original json  data array for csv conversion
 * @returns {Array} returns CSV object of supplied json object.
 */
function convertToCSV(heading, playerInfoAndLog) {

    var csvObj = [];
    var dataRowNumber = 1;
    for (var id in playerInfoAndLog) {
        var dataRow = playerInfoAndLog[id];
        var csvRow = "";
        var formatedFirstLogin;
        var formatedLastAccess;
        if(config.timeFormat != ''){
            formatedFirstLogin =     dateformat(dataRow.firstLogin,config.timeFormat);
            formatedLastAccess = dateformat(dataRow.lastAccess,config.timeFormat);
        }else{
            formatedFirstLogin = dateformat(dataRow.firstLogin);
            formatedLastAccess =dateformat(dataRow.lastAccess);
        }
        formatedFirstLogin = " "+formatedFirstLogin;
        formatedLastAccess = " "+formatedLastAccess;
        csvRow = helperUtil.getUserName(dataRow.ibmId) + ',' + dataRow.step + ',' + formatedFirstLogin + ',' + formatedLastAccess;
        csvRow += endOfLine;
        csvObj[dataRowNumber++] = csvRow;
    }
    csvObj.sort(function (a, b) {
        var x = a.split(',').shift().toLocaleLowerCase();
        var y = b.split(',').shift().toLocaleLowerCase();
        return x < y ? 1 : x > y ? -1 : 0;
    });
    if (helperUtil.isContainsHeader(heading)) {
        var headers = "";
        headers = heading.ibmId + ',' + heading.step + ',' + heading.firstAccessTime + ',' + heading.lastAccessTime;
        headers += endOfLine;
        csvObj.unshift(headers);
    }


    return csvObj;

}


/**
 * returns file name to which CSV output will be written
 */
exports.getFileName  = function() {
    var filename ='';
    var format = '.csv';
    var date = new Date().toISOString().
    replace(/T/, ' ').      // replace T with a space
    replace(/\..+/, '').
    replace(/\..+/, '').
    replace(/\:/g, '_');

    if (config.appendTimeStamp == true) {
        var appendDatefrmt = dateformat(new Date(),config.appendDateFormat);
        return filename = config.outputFileName +'_'+ appendDatefrmt+format;
    } else {
       return  filename = config.outputFileName+format;
    }
}
/**
 * fetches login info from db and process further
 * @param db db conneciton
 */
function  fetchAccessLoginInfo(db,playerInfoAndLog,callback){
    var logCollection = db.collection('playerlogs');
    logCollection.aggregate([
        { $group: { _id: "$playerId", "firstLogin": { $min: "$when" }, "lastAccess": { $max: "$when" }  } }
    ], function(err, result) {
        if (err) {
            logger.error("Failed to obtain playerlogs");
            logger.error(err);
            db.close();
            callback(err,undefined);
        }
        populatePlayerFirstLoginTime(result,playerInfoAndLog);
        db.close();
        callback(undefined,playerInfoAndLog);

    });
}
/**
 * fetches last access info from db and process further
 * @param db db connection
 * @param callback
 */

/**
 * populates first login and last access info to be written to csv
 * @param firstLoginInfo
 */
function populatePlayerFirstLoginTime(firstLoginInfo,playerInfoAndLog){
    firstLoginInfo.forEach(function(loginInfo){
        var player = playerInfoAndLog[loginInfo._id];
        if(player != undefined){
            player.firstLogin = loginInfo.firstLogin;
            player.lastAccess = loginInfo.lastAccess;
        }

    });

}

/**
 * print summery and writes info to csv file
 */
function summery(successfulLineCount,failureLineCount,playerInfoAndLog) {
    logger.info("Data read complete , Closing DB connection");
    logger.info("[INFO] --------------Statistics----------------");
    logger.info("[INFO] Total Numner of valid players: " + successfulLineCount);
    logger.info("INFO] Total Numner of invalid players: " + failureLineCount);
}