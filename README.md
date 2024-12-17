# Palo Santo

A static site built with [Eleventy](https://www.11ty.dev/) (11ty) and [Vite](https://vitejs.dev/).

## Features

- Static site generation with Eleventy
- Modern build tooling with Vite integration
- Nunjucks templating engine
- Support for multiple template formats (Markdown, Nunjucks, HTML, Liquid)

## Prerequisites

- Node.js (Latest LTS version recommended)
- npm (comes with Node.js)

## Installation

```bash
# Clone the repository
git clone [your-repo-url]

# Navigate to the project directory
cd palo-santo

# Install dependencies
npm install
```

## Development

Start the development server:

```bash
npm start
```

This will:
- Start a local development server
- Enable live reloading
- Watch for file changes
- Run at `http://localhost:8080` by default

## Build

Build the site for production:

```bash
npm run build
```

This generates the static site in the `_site` directory.

## Project Structure

```
palo-santo/
├── content/           # Main content directory
│   ├── index.njk     # Main template file
│   ├── _data/        # Global data files
│   └── _includes/    # Template partials and layouts
├── _site/            # Generated static site (not versioned)
├── eleventy.config.js # Eleventy configuration
└── package.json      # Project dependencies and scripts
```

## Template Formats

The project is configured to process the following template formats:
- Markdown (.md)
- Nunjucks (.njk)
- HTML (.html)
- Liquid (.liquid)
- JavaScript (.11ty.js)

## Technologies

- [Eleventy](https://www.11ty.dev/) - Static site generator
- [Vite](https://vitejs.dev/) - Next generation frontend tooling
- [Nunjucks](https://mozilla.github.io/nunjucks/) - Templating engine

## License

ISC
