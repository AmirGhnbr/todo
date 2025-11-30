# Contributing Guide

## Git Branching Model

This project follows a simple Git branching strategy with three main branch types:

### Branch Types

#### `main`

- **Purpose**: Production-ready code
- **Protection**: Protected branch, requires pull request reviews
- **Deployments**: Automatic deployment to production (if configured)

#### `develop`

- **Purpose**: Integration branch for features
- **Merges from**: Feature branches
- **Merges to**: `main` (via pull request)

#### `feature/*`

- **Purpose**: Individual feature development
- **Naming**: `feature/<ticket-id>-<short-description>` (e.g., `feature/123-add-notifications`)
- **Merges to**: `develop`

### Workflow

1. **Start a new feature**:

   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   ```

2. **Work on your feature**:
   - Make commits with clear, descriptive messages
   - Follow conventional commits format: `type(scope): description`
   - Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

3. **Submit for review**:

   ```bash
   git push origin feature/your-feature-name
   ```

   - Open a Pull Request to `develop`
   - Request code review
   - Address feedback

4. **Merge to develop**:
   - Squash and merge (preferred) or merge commit
   - Delete the feature branch after merge

5. **Release to production**:
   - Create a Pull Request from `develop` to `main`
   - Review and approve
   - Merge to `main`

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Examples**:

```
feat(auth): add JWT authentication

- Implement JWT strategy
- Add login and signup endpoints
- Configure Passport module

Closes #123
```

```
fix(todo): correct due date notification timing

The notification was being sent at the wrong time.
Now correctly sends 24 hours before due date.
```

## Code Style

- Follow ESLint and Prettier configurations
- Run `npm run lint` before committing
- Ensure all tests pass with `npm test`

## Pull Request Checklist

- [ ] Code follows the project's coding standards
- [ ] Tests added/updated for changes
- [ ] Documentation updated if needed
- [ ] All CI checks pass
- [ ] PR description explains the changes
