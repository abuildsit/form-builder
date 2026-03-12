# Build Domain

Workflow for building a new business domain.

## Prerequisites
- Read project CLAUDE.md files for patterns
- Reference existing domains as canonical examples

## Build Sequence

### Phase 1: Schema & Database
1. Add data model
2. Create migration
3. Generate types

### Phase 2: Backend Service Layer
4. Create request/response models
5. Create service functions (clean params, never accept auth objects)
6. Create routes with permission guards

### Phase 3: Permissions
7. Add permissions to enum and role mapping

### Phase 4: Frontend
8. Create validation schemas
9. Create API client hooks
10. Create pages
11. Update navigation

### Phase 5: CI
12. Generate types
13. Run full CI
14. Report results

## Completion Checklist
- [ ] Data model and migration
- [ ] Models/schemas defined
- [ ] Service functions implemented
- [ ] Routes created and mounted
- [ ] Permissions configured
- [ ] Frontend pages built
- [ ] Navigation updated
- [ ] Types generated
- [ ] CI passing
