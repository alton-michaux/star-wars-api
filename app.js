const domElements = {
    columnA: document.querySelector('#col-A'),
    columnB: document.querySelector('#col-B'),
    columnC: document.querySelector('#col-C'),
    submit: document.querySelector('#submit')
}

domElements['submit'].addEventListener('click', e => {
    fetchResponse()
});

async function fetchResponse() {
    clearHTML()
    let baseURL = 'https://www.swapi.tech/api/'
    let database = String(document.querySelector('#database').value.toLowerCase())
    let response = await fetch(`${baseURL}${database}`);
    let data = await response.json();
    // console.log(data.results[0])
    handle(data)
}

function clearHTML() {
    domElements['columnA'].innerHTML = ''
    domElements['columnB'].innerHTML = ''
    
}

function handle(response) {
    if (response.message == 'ok') {
        populateContents(response)
    } else {
        console.log('response error')
    }
}

async function populateContents(data) {
    let select = document.createElement('select')
    select.setAttribute('class', 'class="mb-3 text-center"')
    select.setAttribute('id', 'contents')
    select.setAttribute('name', 'contents')
    domElements['columnA'].appendChild(select)
    console.log(select)
    for (let i = 0; i < data.results.length; i++) {
        html = `<option class="text-center" value${data.results[i].name}>${data.results[i].name}</option>`
        select.insertAdjacentHTML('beforeend', html)
    }
}
