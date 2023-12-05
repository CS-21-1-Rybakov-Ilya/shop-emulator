const { TableClient } = require('@azure/data-tables');
const connectionString = `DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;TableEndpoint=http://127.0.0.1:10002/devstoreaccount1;`;

const create = async (tableName, partitionKey, rowKey, data) => {
  const tableClient = TableClient.fromConnectionString(connectionString, tableName, {allowInsecureConnection: true});
  const entity = {
    partitionKey,
    rowKey,
    ...data
  };
  await tableClient.createEntity(entity);
}

const getAll = async (tName) => {
    const serviceClient = TableClient.fromConnectionString(connectionString, tName, {
        allowInsecureConnection: true
      });
      const entities = [];

      for await (const entity of serviceClient.listEntities()) {
        entities.push(entity);
      }
      return entities;
}

const get = async (tName, pKey, rKey) => {
    const serviceClient = TableClient.fromConnectionString(connectionString, tName, {
        allowInsecureConnection: true
      });
    return await serviceClient.getEntity(pKey, rKey);
}
//console.log(get("Category","1231","4561").then((result) => {
//  console.log(result);
//}));

const update = async (tName, partitionKey, rowKey, nData, mergeMode=true) => {
    const serviceClient = TableClient.fromConnectionString(connectionString, tName, {
        allowInsecureConnection: true
      });
    const newElem = {
      partitionKey,
      rowKey,
      ...nData
    }
    await serviceClient.updateEntity(newElem, mergeMode ? "Merge" : "Replace");
}
//update("Category","1231","4561", {name: "vlad"}, true);


const dell = async (tName, pKey, rKey) => {
    const serviceClient = TableClient.fromConnectionString(connectionString, tName, {
        allowInsecureConnection: true
      });
    await serviceClient.deleteEntity(pKey, rKey);
}

//dell("Category","1231","4561");

module.exports = {
  create,
  getAll,
  get,
  update,
  dell
};
