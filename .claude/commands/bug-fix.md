# Bug Fix

Streamline bug fixing workflow from issue creation to pull request.

## Process:

### Before Starting:
1. Create a GitHub issue with a short descriptive title
2. Create and checkout a feature branch (`git checkout -b fix/<issue-description>`)

### Fix the Bug:
1. Reproduce the issue
2. Write failing test that demonstrates the bug
3. Implement the fix
4. Verify test passes
5. Run full test suite
6. Review code changes

### On Completion:
1. Commit with descriptive message referencing the issue
2. Push the branch
3. Create PR and link the issue

## Best Practices:
- Keep changes focused on the specific bug
- Include regression tests
- Update documentation if behavior changes
