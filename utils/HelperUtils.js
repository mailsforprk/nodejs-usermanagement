/**
 * Copyright (c) 2016, Topcoder Inc. All rights reserved.
 */

/**
 * This module provides methods to fetch data from db and write to file.
 *
 * @author      TCSCODER
 * @version     1.0
 */



var config = require('./../config/config.js'),
    dateformat = require('dateformat');



/**
 *
 * @param obj validating header which will be first line in csv file
 * @returns {boolean} return true if header is valid
 */
exports.isContainsHeader = function(obj) {
    if (Object.keys(obj).length == 4 && obj.ibmId != null
        && obj.step != null && obj.firstAccessTime != null
        && obj.lastAccessTime != null) {
        return true;
    } else {
        return false;
    }

}

/**
 *
 * @param ibmId full IBM ID
 * @returns {*} check if IBM id is email and returns usable IBM ID if it is not emailID
 */
exports.getUserName = function(ibmId) {
    if (isIbmIdEmail(ibmId)) {
        return ibmId;
    } else {
        var infoArray = ibmId.split('/');
        return infoArray.pop();
    }

}
/**
 *
 * @param ibmId full IBM id
 * @returns {boolean} returns true if IBM ID is email id.
 */
function isIbmIdEmail(ibmId) {
    var emailRegEx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegEx.test(ibmId);
}