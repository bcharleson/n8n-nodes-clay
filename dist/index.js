"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

// Export the Clay node and credentials
const ClayApi_node_1 = require("./nodes/ClayApi/ClayApi.node");
const ClayApi_credentials_1 = require("./credentials/ClayApi.credentials");

module.exports = {
    ClayApi: ClayApi_node_1.ClayApi,
    ClayApiCredentials: ClayApi_credentials_1.ClayApi
};
