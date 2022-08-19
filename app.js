const baseURL = 'https://swapi.dev/api/'

const domElements = {
    columnA: document.querySelector('#col-A'),
    columnB: document.querySelector('#col-B'),
    columnC: document.querySelector('#col-C'),
    database: document.querySelector('#database'),
    submit: document.querySelector('#submit')
}

domElements['submit'].addEventListener('click', e => {
    initialResponse()
});

async function initialResponse() {
    clearHTML()
    let database = String(domElements['database'].value.toLowerCase())
    console.log(database)
    let response = await fetch(`${baseURL}${database}/`);
    handleResponse(response, database)
}

function clearHTML() {
    domElements['columnA'].innerHTML = ''
    domElements['columnB'].innerHTML = ''
    
}

async function handleResponse(response, type) {
    if (response.status == 200) {
        let data = await response.json();
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
    addDataListener(type)
}

function selectAttributes(select) {
    select.setAttribute('class', 'mb-3 text-center')
    select.setAttribute('id', 'contents')
    select.setAttribute('name', 'contents')
    domElements['columnA'].appendChild(select)
    // add select to list of DOM elements
    domElements['select'] = document.querySelector('#contents')
}

function addDataListener(database) {
    domElements['select'].addEventListener('change', async function(e) {
        let index = e.target.value
        let response = await fetch(`${baseURL}${database}/${index}`);
        let data = await response.json();
        // console.log(data)
        populateData(data)
    } )
}

function populateData(data) {
    domElements['columnB'].innerHTML = ''
    let html = `<h2 class="text-center">${data.name}</h2>`
    domElements['columnB'].insertAdjacentHTML('beforeend', html)
    let ignoredKeys = ['name', 'created_at', 'created', 'edited', 'url', 'films']
    for (let key in data) {
        if (!ignoredKeys.includes(key)) {
            html = `<p class="text-center">${key}: ${data[key]}</p>`
            domElements['columnB'].insertAdjacentHTML('beforeend', html)
        }
    }
}
