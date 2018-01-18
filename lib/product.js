var cheerio = require('cheerio')
var helper = require('./helper')
const events = require('events')

const searchProductURL = '/search/{1}/{2}/results?page=0'

const productInfo = {
	title: {find: '.product_title a'},
	type: {find:'.result_type strong'},
	platform: {find: '.result_type .platform'},
	metascore: {find: '.metascore_w'},
	release_date: {find: '.release_date .data'},
	rating: {find: '.rating .data'},
	cast: {find: '.cast .data', delimiter: ','},
	genre: {find: '.genre .data', delimiter: ','},
	user_score: {find: '.product_avguserscore .data'},
	runtime: {find: '.runtime .data'},
	summary: {find: '.deck'},
	publishers: {find: '.publisher .data', delimiter: ','},
	url: {find: '.product_title a', attr: 'href'}
}

var searchDefaults = {
	category: 'all',
	max: 1000
}

var searchProduct = function (text, options = {}) {
	var emitter = new events ()
	
	helper.fillDefaults(options, searchDefaults)

	var results = []
	url = helper.format(helper.baseURL + searchProductURL, [options.category, text])
	helper.request(url)
		.on('end', (data) => {
			const $ = cheerio.load(data)
			$('.result').filter((h) => {
				var data = $($('.result')[h])
				var product = helper.createObject(data, productInfo)
				results.push(product)
			})
			emitter.emit('end', results.slice(0, options.max))
		})
		.on('error', (error) => {
			emitter.emit('error', error)
		})
	return emitter
}

module.exports = {
	searchProduct: searchProduct
}