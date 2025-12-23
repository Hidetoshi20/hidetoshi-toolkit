# Prompt · Bug 修复

> 适用：线上/测试环境的异常、接口报错、白屏、崩溃、边界缺陷。

## 0. Bug report
- 环境/URL：http://localhost:8888/git/suneo_docs_wind.git/
- 复现步骤：
  1. `git fetch` 或 `curl -I` 访问 Git 仓库。
- 预期 vs 实际：预期返回 200 OK，实际返回 502 Bad Gateway。
- 日志/报错栈：
  - Nginx 正常。
  - `fcgiwrap` 服务状态异常（launchctl status 78）。
  - `fcgiwrap` 日志缺失或无权限写入。
- 影响范围或猜测根因：
  - `fcgiwrap` 未正常启动，导致 Nginx 无法转发 FastCGI 请求。
  - `launchd` plist 配置中的 socket 清理逻辑或日志路径权限有问题。

## 1. 根因定位计划
- **根因**：
  1. `launchd` 服务配置 (`homebrew.mxcl.fcgiwrap.plist`) 启动失败，导致 `.sock` 文件未生成或残留。
  2. 原日志路径 `/Users/hidetoshidekisugi/Documents/Doc Enhance/` 可能存在权限或路径问题，且不符合规范。
  3. `fcgiwrap` 启动命令在 `plist` 中直接执行时，可能因 `.sock` 文件已存在而失败，需要先清理。

- **修复策略**：
  1. 将日志路径迁移至标准目录 `~/Library/Logs/fcgiwrap/`。
  2. 修正 `plist` 中的 `ProgramArguments`，使用 `/bin/sh -c` 正确执行 socket 清理和服务启动。
  3. 重新加载 `launchd` 服务。

## 2. 修复 patch
- 修改文件：`docs/git-server-config-and-docs/git_server_setup/homebrew.mxcl.fcgiwrap.plist`
- 改动内容：
  - 更新日志路径。
  - 优化启动命令逻辑。

## 3. 自测 / 回归
1. **服务状态检查**：`launchctl list | grep fcgiwrap` 显示状态 0。
2. **Socket 检查**：`/opt/homebrew/var/run/fcgiwrap.sock` 存在且有正确权限。
3. **功能验证**：`curl -I "http://localhost:8888/git/suneo_docs_wind.git/info/refs?service=git-upload-pack"` 返回 200 OK。

## 4. Commit / PR
- **Commit Message**: `fix: resolve git server 502 error by fixing fcgiwrap launchd config`
- **Summary**:
  - Moved logs to `~/Library/Logs/fcgiwrap/`.
  - Fixed `fcgiwrap` startup command in plist to handle socket cleanup.
  - Verified service stability and Git access.