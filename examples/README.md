# Examples

This directory contains example implementations of the package to demonstrate various use cases.

## Project Structure

```
examples/
├── src/
│   ├── App.tsx              # Main application component with routing
│   ├── index.tsx            # Entry point for the application
│   ├── components/           # Reusable components
│   │   ├── Sidebar.tsx      # Navigation sidebar
│   │   └── ExampleContent.tsx # Main content area with routing
│   ├── examples/            # Individual example components
│   │   ├── Example1.tsx
│   │   ├── Example2.tsx
│   │   ├── Example3.tsx
│   │   └── Example4.tsx
│   └── styles.css          # Styling for the examples
├── index.html              # HTML template
├── package.json            # Project dependencies and scripts
└── tsconfig.json           # TypeScript configuration
```

## Features

- **Sidebar Navigation**: Left sidebar with list of examples
- **Main Content Area**: Right side showing selected example content
- **React Router Integration**: Dynamic routing between examples
- **Responsive Design**: Clean layout with proper spacing

## Available Examples

1. **Basic Example** - Core functionality demonstration
2. **Advanced Example** - Advanced features and capabilities
3. **Custom Component** - Custom component usage examples
4. **Integration Example** - Integration with other libraries

## Running the Examples

To start the examples:

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`