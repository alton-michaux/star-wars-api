const baseURL = 'https://swapi.dev/api/'

const domElements = {
    columnA: document.querySelector('#col-A'),
    columnB: document.querySelector('#col-B'),
    columnC: document.querySelector('#col-C'),
    database: document.querySelector('#database'),
    submit: document.querySelector('#submit'),
    loader: document.querySelector('#loading')
}

domElements['submit'].addEventListener('click', e => {
    initialRequest()
});

async function initialRequest() {
    clearHTML()
    displayLoading()
    let database = String(domElements['database'].value.toLowerCase())
    await fetch(`${baseURL}${database}/`)
        .then(response => response.json())
        .then(json => {
            hideLoading()
            populateContents(json, database)
        }).catch (error => {
            displayError(error)
            console.log(error)
        } )
}

function secondaryRequest(database) {
    domElements['select'].addEventListener('change', async function(e) {
        displayLoading()
        let index = e.target.value
        await fetch(`${baseURL}${database}/${index}`)
            .then(response => response.json())
            .then(json => {
                hideLoading()
                populateData(json)
            }).catch (error => {
                displayError(error)
                console.log(error)
            } )
    } )
}

function clearHTML() {
    domElements['columnA'].innerHTML = ''
    domElements['columnB'].innerHTML = ''
    
}

function displayLoading() {
    domElements['loader'].classList.add('display');
    setTimeout(() => {
        domElements['loader'].classList.remove('display');
        } , 3000);  // 1000ms = 1s
}

function hideLoading() {
    domElements['loader'].classList.remove('display');
}

function displayError(error) {
    domElements['loader'].style.backgroundColor = 'red'
    domElement['loader'].innerHTML = `Error:${error}`
    domElements['loader'].classList.add('display');
    setTimeout(() => {
        domElements['loader'].classList.remove('display');
        } , 5000);  // 1000ms = 1s
}

function populateContents(data, type) {
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

function populateData(data) {
    domElements['columnB'].innerHTML = ''
    let html = `<h2 class="text-center">${data.name || data.title}</h2>`
    domElements['columnB'].insertAdjacentHTML('beforeend', html)
    let ignoredKeys = ['name', 'title', 'created_at', 'created', 'edited', 'url']
    for (let key in data) {
        if (!ignoredKeys.includes(key)) {
            html = `<h4 style="color:yellow;">${capitalize(key)}:</h4><div class="text-center data-block">${data[key]}</div>`
            domElements['columnB'].insertAdjacentHTML('beforeend', html)
        }
    }
}

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
}
