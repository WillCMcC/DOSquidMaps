//  Requirements
var http = require("http");
var express = require("express");
var mongoose = require("mongoose");
var multipart = require('connect-multiparty');
var fs = require('fs');
var Twitter = require('twitter');
var imgur = require('imgur');
var compress = require('compression');



//Database Intialization

// set env variables for Database
// 'node index.js prod'  will use the hosted production Database
// 'node index.js' or 'node index.js dev' use the local Database

// var env = process.argv[2] || 'dev';
// switch (env) {
//     case 'dev':
//         var mongoDatabase = 'mongodb://localhost/squidMaps';
//         break;
//     case 'prod':
        var mongoDatabase = 'will:pass@ds035503.mongolab.com:35503/heroku_wb5mrk1g';

//  connect to database
mongoose.connect( mongoDatabase);
var db = mongoose.connection;
db.on('error', function (err) {
	console.log('connection error', err);
});
db.once('open', function () {
	console.log('connected.');
});

//Define Squid Schema
var Schema = mongoose.Schema;
var squidSchema = new Schema({
	lat : Number,
	long : Number,
	img_link: String,
	squid: Number,
});

// Schema to DB Model
var Squid = mongoose.model('Squid', squidSchema);

Squid.find(function(err, squids){
  console.log(squids)
  saveNew(squids)
});

function saveNew(squids) {
  db.close()
  // new connection
  mongoDatabase = 'mongodb://localhost/squidMaps'
  mongoose.connect(mongoDatabase);
  var db = mongoose.connection;
  db.once('open', function () {
  	console.log('connected.');
  });


  for(var i = 0; i<squids.length;i++){
    var newSquid = new Squid (squids[i]);
    newSquid.save(function(err){
      console.log('success')
    })
  }
}
