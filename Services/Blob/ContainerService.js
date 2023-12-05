const { BlobServiceClient } = require("@azure/storage-blob");

const connectionString = "DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;BlobEndpoint=http://127.0.0.1:10000/devstoreaccount1;";




const create = async (cName) => {
    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
    const containerClient = blobServiceClient.getContainerClient(cName);
    await containerClient.createIfNotExists();
}
const dell = async (cName) => {
    const serviceClient = BlobServiceClient.fromConnectionString(connectionString);
    const containerClient = serviceClient.getContainerClient(cName);
    await containerClient.delete();
}

module.exports = {
    create,
    dell
};