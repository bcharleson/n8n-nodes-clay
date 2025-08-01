const { ClayApi: ClayApiNode } = require('./nodes/ClayApi/ClayApi.node');
const { ClayApiCredentials } = require('./credentials/ClayApi.credentials');

module.exports = {
    ClayApi: ClayApiNode,
    ClayApiCredentials: ClayApiCredentials
};
