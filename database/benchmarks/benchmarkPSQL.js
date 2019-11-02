const { Client } = require('pg');

const postgres = new Client({
    user: "nick",
    host: "localhost",
    database: "formservice"
});
postgres.connect();

const marks = {
    operations: 20000,
    interval: 1,
    type: 'read',
    pollIncrement: this.type === 'all' ? 4 : 1,
    errors: 0,
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
    let counter = 0
    for (let i = 0; i < marks.operations; i++) {
        setTimeout(() => {
            if (marks.type === 'create' || marks.type === 'all') {
                marks.c.start.push(new Date().getTime())
                postgres.query(`insert into agents(agent_name,recent_sales,phone,agent_type,average_stars,num_ratings,agent_photo) values('test',1,'123-456-7890','listing',1,1,'test url')`, (err, res) => {
                    if (err) {
                        marks.errors++
                    } else {
                        marks.c.end.push(new Date().getTime())
                    }
                    counter++
                    if (counter === marks.operations * marks.pollIncrement) {
                        tallyResults()
                    }
                })
            }
            if (marks.type === 'read' || marks.type === 'all') {
                marks.r.start.push(new Date().getTime())
                postgres.query(`select * from agents where id = ${Math.floor(Math.random() * 3000000 + 7000000)}`, (err, res) => {
                    if (err) {
                        marks.errors++
                    } else {
                        marks.r.end.push(new Date().getTime())
                    }
                    counter++
                    if (counter === marks.operations * marks.pollIncrement) {
                        tallyResults()
                    }
                })
            }
            if (marks.type === 'update' || marks.type === 'all') {
                marks.u.start.push(new Date().getTime())
                postgres.query(`update agents set agent_name = 'test', recent_sales = 1, phone = '123-456-789', agent_type = 'listing', average_stars = 1, num_ratings = 1, agent_photo = 'test url' where id = ${Math.floor(Math.random() * 3000000 + 7000000)}`, (err, res) => {
                    if (err) {
                        marks.errors++
                    } else {
                        marks.u.end.push(new Date().getTime())
                    }
                    counter++
                    if (counter === marks.operations * marks.pollIncrement) {
                        tallyResults()
                    }
                })
            }
            if (marks.type === 'delete' || marks.type === 'all') {
                marks.d.start.push(new Date().getTime())
                postgres.query(`delete from agents where id = ${Math.floor(Math.random() * 3000000 + 7000000)}`, (err, res) => {
                    if (err) {
                        marks.errors++
                    } else {
                        marks.d.end.push(new Date().getTime())
                    }
                    counter++
                    if (counter === marks.operations * marks.pollIncrement) {
                        tallyResults()
                    }
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
        console.log(`Benchmark results:\nCreate average: ${marks.c.avg.toFixed(2)}ms\nRead average: ${marks.r.avg.toFixed(2)}ms\nUpdate average: ${marks.u.avg.toFixed(2)}ms\nDelete average: ${marks.d.avg.toFixed(2)}ms\nOut of ${marks.operations} ${marks.type} operations. With ${marks.errors} errors. At a ${marks.interval}ms interval.`)
        postgres.end()
    }, marks.interval * marks.operations + 500)
}

queryDB()