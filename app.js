const domElements = {
    columnA: document.querySelector('#col-A'),
    columnB: document.querySelector('#col-B'),
    columnC: document.querySelector('#col-C'),
    submit: document.querySelector('#submit')
}

async function fetchResponse() {
    clearHTML()
    let baseURL = 'https://www.swapi.tech/api/'
    let database = String(document.querySelector('#database').value.toLowerCase())
    let response = await fetch(`${baseURL}${database}`);
    let data = await response.json();
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
    for (let i = 0; i < data.results.length; i++) {
        let div = document.createElement('div')
        div.innerHTML = data.results[i].name
        domElements['columnA'].appendChild(div)
    }
}

domElements['submit'].addEventListener('click', e => {
    fetchResponse()
});
