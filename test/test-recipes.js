const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Recipes', function(){
	before(function(){
		return runServer();
	});
	after(function(){
		return closeServer();
	});

	it('should list recipes on GET', function(){
		return chai
			.request(app)
			.get('/recipes')
			.then(function(res){
				expect(res).to.have.status(200);
				expect(res).to.be.json;
				expect(res.body).to.be.a('array');
				expect(res.body.length).to.be.above(0);

				res.body.forEach(function(item){
					expect(item).to.be.a('object');
					expect(item).to.have.all.keys('id', 'name', 'ingredients');
				});
			});
	});
	it('should add an item on POST', function(){
		const newItem = {name: 'avocado toast', ingredients: ['bread', 'sour cream', 'avocado', 'salt', 'garlic powder']};
		return chai
			.request(app)
			.post('/recipes')
			.send(newItem)
			.then(function(res){
				expect(res).to.have.status(201)
				expect(res).to.be.json;
				expect(res.body).to.be.a('object');
				expect(res.body).to.include.keys('id', 'name', 'ingredients');
				expect(res.body.id).to.not.equal(null);
				expect(res.body).to.deep.equal(Object.assign(newItem, {id: res.body.id}))
			});
	});
	it('should update an item on PUT', function(){
		const udpateData = {name: "foo", ingredients: ["time", "money", "experience"]};
		return (
			chai
				.request(app)
				.get('/recipes')
				.then(function(res){
					udpateData.id = res.body[0].id;
					return chai
						.request(app)
						.put(`/recipes/${udpateData.id}`)
						.send(udpateData);
				})
				.then(function(res){
					expect(res).to.have.status(204);
				})
		);
	});
	it('should delete item on DELETE', function(){
		return (
			chai
				.request(app)
				.get('/recipes')
				.then(function(res){
					return chai.request(app).delete(`/recipes/${res.body[0].id}`);
				})
				.then(function(res){
					expect(res).to.have.status(204);
				})
		);
	});
});