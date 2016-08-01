/**
 * Copyright (c) 2016, Topcoder Inc. All rights reserved.
 */

/**
 * This module provides methods to call csv file conversion method.
 *
 * @author      TCSCODER
 * @version     1.0
 */

var csvConverter = require('./../services/CSVConversionService.js'),
    config = require('./../config/config.js');

/**
 * GET /status
 * OK 200 when server is up and running
 */
exports.getServerStatus = function(req, res) {
    res.writeHead(200);
    res.end('OK 200');
};

/**
 * returns exported user date in csv format
 * @param req
 * @param res
 */
exports.getConvertedCSVFile = function(req,res){

    csvConverter.initializeExport(function(err,csvData){
        if(csvData){
             res.setHeader('Content-disposition', 'attachment; filename='+csvConverter.getFileName());
             res.set('Content-Type', 'application/octet-stream');
            res.writeHead(200);
            csvData.forEach(function(data){
                res.write(data);
            });
            res.end();
        }else{
            res.writeHead(500);
            res.end('500 Server Error');
        }

    });

}
