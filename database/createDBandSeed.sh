# psql -f schema.sql -U nick
# node createCsvForPsql.js
node createCsvForCouch.js
curl -X DELETE http://admin:admin@127.0.0.1:5984/agents
curl -X PUT http://admin:admin@127.0.0.1:5984/agents
# curl -d @formSeedData.json -H "Content-type: application/json" -X POST http://admin:admin@127.0.0.1:5984/agents/_bulk_docs
cat CSVForCouch.csv | couchimport --url http://admin:admin@localhost:5984 --database agents --buffer 1000 --parrelism 10 --delimiter ','
echo Done!