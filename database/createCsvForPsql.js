//psql -f schema.sql -U nick formservice
//COPY zip_codes FROM '/path/to/csv/ZIP_CODES.txt' WITH (FORMAT csv);

const startTime = new Date().getTime();

const fs = require('fs');
const faker = require('faker');
const path = require('path');
const { Client } = require('pg');

const agentTypes = ['listing', 'premier'];

const CSVPath = path.join(__dirname, 'CSVForPsql.csv');

const postgres = new Client({
    user: "nick",
    host: "localhost",
    database: "formservice"
});
postgres.connect();

const generateData = async () => {
    writeStream.write('agent_name,recent_sales,phone,agent_type,average_stars,num_ratings,agent_photo\n');
    for (let i = 1; i <= 10000000; i++) {
        const name = faker.name.firstName() + ' ' + faker.name.lastName();
        const sales = faker.random.number({ min: 0, max: 30 });
        const phone = faker.phone.phoneNumber('###-###-####');
        const type = agentTypes[faker.random.number({ min: 0, max: 1 })];
        const stars = faker.random.number({ min: 0, max: 5 });
        //https://s3-us-west-2.amazonaws.com/agents-zallo/Realtor100.jpg
        const ratings = faker.random.number({ min: 0, max: 500 });
        const photo = `https://s3-us-west-2.amazonaws.com/agents-zallo/Realtor${faker.random.number({ min: 1, max: 1000 })}.jpg`;
        if (!writeStream.write(`${name},${sales},${phone},${type},${stars},${ratings},${photo}\n`)) {
            await new Promise(resolve => writeStream.once('drain', resolve));
        };
    };
    postgres.query(`copy agents(agent_name,recent_sales,phone,agent_type,average_stars,num_ratings,agent_photo) FROM '${CSVPath}' DELIMITER ',' CSV HEADER;`, (err, res) => {
        if (err) {
            console.log('CSV Import error:', err);
        } else {
            const endTime = new Date().getTime()
            console.log('Done! Took', (endTime - startTime) / 1000, 'seconds.');
            console.log('Successfully imported CSV into table!');
        };
        postgres.end();
    });
};

fs.access(CSVPath, accessErr => {
    console.log('Trying to access file...');
    if (accessErr) {
        console.log('File not accessed!')
        if (accessErr.errno === -2) {
            console.log('File doesnt exist, generating data...');
            writeStream = fs.createWriteStream(CSVPath, { flags: 'w' });
            generateData();
            return;
        } else {
            console.log('access error', accessErr);
            postgres.end();
            return;
        };
    } else {
        console.log('File accessed!');
        fs.unlink(CSVPath, unlinkErr => {
            console.log('Unlinking file...')
            if (unlinkErr) {
                console.log('unlink error', unlinkErr);
                postgres.end();
                return;
            } else {
                console.log('File unlinked! Generating data...');
                writeStream = fs.createWriteStream(CSVPath, { flags: 'w' });
                generateData();
                return;
            };
        });
    };
});
