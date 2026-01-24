# Suneo Toolkit Dotfiles

Managed with [Chezmoi](https://www.chezmoi.io/).

## Structure

The `dotfiles` directory acts as the source state for Chezmoi.

```text
dotfiles/
├── .shared/                  # Shared configuration files (not directly applied)
│   └── vscode-settings.json
├── dot_config/               # ~/.config/
│   ├── opencode/             # OpenCode configuration
│   ├── ripgrep/              # ripgrep configuration
│   └── Code/                 # VSCode (Linux)
├── Library/                  # ~/Library/ (macOS)
│   └── Application Support/
│       └── Code/
│           └── User/
│               └── settings.json.tmpl
├── AppData/                  # %APPDATA% (Windows)
│   └── Roaming/
│       └── Code/
│           └── User/
│               └── settings.json.tmpl
└── ...
```

## Quick Start

### 1. Install Chezmoi

```bash
# macOS
brew install chezmoi

# Linux
sh -c "$(curl -fsLS get.chezmoi.io)"
```

### 2. Apply Configuration

Use Chezmoi directly with this repo as the source:

```bash
chezmoi --source ./dotfiles apply -v
```

## Managing Files

### Add a new file

```bash
# Add ~/.zshrc to dotfiles
chezmoi --source ./dotfiles add ~/.zshrc
```

### Edit a file

```bash
# Edit managed files in the source directory
chezmoi --source ./dotfiles edit ~/.zshrc
```

### Check changes

```bash
# Check diff between source and target
chezmoi --source ./dotfiles diff
```

### Apply changes

```bash
chezmoi --source ./dotfiles apply -v
```

## VSCode Settings

VSCode settings are managed via a shared template.

- Source: `dotfiles/.shared/vscode-settings.json.tmpl`
- Targets: Mapped to correct paths on Windows, macOS, and Linux automatically.

To update VSCode settings, edit `dotfiles/.shared/vscode-settings.json.tmpl` and run `chezmoi --source ./dotfiles apply -v`.

## Ripgrep 配置

建议用 Chezmoi 管理 `~/.config/ripgrep/ripgreprc`，用于统一 `rg` 的默认参数。

- Source: `dotfiles/dot_config/ripgrep/ripgreprc`
- Target: `~/.config/ripgrep/ripgreprc`
- 启用方式（二选一）：
  - 设置环境变量：`export RIPGREP_CONFIG_PATH="$HOME/.config/ripgrep/ripgreprc"`
  - 或创建软链：`ln -sf "$HOME/.config/ripgrep/ripgreprc" "$HOME/.ripgreprc"`

## fzf 配置

`~/.zshrc` 里包含一套 fzf 默认配置（使用 `rg --files` 作为文件列表来源），并提供 `rgi`（ripgrep -> fzf 交互式内容搜索）。

- Source: `dotfiles/dot_zshrc.tmpl`
