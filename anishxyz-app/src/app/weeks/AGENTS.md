# My Life in Weeks — Design + Config Spec

## Scope
Build a "life in weeks" grid where each tile represents a week. Events can be
single-date or date ranges, optionally recurring via patterns. Tiles with events
are highlighted. The grid renders from the first event to first event + 100
years (configurable). A compact view exists for strict 1-week tiles.

## Goals
- Fast render (precompute; minimal runtime logic).
- Easy configuration from a single file.
- Support one-offs, recurring patterns, and exceptions.
- Visual spans based on date ranges (N weeks => N-wide tile).
- Optional hover content.
- Compact mode with strict grid (1 tile per week).

## Non-Goals (for now)
- Editing UI for events.
- Persisting runtime changes.
- Complex overlap resolution beyond priority rules.

## Config Spec (YAML or JSON)

### File
`content/life-weeks.yaml` (preferred) or `content/life-weeks.json`

### Top-level
```
version: 1
settings:
  start_date: 2003-02-23        # ISO date, earliest anchor
  years: 100                    # render N years from start_date
  week_start: sunday            # sunday | monday
  columns: 52                   # weeks per row in grid
  class_themes:
    birthday:
      bg: "rgba(142, 203, 255, 0.25)"
      border: "#8ecbff"
      fg: "#2a78c2"
  compact_mode:
    enabled: true
    max_chars: 1                # 1–3
  span_rules:
    mode: range_then_label      # range | label | range_then_label
    max_span: 8                 # clamp visual spans
events:
  - id: birthday-2003
    date: 2003-02-23
    emoji: "🐣"
    label: "1st Birthday"
    compact: "🐣"
    hover: "First birthday"
    class: "birthday"
  - id: college
    start: 2021-08-20
    end: 2025-05-15
    label: "College"
    compact: "C"
    hover: "Undergrad years"
    class: "milestone"
patterns:
  - id: birthdays
    type: yearly
    date: 02-23
    start_year: 2004
    emoji: "🎂"
    label: "Birthday"
    compact: "🎂"
    class: "birthday"
exceptions:
  - date: 2025-02-23
    remove: true
```

### Event Fields
- `id` (string, optional but recommended)
- `date` (ISO date) OR `start` + `end` (ISO date range, inclusive)
- `emoji` (optional string)
- `label` (optional string)
- `compact` (optional string, 1–3 chars)
- `hover` (optional string)
- `class` (optional string)
- `theme` (optional object with `bg`, `fg`, `border` CSS colors)

### Pattern Fields
- `id` (string)
- `type` (currently `yearly`)
- `date` (MM-DD)
- `start_year` (optional; defaults to settings.start_date year)
- `end_year` (optional)
- plus all display fields (`emoji`, `label`, `compact`, `hover`, `class`)
- plus `theme` (`bg`, `fg`, `border`)

### Exception Fields
- `date` (ISO date for the instance)
- `remove` (boolean) OR override fields (same as Event Fields)
- `theme` can also be overridden

## Behavior Rules
1. **Week Indexing**
   - Week buckets are computed based on `week_start` and ISO dates.
2. **Grid Range**
   - Compute from `settings.start_date` through `start_date + years`.
3. **Pattern Expansion**
   - Expand patterns into concrete dates within range.
4. **Resolution Priority**
   - Exception > explicit event > pattern.
5. **Range Events**
   - An event with `start`/`end` spans N weeks (inclusive).
   - Only the first week shows label/emoji; continuation weeks are marked as
     “covered” and may still be highlighted.
6. **Span Rules**
   - Default: span by range length.
   - Label-based span only when no range is provided and mode allows it.
7. **Compact Mode**
   - Force 1 tile per week; ignore range span and label span.

## UI Notes
- Use CSS grid with `columns` weeks per row.
- Use `grid-column: span N` for range spans.
- Hover text should not affect layout (use `position: absolute` or tooltip).

## Decisions
- Overlapping events: highest priority wins.
- Theming: support both per-event colors and class-based styles.

## Open Questions / Future
- Optional legend or filtering.
