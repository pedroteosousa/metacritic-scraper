var cheerio = require('cheerio')
var helper = require('./helper')
const events = require('events')

const detailsURL = '/details'

const movieInfo = {
	title: {find: '.product_page_title a'},
	release_date: {find: '.release_date'},
	genre: {find: '.genres .data', delimiter: ','},
	url: {find: '.product_page_title a', attr: 'href'}
}

var getMovie = function (product) {
	var emitter = new events ()
	
	url = helper.baseURL + product.url + detailsURL
	helper.request(url)
		.on('end', (data) => {
			const $ = cheerio.load(data)
			var data = $('.details')
			var product = helper.createObject(data, movieInfo)
			emitter.emit('end', product)
		})
		.on('error', (error) => {
			emitter.emit('error', error)
		})
	return emitter
}

module.exports = {
	getMovie: getMovie
}
