const create = require('ipfs-http-client');
const projectId = '2Dd6PUpfJZVoYoU9WlYxRJgXpZn';
const projectSecret = '19a29fab5a9455da0a1abb6ce146dd25';
const auth =
    'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

    const client = create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
        authorization: auth,
    },
});

export default client;