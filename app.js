const domElements = {
    columnA: document.querySelector('#col-A'),
    columnB: document.querySelector('#col-B'),
    columnC: document.querySelector('#col-C'),
    submit: document.querySelector('#submit')
}

async function fetchResponse() {
    let baseURL = 'https://www.swapi.tech/api/'
    let database = String(document.querySelector('#database').value.toLowerCase())
    let response = await fetch(`${baseURL}${database}`);
    let data = await response.json();
    console.log(data)
}

domElements['submit'].addEventListener('click', e => {
    console.log(e.target)
    fetchResponse()
});

// addEventListener('submit', fetchResponse());
