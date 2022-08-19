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
    let response = await fetch(`${baseURL}${database}`);
    let data = await response.json();
    handle(data, database)
}

function clearHTML() {
    domElements['columnA'].innerHTML = ''
    domElements['columnB'].innerHTML = ''
    
}

function handle(response, type) {
    if (response) {
        populateContents(response, type)
    } else {
        console.log(response)
    }
}

async function populateContents(data, type) {
    let select = document.createElement('select')
    select.setAttribute('class', 'mb-3 text-center')
    select.setAttribute('id', 'contents')
    select.setAttribute('name', 'contents')
    domElements['columnA'].appendChild(select)
    domElements['select'] = document.querySelector('#contents')
    for (let i = 0; i < data.results.length; i++) {
        html = `<option class="text-center option-select" label="${data.results[i].name}" value="${i}">${data.results[i].name}</option>`
        select.insertAdjacentHTML('beforeend', html)
    }
    addDataListener(type)
}

function addDataListener(database) {
    domElements['select'].addEventListener('change', async function() {
        let index = domElements['select'].value
        let response = await fetch(`${baseURL}${database}/${index}`);
        let data = await response.json();
        console.log(data)
        // populateData(data)
    } )
}
