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
            .then((response) => {
                if (response.ok) {
                    return response.json()
                }
                displayError(response.status)
            })
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
    domElements['loader'].style.backgroundColor = 'yellow'
    domElements['loader'].style.color = 'black'
    domElements['loader'].innerHTML = "LOADING..."
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
    domElements['loader'].style.color = 'white'
    domElements['loader'].innerHTML = ""
    domElements['loader'].innerHTML = error
    domElements['loader'].classList.add('display');
    setTimeout(() => {
        domElements['loader'].classList.remove('display');
        } , 5000);  // 1000ms = 1s
    throw new Error(error)
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
    createSelectedOption(select)
}

function createSelectedOption(select) {
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
        if (!ignoredKeys.includes(key)) {
            if (linkedKeys.includes(key.toLowerCase())) {
                let html = `<div class="text-center data-block"><h4 style="color:yellow;">${capitalize(key)}</h4>`
                html +=`<a href="${data[key]}" target="_blank">${data[key]}</a></div>`
                domElements['columnB'].insertAdjacentHTML('beforeend', html)
            } else {
                html = `<div class="text-center data-block"><h4 style="color:yellow;">${capitalize(key)}:</h4>${data[key]}</div>`
                domElements['columnB'].insertAdjacentHTML('beforeend', html)
            }
        }
    }
}

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
}
