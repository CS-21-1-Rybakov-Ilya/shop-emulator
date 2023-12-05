const AzureTables = require('@azure/data-tables');

const connectionString = `DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;TableEndpoint=http://127.0.0.1:10002/devstoreaccount1;`;


const create = async (tName) => {
    const serviceClient = AzureTables.TableClient.fromConnectionString(connectionString, tName, {
        allowInsecureConnection: true
      });
    await serviceClient.createTable();
}

const dell = async (tName) => {
    const serviceClient = AzureTables.TableClient.fromConnectionString(connectionString, tName, {
        allowInsecureConnection: true
      });
    await serviceClient.deleteTable();
}
const createIfNotExists = async (tName) => {
    const serviceClient = AzureTables.TableClient.fromConnectionString(connectionString, tName, {allowInsecureConnection: true});
    await serviceClient.createTable();
}

module.exports = {
    create,
    dell,
    createIfNotExists
  };