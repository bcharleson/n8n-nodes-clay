import {
	IExecuteFunctions,
	IHookFunctions,
	ILoadOptionsFunctions,
	IHttpRequestOptions,
	IHttpRequestMethods,
	IDataObject,
} from 'n8n-workflow';

/**
 * Make an API request to Clay
 */
export async function clayApiRequest(
	this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	qs: IDataObject = {},
): Promise<any> {
	console.log('Clay API Request:', {
		method,
		url: `https://api.clay.com/v3${endpoint}`,
		qs,
		body,
	});

	const options: IHttpRequestOptions = {
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
		options.headers!['Content-Type'] = 'application/json';
	} else {
		// Remove body for requests without data (like GET)
		delete options.body;
	}

	try {
		return await this.helpers.httpRequestWithAuthentication.call(this, 'clayApi', options);
	} catch (error) {
		const err = error as any;

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
					} else if (responseBody && responseBody.error) {
						throw new Error(`Clay API error [${statusCode}]: ${responseBody.error}`);
					} else {
						throw new Error(`Clay API error [${statusCode}]: ${err.message || 'Unknown error'}`);
					}
			}
		} else if (err.code === 'ENOTFOUND' || err.code === 'ECONNREFUSED') {
			throw new Error('Unable to connect to Clay API. Please check your internet connection.');
		} else if (err.code === 'ETIMEDOUT') {
			throw new Error('Clay API request timed out. Please try again.');
		} else {
			throw new Error(`Clay API request failed: ${err.message || 'Unknown error'}`);
		}
	}
}

/**
 * Make a webhook request to Clay table
 */
export async function clayWebhookRequest(
	this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions,
	webhookUrl: string,
	body: IDataObject = {},
): Promise<any> {
	console.log('Clay Webhook Request:', {
		url: webhookUrl,
		body,
	});

	const options: IHttpRequestOptions = {
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
	} catch (error) {
		const err = error as any;

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
					} else if (responseBody && responseBody.error) {
						throw new Error(`Clay webhook error [${statusCode}]: ${responseBody.error}`);
					} else {
						throw new Error(`Clay webhook error [${statusCode}]: ${err.message || 'Unknown error'}`);
					}
			}
		} else if (err.code === 'ENOTFOUND' || err.code === 'ECONNREFUSED') {
			throw new Error('Unable to connect to Clay webhook. Please check the webhook URL and your internet connection.');
		} else if (err.code === 'ETIMEDOUT') {
			throw new Error('Clay webhook request timed out. Please try again.');
		} else {
			throw new Error(`Clay webhook request failed: ${err.message || 'Unknown error'}`);
		}
	}
}

/**
 * Validate Clay webhook URL format
 */
export function validateWebhookUrl(webhookUrl: string): boolean {
	const webhookPattern = /^https:\/\/api\.clay\.com\/v3\/sources\/webhook\/pull-in-data-from-a-webhook-[a-f0-9-]+$/i;
	return webhookPattern.test(webhookUrl);
}

/**
 * Validate field name (no empty strings, reasonable length)
 */
export function validateFieldName(fieldName: string): boolean {
	return typeof fieldName === 'string' &&
		   fieldName.trim().length > 0 &&
		   fieldName.length <= 100;
}

/**
 * Sanitize field value for Clay webhook
 */
export function sanitizeFieldValue(value: any): any {
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
export function validateAndSanitizeRecordData(recordData: any): any {
	const sanitized: any = {};

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
