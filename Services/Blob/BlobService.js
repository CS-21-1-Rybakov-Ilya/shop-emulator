const { BlobServiceClient, BlobClient, BlobSASPermissions } = require("@azure/storage-blob");

const connectionString = "DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;BlobEndpoint=http://127.0.0.1:10000/devstoreaccount1;";

const getSASUrl = async (containerName, fileName) => {
    const client = new BlobClient(connectionString, containerName, fileName);
    const options = {
        permissions: BlobSASPermissions.from({ read: true }),
        expiresOn: new Date(Date.now() + 24 * 3600 * 1000)
    }
    return await client.generateSasUrl(options);
}
// getSASUrl("goods","1701724852729-haerin-newjeans-akmu-love-lee-getty.jpg")
// .then((elem) => {
//     console.log(elem);
// })



const upload = async (fName, path, container) => {
    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
    const containerClient = blobServiceClient.getContainerClient(container);


    const blobName = `${Date.now()}-${fName}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    await blockBlobClient.uploadFile(path);
    return blobName;
}

const uploadWTS = async (fName, path, container) => {
    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
    const containerClient = blobServiceClient.getContainerClient(container);


    const blobName = `${fName}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    await blockBlobClient.uploadFile(path);
    return blobName;
}
module.exports = {
    upload,
    uploadWTS,
    getSASUrl
};