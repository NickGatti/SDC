//psql -f schema.sql -U nick formservice
//COPY zip_codes FROM '/path/to/csv/ZIP_CODES.txt' WITH (FORMAT csv);

const startTime = new Date().getMilliseconds();

const fs = require('fs');
const faker = require('faker');
const { client } = require('pg');

const writeStream = fs.createWriteStream('formSeedData.csv', { flags: 'w' });
const client = new Client({
    user: "nick",
    host: "localhost",
    database: "formservice"
})
client.connect();

const agentTypes = ['listing', 'premier'];

(async () => {
    writeStream.write('id,agent_name,recent_sales,phone,agent_type,average_stars,num_ratings,agent_photo\n');
    for (let i = 1; i <= 10000000; i++) {
        const name = faker.name.firstName() + ' ' + faker.name.lastName();
        const sales = faker.random.number({ min: 0, max: 30 });
        const phone = faker.phone.phoneNumber();
        const type = agentTypes[faker.random.number({ min: 0, max: 1 })];
        const stars = faker.random.number({ min: 0, max: 5 });
        const ratings = faker.random.number({ min: 0, max: 500 });
        const photo = `https://picsum.photos/id/${faker.random.number({ min: 1, max: 1000 })}/200/300`;
        if (!writeStream.write(`${i},${name},${sales},${phone},${type},${stars},${ratings},${photo}\n`)) {
            await new Promise(resolve => writeStream.once('drain', resolve));
        };
    };
    const endTime = new Date().getMilliseconds()
    console.log('Done! Took', endTime - startTime, 'milliseconds.')
})();

client.query(`agents FROM './formSeedData.csv' WITH (FORMAT csv);`, (err, res) => {
    if (err) {
        console.log(err)
    } else {
        console.log('Successfully imported CSV into table!')
    }
})