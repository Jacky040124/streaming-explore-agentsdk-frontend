# Streaming Explore AgentSDK Frontend

A modern React frontend for the content creation workflow using Bun, TypeScript, Tailwind CSS, and shadcn/ui components.

## Overview

This frontend provides an intuitive interface for interacting with the multi-agent content creation workflow. Users can submit prompts and view generated content including research summaries, images, and stories in a beautifully rendered markdown format.

## Features

- ⚡ **Bun Runtime**: Fast JavaScript runtime for development and production
- ⚛️ **React 19**: Latest React with modern hooks and features
- 🎨 **Tailwind CSS**: Utility-first CSS framework
- 🧩 **shadcn/ui**: Beautiful, accessible component library
- 📝 **Markdown Rendering**: Full-featured markdown display with syntax highlighting
- 🔄 **Dual View Mode**: Form view for input, full-screen preview for results
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile
- 🖼️ **Image Display**: Proper handling of generated images
- 📋 **Copy & Download**: Export generated content as markdown files

## Tech Stack

- **Runtime**: [Bun](https://bun.sh) v1.2.18+
- **Framework**: React 19 with TypeScript
- **Styling**: Tailwind CSS v4 with tailwindcss-animate
- **Components**: shadcn/ui with Radix UI primitives
- **Markdown**: react-markdown with GitHub Flavored Markdown support
- **Icons**: Lucide React
- **Build**: Custom Bun build script

## Architecture

### Component Structure
```
src/
├── components/
│   ├── ContentCreator.tsx     # Main content creation interface
│   ├── MarkdownRenderer.tsx   # Markdown display component
│   └── ui/                    # shadcn/ui components
├── utils/
│   └── generateMarkdown.ts    # Markdown generation utilities
├── App.tsx                    # Main application component
├── index.tsx                  # Application entry point
└── index.css                  # Global styles
```

### Features

#### 🎯 **Content Creation Interface**
- Clean form for prompt input
- Real-time loading states
- Error handling and validation
- Quick summary display

#### 🖥️ **View Modes**
- **Form View**: Input interface with compact results
- **Preview View**: Full-screen markdown rendering
- Seamless switching between modes

#### 📝 **Markdown Rendering**
- Custom styled components for all markdown elements
- Syntax highlighting for code blocks
- Image handling and display
- GitHub Flavored Markdown support

## Setup

### Prerequisites
- [Bun](https://bun.sh) v1.2.18 or later
- Node.js compatibility (for IDE support)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Jacky040124/streaming-explore-agentsdk-frontend.git
   cd streaming-explore-agentsdk-frontend
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Start development server**
   ```bash
   bun dev
   ```

The application will be available at `http://localhost:3000`

### Production Build

```bash
# Build for production
bun run build

# Run production server
bun start
```

## API Integration

The frontend connects to the backend API at `http://localhost:8000` by default. Make sure your backend is running before using the application.

### Environment Configuration

Create a `.env.local` file for custom configuration:

```env
# Backend API URL (optional, defaults to http://localhost:8000)
REACT_APP_API_URL=http://localhost:8000
```

## Usage

### Creating Content

1. **Enter a prompt** in the input field (e.g., "space exploration and Mars missions")
2. **Click "Create Content"** to start the workflow
3. **View the summary** in the results card
4. **Click "Full Preview"** to see the complete markdown rendering
5. **Copy or download** the generated content using the action buttons

### Navigation

- **Form View**: Default interface for content creation
- **Preview View**: Full-screen markdown display
- **Back to Editor**: Return to form view from preview
- **Copy/Download**: Available in both views

## Development

### Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── ContentCreator.tsx    # Main interface component
│   │   ├── MarkdownRenderer.tsx  # Markdown display
│   │   └── ui/                   # shadcn/ui components
│   ├── utils/
│   │   └── generateMarkdown.ts   # Markdown utilities
│   ├── App.tsx                   # Root component
│   ├── index.tsx                 # Entry point
│   └── index.css                 # Global styles
├── build.ts                      # Custom build script
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
├── components.json               # shadcn/ui configuration
└── CLAUDE.md                     # Development guidelines
```

### Available Scripts

```bash
# Development server with hot reload
bun dev

# Production build
bun run build

# Production server
bun start
```

### Component Development

The project uses shadcn/ui components. To add new components:

```bash
# Add shadcn/ui components (if npx is available)
npx shadcn@latest add [component-name]
```

### Styling Guidelines

- Use Tailwind CSS classes for styling
- Follow the existing design system
- Utilize shadcn/ui components for consistency
- Maintain responsive design principles

## Backend Integration

This frontend is designed to work with the streaming-explore-agentsdk-backend. Ensure the backend is running for full functionality.

**Backend Repository**: [streaming-explore-agentsdk-backend](https://github.com/Jacky040124/streaming-explore-agentsdk-backend)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Browser Support

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

This project is licensed under the MIT License.