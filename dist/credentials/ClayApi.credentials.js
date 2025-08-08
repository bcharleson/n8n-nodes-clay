"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClayApi = void 0;
class ClayApi {
    constructor() {
        this.name = 'clayApi';
        this.displayName = 'Clay API';
        this.documentationUrl = 'https://www.clay.com/university/guide/guide-find-clay-api-key';
        this.properties = [
            {
                displayName: 'API Key',
                name: 'apiKey',
                type: 'string',
                typeOptions: { password: true },
                default: '',
                required: true,
                description: 'Your Clay API key. You can find this in your Clay dashboard under Settings > API Keys.',
            },
        ];
        this.authenticate = {
            type: 'generic',
            properties: {
                headers: {
                    'Authorization': '=Bearer {{$credentials.apiKey}}',
                },
            },
        };
    }
}
exports.ClayApi = ClayApi;
//# sourceMappingURL=ClayApi.credentials.js.map