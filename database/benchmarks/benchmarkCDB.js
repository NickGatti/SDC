const axios = require('axios')

const marks = {
    operations: 10000,
    interval: 1,
    type: 'read',
    pollIncrement: this.type === 'all' ? 4 : this.type === 'non-read' ? 3 : 1,
    c: {
        start: [],
        end: [],
        avg: 0
    },
    r: {
        start: [],
        end: [],
        avg: 0
    },
    u: {
        start: [],
        end: [],
        avg: 0
    },
    d: {
        start: [],
        end: [],
        avg: 0
    }
}

function queryDB() {
    let updateId = null
    let updateRev = null
    let counter = 0
    for (let i = 0; i < marks.operations; i++) {
        setTimeout(() => {
            if (marks.type === 'non-read' || marks.type === 'all') {
                marks.c.start.push(new Date().getTime())
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
                        counter++
                        updateId = res.data.id
                        updateRev = res.data.rev
                        marks.c.end.push(new Date().getTime())
                        marks.u.start.push(new Date().getTime())
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
                                counter++
                                updateId = res.data.id
                                updateRev = res.data.rev
                                marks.u.end.push(new Date().getTime())
                                marks.d.start.push(new Date().getTime())
                                axios(`http://admin:admin@localhost:5984/agents/${updateId}?rev=${updateRev}`, {
                                    method: 'DELETE',
                                    headers: { 'Content-Type': 'application/json' }
                                })
                                    .then(res => {
                                        counter++
                                        marks.d.end.push(new Date().getTime())
                                        if (counter === marks.operations * marks.pollIncrement) {
                                            tallyResults()
                                        }
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
            }
            if (marks.type === 'read' || marks.type === 'all') {
                marks.r.start.push(new Date().getTime())
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
                        counter++
                        marks.r.end.push(new Date().getTime())
                        if (counter === marks.operations * marks.pollIncrement) {
                            tallyResults()
                        }
                    })
                    .catch(err => {
                        console.log('Read error!', err)
                    })
            }
        }, marks.interval * i)
    }
}

function tallyResults() {
    setTimeout(() => {
        marks.c.avg = ((marks.c.end.reduce((acc, cur) => acc + cur, 0) / marks.operations) - (marks.c.start.reduce((acc, cur) => acc + cur, 0) / marks.operations))
        marks.r.avg = ((marks.r.end.reduce((acc, cur) => acc + cur, 0) / marks.operations) - (marks.r.start.reduce((acc, cur) => acc + cur, 0) / marks.operations))
        marks.u.avg = ((marks.u.end.reduce((acc, cur) => acc + cur, 0) / marks.operations) - (marks.u.start.reduce((acc, cur) => acc + cur, 0) / marks.operations))
        marks.d.avg = ((marks.d.end.reduce((acc, cur) => acc + cur, 0) / marks.operations) - (marks.d.start.reduce((acc, cur) => acc + cur, 0) / marks.operations))
        console.log(`Benchmark results:\nCreate average: ${marks.c.avg.toFixed(2)}ms\nRead average: ${marks.r.avg.toFixed(2)}ms\nUpdate average: ${marks.u.avg.toFixed(2)}ms\nDelete average: ${marks.d.avg.toFixed(2)}ms\nOut of ${marks.operations} operations.`)
    }, 25 * marks.operations)
}

queryDB()