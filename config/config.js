/**
 * Copyright (c) 2016, Topcoder Inc. All rights reserved.
 */

/**
 * This module provides db details,line terminator and output file properties.
 *
 * @author      TCSCODER
 * @version     1.0
 */

'use strict';


exports.mongodburi = "candidate.60.mongolayer.com:10408/ibmgo20151222";
exports.mongousername = "iseo";
exports.mongopassword = "topcoder";

exports.WEB_SERVER_PORT = 3100;

exports.enableLogging =  false;


/*These four fields will be first row in csv file.
if heading is not required  in csv file, remove all the values (exports.headings = {};)  */
exports.headings = {
    ibmId: "IBM_ID",
    step: "STEP",
    firstAccessTime: "FIRST_ACCESS_TIME",
    lastAccessTime: "LAST_ACCESS_TIME"
};
/*This filed specifies in which format dates should be written to csv file, leaving blank wirtes in default format*/
/*Ex1: exports.timeFormat="UTC:dddd, mmmm dS, yyyy, h:MM:ss TT"*/
/*Ex1: exports.timeFormat="GMT:dddd, mmmm dS, yyyy, h:MM:ss TT"*/
exports.timeFormat = 'yyyy-mm-dd HH:MM:ss';

/*This filed indicates how end of the line should be ('\r\n' or \r)*/
exports.lineterminator = '\r';
/*Name of output file*/
exports.outputFileName = "exportedData"; //Note: .csv will be appended.
/* Appeds date and time at end of time stamp if set to true*/
exports.appendTimeStamp = true;

/*Appends below formated date to filename,sould not be empty if appendTimeStamp = true*/
exports.appendDateFormat = 'mm-dd-yyyy_h-MM-ssTT';

