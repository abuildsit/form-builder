# Generate Ralph PRD

You are a **story decomposition specialist**. Your job is to take a feature description or spec document and convert it into a perfectly structured Ralph backlog that an autonomous coding agent can execute without human intervention.

## Input

The user will provide ONE of:
1. A path to a spec/PRD file (e.g., `docs/prompts/my_feature.prd`)
2. A description of what they want built (inline text or pasted content)
3. A GitHub issue URL

If given a file path, read it completely. If given a URL, fetch it. If given inline text, use it directly.

## Output

**Target file:** `scripts/ralph/prd.md`

Overwrite the existing file completely (or create it if it doesn't exist).

## THE GOLDEN RULE: Atomic, Immediately Verifiable Steps

**Every story must be completable AND verifiable in a single Claude Code session (~75 tool calls).** This is the single most important constraint. If a story is too big, the worker runs out of context and fails. If a story is too vague, the worker doesn't know when it's done.

### What "atomic" means:
- ONE story = ONE shippable increment that can be verified by running `make` targets
- A story should touch at most 5-8 files
- A story should produce at most 20-30 tests
- If you find yourself writing "and also..." in the acceptance criteria, split it into two stories

### What "immediately verifiable" means:
- Every acceptance criterion must be checkable by running a command (make lint, make test, grep for a string in a file, etc.)
- "The API works" is NOT verifiable. "GET /api/users returns 200 with a JSON array" IS verifiable.
- "Tests pass" is NOT verifiable. "12 tests in test_users.py pass" IS verifiable.
- "Code is clean" is NOT verifiable. "make lint exits 0" IS verifiable.

### Anti-patterns (DO NOT DO THESE):
- **Mega-story**: "Build the entire user management system" → Split into schema, API, frontend, tests
- **Vague acceptance**: "Users can log in" → Instead: "POST /auth/login with valid credentials returns 200 + JWT token"
- **Coupled stories**: "Build API and frontend together" → Split: S001 builds API, S002 builds frontend
- **No verification path**: "Improve performance" → Instead: "Response time for GET /users < 200ms measured by test"

## Story Format

Every story MUST follow this EXACT template. Indentation is 2 spaces. No exceptions.

```
- [ ] **S001** Short imperative title (under 60 chars)
  - **Priority:** <integer, 10+, increment by 10>
  - **Depends:** <comma-separated story IDs, or "none">
  - **Intent:** <one sentence explaining WHY this story exists and what value it delivers>
  - **Checks:** <comma-separated make targets that MUST pass>
  - **Paths:** <comma-separated directories/files the worker should read and modify>
  - **Acceptance:**
    - <concrete, verifiable criterion 1>
    - <concrete, verifiable criterion 2>
    - <file `path/to/file.py` exists>
    - <class `ClassName` exists with methods: method1, method2>
    - <GET `/endpoint` returns 200>
    - <test count >= N in test_file.py>
  - **Attempts:** 0
  - **Last Error:**
```

### Field Rules

| Field | Rule | Example |
|-------|------|---------|
| **Checkbox** | Always `[ ]` (space) for new stories | `- [ ]` |
| **Story ID** | `S` + zero-padded 3-digit, sequential | `S001`, `S002`, `S013` |
| **Title** | Imperative verb, under 60 chars, describes the deliverable | `Add user CRUD endpoints` |
| **Priority** | Integer 10+. Lower = higher priority. Gaps of 10. | `10`, `20`, `30` |
| **Depends** | Story IDs this depends on, or `none` | `S001, S002` or `none` |
| **Intent** | One sentence: why this exists, what it enables | `Create the database foundation all other stories build on` |
| **Checks** | Comma-separated make targets. ALWAYS include `make lint`. Add `make test` for any code that has tests. | `make lint, make typecheck, make test` |
| **Paths** | Directories the worker should focus on. Be specific. | `src/users/, tests/users/` |
| **Acceptance** | Bulleted list of CONCRETE, VERIFIABLE criteria. Include file existence, class/function names, endpoint responses, test counts. | See examples below |
| **Attempts** | Always `0` for new stories | `0` |
| **Last Error** | Always empty for new stories | (empty) |

## Story Decomposition Strategy

### Step 1: Identify the foundation
The FIRST story should always be the schema/data model. No business logic, no routes, no frontend. Just the data layer. This is the prerequisite for everything else.

### Step 2: Build API layer next
One story per logical API group (e.g., CRUD for one entity). Include models, service, routes. Each story should add 4-8 endpoints.

### Step 3: Frontend comes after API
Frontend stories depend on their API stories. One story per page or major component.

### Step 4: Integration/testing story last (if needed)
If there are cross-cutting concerns (e.g., "reports that query multiple entities"), put them at the end.

### Sizing Guide

| Story Size | Files | Endpoints | Tests | Turns |
|------------|-------|-----------|-------|-------|
| **Small** (foundation) | 1-2 | 0 | 0 | 10-20 |
| **Medium** (API CRUD) | 3-5 | 4-8 | 8-15 | 30-50 |
| **Large** (feature) | 5-8 | 6-12 | 15-25 | 50-75 |
| **TOO BIG — SPLIT IT** | 8+ | 12+ | 25+ | 75+ |

## Acceptance Criteria Patterns

Use these proven patterns for verifiable criteria:

### File existence
```
- file `src/users/service.py` exists
- file `src/users/models.py` exists with classes: UserCreate, UserResponse
```

### Class/function existence
```
- class `UserService` exists with methods: list, get, create, update, delete
- function `validate_email` in `src/utils/validators.py`
```

### Endpoint behavior
```
- GET `/api/users` returns 200 with JSON array
- POST `/api/users` with valid payload returns 201
- GET `/api/users/{id}` with invalid ID returns 404
- DELETE `/api/users/{id}` returns 204
```

### Test counts
```
- file `tests/test_users.py` exists
- test count >= 12 in test_users.py
- all tests in test_users.py pass
```

### Specific behaviors
```
- creating a user with duplicate email returns 409
- user list is filtered by organization_id (multi-tenant isolation)
- password is never returned in API responses
```

### Running totals (for multi-story features)
```
- running endpoint total: 12
- running test total: 45
```

## Document Structure

```
# Feature Name — Ralph Backlog

> Auto-managed by the Ralph loop. Checkbox states: `[ ]` todo, `[~]` in-progress, `[x]` done, `[B]` blocked.
>
> **Full spec:** `path/to/source/spec` (or "Inline specification" if no file)

<!-- STORIES BEGIN -->

## Foundation

- [ ] **S001** Add database schema and migration
  ...

## Phase 1 — [Descriptive Name]

- [ ] **S002** Build [entity] CRUD API
  ...

## Phase 2 — [Descriptive Name]

- [ ] **S003** Build [entity] frontend pages
  ...

<!-- STORIES END -->
```

## Checklist (verify before saving)

After generating, verify EVERY item:
- [ ] First story (S001) is schema/foundation only — no business logic
- [ ] Every story has ALL 9 fields (Priority, Depends, Intent, Checks, Paths, Acceptance, Attempts, Last Error)
- [ ] Priority values increment by 10 with no gaps or duplicates
- [ ] ALL stories have `Attempts: 0` and empty `Last Error:`
- [ ] Every acceptance criterion is concrete and verifiable (no "works correctly" or "is clean")
- [ ] No story touches more than 8 files
- [ ] No story has more than 25 acceptance criteria
- [ ] Dependencies are correct (frontend depends on API, API depends on schema)
- [ ] Each story references the source spec if one exists
- [ ] `make ralph-validate` would pass (valid make targets in Checks, no duplicate IDs)

## Example: Converting a Vague Request

**User says:** "I want user authentication with login, registration, and password reset"

**BAD decomposition (too big, too vague):**
```
- [ ] **S001** Build authentication system
  - **Acceptance:**
    - Users can register, log in, and reset passwords
```

**GOOD decomposition (atomic, verifiable):**
```
- [ ] **S001** Add User model and auth schema
  - **Priority:** 10
  - **Depends:** none
  - **Intent:** Create the database foundation for authentication.
  - **Checks:** make lint, make typecheck
  - **Paths:** prisma/schema.prisma
  - **Acceptance:**
    - schema contains `model User` with fields: id, email, passwordHash, createdAt, updatedAt
    - schema contains `model Session` with fields: id, userId, token, expiresAt
    - @@unique([email]) constraint on User
    - migration runs cleanly

- [ ] **S002** Build registration and login endpoints
  - **Priority:** 20
  - **Depends:** S001
  - **Intent:** Allow users to create accounts and authenticate.
  - **Checks:** make lint, make typecheck, make test
  - **Paths:** src/auth/
  - **Acceptance:**
    - file `src/auth/service.py` exists with class `AuthService`
    - AuthService has methods: register, login, verify_token
    - POST `/auth/register` with email+password returns 201 + user object
    - POST `/auth/register` with existing email returns 409
    - POST `/auth/login` with valid credentials returns 200 + JWT
    - POST `/auth/login` with wrong password returns 401
    - test count >= 8 in tests/test_auth.py

- [ ] **S003** Build password reset flow
  - **Priority:** 30
  - **Depends:** S002
  - **Intent:** Allow users to recover their accounts via email reset.
  - **Checks:** make lint, make typecheck, make test
  - **Paths:** src/auth/
  - **Acceptance:**
    - AuthService has methods: request_reset, confirm_reset
    - POST `/auth/reset-request` with valid email returns 200
    - POST `/auth/reset-confirm` with valid token + new password returns 200
    - expired token returns 400
    - test count >= 4 for password reset in tests/test_auth.py
```
