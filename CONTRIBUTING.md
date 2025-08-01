# Contributing to n8n-nodes-clay

Thank you for your interest in contributing to the Clay community node for n8n! This guide will help you get started with contributing to the project.

## 🚀 Getting Started

### Prerequisites

- Node.js 18.10.0 or higher
- npm or yarn package manager
- Git
- Clay account with API access
- n8n development environment

### Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/your-username/n8n-nodes-clay.git
   cd n8n-nodes-clay
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Build the Project**
   ```bash
   npm run build
   ```

4. **Link for Local Development**
   ```bash
   npm link
   # In your n8n installation directory
   npm link n8n-nodes-clay
   ```

5. **Start Development**
   ```bash
   npm run dev
   ```

## 🏗️ Project Structure

```
n8n-nodes-clay/
├── credentials/           # Authentication credentials
│   └── ClayApi.credentials.ts
├── nodes/                # Node implementations
│   ├── ClayApi/
│   │   └── ClayApi.node.ts
│   └── generic.functions.ts
├── icons/                # Node icons
├── examples/             # Example workflows
├── test/                 # Testing guides and utilities
├── docs/                 # Documentation
└── dist/                 # Built files (generated)
```

## 🛠️ Development Guidelines

### Code Style

- **TypeScript**: All code should be written in TypeScript
- **ESLint**: Follow the ESLint configuration
- **Prettier**: Use Prettier for code formatting
- **Naming**: Use descriptive names for variables and functions

### Commit Messages

Follow conventional commit format:
```
type(scope): description

Examples:
feat(node): add batch record creation
fix(validation): improve webhook URL validation
docs(readme): update installation instructions
test(integration): add webhook error handling tests
```

### Branch Naming

- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `test/description` - Testing improvements

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run specific test types
npm run test:unit
npm run test:integration
npm run test:e2e

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Writing Tests

1. **Unit Tests**: Test individual functions and components
2. **Integration Tests**: Test node operations with mock data
3. **E2E Tests**: Test with real Clay API (use test environment)

### Test Guidelines

- Write tests for all new functionality
- Maintain or improve test coverage
- Use descriptive test names
- Mock external dependencies appropriately
- Test both success and error scenarios

## 📝 Documentation

### Code Documentation

- Add JSDoc comments for all public functions
- Include parameter descriptions and return types
- Document complex logic with inline comments

### User Documentation

- Update README.md for new features
- Add examples for new functionality
- Update API documentation
- Include troubleshooting information

## 🐛 Bug Reports

When reporting bugs, please include:

1. **Environment Information**
   - n8n version
   - Node.js version
   - Operating system
   - Clay node version

2. **Bug Description**
   - Clear description of the issue
   - Steps to reproduce
   - Expected vs actual behavior
   - Error messages (if any)

3. **Additional Context**
   - Workflow JSON (if applicable)
   - Screenshots (if helpful)
   - Related issues or PRs

## ✨ Feature Requests

For new features:

1. **Check Existing Issues**: Search for similar requests
2. **Clay API Limitations**: Consider Clay's API capabilities
3. **Use Cases**: Describe specific use cases
4. **Implementation Ideas**: Suggest implementation approaches

## 🔄 Pull Request Process

### Before Submitting

1. **Test Your Changes**
   - Run all tests locally
   - Test with real Clay API
   - Verify no regressions

2. **Update Documentation**
   - Update README if needed
   - Add/update code comments
   - Update examples if applicable

3. **Check Code Quality**
   - Run linting: `npm run lint`
   - Fix any linting errors: `npm run lintfix`
   - Format code: `npm run format`

### Submitting PR

1. **Create Pull Request**
   - Use descriptive title
   - Fill out PR template
   - Link related issues

2. **PR Description Should Include**
   - What changes were made
   - Why changes were needed
   - How to test the changes
   - Any breaking changes

3. **Review Process**
   - Maintainers will review your PR
   - Address feedback promptly
   - Keep PR updated with main branch

## 🏷️ Release Process

### Version Numbering

We follow [Semantic Versioning](https://semver.org/):
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Types

```bash
# Development releases
npm run publish:dev

# Beta releases
npm run publish:beta

# Release candidates
npm run publish:rc

# Stable releases
npm run publish:stable
```

## 🤝 Community Guidelines

### Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Respect different opinions and approaches

### Communication

- **GitHub Issues**: Bug reports and feature requests
- **Pull Requests**: Code contributions and discussions
- **Discussions**: General questions and community chat

## 🎯 Areas for Contribution

### High Priority

1. **Error Handling**: Improve error messages and handling
2. **Testing**: Expand test coverage
3. **Documentation**: Improve user guides and examples
4. **Performance**: Optimize API requests and data handling

### Medium Priority

1. **New Features**: Additional Clay operations (if API supports)
2. **Validation**: Enhanced input validation
3. **Examples**: More workflow examples
4. **Integration**: Better integration with other n8n nodes

### Low Priority

1. **UI/UX**: Improve node interface
2. **Logging**: Enhanced debugging capabilities
3. **Utilities**: Helper functions and utilities

## 📚 Resources

### Clay Resources

- [Clay API Documentation](https://www.clay.com/university/guide/http-api-integration-overview)
- [Clay Webhook Guide](https://www.clay.com/university/guide/webhook-integration-guide)
- [Clay University](https://www.clay.com/university)

### n8n Resources

- [n8n Node Development](https://docs.n8n.io/integrations/creating-nodes/)
- [n8n Community Nodes](https://docs.n8n.io/integrations/community-nodes/)
- [n8n GitHub](https://github.com/n8n-io/n8n)

### Development Tools

- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [ESLint Rules](https://eslint.org/docs/rules/)
- [Jest Testing Framework](https://jestjs.io/docs/getting-started)

## 🙏 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes for significant contributions
- GitHub contributors page

Thank you for contributing to n8n-nodes-clay! 🎉
