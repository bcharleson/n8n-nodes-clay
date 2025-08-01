# Clay Node Examples

This directory contains example n8n workflows demonstrating how to use the Clay community node.

## Available Examples

### 1. Create Record Workflow (`clay-create-record-workflow.json`)

**Purpose**: Demonstrates how to create a new record in a Clay table using manual field mapping.

**Features**:
- Manual trigger for testing
- Manual field mapping mode
- Common Clay fields (First Name, Last Name, Email, Company, LinkedIn URL)
- Proper webhook URL configuration

**Setup**:
1. Import the workflow into your n8n instance
2. Update the `workspaceId` and `tableId` with your actual Clay workspace and table IDs
3. Update the `webhookUrl` with your actual Clay table webhook URL
4. Configure your Clay API credentials
5. Test the workflow

### 2. Update Record Workflow (`clay-update-record-workflow.json`)

**Purpose**: Demonstrates how to update/upsert a record in a Clay table using JSON field mapping and auto-dedupe.

**Features**:
- Manual trigger for testing
- JSON field mapping mode
- Email as unique identifier for auto-dedupe
- Comprehensive field data including phone and status
- Proper error handling for duplicate prevention

**Setup**:
1. Import the workflow into your n8n instance
2. Update the `workspaceId` and `tableId` with your actual Clay workspace and table IDs
3. Update the `webhookUrl` with your actual Clay table webhook URL
4. Ensure auto-dedupe is enabled on your Clay table with Email as the unique field
5. Configure your Clay API credentials
6. Test the workflow

## Getting Your Clay Information

### Finding Workspace and Table IDs

1. **Workspace ID**: 
   - Go to your Clay workspace
   - Look at the URL: `https://app.clay.com/workspace/12345/...`
   - The number `12345` is your workspace ID

2. **Table ID**:
   - Open your Clay table
   - Look at the URL: `https://app.clay.com/workspace/12345/table/67890`
   - The number `67890` is your table ID

### Getting Webhook URL

1. Open your Clay table
2. Click on "Sources" or "Add Data"
3. Select "Webhook" as a data source
4. Copy the webhook URL provided
5. The URL format should be: `https://api.clay.com/v3/sources/webhook/pull-in-data-from-a-webhook-{UUID}`

### Setting Up Auto-Dedupe (for Update Operations)

1. In your Clay table, click on table settings
2. Enable "Auto-dedupe" feature
3. Select the field to use as unique identifier (e.g., Email, LinkedIn URL)
4. Save the settings

## Common Field Names

Clay tables commonly use these field names (case-sensitive):

- `First Name`
- `Last Name`
- `Email`
- `Company`
- `LinkedIn URL`
- `Phone`
- `Title`
- `Website`
- `Industry`
- `Location`
- `Status`

## Tips for Success

1. **Field Names**: Clay field names are case-sensitive. Make sure they match exactly.

2. **Webhook Testing**: Test your webhook URL directly with a tool like Postman before using in n8n.

3. **Auto-Dedupe**: For update operations, ensure auto-dedupe is properly configured in Clay.

4. **Error Handling**: The node provides detailed error messages. Check the execution logs for troubleshooting.

5. **Rate Limits**: Be mindful of Clay's rate limits when processing large amounts of data.

## Troubleshooting

### Common Issues

1. **Invalid Webhook URL**: Ensure the webhook URL follows the correct format and is active.

2. **Field Name Mismatch**: Verify field names match exactly with your Clay table columns.

3. **Authentication Errors**: Check that your Clay API key is correct and has necessary permissions.

4. **Auto-Dedupe Not Working**: Ensure auto-dedupe is enabled and configured with the correct unique field.

### Getting Help

- Check the main README.md for detailed setup instructions
- Review Clay's documentation: https://www.clay.com/university
- Open an issue on GitHub: https://github.com/bcharleson/n8n-nodes-clay/issues
