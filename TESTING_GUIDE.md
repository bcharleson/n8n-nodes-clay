# Testing and Deployment Guide for n8n-nodes-clay

This guide provides comprehensive instructions for testing and deploying the Clay community node for n8n.

## 🧪 Testing Process

### Prerequisites

- Node.js 18.10.0 or higher
- n8n instance (local or cloud)
- Clay account with API access
- Git

### 1. Local Development Setup

```bash
# Clone the repository
git clone https://github.com/bcharleson/n8n-nodes-clay.git
cd n8n-nodes-clay

# Install dependencies
npm install

# Build the project
npm run build
```

### 2. Link for Local Testing

```bash
# Link the package globally
npm link

# Navigate to your n8n installation directory
cd ~/.n8n

# Link the Clay node
npm link n8n-nodes-clay

# Restart n8n
pkill -f n8n
n8n start
```

### 3. Verification Checklist

#### ✅ Installation Verification
- [ ] Node appears in n8n palette under "Transform" category
- [ ] Clay icon displays correctly
- [ ] Node can be added to workflow canvas

#### ✅ Credentials Testing
- [ ] Clay API credential type is available
- [ ] Can create new Clay API credential
- [ ] API key field accepts input
- [ ] Credential can be saved successfully

#### ✅ Node Configuration
- [ ] Resource dropdown shows "Table" option
- [ ] Operation dropdown shows available operations:
  - [ ] Create Record
  - [ ] Update Record (Upsert)
- [ ] Required fields are marked as required
- [ ] Field descriptions are clear and helpful

#### ✅ Functional Testing

**Create Record Operation:**
- [ ] Webhook URL field accepts valid Clay webhook URLs
- [ ] Field mapping works in both manual and JSON modes
- [ ] Records are successfully created in Clay table
- [ ] Error handling works for invalid webhook URLs
- [ ] Error handling works for invalid field data

**Update Record Operation:**
- [ ] Auto-dedupe functionality works correctly
- [ ] Existing records are updated when unique identifier matches
- [ ] New records are created when no match is found
- [ ] Error handling works for duplicate prevention

### 4. Integration Testing

#### Test with Real Clay Environment

1. **Setup Test Table in Clay:**
   ```
   - Create a test workspace
   - Create a test table with sample fields
   - Enable webhook integration
   - Copy webhook URL
   ```

2. **Test Create Record:**
   ```
   - Configure Clay node with webhook URL
   - Map test data to table fields
   - Execute workflow
   - Verify record appears in Clay table
   ```

3. **Test Update Record:**
   ```
   - Enable auto-dedupe in Clay table
   - Configure unique identifier field
   - Test updating existing record
   - Test creating new record
   ```

## 🚀 Deployment Process

### Micro-Versioning Strategy

For testing iterations and community feedback:

```bash
# Development versions (for testing)
npm version prerelease --preid=dev --no-git-tag-version
npm publish --tag dev

# Beta versions (for community testing)
npm version prerelease --preid=beta
npm publish --tag beta

# Release candidates (for final testing)
npm version prerelease --preid=rc
npm publish --tag rc

# Stable release (for production)
npm version patch  # or minor/major
npm publish
```

### Version Examples
- `1.0.0-dev.1` - Development version
- `1.0.0-beta.1` - Beta version for community testing
- `1.0.0-rc.1` - Release candidate
- `1.0.0` - Stable release

### Pre-Deployment Checklist

#### ✅ Code Quality
- [ ] All TypeScript compilation passes without errors
- [ ] Build process completes successfully
- [ ] No console.log statements in production code
- [ ] Error handling is comprehensive

#### ✅ Package Configuration
- [ ] package.json version is updated
- [ ] package.json includes correct n8n configuration
- [ ] All required files are included in "files" array
- [ ] No runtime dependencies (only devDependencies)

#### ✅ Documentation
- [ ] README.md is updated and accurate
- [ ] Installation instructions are clear
- [ ] Usage examples are working
- [ ] API documentation is current

### Deployment Commands

```bash
# 1. Final build
npm run build

# 2. Version bump (choose appropriate level)
npm version patch  # for bug fixes
npm version minor  # for new features
npm version major  # for breaking changes

# 3. Publish to npm
npm publish

# 4. Create GitHub release
git push origin main --tags
```

## 🔍 Validation Tools

### n8n Community Package Scanner

```bash
# Run the official n8n validation tool
npx @n8n/scan-community-package

# This checks for:
# - Proper package structure
# - n8n compatibility
# - Security issues
# - Best practices compliance
```

### Manual Validation

1. **Package Structure:**
   ```
   ✅ dist/ folder contains compiled files
   ✅ index.js exists and is empty
   ✅ package.json has correct n8n configuration
   ✅ Icons are properly placed
   ```

2. **n8n Integration:**
   ```
   ✅ Node loads without errors
   ✅ Credentials work correctly
   ✅ Operations execute successfully
   ✅ Error messages are user-friendly
   ```

## 🐛 Troubleshooting

### Common Issues

1. **Node doesn't appear in palette:**
   ```bash
   # Check if package is linked correctly
   npm list n8n-nodes-clay
   
   # Restart n8n completely
   pkill -f n8n
   n8n start
   ```

2. **Build failures:**
   ```bash
   # Clear cache and rebuild
   rm -rf node_modules dist
   npm install
   npm run build
   ```

3. **TypeScript errors:**
   ```bash
   # Check TypeScript version
   tsc --version
   
   # Ensure compatibility with n8n types
   npm install --save-dev typescript@^5.5.3
   ```

### Debug Mode

Enable debug logging for troubleshooting:

```bash
export DEBUG=n8n:*
n8n start
```

## 📊 Testing Metrics

Track these metrics during testing:

- **Installation Success Rate**: % of successful installations
- **Node Load Time**: Time for node to appear in palette
- **Operation Success Rate**: % of successful operations
- **Error Rate**: % of operations that result in errors
- **User Feedback**: Community feedback and issues

## 🎯 Success Criteria

The node is ready for production when:

- [ ] All functional tests pass
- [ ] Integration tests with real Clay API work
- [ ] n8n community package scanner passes
- [ ] Documentation is complete and accurate
- [ ] No critical bugs or security issues
- [ ] Community feedback is positive

## 📞 Support

For testing issues:
- GitHub Issues: https://github.com/bcharleson/n8n-nodes-clay/issues
- n8n Community: https://community.n8n.io/
