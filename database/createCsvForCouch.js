//cat myFile.json | POST -sS "http://myDB.couchone.com/testDB" -c "application/json"

const startTime = new Date().getTime()

const fs = require('fs');
const faker = require('faker');
const path = require('path');

const agentTypes = ['listing', 'premier'];

const CSVPath = path.join(__dirname, 'CSVForCouch.csv');

const generateData = async () => {
    writeStream.write('id,agent_name,recent_sales,phone,agent_type,average_stars,num_ratings,agent_photo\n');
    for (let i = 1; i <= 10000000; i++) {
        const name = faker.name.firstName() + ' ' + faker.name.lastName();
        const sales = faker.random.number({ min: 0, max: 30 });
        const phone = faker.phone.phoneNumber('###-###-####');
        const type = agentTypes[faker.random.number({ min: 0, max: 1 })];
        const stars = faker.random.number({ min: 0, max: 5 });
        const ratings = faker.random.number({ min: 0, max: 500 });
        const photo = `https://picsum.photos/id/${faker.random.number({ min: 1, max: 1000 })}/200/300`;
        if (!writeStream.write(`${i},${name},${sales},${phone},${type},${stars},${ratings},${photo}\n`)) {
            await new Promise(resolve => writeStream.once('drain', resolve));
        };
    };
    const endTime = new Date().getTime()
    console.log('Done! Took', (endTime - startTime) / 10000, 'seconds.');
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
            return;
        };
    } else {
        console.log('File accessed!');
        fs.unlink(CSVPath, unlinkErr => {
            console.log('Unlinking file...')
            if (unlinkErr) {
                console.log('unlink error', unlinkErr);
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
