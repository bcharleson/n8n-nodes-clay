# n8n-nodes-clay

[![Clay Logo](https://raw.githubusercontent.com/bcharleson/n8n-nodes-clay/master/icons/clay.png)](https://raw.githubusercontent.com/bcharleson/n8n-nodes-clay/master/icons/clay.png)

A comprehensive n8n community node for Clay - the data enrichment and automation platform that helps you build targeted lead lists, enrich data, and automate your GTM workflows.

[![npm version](https://badge.fury.io/js/n8n-nodes-clay.svg)](https://badge.fury.io/js/n8n-nodes-clay)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub issues](https://img.shields.io/github/issues/bcharleson/n8n-nodes-clay)](https://github.com/bcharleson/n8n-nodes-clay/issues)

## 🚀 What is this?

This node allows you to create, retrieve, update, and manage your Clay table records directly from n8n workflows. It provides seamless integration with Clay's powerful data enrichment platform, enabling you to automate your lead generation and data management processes.

**Perfect for:**
- Automating data enrichment workflows
- Managing lead lists and prospect data
- Integrating Clay with your existing tech stack
- Building sophisticated GTM automation sequences
- Syncing data between Clay and other platforms

## ✨ Features

- **Complete Table Operations**: Create, read, update, and find records in Clay tables
- **Dynamic Field Mapping**: Automatically discover table schemas and field definitions
- **Workspace Management**: List and manage multiple Clay workspaces
- **Smart Error Handling**: Comprehensive error handling with user-friendly messages
- **Production Ready**: Thoroughly tested with robust validation
- **Easy Setup**: Simple authentication with Clay API key

## 📦 Installation

### Community Nodes (Recommended)

For users on n8n v0.187.0+, you can install this node directly through the n8n interface:

1. Go to **Settings > Community Nodes** in your n8n instance
2. Click **Install**
3. Enter `n8n-nodes-clay` and click **Download**
4. Restart your n8n instance
5. The Clay node will appear in your node palette

### Manual Installation

For self-hosted n8n instances:

```bash
# Navigate to your n8n installation directory
cd ~/.n8n

# Install the node
npm install n8n-nodes-clay

# Restart n8n
```

### Docker Installation

For Docker-based n8n installations:

```dockerfile
# Add to your Dockerfile or docker-compose.yml
RUN npm install -g n8n-nodes-clay

# Or install at runtime
docker exec -it n8n npm install n8n-nodes-clay
```

### Requirements

- n8n version 0.187.0 or higher
- Node.js 18.10.0 or higher
- Valid Clay account with API access

## 🔧 Setup & Authentication

### Getting Your Clay API Key

1. **Log into Clay**: Visit [app.clay.com](https://app.clay.com) and sign in
2. **Navigate to Settings**: Click your profile and go to **Settings**
3. **Find API Section**: Look for the API or Integrations section
4. **Generate API Key**: Create a new API key or copy your existing key
5. **Copy the Key**: Save this key securely - you'll need it for n8n

### Creating n8n Credentials

1. **Add Credential**: In n8n, go to **Credentials** → **Add Credential**
2. **Select Type**: Search for and select "Clay API"
3. **Enter API Key**: Paste your Clay API key
4. **Test Connection**: Click "Test" to verify the connection works
5. **Save**: Give your credential a name and save it

## 🎯 Available Operations

This node provides comprehensive access to Clay's data management platform:

### 📊 Table Operations

Perfect for managing your Clay table data:

- **Create Record**: Add new records to Clay tables with field mapping
- **Update Record**: Modify existing records in your tables
- **Find Record**: Search for records based on field criteria
- **Get Record**: Retrieve specific records by ID

### 🏢 Workspace Management

Organize and manage your Clay workspaces:

- **List Workspaces**: Get all available workspaces
- **List Tables**: Get tables within a specific workspace
- **Get Table Schema**: Discover field definitions and data types

## 💡 Usage Examples

### Example 1: Create New Lead Record

```json
{
  "nodes": [
    {
      "name": "Create Clay Record",
      "type": "n8n-nodes-clay.clayApi",
      "parameters": {
        "resource": "table",
        "operation": "createRecord",
        "workspaceId": "12345",
        "tableId": "67890",
        "fields": {
          "First Name": "John",
          "Last Name": "Doe",
          "Email": "john.doe@example.com",
          "Company": "Example Corp"
        }
      }
    }
  ]
}
```

### Example 2: Find Records by Email

```json
{
  "nodes": [
    {
      "name": "Find Clay Records",
      "type": "n8n-nodes-clay.clayApi",
      "parameters": {
        "resource": "table",
        "operation": "findRecord",
        "workspaceId": "12345",
        "tableId": "67890",
        "searchField": "Email",
        "searchValue": "john.doe@example.com"
      }
    }
  ]
}
```

## 🛠️ Development

### Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/bcharleson/n8n-nodes-clay.git
   cd n8n-nodes-clay
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Build the node**:
   ```bash
   npm run build
   ```

4. **Link for local testing**:
   ```bash
   # Link the package globally
   npm link
   
   # In your n8n installation directory
   npm link n8n-nodes-clay
   ```

5. **Start n8n in development mode**:
   ```bash
   n8n start --tunnel
   ```

### Testing

Run the test suite:

```bash
npm test
```

## 📚 Documentation

For detailed usage examples and API reference, visit the [Clay API Documentation](https://www.clay.com/university/guide/http-api-integration-overview).

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

MIT

## 🆘 Support

For issues and feature requests, please visit: [https://github.com/bcharleson/n8n-nodes-clay/issues](https://github.com/bcharleson/n8n-nodes-clay/issues)

---

Built with ❤️ by [Brandon Charleson](https://github.com/bcharleson)
