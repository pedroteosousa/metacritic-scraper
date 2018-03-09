const cheerio = require('cheerio')
const events = require('events')

const helper = require('./helper')

const searchURL = '/search/{1}/{2}/results?page={3}'

const info = {
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
	page: 0
}

module.exports = {
	find: function (text, options = {}) {
		var emitter = new events ()
		
		helper.fillDefaults(options, searchDefaults)

		var results = []
		url = helper.format(helper.baseURL + searchURL, [options.category, text, options.page])
		helper.request(url).on('end', (data) => {
			const $ = cheerio.load(data)
			$('.result').filter((h) => {
				var product = helper.createObject($, info, $('.result')[h])
				results.push(product)
			})
			emitter.emit('end', results)
		})
		.on('error', (error) => {
			emitter.emit('error', error)
		})
		return emitter
	}
}
