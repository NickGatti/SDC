//cat myFile.json | POST -sS "http://myDB.couchone.com/testDB" -c "application/json"

const startTime = new Date().getTime()

const fs = require('fs');
const faker = require('faker');
const path = require('path');
const axios = require('axios');

const agentTypes = ['listing', 'premier'];

const JSONPath = path.join(__dirname, 'formSeedData.json');

const generateData = async () => {
    writeStream.write(`{"agents":[`)
    for (let i = 1; i <= 10; i++) {
        const name = faker.name.firstName() + ' ' + faker.name.lastName();
        const sales = faker.random.number({ min: 0, max: 30 });
        const phone = faker.phone.phoneNumber('###-###-####');
        const type = agentTypes[faker.random.number({ min: 0, max: 1 })];
        const stars = faker.random.number({ min: 0, max: 5 });
        const ratings = faker.random.number({ min: 0, max: 500 });
        const photo = `https://picsum.photos/id/${faker.random.number({ min: 1, max: 1000 })}/200/300`;
        if (!writeStream.write(`${i > 1 ? ',' : ''}{"agent_name":"${name}","recent_sales":${sales},"phone":"${phone}","agent_type":"${type}","average_stars":${stars},"num_ratings":${ratings},"agent_photo":"${photo}"}`)) {
            await new Promise(resolve => writeStream.once('drain', resolve));
        };
    };
    writeStream.write(`]}`)
    const endTime = new Date().getTime()
    console.log('Done! Took', (endTime - startTime) / 10000, 'seconds.');
};

fs.access(JSONPath, accessErr => {
    console.log('Trying to access file...');
    if (accessErr) {
        console.log('File not accessed!')
        if (accessErr.errno === -2) {
            console.log('File doesnt exist, generating data...');
            writeStream = fs.createWriteStream(JSONPath, { flags: 'w' });
            generateData();
            return;
        } else {
            console.log('access error', accessErr);
            postgres.end();
            return;
        };
    } else {
        console.log('File accessed!');
        fs.unlink(JSONPath, unlinkErr => {
            console.log('Unlinking file...')
            if (unlinkErr) {
                console.log('unlink error', unlinkErr);
                postgres.end();
                return;
            } else {
                console.log('File unlinked! Generating data...');
                writeStream = fs.createWriteStream(JSONPath, { flags: 'w' });
                generateData();
                return;
            };
        });
    };
});
