const baseURL = 'https://swapi.dev/api'

const domElements = {
	columnA: document.querySelector('#col-A'),
	columnB: document.querySelector('#col-B'),
	columnC: document.querySelector('#col-C'),
	database: document.querySelector('#database'),
	submit: document.querySelector('#submit'),
	loader: document.querySelector('#loading')
}

domElements['submit'].addEventListener('click', e => { // when submit button is clicked, fetch response from selected option
	clearHTML()
	let database = domElements['database'].value.toLowerCase() // get database name from dropdown menu
	fetchResponse(database)
});

function addListener(database) { // when select option is changed, fetch response from selected option
	domElements['select'].addEventListener('change', e => {
		fetchResponse(database, e.target.value)
	} )
}

async function fetchResponse(database, index="") {
	displayLoadingMessage()
	await fetch(`${baseURL}/${database}/${index}`)
		.then((response) => {
			if (response.ok) {
				return response.json()
			}
			displayError(response.status)
		})
		.then(json => {
			if (index == "") { // index is empty upon initial load
				hideLoadingMessage()
				populateColumnA(json, database)
			} else {
				hideLoadingMessage()
				populateColumnB(json)
			}
		}).catch (error => {
				displayError(error)
		} )
}

function clearHTML() {
	domElements['columnA'].innerHTML = ''
	domElements['columnB'].innerHTML = ''
	
}

function displayLoadingMessage() {
	domElements['loader'].style.backgroundColor = 'yellow'
	domElements['loader'].style.color = 'black'
	domElements['loader'].innerHTML = "LOADING..."
	domElements['loader'].classList.add('display');
	timeoutSet() // set timeout to hide loading message
}

function hideLoadingMessage() {
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

function timeoutSet() {
	setTimeout(() => {
		hideLoadingMessage()
		} , 5000);  // 1000ms = 1s
}

function populateColumnA(data, database) {
	let select = document.createElement('select')
	buildSelectElement(select)
	for (let i = 0; i < data.results.length; i++) { // loop through results and populate select element with options from response
		html = `<option class="text-center option-select" label="${data.results[i].name || data.results[i].title}" value="${i + 1}">${data.results[i].name || data.results[i].title}</option>`
		select.insertAdjacentHTML('beforeend', html)
	}
	addListener(database) 
}

function buildSelectElement(select) {
	select.setAttribute('class', 'mb-3 text-center')
	select.setAttribute('id', 'contents')
	select.setAttribute('name', 'contents')
	domElements['columnA'].appendChild(select)
	domElements['select'] = document.querySelector('#contents') // add select to list of DOM elements
	createSelectedOption() // create default selected option for select menu
}

function createSelectedOption() {
	let selected = document.createElement('option')
	selected.setAttribute('value', '0')
	selected.setAttribute('selected', 'selected')
	selected.innerHTML = 'Select an option'
	domElements['select'].appendChild(selected)
}

function populateColumnB(data) {
	domElements['columnB'].innerHTML = ''
	let html = `<h2 class="text-center">${data.name || data.title}</h2>`
	domElements['columnB'].insertAdjacentHTML('beforeend', html)
	let ignoredKeys = ['name', 'title', 'created_at', 'created', 'edited', 'url'] // these keys won't be displayed in column C
	let linkedKeys = ['homeworld', 'species', 'starships', 'vehicles', 'films', 'characters', 'planets', 'people'] // keys that contain links to other resources
	for (let key in data) {
		if (!ignoredKeys.includes(key)) { // if key is not in ignoredKeys array push to html
			if (linkedKeys.includes(key.toLowerCase())) {
				let html = `<h4 style="color:yellow;">${capitalize(key.replace("_", " "))}</h4>`
				html +=`<div class="text-center data-block"><a href="${data[key]}" target="_blank" style="color:white;">${data[key]}</a></div>` // create link to another page
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
