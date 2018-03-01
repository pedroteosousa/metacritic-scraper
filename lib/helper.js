const request = require('request')
const events = require('events')

const baseURL = 'http://metacritic.com'

// makes request to url
var makeRequest = function (url) {
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

// replaces placeholders on string with given arguments
var format = function (initial_str, arguments) {
	new_str = initial_str
	for (var i = 1; i <= arguments.length; i++)
		new_str = new_str.replace('{'+i+'}', arguments[i-1])
	return new_str
}

// removes empty fields from object
var filterObject = function (object) {
	for (var i in object) {
		if (object[i] == undefined
			|| (typeof object[i] === 'string' && object[i] === '') 
			|| (typeof object[i] !== 'string' && object[i][0] == ''))
			delete object[i]
	}
}

var createObject = function ($, base, loc) {
	var data = $(loc)

	var object = {}
	for (var i in base) {
		var array = base[i].array
		if (array !== undefined) {
			object[i] = []

			$(base[i].find).filter((h) => {
				object[i].push(createObject($, base[i].array, $(base[i].find)[h]))
			})
			continue
		}
		
		var fields = base[i].fields
		if (fields !== undefined) {
			object[i] = createObject($, fields, loc)
			continue
		}

		var attr = base[i].attr
		if (attr === undefined)
			object[i] = data.find(base[i].find).text()
		else {
			object[i] = data.find(base[i].find).attr(attr)
		}
		if (object[i] !== undefined)
			object[i] = object[i].trim()

		var delimiter = base[i].delimiter
		if (delimiter !== undefined) {
			var array = object[i].split(delimiter)
			if (array !== undefined)
				object[i] = array.map((v) => {return v.trim()})
		}
	}
	filterObject(object)
	return object
}

var fillDefaults = function (options, defaults) {
	for (var i in defaults) {
		if (options[i] === undefined)
			options[i] = defaults[i]
	}
}

module.exports = {
	baseURL: baseURL,
	request: makeRequest,
	format: format,
	createObject: createObject,
	fillDefaults: fillDefaults
}
