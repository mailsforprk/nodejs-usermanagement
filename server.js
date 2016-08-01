/**
 * Copyright (c) 2016, Topcoder Inc. All rights reserved.
 */

/**
 * Starts node js as http server and listens on mentioned port number.
 *
 * @author      TCSCODER
 * @version     1.0
 */



var express = require('express'),
    app = express(),
    config = require('./config/config.js'),
    logger = require('./logger').getLogger(),
    pirmaryController = require('./controllers/PrimaryController.js');

var port = process.env.PORT || config.WEB_SERVER_PORT || 3100;

/* app routes */
app.get('/', pirmaryController.getServerStatus);
app.get('/api/v1/user/export', pirmaryController.getConvertedCSVFile);

app.listen(port, function() {
    logger.info('Application started successfully on port:', port);
});