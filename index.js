var request = require('request')
var cheerio = require('cheerio')
const events = require('events')

const urls = {
	search : 'http://metacritic.com/search/[1]/[2]/results'
}

const product_info = {
	title: {find: '.product_title a'},
	type: {find:'.result_type strong'},
	platform: {find: '.result_type .platform'},
	metascore: {find:'.metascore_w'},
	release_date: {find:'.release_date .data'},
	rating: {find: '.rating .data'},
	cast: {find: '.cast .data', delimiter: ','},
	genre: {find: '.genre .data', delimiter: ','},
	user_score: {find: '.product_avguserscore .data'},
	runtime: {find: '.runtime .data'},
	summary: {find: '.deck'},
	publishers: {find: '.publisher .data', delimiter: ','}
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

var search = function (text, options = {}) {
	var emitter = new events ()
	
	var options_default = {
		category: 'all',
		max: 1000
	}
	for (var i in options_default) {
		if (options[i] === undefined)
			options[i] = options_default[i]
	}

	var results = []
	if (typeof options.category === 'string') {
		url = replace(urls.search, [options.category, text])
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
					filter_object(product)
					results.push(product)
				})
				emitter.emit('end', results.slice(0, options.max))
			})
			.on('error', (error) => {
				emitter.emit('error', error)
			})
	} else {
		var temp_options = JSON.parse(JSON.stringify(options))
		var num_done = 0
		for (var i in options.category) {
			temp_options.category = options.category[i]
			search(text, temp_options)
				.on('end', (res) => {
					results = results.concat(res).slice(0, options.max)
					num_done++
					if (num_done == options.category.length)
						emitter.emit('end', results)
				})
				.on('error', (error) => {
					emitter.emit('error', error)
				})
		}
	}
	return emitter
}

module.exports = {
	search : search
}