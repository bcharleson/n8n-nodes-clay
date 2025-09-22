import {
	IExecuteFunctions,
	ILoadOptionsFunctions,
	INodeExecutionData,
	INodeListSearchResult,
	INodePropertyOptions,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

import {
	clayApiRequest,
	clayWebhookRequest,
	validateWebhookUrl,
	validateAndSanitizeRecordData
} from '../generic.functions';

export class ClayApi implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Clay',
		name: 'clayApi',
		icon: 'file:clay.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Clay data enrichment platform',
		defaults: {
			name: 'Clay',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'clayApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Table',
						value: 'table',
					},
					{
						name: 'Workspace',
						value: 'workspace',
					},
				],
				default: 'table',
			},

			// TABLE OPERATIONS
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['table'],
					},
				},
				options: [
					{
						name: 'Create Record',
						value: 'createRecord',
						description: 'Create a new record in a Clay table',
						action: 'Create a record in table',
					},
					{
						name: 'Update Record (Upsert)',
						value: 'updateRecord',
						description: 'Create or update a record using auto-dedupe (requires unique identifier)',
						action: 'Update/create a record in table',
					},
					{
						name: 'Find Record',
						value: 'findRecord',
						description: 'Find records in a Clay table',
						action: 'Find records in table',
					},
					{
						name: 'Get Schema',
						value: 'getSchema',
						description: 'Get table schema and field definitions',
						action: 'Get table schema',
					},
				],
				default: 'createRecord',
			},

			// WORKSPACE OPERATIONS
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['workspace'],
					},
				},
				options: [
					{
						name: 'List Workspaces',
						value: 'listWorkspaces',
						description: 'List all available workspaces',
						action: 'List workspaces',
					},
					{
						name: 'List Tables',
						value: 'listTables',
						description: 'List tables in a workspace',
						action: 'List tables in workspace',
					},
				],
				default: 'listWorkspaces',
			},

			// WORKSPACE ID FIELD
			{
				displayName: 'Workspace ID',
				name: 'workspaceId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['table'],
					},
				},
				default: '',
				description: 'The ID of the Clay workspace',
				placeholder: 'e.g. 12345',
			},

			{
				displayName: 'Workspace ID',
				name: 'workspaceId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['workspace'],
						operation: ['listTables'],
					},
				},
				default: '',
				description: 'The ID of the Clay workspace',
				placeholder: 'e.g. 12345',
			},

			// TABLE ID FIELD
			{
				displayName: 'Table ID',
				name: 'tableId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['table'],
						operation: ['createRecord', 'updateRecord', 'findRecord', 'getSchema'],
					},
				},
				default: '',
				description: 'The ID of the Clay table',
				placeholder: 'e.g. 67890',
			},

			// WEBHOOK URL FIELD (for create and update record)
			{
				displayName: 'Webhook URL',
				name: 'webhookUrl',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['table'],
						operation: ['createRecord', 'updateRecord'],
					},
				},
				default: '',
				description: 'The Clay webhook URL for this table (from Clay table settings)',
				placeholder: 'https://api.clay.com/v3/sources/webhook/pull-in-data-from-a-webhook-{UUID}',
			},

			// UNIQUE IDENTIFIER FIELD (for update record)
			{
				displayName: 'Unique Identifier Field',
				name: 'uniqueField',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['table'],
						operation: ['updateRecord'],
					},
				},
				default: 'Email',
				description: 'The field name used as unique identifier for auto-dedupe (e.g., Email, LinkedIn URL, Company Domain)',
				placeholder: 'e.g. Email, LinkedIn URL, Company Domain',
			},

			// AUTO-DEDUPE WARNING
			{
				displayName: 'Important Note',
				name: 'updateNote',
				type: 'notice',
				default: '',
				displayOptions: {
					show: {
						resource: ['table'],
						operation: ['updateRecord'],
					},
				},
				typeOptions: {
					theme: 'warning',
				},
				description: 'Clay\'s auto-dedupe feature must be enabled on your table with the unique identifier field. This operation will create a new record if no match is found, or rely on auto-dedupe to prevent duplicates.',
			},

			// FIELD MAPPING MODE FOR CREATE AND UPDATE RECORD
			{
				displayName: 'Field Mapping Mode',
				name: 'fieldMappingMode',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['table'],
						operation: ['createRecord', 'updateRecord'],
					},
				},
				options: [
					{
						name: 'Manual Field Mapping',
						value: 'manual',
						description: 'Manually specify field names and values',
					},
					{
						name: 'JSON Object',
						value: 'json',
						description: 'Provide fields as a JSON object',
					},
				],
				default: 'manual',
				description: 'How to specify the fields for the new record',
			},

			// FIELDS FOR CREATE AND UPDATE RECORD (MANUAL MODE)
			{
				displayName: 'Fields',
				name: 'fields',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				displayOptions: {
					show: {
						resource: ['table'],
						operation: ['createRecord', 'updateRecord'],
						fieldMappingMode: ['manual'],
					},
				},
				default: {},
				options: [
					{
						name: 'field',
						displayName: 'Field',
						values: [
							{
								displayName: 'Field Name',
								name: 'name',
								type: 'string',
								default: '',
								description: 'Name of the field in the Clay table (case-sensitive)',
								placeholder: 'e.g. First Name, Email, Company',
							},
							{
								displayName: 'Field Value',
								name: 'value',
								type: 'string',
								default: '',
								description: 'Value to set for this field',
								placeholder: 'e.g. John Doe, john@example.com',
							},
						],
					},
				],
				description: 'Fields to set in the new record. Field names must match exactly with Clay table column names.',
			},

			// JSON FIELDS FOR CREATE AND UPDATE RECORD (JSON MODE)
			{
				displayName: 'Fields (JSON)',
				name: 'fieldsJson',
				type: 'json',
				displayOptions: {
					show: {
						resource: ['table'],
						operation: ['createRecord', 'updateRecord'],
						fieldMappingMode: ['json'],
					},
				},
				default: '{\n  "First Name": "John",\n  "Last Name": "Doe",\n  "Email": "john.doe@example.com",\n  "Company": "Example Corp"\n}',
				description: 'Fields as a JSON object. Keys must match Clay table column names exactly.',
				typeOptions: {
					rows: 10,
				},
			},

			// SEARCH FIELD FOR FIND RECORD
			{
				displayName: 'Search Field',
				name: 'searchField',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['table'],
						operation: ['findRecord'],
					},
				},
				default: '',
				description: 'The field name to search by',
				placeholder: 'e.g. Email',
			},

			// SEARCH VALUE FOR FIND RECORD
			{
				displayName: 'Search Value',
				name: 'searchValue',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['table'],
						operation: ['findRecord'],
					},
				},
				default: '',
				description: 'The value to search for',
				placeholder: 'e.g. john.doe@example.com',
			},

			// LIMIT FOR FIND RECORD
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				typeOptions: {
					minValue: 1,
					maxValue: 100,
				},
				default: 10,
				displayOptions: {
					show: {
						resource: ['table'],
						operation: ['findRecord'],
					},
				},
				description: 'Maximum number of records to return',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const resource = this.getNodeParameter('resource', i) as string;
				const operation = this.getNodeParameter('operation', i) as string;

				let responseData;

				if (resource === 'table') {
					if (operation === 'createRecord' || operation === 'updateRecord') {
						const webhookUrl = this.getNodeParameter('webhookUrl', i) as string;
						const fieldMappingMode = this.getNodeParameter('fieldMappingMode', i) as string;

						// Validate webhook URL format
						if (!validateWebhookUrl(webhookUrl)) {
							throw new NodeOperationError(
								this.getNode(),
								'Invalid Clay webhook URL format. Expected format: https://api.clay.com/v3/sources/webhook/pull-in-data-from-a-webhook-{UUID}',
								{ itemIndex: i }
							);
						}

						// Build the record data based on mapping mode
						let recordData: any = {};

						if (fieldMappingMode === 'manual') {
							const fields = this.getNodeParameter('fields', i) as any;
							if (fields.field && Array.isArray(fields.field)) {
								for (const field of fields.field) {
									if (field.name && field.value !== undefined) {
										recordData[field.name] = field.value;
									}
								}
							}
						} else if (fieldMappingMode === 'json') {
							const fieldsJson = this.getNodeParameter('fieldsJson', i) as string;
							try {
								recordData = JSON.parse(fieldsJson);
							} catch (error) {
								throw new NodeOperationError(
									this.getNode(),
									`Invalid JSON in Fields (JSON): ${(error as Error).message}`,
									{ itemIndex: i }
								);
							}
						}

						// For update operations, validate unique identifier is included
						if (operation === 'updateRecord') {
							const uniqueField = this.getNodeParameter('uniqueField', i) as string;
							if (!recordData[uniqueField]) {
								throw new NodeOperationError(
									this.getNode(),
									`Unique identifier field "${uniqueField}" must be included in the record data for update operations.`,
									{ itemIndex: i }
								);
							}
						}

						// Validate that we have some data to send
						if (Object.keys(recordData).length === 0) {
							throw new NodeOperationError(
								this.getNode(),
								`No fields specified for record ${operation === 'updateRecord' ? 'update' : 'creation'}. Please add at least one field.`,
								{ itemIndex: i }
							);
						}

						// Validate and sanitize the record data
						try {
							recordData = validateAndSanitizeRecordData(recordData);
						} catch (error) {
							throw new NodeOperationError(
								this.getNode(),
								`Invalid record data: ${(error as Error).message}`,
								{ itemIndex: i }
							);
						}

						// Send data to Clay webhook
						try {
							responseData = await clayWebhookRequest.call(this, webhookUrl, recordData);

							// If the webhook doesn't return data, create a success response
							if (!responseData) {
								const operationType = operation === 'updateRecord' ? 'updated/created' : 'created';
								responseData = {
									success: true,
									message: `Record ${operationType} successfully in Clay table`,
									operation: operation,
									data: recordData,
									timestamp: new Date().toISOString(),
									...(operation === 'updateRecord' && {
										note: 'Record was sent to Clay with auto-dedupe. If a matching record exists, it may have been deduplicated rather than updated.',
									}),
								};
							}
						} catch (error) {
							const operationType = operation === 'updateRecord' ? 'update/create' : 'create';
							throw new NodeOperationError(
								this.getNode(),
								`Failed to ${operationType} record in Clay table: ${(error as Error).message}. Please verify the webhook URL is correct and the table is accessible.`,
								{ itemIndex: i }
							);
						}

					} else if (operation === 'findRecord') {
						// Clay doesn't provide a direct API for finding records
						// This operation provides guidance on alternatives
						const searchField = this.getNodeParameter('searchField', i) as string;
						const searchValue = this.getNodeParameter('searchValue', i) as string;
						const limit = this.getNodeParameter('limit', i) as number;

						// Return informational response about Clay's limitations
						responseData = {
							success: false,
							operation: 'findRecord',
							message: 'Clay API does not support direct record search operations',
							searchCriteria: {
								field: searchField,
								value: searchValue,
								limit: limit,
							},
							alternatives: [
								'Use Clay\'s built-in lookup functionality within Clay tables',
								'Export table data and search externally',
								'Use Clay\'s Zapier integration for search operations',
								'Implement client-side filtering after data export',
							],
							documentation: 'https://www.clay.com/university/guide/lookup-data-from-other-tables',
							timestamp: new Date().toISOString(),
						};

					} else if (operation === 'getSchema') {
						// Clay doesn't provide a direct API for getting table schemas
						// This operation provides guidance on alternatives
						const workspaceId = this.getNodeParameter('workspaceId', i) as string;
						const tableId = this.getNodeParameter('tableId', i) as string;

						// Return informational response about Clay's limitations
						responseData = {
							success: false,
							operation: 'getSchema',
							message: 'Clay API does not support direct table schema retrieval',
							tableInfo: {
								workspaceId: workspaceId,
								tableId: tableId,
							},
							alternatives: [
								'View table schema within Clay interface',
								'Export a sample record to see field structure',
								'Use Clay\'s field mapping in webhook setup',
								'Document field names manually for consistent usage',
							],
							recommendations: [
								'Common Clay fields: First Name, Last Name, Email, Company, LinkedIn URL',
								'Field names are case-sensitive in webhook operations',
								'Use consistent field naming across your Clay tables',
							],
							documentation: 'https://www.clay.com/university/guide/http-api-integration-overview',
							timestamp: new Date().toISOString(),
						};
					}

				} else if (resource === 'workspace') {
					if (operation === 'listWorkspaces') {
						// Clay doesn't provide a direct API for listing workspaces
						responseData = {
							success: false,
							operation: 'listWorkspaces',
							message: 'Clay API does not support listing workspaces',
							alternatives: [
								'Find workspace IDs in Clay interface URL (e.g., app.clay.com/workspace/12345)',
								'Check Clay table settings for workspace information',
								'Use Clay\'s sharing features to get workspace details',
							],
							documentation: 'https://www.clay.com/university/guide/workspace-management',
							timestamp: new Date().toISOString(),
						};

					} else if (operation === 'listTables') {
						const workspaceId = this.getNodeParameter('workspaceId', i) as string;

						// Clay doesn't provide a direct API for listing tables
						responseData = {
							success: false,
							operation: 'listTables',
							message: 'Clay API does not support listing tables in workspace',
							workspaceId: workspaceId,
							alternatives: [
								'Find table IDs in Clay interface URL (e.g., app.clay.com/workspace/12345/table/67890)',
								'Check webhook URLs for table IDs',
								'Use Clay\'s table sharing features to get table information',
							],
							documentation: 'https://www.clay.com/university/guide/table-management',
							timestamp: new Date().toISOString(),
						};
					}
				}

				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray(responseData as any),
					{ itemData: { item: i } },
				);

				returnData.push(...executionData);
			} catch (error) {
				if (this.continueOnFail()) {
					const executionData = this.helpers.constructExecutionMetaData(
						[{ json: { error: (error as Error).message } }],
						{ itemData: { item: i } },
					);
					returnData.push(...executionData);
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
