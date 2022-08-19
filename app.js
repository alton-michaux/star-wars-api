const baseURL = 'https://swapi.dev/api/'

const domElements = {
    columnA: document.querySelector('#col-A'),
    columnB: document.querySelector('#col-B'),
    columnC: document.querySelector('#col-C'),
    database: document.querySelector('#database'),
    submit: document.querySelector('#submit')
}

domElements['submit'].addEventListener('click', e => {
    initialRequest()
});

async function initialRequest() {
    clearHTML()
    let database = String(domElements['database'].value.toLowerCase())
    let response = await fetch(`${baseURL}${database}/`);
    handleInitialResponse(response, database)
}

function clearHTML() {
    domElements['columnA'].innerHTML = ''
    domElements['columnB'].innerHTML = ''
    
}

async function handleInitialResponse(response, type) {
    if (response.status == 200) {
        let data = await response.json();
        console.log(data)
        populateContents(data, type)
    } else {
        console.log(response.message)
    }
}

async function populateContents(data, type) {
    let select = document.createElement('select')
    selectAttributes(select)
    // populate select with options from response
    for (let i = 0; i < data.results.length; i++) {
        html = `<option class="text-center option-select" label="${data.results[i].name || data.results[i].title}" value="${i + 1}">${data.results[i].name || data.results[i].title}</option>`
        select.insertAdjacentHTML('beforeend', html)
    }
    // add listener to select options to populate data in columnB
    secondaryRequest(type)
}

function selectAttributes(select) {
    select.setAttribute('class', 'mb-3 text-center')
    select.setAttribute('id', 'contents')
    select.setAttribute('name', 'contents')
    domElements['columnA'].appendChild(select)
    // add select to list of DOM elements
    domElements['select'] = document.querySelector('#contents')
}

function secondaryRequest(database) {
    domElements['select'].addEventListener('change', async function(e) {
        let index = e.target.value
        let response = await fetch(`${baseURL}${database}/${index}`);
        handleNextResponse(response)
    } )
}

async function handleNextResponse(response) {
    if (response.status == 200) {
        let data = await response.json();
        populateData(data)
    } else {
        console.log("Something went wrong with the request for this endpoint")
    }
}

function populateData(data) {
    domElements['columnB'].innerHTML = ''
    let html = `<h2 class="text-center">${data.name || data.title}</h2>`
    domElements['columnB'].insertAdjacentHTML('beforeend', html)
    let ignoredKeys = ['name', 'title', 'created_at', 'created', 'edited', 'url', 'films']
    for (let key in data) {
        if (!ignoredKeys.includes(key)) {
            html = `<p class="text-center">${key}: ${data[key]}</p>`
            domElements['columnB'].insertAdjacentHTML('beforeend', html)
        }
    }
}
