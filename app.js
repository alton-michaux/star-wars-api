const baseURL = 'https://swapi.dev/api'

const domElements = { // add DOM elements to global object
	columnA: document.querySelector('#col-A'),
	columnB: document.querySelector('#col-B'),
	columnC: document.querySelector('#col-C'),
	database: document.querySelector('#database'),
	submit: document.querySelector('#submit'),
	loader: document.querySelector('#loading')
}

domElements['submit'].addEventListener('click', e => {
	clearHTML()
	let database = domElements['database'].value.toLowerCase() // get database name from dropdown menu
	fetchResponse(database)
});

function selectListener(database) { // add listener to select options
	domElements['select'].addEventListener('change', e => {
		fetchResponse(database, e.target.value)
	} )
}

async function fetchResponse(database, index="") {
	displayLoading() // display loading message
	await fetch(`${baseURL}/${database}/${index}`)
		.then((response) => {
			if (response.ok) {
				return response.json()
			}
			displayError(response.status)
		})
		.then(json => {
			if (index == "") { // index is empty upon initial load
				hideLoading()
				populateContents(json, database) // populate data in columnA
			} else {
				hideLoading()
				populateData(json) // populate data in columnB
			}
		}).catch (error => {
				displayError(error)
		} )
}

function clearHTML() {
	domElements['columnA'].innerHTML = ''
	domElements['columnB'].innerHTML = ''
	
}

function displayLoading() {
	domElements['loader'].style.backgroundColor = 'yellow'
	domElements['loader'].style.color = 'black'
	domElements['loader'].innerHTML = "LOADING..."
	domElements['loader'].classList.add('display');
	timeoutSet()
}

function hideLoading() { // hide loading message if no error is thrown before 5 seconds
	domElements['loader'].classList.remove('display');
}

function displayError(error) {
	domElements['loader'].style.backgroundColor = 'red'
	domElements['loader'].style.color = 'white'
	domElements['loader'].innerHTML = ""
	domElements['loader'].innerHTML = error
	domElements['loader'].classList.add('display');
	timeoutSet()
	throw new Error(error)
}

function timeoutSet() { // set timeout for loading message to disappear
	setTimeout(() => { // remove loading message after 5 seconds
		domElements['loader'].classList.remove('display');
		} , 5000);  // 1000ms = 1s
}

function populateContents(data, type) {
	let select = document.createElement('select')
	selectAttributes(select)
	for (let i = 0; i < data.results.length; i++) { // loop through results and populate select with options from response
		html = `<option class="text-center option-select" label="${data.results[i].name || data.results[i].title}" value="${i + 1}">${data.results[i].name || data.results[i].title}</option>`
		select.insertAdjacentHTML('beforeend', html)
	}
	selectListener(type) 
}

function selectAttributes(select) { // set attributes for select menu
	select.setAttribute('class', 'mb-3 text-center')
	select.setAttribute('id', 'contents')
	select.setAttribute('name', 'contents')
	domElements['columnA'].appendChild(select)
	// add select to list of DOM elements
	domElements['select'] = document.querySelector('#contents')
	createSelectedOption()
}

function createSelectedOption() { // create selected option for select menu
	let selected = document.createElement('option')
	selected.setAttribute('value', '0')
	selected.setAttribute('selected', 'selected')
	selected.innerHTML = 'Select an option'
	domElements['select'].appendChild(selected)
}

function populateData(data) {
	domElements['columnB'].innerHTML = ''
	let html = `<h2 class="text-center">${data.name || data.title}</h2>`
	domElements['columnB'].insertAdjacentHTML('beforeend', html)
	let ignoredKeys = ['name', 'title', 'created_at', 'created', 'edited', 'url'] //ignore these keys
	let linkedKeys = ['homeworld', 'species', 'starships', 'vehicles', 'films', 'characters', 'planets', 'people'] //keys that have a link to another page
	for (let key in data) {
		if (!ignoredKeys.includes(key)) { // if key is not in ignoredKeys array push to html
			if (linkedKeys.includes(key.toLowerCase())) { // if key is in linkedKeys array, create link to another page
				let html = `<h4 style="color:yellow;">${capitalize(key.replace("_", " "))}</h4>`
				html +=`<div class="text-center data-block"><a href="${data[key]}" target="_blank" style="color:white;">${data[key]}</a></div>`
				domElements['columnB'].insertAdjacentHTML('beforeend', html)
			} else {
				html = `<h4 style="color:yellow;">${capitalize(key.replace("_", " "))}:</h4><div class="text-center data-block">${data[key]}</div>`
				domElements['columnB'].insertAdjacentHTML('beforeend', html)
			}
		}
	}
}

function capitalize(string) {
	return string.charAt(0).toUpperCase() + string.slice(1)
}
