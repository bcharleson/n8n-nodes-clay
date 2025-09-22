"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clayApiRequest = clayApiRequest;
exports.clayWebhookRequest = clayWebhookRequest;
exports.validateWebhookUrl = validateWebhookUrl;
exports.validateFieldName = validateFieldName;
exports.sanitizeFieldValue = sanitizeFieldValue;
exports.validateAndSanitizeRecordData = validateAndSanitizeRecordData;
/**
 * Make an API request to Clay
 */
async function clayApiRequest(method, endpoint, body = {}, qs = {}) {
    const options = {
        method,
        url: `https://api.clay.com/v3${endpoint}`,
        headers: {
            'Accept': 'application/json',
        },
        qs: {
            ...qs,
        },
        body,
        json: true,
    };
    // Only set Content-Type and include body for requests that have data
    if (Object.keys(body).length > 0) {
        options.headers['Content-Type'] = 'application/json';
    }
    else {
        // Remove body for requests without data (like GET)
        delete options.body;
    }
    try {
        return await this.helpers.httpRequestWithAuthentication.call(this, 'clayApi', options);
    }
    catch (error) {
        const err = error;
        // Handle different types of errors
        if (err.response) {
            const statusCode = err.response.statusCode;
            const responseBody = err.response.body;
            // Handle specific HTTP status codes
            switch (statusCode) {
                case 401:
                    throw new Error('Clay API authentication failed. Please check your API key in the credentials.');
                case 403:
                    throw new Error('Clay API access forbidden. Please verify your API key has the necessary permissions.');
                case 404:
                    throw new Error('Clay API endpoint not found. The requested resource may not exist or the API version may be incorrect.');
                case 429:
                    throw new Error('Clay API rate limit exceeded. Please wait before making more requests.');
                case 500:
                    throw new Error('Clay API server error. Please try again later or contact Clay support.');
                default:
                    if (responseBody && responseBody.message) {
                        throw new Error(`Clay API error [${statusCode}]: ${responseBody.message}`);
                    }
                    else if (responseBody && responseBody.error) {
                        throw new Error(`Clay API error [${statusCode}]: ${responseBody.error}`);
                    }
                    else {
                        throw new Error(`Clay API error [${statusCode}]: ${err.message || 'Unknown error'}`);
                    }
            }
        }
        else if (err.code === 'ENOTFOUND' || err.code === 'ECONNREFUSED') {
            throw new Error('Unable to connect to Clay API. Please check your internet connection.');
        }
        else if (err.code === 'ETIMEDOUT') {
            throw new Error('Clay API request timed out. Please try again.');
        }
        else {
            throw new Error(`Clay API request failed: ${err.message || 'Unknown error'}`);
        }
    }
}
/**
 * Make a webhook request to Clay table
 */
async function clayWebhookRequest(webhookUrl, body = {}) {
    const options = {
        method: 'POST',
        url: webhookUrl,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body,
        json: true,
    };
    try {
        return await this.helpers.request(options);
    }
    catch (error) {
        const err = error;
        // Handle webhook-specific errors
        if (err.response) {
            const statusCode = err.response.statusCode;
            const responseBody = err.response.body;
            switch (statusCode) {
                case 400:
                    throw new Error('Clay webhook bad request. Please check your field names and data format match the table schema.');
                case 401:
                    throw new Error('Clay webhook authentication failed. Please verify the webhook URL is correct.');
                case 403:
                    throw new Error('Clay webhook access forbidden. The webhook may be disabled or you may not have permission.');
                case 404:
                    throw new Error('Clay webhook not found. Please verify the webhook URL is correct and the table exists.');
                case 413:
                    throw new Error('Clay webhook payload too large. Please reduce the amount of data being sent.');
                case 429:
                    throw new Error('Clay webhook rate limit exceeded. Please wait before sending more data.');
                case 500:
                    throw new Error('Clay webhook server error. Please try again later or contact Clay support.');
                default:
                    if (responseBody && responseBody.message) {
                        throw new Error(`Clay webhook error [${statusCode}]: ${responseBody.message}`);
                    }
                    else if (responseBody && responseBody.error) {
                        throw new Error(`Clay webhook error [${statusCode}]: ${responseBody.error}`);
                    }
                    else {
                        throw new Error(`Clay webhook error [${statusCode}]: ${err.message || 'Unknown error'}`);
                    }
            }
        }
        else if (err.code === 'ENOTFOUND' || err.code === 'ECONNREFUSED') {
            throw new Error('Unable to connect to Clay webhook. Please check the webhook URL and your internet connection.');
        }
        else if (err.code === 'ETIMEDOUT') {
            throw new Error('Clay webhook request timed out. Please try again.');
        }
        else {
            throw new Error(`Clay webhook request failed: ${err.message || 'Unknown error'}`);
        }
    }
}
/**
 * Validate Clay webhook URL format
 */
function validateWebhookUrl(webhookUrl) {
    const webhookPattern = /^https:\/\/api\.clay\.com\/v3\/sources\/webhook\/pull-in-data-from-a-webhook-[a-f0-9-]+$/i;
    return webhookPattern.test(webhookUrl);
}
/**
 * Validate field name (no empty strings, reasonable length)
 */
function validateFieldName(fieldName) {
    return typeof fieldName === 'string' &&
        fieldName.trim().length > 0 &&
        fieldName.length <= 100;
}
/**
 * Sanitize field value for Clay webhook
 */
function sanitizeFieldValue(value) {
    if (value === null || value === undefined) {
        return '';
    }
    if (typeof value === 'object') {
        return JSON.stringify(value);
    }
    return String(value);
}
/**
 * Validate and sanitize record data for Clay webhook
 */
function validateAndSanitizeRecordData(recordData) {
    const sanitized = {};
    for (const [fieldName, fieldValue] of Object.entries(recordData)) {
        // Validate field name
        if (!validateFieldName(fieldName)) {
            throw new Error(`Invalid field name: "${fieldName}". Field names must be non-empty strings with reasonable length.`);
        }
        // Sanitize field value
        sanitized[fieldName] = sanitizeFieldValue(fieldValue);
    }
    return sanitized;
}
//# sourceMappingURL=generic.functions.js.map