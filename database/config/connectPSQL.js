const { Client } = require('pg');

const postgres = new Client({
    user: "nick",
    host: "localhost",
    database: "formservice"
});
postgres.connect();

function queryDB() {
    let counter = 0
    let startTime = new Date().getTime()
    let endTime = null
    postgres.query(`insert into agents(agent_name,recent_sales,phone,agent_type,average_stars,num_ratings,agent_photo) values('test',1,'123-456-7890','listing',1,1,'test url')`, (err, res) => {
        if (err) {
            throw new Error(err)
        } else {
            counter++
            if (counter === 4) {
                postgres.end()
            }
            endTime = new Date().getTime()
            console.log('Create: Finished in', (endTime - startTime) / 1000, 'seconds!')
        }
    })
    startTime = new Date().getTime()
    endTime = null
    postgres.query(`select * from agents where id = ${Math.floor(Math.random() * 3000000 + 7000000)}`, (err, res) => {
        if (err) {
            throw new Error(err)
        } else {
            counter++
            if (counter === 4) {
                postgres.end()
            }
            endTime = new Date().getTime()
            console.log('Read: Finished in', (endTime - startTime) / 1000, 'seconds!')
        }
    })
    startTime = new Date().getTime()
    endTime = null
    postgres.query(`update agents set agent_name = 'test', recent_sales = 1, phone = '123-456-789', agent_type = 'listing', average_stars = 1, num_ratings = 1, agent_photo = 'test url' where id = ${Math.floor(Math.random() * 3000000 + 7000000)}`, (err, res) => {
        if (err) {
            throw new Error(err)
        } else {
            counter++
            if (counter === 4) {
                postgres.end()
            }
            endTime = new Date().getTime()
            console.log('Update: Finished in', (endTime - startTime) / 1000, 'seconds!')
        }
    })
    startTime = new Date().getTime()
    endTime = null
    postgres.query(`delete from agents where id = ${Math.floor(Math.random() * 3000000 + 7000000)}`, (err, res) => {
        if (err) {
            throw new Error(err)
        } else {
            counter++
            if (counter === 4) {
                postgres.end()
            }
            endTime = new Date().getTime()
            console.log('Delete: Finished in', (endTime - startTime) / 1000, 'seconds!')
        }
    })
}

queryDB()