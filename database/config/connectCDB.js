const axios = require('axios')

function queryDB() {
    let startTime = new Date().getTime()
    let endTime = null
    let updateId = null
    let updateRev = null
    axios('http://admin:admin@localhost:5984/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        data: JSON.stringify({
            "id": `10000001`,
            'agent_name': 'test',
            'recent_sales': 1,
            'phone': '123-456-7890',
            'agent_type': 'listing',
            'average_stars': 1,
            'num_ratings': 1,
            'agent_photo': 'test url'
        })
    })
        .then(res => {
            updateId = res.data.id
            updateRev = res.data.rev
            endTime = new Date().getTime()
            console.log('Create: Finished in', (endTime - startTime) / 1000, 'seconds!')
            axios(`http://admin:admin@localhost:5984/agents/${updateId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                data: JSON.stringify({
                    "_rev": updateRev,
                    "id": `1000000`,
                    'agent_name': 'test1',
                    'recent_sales': 1,
                    'phone': '123-456-7890',
                    'agent_type': 'listing',
                    'average_stars': 1,
                    'num_ratings': 1,
                    'agent_photo': 'test url'
                })
            })
                .then(res => {
                    updateId = res.data.id
                    updateRev = res.data.rev
                    endTime = new Date().getTime()
                    console.log('Update: Finished in', (endTime - startTime) / 1000, 'seconds!')
                    axios(`http://admin:admin@localhost:5984/agents/${updateId}?rev=${updateRev}`, {
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json' }
                    })
                        .then(res => {
                            endTime = new Date().getTime()
                            console.log('Delete: Finished in', (endTime - startTime) / 1000, 'seconds!')
                        })
                        .catch(err => {
                            console.log('Delete error!', err)
                        })
                })
                .catch(err => {
                    console.log('Update error!')
                })
        })
        .catch(err => {
            console.log('Create error!')
        })
    axios('http://admin:admin@localhost:5984/agents/_find', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        data: JSON.stringify({
            "selector": {
                "id": "1000000"
            }
        })
    })
        .then(res => {
            endTime = new Date().getTime()
            console.log('Read: Finished in', (endTime - startTime) / 1000, 'seconds!')
        })
        .catch(err => {
            console.log('Read error!', err)
        })
}

queryDB()