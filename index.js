var request = require('request')
var cheerio = require('cheerio')
const events = require('events')

const urls = {
	base : 'http://metacritic.com',
	search : '/search/[1]/[2]/results?page=0'
}

var search_options_default = {
	category: 'all',
	max: 1000
}
const product_info = {
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
	publishers: {find: '.publisher .data', delimiter: ','}
}

const review_info = {
	score: {find: '.metascore_w'},
	source: {find: '.title .source'},
	author: {find: '.title .author'},
	date: {find: '.title .date'},
	summary: {find: '.summary .no_hover'},
}

var make_request = function (url) {
	var emitter = new events ()
	request.get(url).on('response', (response) => {
		if (response.statusCode == 200) {
			response.setEncoding("utf8");
			var data = ''
			response
				.on('data', (chunk) => {
					data += chunk
				})
				.on('end', () => {
					emitter.emit('end', data)
				})
				.on('error', (error) => {
					emitter.emit('error', error)
				})
		} else {
			emitter.emit('error', "statusCode: " + response.statusCode)
		}
	})
	return emitter;
}

// replaces placeholders on url with arguments
var replace = function (default_url, arguments) {
	new_url = default_url
	for (var i = 1; i <= arguments.length; i++)
		new_url = new_url.replace('['+i+']', arguments[i-1])
	return new_url
}

// removes empty fields from objects
var filter_object = function (object) {
	for (var i in object) {
		if ((typeof object[i] === 'string' && object[i] === '') 
			|| (typeof object[i] !== 'string' && object[i][0] == ''))
			delete object[i]
	}
}

var getReviews = function (product) {
	var emitter = new events ()

	var results = []
	url = urls.base + product.href + '/critic-reviews'
	make_request(url)
		.on('end', (data) => {
			const $ = cheerio.load(data)
			$('.review').filter((h) => {
				var data = $($('.review')[h])
		
				//remove ads
				if (data.find('.metascore_w').text() == '')
					return
		
				var review = {}
				for (var i in review_info) {
					review[i] = data.find(review_info[i].find).text().trim()
					var delimiter = review_info[i].delimiter
					if (delimiter !== undefined) {
						var array = review[i].split(delimiter)
						review[i] = array.map((v) => {return v.trim()})
					}
				}
				review['href'] = data.find('.summary .read_full').attr('href').trim()
				filter_object(review)
				results.push(review)
			})
			emitter.emit('end', results)
		})
		.on('error', (error) => {
			emitter.emit('error', error)
		})
	return emitter
}

var search = function (text, options = {}) {
	var emitter = new events ()
	
	for (var i in search_options_default) {
		if (options[i] === undefined)
			options[i] = search_options_default[i]
	}

	var results = []
	url = replace(urls.base + urls.search, [options.category, text])
	make_request(url)
		.on('end', (data) => {
			const $ = cheerio.load(data)
			$('.result').filter((h) => {
				var data = $($('.result')[h])
				var product = {}
				for (var i in product_info) {
					product[i] = data.find(product_info[i].find).text().trim()
					var delimiter = product_info[i].delimiter
					if (delimiter !== undefined) {
						var array = product[i].split(delimiter)
						product[i] = array.map((v) => {return v.trim()})
					}
				}
				product['href'] = data.find('.product_title a').attr('href').trim()
				filter_object(product)
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
	search : search,
	getReviews: getReviews
}