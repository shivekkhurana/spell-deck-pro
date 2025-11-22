# Context-Aware Spell Checker Implementation Plan

## Overview

This document outlines the plan to implement a two-stage context-aware spell checker for speaker notes:

1. **Stage 1**: Fast in-browser spell checking using WASM (`spellchecker-wasm`)
2. **Stage 2**: If errors found, call Claude Haiku with context for intelligent corrections

## Architecture Flow

```
User types note → Debounce (2s) →
  ↓
Stage 1: In-browser WASM spell check
  ↓
  Has errors? → NO → Done (no errors)
  ↓ YES
Stage 2: Call Claude Haiku with:
  - System prompt (context-aware)
  - Note content
  ↓
Parse Claude response (JSON)
  ↓
Display recommendations as clickable buttons
  ↓
User clicks → Replace text in note
```

## Dependencies

### New Package

- `spellchecker-wasm` - In-browser spell checking using WebAssembly

### Existing Dependencies (Already Installed)

- `ai` - AI SDK for Claude integration
- `@ai-sdk/anthropic` - Anthropic provider
- `debounce` utility (already exists in `src/utils/debounce.ts`)

## Pure Functions to Create

### 1. `spellcheckWasm(text: string)`

**Location**: `src/services/spellCheckService/wasmSpellChecker.ts`

**Purpose**: Run in-browser spell check using WASM

**Input**:

- `text: string` - The note content to check

**Output**:

```typescript
interface WasmSpellCheckResult {
  errors: Array<{
    word: string; // The misspelled word
    position: number; // Character position in text
    suggestions?: string[]; // Optional suggestions from WASM
  }>;
  hasErrors: boolean;
}
```

**Implementation Notes**:

- Initialize WASM spellchecker (may need async initialization)
- Split text into words and check each
- Return structured error data
- Handle edge cases (empty text, special characters, etc.)

---

### 2. `callClaudeHaiku(systemPrompt: string, noteContent: string)`

**Location**: `src/services/spellCheckService/aiSpellChecker.ts`

**Purpose**: Call Claude Haiku for context-aware spell checking

**Input**:

- `systemPrompt: string` - Context-aware system prompt (built from slide context)
- `noteContent: string` - The note content to check

**Output**:

```typescript
interface AISpellCheckResult {
  isCorrect: boolean;
  errors: Array<{
    word: string; // Misspelled word
    suggestions: string[]; // AI suggestions
    context?: string; // Why this might be an error
    position?: number; // Optional position if provided
  }>;
}
```

**Implementation Notes**:

- Use existing `aiClient.ts` pattern but create separate function
- Construct prompt that includes:
  - System prompt (context from slides)
  - Note content
- Parse JSON response from Claude
- Handle errors gracefully

---

### 3. `contextAwareSpellCheck(systemPrompt: string, noteContent: string)`

**Location**: `src/services/spellCheckService/contextAwareSpellCheck.ts`

**Purpose**: Orchestrate the two-stage spell checking process

**Input**:

- `systemPrompt: string` - Context-aware system prompt
- `noteContent: string` - The note content to check

**Output**:

```typescript
interface ContextAwareSpellCheckResult {
  stage: 'wasm' | 'ai' | 'none';
  hasErrors: boolean;
  errors: Array<{
    word: string;
    suggestions: string[];
    context?: string;
    position?: number;
  }>;
}
```

**Flow**:

1. Run `spellcheckWasm(noteContent)`
2. If `wasmResult.hasErrors === false`:
   - Return early with `{ stage: 'wasm', hasErrors: false, errors: [] }`
3. If `wasmResult.hasErrors === true`:
   - Call `callClaudeHaiku(systemPrompt, noteContent)`
   - Return `{ stage: 'ai', hasErrors: true/false, errors: aiResult.errors }`

**Implementation Notes**:

- Pure function - no side effects
- Handles both stages
- Returns unified result format
- Can be easily tested

---

## Test Plan

### Test File Location

`src/services/spellCheckService/contextAwareSpellCheck.test.ts`

### Test Cases

#### 1. `spellcheckWasm` Tests

- ✅ Empty string returns no errors
- ✅ Correct text returns no errors
- ✅ Single misspelled word detected
- ✅ Multiple misspelled words detected
- ✅ Special characters handled correctly
- ✅ Numbers and punctuation ignored
- ✅ Case sensitivity handled

#### 2. `callClaudeHaiku` Tests

- ✅ Valid API key required
- ✅ Returns structured JSON response
- ✅ Handles Claude API errors
- ✅ Parses response correctly
- ✅ Handles empty note content

#### 3. `contextAwareSpellCheck` Integration Tests

- ✅ No errors → returns early after WASM (no AI call)
- ✅ WASM finds errors → calls Claude
- ✅ Claude returns corrections
- ✅ Handles WASM errors gracefully
- ✅ Handles Claude API failures gracefully
- ✅ System prompt passed correctly

#### 4. Context-Aware Spell Check Test Cases (10 Examples)

These test cases demonstrate how context prevents false positives for domain-specific jargon. Each test case includes:

- **Slide content**: Provides domain context
- **Note without context**: Should error (jargon flagged as misspelling)
- **Note with matching context**: Should NOT error (jargon is correct)

##### Test Case 1: Healthcare - "Hemoglobin" (Health Domain)

**Slide Content:**

```
Title: Blood Analysis Results
Content: The patient's hemoglobin levels were measured at 14.2 g/dL.
We need to monitor hematocrit and check for any signs of anemia.
```

**Note WITHOUT Context (should error):**

```
The hemogloben levels are concerning and we should check the hemotocrit.
```

- Expected: "hemogloben" → "hemoglobin", "hemotocrit" → "hematocrit"

**Note WITH Matching Context (should NOT error):**

```
The hemoglobin levels are concerning and we should check the hematocrit.
```

- Expected: No errors (correct medical terminology in context)

---

##### Test Case 2: Healthcare - "Dyspnea" (Health Domain)

**Slide Content:**

```
Title: Respiratory Assessment
Content: Patient presents with dyspnea and tachypnea.
We'll need to perform auscultation and check oxygen saturation.
```

**Note WITHOUT Context (should error):**

```
The patient is experiencing dispnea and tachypnea, so we'll do auscultation.
```

- Expected: "dispnea" → "dyspnea"

**Note WITH Matching Context (should NOT error):**

```
The patient is experiencing dyspnea and tachypnea, so we'll do auscultation.
```

- Expected: No errors (correct medical terminology)

---

##### Test Case 3: Accounting - "Amortization" (Accounting Domain)

**Slide Content:**

```
Title: Financial Statements Q3
Content: We need to calculate amortization for the new equipment.
The depreciation schedule shows a 5-year straight-line method.
```

**Note WITHOUT Context (should error):**

```
We need to account for amoritization and deprecation in our financials.
```

- Expected: "amoritization" → "amortization", "deprecation" → "depreciation"

**Note WITH Matching Context (should NOT error):**

```
We need to account for amortization and depreciation in our financials.
```

- Expected: No errors (correct accounting terminology)

---

##### Test Case 4: Accounting - "Accrual" (Accounting Domain)

**Slide Content:**

```
Title: Accrual Accounting Principles
Content: We use accrual basis accounting. All revenue is recognized
when earned, not when cash is received. Accounts receivable must be tracked.
```

**Note WITHOUT Context (should error):**

```
We use acrual basis accounting and track accounts recievable.
```

- Expected: "acrual" → "accrual", "recievable" → "receivable"

**Note WITH Matching Context (should NOT error):**

```
We use accrual basis accounting and track accounts receivable.
```

- Expected: No errors (correct accounting terminology)

---

##### Test Case 5: Finance - "Liquidity" (Finance Domain)

**Slide Content:**

```
Title: Portfolio Liquidity Analysis
Content: Our portfolio has strong liquidity ratios. We maintain
adequate cash reserves and monitor our leverage carefully.
```

**Note WITHOUT Context (should error):**

```
We need to improve our liquity ratios and reduce our levrage.
```

- Expected: "liquity" → "liquidity", "levrage" → "leverage"

**Note WITH Matching Context (should NOT error):**

```
We need to improve our liquidity ratios and reduce our leverage.
```

- Expected: No errors (correct finance terminology)

---

##### Test Case 6: Finance - "Derivative" (Finance Domain)

**Slide Content:**

```
Title: Derivatives Trading Strategy
Content: We use derivatives to hedge against market volatility.
Our options portfolio includes calls and puts with various strike prices.
```

**Note WITHOUT Context (should error):**

```
We use derivitives to hedge and our options portfolo includes calls.
```

- Expected: "derivitives" → "derivatives", "portfolo" → "portfolio"

**Note WITH Matching Context (should NOT error):**

```
We use derivatives to hedge and our options portfolio includes calls.
```

- Expected: No errors (correct finance terminology)

---

##### Test Case 7: Manufacturing - "Tolerance" (Manufacturing Domain)

**Slide Content:**

```
Title: Quality Control Specifications
Content: The parts must meet tight tolerances. We use calipers
to measure dimensions and ensure all components are within spec.
```

**Note WITHOUT Context (should error):**

```
The parts need to meet tight tolorances and we use calipers to measure.
```

- Expected: "tolorances" → "tolerances"

**Note WITH Matching Context (should NOT error):**

```
The parts need to meet tight tolerances and we use calipers to measure.
```

- Expected: No errors (correct manufacturing terminology)

---

##### Test Case 8: Manufacturing - "CNC" (Manufacturing Domain)

**Slide Content:**

```
Title: CNC Machining Process
Content: Our CNC machines use G-code programming. We've reduced
cycle time by 20% through optimization of feed rates and spindle speeds.
```

**Note WITHOUT Context (should error):**

```
Our CNC machines use G-code and we've optimized feed rates and spindel speeds.
```

- Expected: "spindel" → "spindle"

**Note WITH Matching Context (should NOT error):**

```
Our CNC machines use G-code and we've optimized feed rates and spindle speeds.
```

- Expected: No errors (correct manufacturing terminology)

---

##### Test Case 9: Marketing - "Segmentation" (Marketing Domain)

**Slide Content:**

```
Title: Customer Segmentation Strategy
Content: We've identified three key segments: millennials, Gen Z,
and baby boomers. Our personas help us target each demographic effectively.
```

**Note WITHOUT Context (should error):**

```
We've identified key segements and created personas for each demografic.
```

- Expected: "segements" → "segments", "demografic" → "demographic"

**Note WITH Matching Context (should NOT error):**

```
We've identified key segments and created personas for each demographic.
```

- Expected: No errors (correct marketing terminology)

---

##### Test Case 10: Marketing - "ROI" and "CTR" (Marketing Domain)

**Slide Content:**

```
Title: Digital Marketing Performance
Content: Our ROI has improved by 35%. The CTR on our email campaigns
is 4.2%, and our conversion rate optimization efforts are paying off.
```

**Note WITHOUT Context (should error):**

```
Our ROI improved and the CTR on our email campains is great.
```

- Expected: "campains" → "campaigns"

**Note WITH Matching Context (should NOT error):**

```
Our ROI improved and the CTR on our email campaigns is great.
```

- Expected: No errors (correct marketing terminology and acronyms)

---

### Test Setup

- Use Node.js test runner (Bun has built-in test runner)
- Mock WASM spellchecker for unit tests
- Mock Claude API calls (or use test API key)
- Test with real WASM in integration tests

---

## UI Implementation Plan (After Tests Pass)

### Components to Create/Modify

#### 1. `SpellCheckRecommendations.tsx`

**Location**: `src/components/SpellCheck/SpellCheckRecommendations.tsx`

**Purpose**: Display spell check recommendations as clickable buttons

**Props**:

```typescript
interface SpellCheckRecommendationsProps {
  errors: Array<{
    word: string;
    suggestions: string[];
    context?: string;
  }>;
  onReplace: (oldWord: string, newWord: string) => void;
  onIgnore: (word: string) => void; // New: ignore individual suggestion
  onAcceptAll: () => void; // New: accept all suggestions at once
}
```

**UI Design**:

- **Header Section**:
  - Show count of errors found (e.g., "3 spelling errors found")
  - "Accept All" button (primary action) - applies all corrections at once
  - Only show if there are multiple errors

- **Error Cards** (one per error):
  - Format: `[misspelled_word] → [correct_word]`
  - Arrow icon between old and new word
  - Primary action button: "Replace" → calls `onReplace(oldWord, newWord)`
  - Secondary action: "Ignore" button (X icon or text) → calls `onIgnore(word)`
  - Show context tooltip if available
  - Multiple suggestions? Show dropdown or list to select which correction
  - When ignored, card is dimmed/removed from view (or marked as ignored)

- **Visual States**:
  - Hover states for all interactive elements
  - Disabled state for already-processed errors
  - Visual feedback when suggestion is applied or ignored

#### 2. Modify `SpeakerNoteCard.tsx`

**Location**: `src/components/SpeakerNotes/SpeakerNoteCard.tsx`

**Changes**:

- Add spell check recommendations below text input
- Show loading state during spell check
- Show error state if spell check fails
- Handle text replacement when user clicks recommendation
- Handle "Accept All" action - replace all errors with their first suggestion
- Handle "Ignore" action - remove error from display (optionally track ignored words to prevent re-showing)
- Track ignored words in component state (or atom) to persist during session

#### 3. Modify `spellCheckService.ts`

**Location**: `src/services/spellCheckService/spellCheckService.ts`

**Changes**:

- Replace current `performSpellCheck` with new `contextAwareSpellCheck`
- Keep same interface for backward compatibility
- Add debounce integration point

### Ignored Words Behavior

**Scope**: Per-note session (not persisted across page reloads)

- When user clicks "Ignore" on a suggestion:
  - Remove that error from the displayed list immediately
  - Store ignored word in component state/atom for that note
  - Filter out ignored words from future spell check results for the same note
  - If user edits the note and the word changes, it can be flagged again (fresh spell check)

**Implementation Options**:

1. **Component State** (Simpler):
   - Track ignored words in `SpeakerNoteCard` component state
   - Filter errors before displaying: `errors.filter(e => !ignoredWords.has(e.word))`
   - Reset when note content changes significantly

2. **Atom/Global State** (More robust):
   - Create `ignoredWords` atom keyed by note ID
   - Persist ignored words per note across component re-renders
   - Clear when note is deleted or content is significantly changed

**Accept All Behavior**:

- When user clicks "Accept All":
  - Apply first suggestion for each error (or best suggestion if ranked)
  - Replace all occurrences of each misspelled word in the note
  - Clear all errors from display
  - Show success feedback (toast or visual indicator)

---

## Integration Points

### 1. Debounce Integration

- Use existing `debounce` utility from `src/utils/debounce.ts`
- Apply to note content changes
- Default: 2000ms (configurable via env var)

### 2. Context Building

- Use existing `buildSpellCheckContext` from `src/utils/contextBuilder.ts`
- Pass cover page and current slide to build system prompt
- System prompt format:

  ```
  You are a context-aware spell checker for presentation speaker notes.

  Context:
  [Cover page and slide content from buildSpellCheckContext]

  Please review the following note content and provide intelligent corrections
  considering the context above...
  ```

### 3. State Management

- Update `SpeakerNote.spellCheckStatus`:
  - `'pending'` - Waiting for debounce
  - `'checking'` - Spell check in progress
  - `'checked'` - Spell check complete (with or without errors)
  - `'error'` - Spell check failed

---

## Data Flow

### Current Flow (to be replaced)

```
Note change → debounce → performSpellCheck → AI call → update status
```

### New Flow

```
Note change → debounce →
  contextAwareSpellCheck →
    spellcheckWasm →
      (if errors) callClaudeHaiku →
        update status + show recommendations
```

---

## Error Handling

### WASM Errors

- If WASM fails to initialize: fallback to AI-only check
- If WASM throws: log error, continue to AI check
- Graceful degradation

### Claude API Errors

- If API key missing: show user-friendly error
- If API call fails: show error state, don't crash
- If JSON parsing fails: log error, show generic message

### Network Errors

- Retry logic? (Maybe in future)
- Show user-friendly error messages
- Don't block note editing

---

## Performance Considerations

### WASM Initialization

- Initialize once, reuse instance
- May need singleton pattern or context
- Lazy load if possible

### Debounce Timing

- Current: 2000ms
- Consider: Make configurable
- Balance: User experience vs API costs

### Caching

- Cache results for unchanged content?
- Invalidate on content change
- Consider memoization

---

## Future Enhancements (Out of Scope for Now)

- [ ] Batch spell checking for multiple notes
- [ ] Offline mode (WASM only)
- [ ] Custom dictionary support
- [ ] Learning from user corrections
- [ ] Spell check for slide content (not just notes)
- [ ] Real-time suggestions (as user types)

---

## Implementation Order

1. ✅ **Phase 1: Pure Functions & Tests**
   - Install `spellchecker-wasm`
   - Create `spellcheckWasm` function
   - Create `callClaudeHaiku` function
   - Create `contextAwareSpellCheck` orchestrator
   - Write comprehensive tests
   - Run tests in Node.js
   - Verify all tests pass

2. ⏳ **Phase 2: UI Implementation** (After Phase 1)
   - Create `SpellCheckRecommendations` component
   - Modify `SpeakerNoteCard` to show recommendations
   - Update `spellCheckService` to use new functions
   - Integrate debounce
   - Test in browser
   - Polish UI/UX

---

## Questions & Decisions Needed

1. **System Prompt**: Should we build it from context (like current `buildSpellCheckContext`) or accept as parameter?
   - **Decision**: Accept as parameter for flexibility, but provide helper to build it

2. **WASM Result Format**: What format does `spellchecker-wasm` return?
   - **Action**: Check package documentation, adapt our interface accordingly

3. **Error Display**: Show all errors at once or one at a time?
   - **Decision**: Show all errors as buttons, user can click any

4. **Text Replacement**: Replace first occurrence or all occurrences?
   - **Decision**: Replace all occurrences of the word (safer, more predictable)

5. **Position Tracking**: Do we need character positions for highlighting?
   - **Decision**: Optional for now, can add later if needed

---

## Success Criteria

- ✅ All pure functions work correctly in Node.js tests
- ✅ WASM spell checker correctly identifies misspellings
- ✅ Claude Haiku provides context-aware suggestions
- ✅ Two-stage process works end-to-end
- ✅ UI displays recommendations clearly
- ✅ User can click to replace text
- ✅ Debounce prevents excessive API calls
- ✅ Error handling is robust
- ✅ No performance regressions
