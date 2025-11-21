# Spell Deck Pro

A proof-of-concept presentation software focused on contextual spell checking for speaker notes.

## Features

- Create and manage multiple slides
- Rich text editing for slide content
- Multiple speaker notes per slide
- Contextual AI-powered spell checking
- Real-time spell check status indicators

## Tech Stack

- **Build Tool**: Vite
- **Runtime**: Bun
- **Language**: TypeScript
- **Frontend Framework**: ReactJS (SPA mode)
- **State Management**: Jotai
- **AI Integration**: AI SDK (Vercel AI SDK)
- **Styling**: Tailwind CSS
- **Rich Text Editor**: Quill

## Setup

1. Install dependencies:

   ```bash
   bun install
   ```

2. Configure environment variables:
   Create a `.env` file with the following variables:

   ```bash
   ANTHROPIC_API_KEY=your_anthropic_api_key_here
   SPELL_CHECK_MODEL=claude-3-haiku-20240307
   SPELL_CHECK_DEBOUNCE_MS=2000
   ```

3. Start the development server:

   ```bash
   bun run dev
   ```

4. Build for production:
   ```bash
   bun run build
   ```

## Environment Variables

Required environment variables:

- `ANTHROPIC_API_KEY`: Your Anthropic/Claude API key
- `SPELL_CHECK_MODEL`: Model to use for spell checking (default: `claude-3-haiku-20240307`)
- `SPELL_CHECK_DEBOUNCE_MS`: Debounce delay in milliseconds (default: 2000)

## Project Structure

```
src/
├── components/    # React components
├── atoms/         # Jotai state atoms
├── services/      # Business logic services
├── utils/         # Utility functions
├── App.tsx        # Main app component
└── main.tsx       # Entry point
```

## Development

The project follows functional programming principles:

- Pure functions where possible
- Immutable state updates
- Functional composition
- No direct mutations

Code is automatically formatted with Prettier on save.
