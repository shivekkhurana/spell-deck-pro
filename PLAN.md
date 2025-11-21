# Spell Deck Pro - Implementation Plan

## Overview
A proof-of-concept presentation software focused on contextual spell checking for speaker notes. The application allows users to create slides with multiple speaker notes and perform efficient, contextual spell checking.

## Tech Stack
- **Build Tool**: Vite
- **Runtime**: Bun
- **Language**: TypeScript
- **Frontend Framework**: ReactJS (SPA mode)
- **State Management**: Jotai
- **AI Integration**: AI SDK (Vercel AI SDK)
- **Styling**: Tailwind CSS
- **Rich Text Editor**: Quill
- **Code Formatter**: Prettier (with format on save)

## Programming Paradigm
- **Approach**: Functional Programming
- **Principles**:
  - Use pure functions wherever possible
  - Prefer immutability (avoid direct mutations)
  - Use functional composition and higher-order functions
  - Leverage map, filter, reduce, and other functional array methods
  - Keep functions small, focused, and composable
  - Avoid side effects in pure functions (isolate side effects to specific boundaries)
  - Use functional patterns for state transformations (e.g., immutable updates)

## Project Structure

```
spell-deck-pro/
├── src/
│   ├── components/
│   │   ├── SlideEditor/
│   │   │   ├── SlideEditor.tsx
│   │   │   └── SlideEditor.types.ts
│   │   ├── SlideMiniMap/
│   │   │   ├── SlideMiniMap.tsx
│   │   │   ├── SlideThumbnail.tsx
│   │   │   └── SlideMiniMap.types.ts
│   │   ├── SpeakerNotes/
│   │   │   ├── SpeakerNotes.tsx
│   │   │   ├── SpeakerNoteCard.tsx
│   │   │   ├── AddNoteButton.tsx
│   │   │   └── SpeakerNotes.types.ts
│   │   ├── SpellCheck/
│   │   │   ├── SpellCheckIndicator.tsx
│   │   │   └── SpellCheck.types.ts
│   │   └── Layout/
│   │       ├── MainLayout.tsx
│   │       ├── LeftSidebar.tsx
│   │       ├── RightSidebar.tsx
│   │       ├── CenterPanel.tsx
│   │       └── Layout.types.ts
│   ├── atoms/
│   │   ├── slides.ts
│   │   │   └── slides.types.ts
│   │   ├── currentSlide.ts
│   │   │   └── currentSlide.types.ts
│   │   └── speakerNotes.ts
│   │       └── speakerNotes.types.ts
│   ├── services/
│   │   ├── spellCheckService.ts
│   │   │   └── spellCheckService.types.ts
│   │   └── aiClient.ts
│   │       └── aiClient.types.ts
│   ├── utils/
│   │   ├── debounce.ts
│   │   └── contextBuilder.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
├── public/
├── .env.example
├── .env
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── prettier.config.js
├── .prettierignore
├── bunfig.toml
└── README.md
```

## Data Models

### Slide
```typescript
interface Slide {
  id: string;
  title?: string;
  content: string; // Rich text content (HTML from Quill)
  order: number;
}
```

### SpeakerNote
```typescript
interface SpeakerNote {
  id: string;
  slideId: string;
  content: string; // Plain text
  order: number;
  spellCheckStatus?: 'pending' | 'checking' | 'checked' | 'error';
}
```

Note: SpellCheckResult types will be defined later when implementing spell check functionality.

## State Management (Jotai Atoms)

### Core Atoms
1. **slidesAtom**: Array of all slides
2. **currentSlideIdAtom**: ID of currently focused slide
3. **speakerNotesAtom**: Map/Array of speaker notes keyed by slideId (includes spellCheckStatus in each note)

### Derived Atoms
1. **currentSlideAtom**: Derived from slidesAtom and currentSlideIdAtom
2. **currentSlideNotesAtom**: Derived from speakerNotesAtom and currentSlideIdAtom
3. **coverPageAtom**: Derived from slidesAtom (first slide, order === 0)

## UI Components Breakdown

### 1. MainLayout
- Three-column layout: Left Sidebar | Center Panel | Right Sidebar
- Responsive (but desktop-first for PoC)

### 2. Left Sidebar (SlideMiniMap)
- Vertical list of slide thumbnails
- Shows slide number and preview
- Click to switch current slide
- "Add Slide" button at top or bottom
- Active slide highlighted

### 3. Center Panel (SlideEditor)
- Displays current slide
- Rich text editor (basic: bold, italic, underline, lists)
- Simple toolbar for formatting
- Full-width, scrollable if needed

### 4. Right Sidebar (SpeakerNotes)
- Header: "Speaker Notes" title
- Prominent "Add Note" button (large, visible)
- List of speaker note cards
- Each card:
  - Note content (editable textarea)
  - Spell check status indicator (pending/checking/checked/error)
  - Delete button (optional)
  - Order number

## Spell Checking Workflow

### Context Building Strategy
1. **Context Sources**:
   - Cover page (first slide) - title and content
   - Current slide title
   - Current slide content
   - Note: We check one note at a time (implementation details later)

2. **Efficiency Considerations**:
   - Debounce spell check requests (wait for user to stop typing)
   - Only check notes that have changed
   - Cache results per note content hash (optional, for later)

3. **Spell Check Trigger**:
   - Auto: Debounced check after user stops typing in a note
   - Debounce delay: Configurable via env (default 2000ms)

4. **AI Prompt Structure** (to be refined later):
   ```
   You are a spell checker for presentation speaker notes. 
   Context: [Cover page + Current slide title + Current slide content]
   Text to check: [Speaker note content]
   
   Return JSON with spell check results
   ```

### Spell Check Service Flow
1. User types in a speaker note
2. Debounce timer starts (wait for user to stop typing)
3. After debounce period, build context from cover page + current slide
4. Call AI SDK with context + note content
5. Update note's spellCheckStatus
6. Display results in UI (implementation details later)

Note: Spell check result handling and UI display will be implemented later.

## Environment Variables

### .env.example
```
# AI Provider Configuration
AI_PROVIDER=openai  # or anthropic, etc.
OPENAI_API_KEY=your_openai_api_key_here
# OR
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Spell Check Configuration
SPELL_CHECK_MODEL=gpt-4o-mini  # or claude-3-haiku, etc.
SPELL_CHECK_DEBOUNCE_MS=2000  # milliseconds to wait before auto-check
ENABLE_AUTO_SPELL_CHECK=true  # enable/disable auto checking

# Optional: Rate limiting
MAX_SPELL_CHECKS_PER_MINUTE=30
```

## Implementation Phases

### Phase 1: Project Setup
- [ ] Initialize Bun project with Vite
- [ ] Set up TypeScript configuration
- [ ] Set up Tailwind CSS (config, PostCSS)
- [ ] Install dependencies (React, Jotai, AI SDK, Quill, etc.)
- [ ] Set up Prettier (config file, format on save)
- [ ] Create .env.example and .env files
- [ ] Set up Vite dev server and build scripts

### Phase 2: Core State & Types
- [ ] Define TypeScript interfaces/types (next to respective files as .types.ts)
- [ ] Set up Jotai atoms for slides, currentSlide, and speakerNotes
- [ ] Include spellCheckStatus in speakerNotes atom structure
- [ ] Create basic state management functions
- [ ] Test state updates manually

### Phase 3: Basic UI Layout
- [ ] Create MainLayout component
- [ ] Implement three-column layout with Tailwind
- [ ] Add basic styling (Pitch/Google Slides-like UI)
- [ ] Ensure responsive structure

### Phase 4: Slide Management
- [ ] Implement SlideMiniMap component
- [ ] Add slide creation functionality
- [ ] Implement slide selection/switching
- [ ] Create SlideEditor component (basic text input first)
- [ ] Connect slide editor to state

### Phase 5: Speaker Notes
- [ ] Implement SpeakerNotes sidebar component
- [ ] Create SpeakerNoteCard component
- [ ] Add "Add Note" button functionality
- [ ] Implement note editing (textarea)
- [ ] Add note deletion (optional)
- [ ] Connect to state management

### Phase 6: Rich Text Editor
- [ ] Integrate Quill editor into SlideEditor
- [ ] Configure Quill with basic formatting (bold, italic, underline, lists)
- [ ] Ensure content is stored properly (HTML format)
- [ ] Style Quill toolbar to match UI

### Phase 7: Spell Check Integration
- [ ] Set up AI SDK client
- [ ] Create context builder utility (cover page + current slide title + current slide content)
- [ ] Implement spellCheckService
- [ ] Add debouncing logic for auto spell check
- [ ] Integrate debounced spell check into note textarea
- [ ] Update note's spellCheckStatus in atom
- [ ] Display spell check status indicator in note cards
- [ ] Note: Spell check results display will be implemented later

### Phase 8: Polish & Testing
- [ ] Test spell check accuracy
- [ ] Test context building
- [ ] Verify efficiency (no unnecessary API calls)
- [ ] Basic error handling
- [ ] Loading states

## Dependencies (package.json)

```json
{
  "dependencies": {
    "react": "^18.x",
    "react-dom": "^18.x",
    "jotai": "^2.x",
    "ai": "^3.x",
    "@ai-sdk/openai": "^1.x",
    "react-quill": "^2.x",
    "quill": "^1.x"
  },
  "devDependencies": {
    "@types/react": "^18.x",
    "@types/react-dom": "^18.x",
    "@types/node": "^20.x",
    "typescript": "^5.x",
    "bun-types": "latest",
    "vite": "^5.x",
    "@vitejs/plugin-react": "^4.x",
    "tailwindcss": "^3.x",
    "postcss": "^8.x",
    "autoprefixer": "^10.x",
    "prettier": "^3.x"
  }
}
```

## Key Design Decisions

1. **Spell Check Timing**: 
   - Auto with debounce (configurable delay, default 2000ms)
   - Triggers after user stops typing in a speaker note
   - Rationale: Efficient, non-intrusive, reduces API calls

2. **Context Strategy**:
   - Cover page (first slide) - title and content
   - Current slide title
   - Current slide content
   - Rationale: Provides presentation context without overloading

3. **Rich Text Editor**:
   - Quill editor for slides
   - Basic formatting: bold, italic, underline, lists
   - Rationale: Simple API, good UX, sufficient for PoC

4. **State Management**:
   - spellCheckStatus included in SpeakerNote interface
   - Managed within speakerNotes atom
   - Rationale: Keeps related data together, simpler state structure

5. **Type Organization**:
   - Types defined next to files as .types.ts
   - Rationale: Better colocation, easier to maintain

6. **State Persistence**:
   - In-memory only (no database)
   - Can add localStorage later if needed
   - Rationale: PoC doesn't need persistence

7. **Functional Programming**:
   - All code should follow functional programming principles
   - Use pure functions for transformations and computations
   - State updates should be immutable (create new objects/arrays rather than mutating)
   - Prefer functional composition over imperative code
   - Use functional utilities (map, filter, reduce, etc.) over loops
   - Rationale: Better testability, predictability, and maintainability

8. **Code Formatting**:
   - Use Prettier for consistent code formatting
   - Configure format on save in editor settings
   - Prettier config should align with functional programming style
   - Rationale: Consistent code style, reduces formatting debates, improves readability

## Code Formatting (Prettier)

### Configuration
- **Config File**: `prettier.config.js`
- **Format on Save**: Enabled in editor settings
- **Recommended Settings**:
  ```javascript
  {
    semi: true,
    singleQuote: true,
    tabWidth: 2,
    trailingComma: 'es5',
    printWidth: 80,
    arrowParens: 'always',
  }
  ```

### Editor Setup
- Configure editor (VS Code/Cursor) to format on save
- Use Prettier as default formatter
- Add `.prettierignore` for build artifacts and dependencies

## Implementation Notes

- **Spell Check Results**: Results display and detailed error handling will be implemented later
- **One Note at a Time**: Spell checking logic for one note at a time will be implemented later
- **Cover Page**: First slide (order === 0) is treated as the cover page for context
- **Functional Programming**: All implementations should follow functional programming principles:
  - State updates: Use immutable patterns (e.g., `[...array, newItem]` instead of `array.push(newItem)`)
  - Utility functions: Write pure functions that take inputs and return outputs without side effects
  - Component logic: Extract logic into pure functions outside components when possible
  - Data transformations: Use functional methods (map, filter, reduce) and composition
  - Avoid: Direct mutations, imperative loops where functional alternatives exist, side effects in pure functions
- **Code Formatting**: All code should be formatted with Prettier on save to maintain consistency

## Next Steps

1. Review this plan
2. Adjust based on feedback if needed
3. Once approved, proceed with Phase 1 implementation

