# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a **personal scripts and configuration repository** (个人脚本与配置仓库) that serves as a centralized collection of:

- Software configurations (network proxy settings, development tools)
- Development standards and guidelines
- Utility scripts for personal tasks
- AI-assisted development prompt templates and workflows
- Miscellaneous documentation

**Key principle:** This repository is for configuration files and standalone documents only. Knowledge content and learning notes are stored separately in Obsidian.

## Development Commands

This repository has no automated build system or package management. All operations are manual:

```bash
# Standard Git workflow
git status
git add .
git commit -m "description"
git push

# File management through standard shell commands
ls docs/
cat clash.yaml
```

## Architecture and Key Components

### 1. Network Configuration Management
- **File:** `clash.yaml` (216KB configuration file)
- **Purpose:** Network proxy setup with multiple geographical server endpoints
- **Content:** Proxy configurations for Japan, Singapore, Hong Kong, Taiwan, and US servers
- **Usage:** Direct configuration file for Clash proxy client

### 2. AI-Assisted Development Framework
**Location:** `docs/frontend-vibe/`

This is a sophisticated **AI-pair programming framework** with:

#### 6-Phase Development Methodology (Stages 0-5):
1. **Stage 0** - Task definition and background gathering
2. **Stage 1** - Task decomposition and planning
3. **Stage 2** - Context loading and codebase understanding
4. **Stage 3** - Patch/diff generation (minimal changes)
5. **Stage 4** - Self-testing and regression verification
6. **Stage 5** - Final validation and deployment

#### Specialized Templates:
- `new-page.md` - New page/route creation
- `feature-enhancement.md` - Adding features to existing pages
- `refactor.md` - Behavior-preserving refactoring
- `micro-tweak.md` - Small changes (copy/style)
- `bugfix.md` - Bug reports with minimal fixes
- `documentation.md` - Documentation optimization
- `PR_TEMPLATE.md` - Pull request description skeleton

#### Key Philosophy:
- **AI as collaborative pair programmer**, not code generator
- **Minimal diff approach** - 5-30 line changes per commit
- **Context-aware development** - Understanding existing codebase first
- **Iterative workflow** - Stage-based progression with human oversight

### 3. Documentation Structure
```
docs/
├── travel-plan.md              # Travel planning documents
└── frontend-vibe/              # AI development framework
    ├── README.md              # Template library overview
    ├── frontend-vibe-coding.md # Complete methodology
    ├── [scenario].md         # Task-specific templates
    └── PR_TEMPLATE.md        # Standard PR format
```

## Development Standards and Conventions

### AI Interaction Guidelines
When working with AI for development tasks:

1. **Use the structured templates** in `docs/frontend-vibe/` for consistency
2. **Follow the 6-stage methodology** for complex frontend tasks
3. **Generate minimal, auditable diffs** rather than large code blocks
4. **Always reference existing codebase** before proposing changes
5. **Focus on incremental improvements** with clear validation steps

### Code Quality Principles
- **Minimal change philosophy** - Small, reviewable commits
- **Context-first development** - Understand before modifying
- **Reuse over reinvention** - Leverage existing patterns and abstractions
- **Manual verification** - Apply patches incrementally with human oversight

## File Organization Patterns

### Configuration Files
- `clash.yaml` - Network proxy configuration
- `.gitignore` - Excludes IDE and Obsidian files
- No package.json or build automation files

### Documentation Standards
- **Chinese-first documentation** - All content in Chinese
- **Template-driven structure** - Reusable prompt formats
- **Hierarchical organization** - Clear separation of concerns
- **Practical focus** - Real-world application over theoretical concepts

## Important Notes

1. **Language:** All documentation and comments are in Chinese
2. **Scope:** Configuration-only repository (knowledge content in Obsidian)
3. **Workflow:** Manual Git operations, no CI/CD pipeline
4. **Integration:** IntelliJ IDEA and Obsidian integration present
5. **Security:** Contains network proxy configurations with credentials

## Template Usage

For AI-assisted development tasks:
1. Copy the appropriate template from `docs/frontend-vibe/`
2. Replace placeholders with specific context
3. Follow the iterative stage-based workflow
4. Use `PR_TEMPLATE.md` for final pull request descriptions

This repository represents an advanced approach to personal productivity management, combining configuration management with sophisticated AI-assisted development workflows.