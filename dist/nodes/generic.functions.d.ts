import { IExecuteFunctions, IHookFunctions, ILoadOptionsFunctions, IHttpRequestMethods, IDataObject } from 'n8n-workflow';
/**
 * Make an API request to Clay
 */
export declare function clayApiRequest(this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions, method: IHttpRequestMethods, endpoint: string, body?: IDataObject, qs?: IDataObject): Promise<any>;
/**
 * Make a webhook request to Clay table
 */
export declare function clayWebhookRequest(this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions, webhookUrl: string, body?: IDataObject): Promise<any>;
/**
 * Validate Clay webhook URL format
 */
export declare function validateWebhookUrl(webhookUrl: string): boolean;
/**
 * Validate field name (no empty strings, reasonable length)
 */
export declare function validateFieldName(fieldName: string): boolean;
/**
 * Sanitize field value for Clay webhook
 */
export declare function sanitizeFieldValue(value: any): any;
/**
 * Validate and sanitize record data for Clay webhook
 */
export declare function validateAndSanitizeRecordData(recordData: any): any;
//# sourceMappingURL=generic.functions.d.ts.map