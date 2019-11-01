const axios = require('axios')

axios('http://admin:admin@localhost:5984/agents/_index', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify({
        "index": {
            "fields": ["id"]
        }
    })
})
    .then(res => {
        console.log('Creating ID index for couchDB, this may take a while...')
    })
    .catch(err => {
        console.log('Index creation error for couchDB.')
    })