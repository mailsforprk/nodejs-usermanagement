
/**
 * Copyright (c) 2016, Topcoder Inc. All rights reserved.
 */

/**
 * This module provides rotating logger.
 *
 * @author      TCSCODER
 * @version     1.0
 */

var config = require("./config/config.js");
var logger = {};

/**
 * provides logger for other services and controllers
 * @returns {exports|module.exports|*}
 */
logger.getLogger = function() {
    if(!this.winston) {
        this.winston = require('winston');

        if(config.enableLogging){
            this.winston.add(require('winston-daily-rotate-file'), {
             filename: './logs/export.log',
             datePattern: '.MM-yyyy'
             });
        }

    }
    return this.winston;
};

module.exports = logger;