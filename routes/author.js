var express = require('express');
	var router = express.Router();
	var path = require('path');
	var fs = require('fs');
	var sanitizeHtml = require('sanitize-html');
	var template = require('../lib/template.js');
	var db = require('../config/db');
	
	router.get('/', (request, response) => {
		db.query(`SELECT * FROM topic`, (error,topics) => {
			if(error){
				throw error;
			}
			db.query(`SELECT * FROM author`, (error2, authors) => {
				if(error2){
					throw error2;
				}
	
				var title = 'Author';
			var list = template.list(topics);
			var html = template.HTML(title, list, 
				`
				${template.authorTable(authors)}
				<style>
					table{
						border-collapse: collapse;
					}
					td{
						border: 1px solid black;
					}
				</style>
	
				<form action="author/create_process" method="post">
					<p>
						<input type="text" name="name" placeholder="name">
					</p>
					<p>
						<textarea name="profile" placeholder="description"></textarea> 
					</p>
					<p>
						<input type="submit" value="create">
					</p>
				</form>
				`,
			``
			);
			response.end(html);
			});
		  });
	});

	// router.get('/', (request, response) => {

	// });

	// router.get('/', (request, response) => {

	// });

	// router.get('/', (request, response) => {

	// });

	// router.get('/', (request, response) => {

	// });


module.exports = router;
    