const express = require('express');
	const router = express.Router();
	const path = require('path');
	const template = require('../lib/template.js');
	const db = require('../config/db');
	
	router.get('/', (request, response) => {
		db.query(`SELECT * FROM topic`, (error,topics) => {
			if(error){
				throw error;
			}
			db.query(`SELECT * FROM author`, (error2, authors) => {
				if(error2){
					throw error2;
				}
	
				const title = 'Author';
			const list = template.list(topics);
			const authIsOwner = template.authIsOwner(request, response);
        	const authStatusUI = template.authStatusUI(authIsOwner);
			const html = template.HTML(title, list, 
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
	
				<form action="/author/create_process" method="post">
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
			``, authStatusUI
			);
			response.send(html);
			});
		  });
	});

	router.post('/create_process', (request, response) => {
		const post = request.body;
		db.query(`INSERT INTO author (name, profile) VALUES(?, ?)`, [post.name, post.profile], (error, result) => {
			if(error){
				throw error;
			}
			// console.log(post);
			response.redirect(`/author`);
		});
	});

	router.get('/update', (request, response) => {
		// console.log(request.body);
		const filteredId = path.parse(request.query.id).base;
		db.query(`SELECT * FROM topic`, (error, topics) => {
			if(error){
				throw error;
			}
			db.query(`SELECT * FROM author`, (error2, authors) => {
				if(error2){
					throw error2;
				}
				db.query(`SELECT * FROM author WHERE id = ?`, [filteredId], (error3, author) => {
					if(error3){
						throw error3;
					}
					const title = 'Author';
			const list = template.list(topics);
			const authIsOwner = template.authIsOwner(request, response);
        	const authStatusUI = template.authStatusUI(authIsOwner);
			const html = template.HTML(title, list, 
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
	
				<form action="/author/update_process" method="post">
					<p>
                        <input type="hidden" name="id" value="${filteredId}">
                    </p>
					<p>
						<input type="text" name="name" placeholder="${author[0].name}" value = "${author[0].name}">
					</p>
					<p>
						<textarea name="profile" placeholder="${author[0].profile}">${author[0].profile}</textarea> 
					</p>
					<p>
						<input type="submit" value="update">
					</p>
				</form>
				`,
			``, authStatusUI
			);
			response.send(html);
				})
			});
		});
	});

	router.post('/update_process', (request, response) => {
		const post = request.body;
		db.query(`UPDATE author SET name=?, profile=? WHERE id=?`, [post.name, post.profile, post.id], (error, result) => {
			if(error){
				throw error;
			}
			response.redirect(`/author`);
		});
	});

	// author가 쓴 post 먼저 지우고 난 다음에 author 지운다
	router.post('/delete_process', (request, response) => {
		const post = request.body;
		db.query(`DELETE FROM topic WHERE author_id = ?`, [post.id], (error1, result1) => {
			if(error1){
				throw error1;
			}
			db.query(`DELETE FROM author WHERE id = ?`, [post.id], (error2, result2) => {
				if(error2){
					throw error2;
				}
				response.redirect(`/author`);
			});
		});
	});


module.exports = router;
    