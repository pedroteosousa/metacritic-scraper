var cheerio = require('cheerio')
var helper = require('./helper')
const events = require('events')

const detailsURL = '/details'

const movieInfo = {
	title: {find: '.product_page_title a'},
	distributor: {
		fields: {
			name: {find: '.distributor a'},
			url: {find: '.distributor a', attr: 'href'}
		}
	},
	release_date: {find: '.release_date span:nth-child(2)'},
	summary: {find: '.summary span:nth-child(2)'},
	runtime: {find: '.runtime .data'},
	rating: {find: '.movie_rating .data'},
	official_url: {find: '.official_url .data a', attr: 'href'},
	company: {find: '.company .data'},
	genre: {find: '.genres .data', delimiter: ','},
	countries: {find: '.countries .data', delimiter: ','},
	languages: {find: '.languages .data', delimiter: ','},
	home_release_date: {find: 'home_release_date .data'},
	credits: {find: '.credits tbody .alt',
		array: {
			name: {find: '.person a'},
			credit: {find: '.role'},
			url: {find: '.person a', attr: 'href'}
		}
	},
	url: {find: '.product_page_title a', attr: 'href'}
}

var getMovie = function (product) {
	var emitter = new events ()
	
	url = helper.baseURL + product.url + detailsURL
	helper.request(url)
		.on('end', (data) => {
			const $ = cheerio.load(data)
			var data = $('.details')
			var product = helper.createObject(data, movieInfo, $)
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
