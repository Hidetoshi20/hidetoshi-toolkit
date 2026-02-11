# 🌐 虚拟机内部代理配置

> 目标：在 Headless VM 内部实现全局透明代理，不再依赖宿主机 VPN 转发。

## 🚀 核心架构
- **内核 (Core)**: `mihomo` (Clash Meta) - 支持 TUN 模式，性能强劲。
- **管理 (CLI)**: `mihoro` - 专为 Linux Server 设计的 Rust 命令行工具，支持订阅管理与 Systemd 集成。

---

## 🛠️ 配置步骤

### 1. 安装 mihomo (Clash Meta)
```bash
# 下载二进制 (ARM64)
# 建议访问 https://github.com/MetaCubeX/mihomo/releases 获取最新链接
wget https://github.com/MetaCubeX/mihomo/releases/download/v1.18.1/mihomo-linux-arm64-v1.18.1.gz
gunzip mihomo-linux-arm64-v1.18.1.gz
chmod +x mihomo-linux-arm64-v1.18.1
sudo mv mihomo-linux-arm64-v1.18.1 /usr/local/bin/mihomo
```

### 2. 安装 mihoro (CLI 管理工具)
```bash
# 下载 mihoro (Rust 编写)
# 建议从 https://github.com/a-wing/mihoro/releases 下载二进制
wget https://github.com/a-wing/mihoro/releases/download/v0.3.1/mihoro-aarch64-unknown-linux-musl.tar.gz
tar -xvf mihoro-aarch64-unknown-linux-musl.tar.gz
sudo mv mihoro /usr/local/bin/mihoro
```

### 3. 初始化与订阅配置
创建配置文件 `~/.config/mihoro.toml`：
```toml
[mihomo]
# 你的订阅链接
remote_config_url = "YOUR_SUBSCRIPTION_URL"
# 自动更新间隔 (小时)
auto_update_interval = 12

[mihoro]
# 启用 TUN 模式 (需要 sudo)
tun = true
```

运行初始化并启动：
```bash
# 导入订阅并生成配置
mihoro setup

# 启动服务 (由 mihoro 管理 systemd)
sudo mihoro start
```

### 4. 节点切换
```bash
# 查看当前节点
mihoro proxy select

# 切换节点
mihoro proxy select "香港 01"
```

---

## 🔍 验证代理状态
```bash
# 检查外网 IP
curl -L google.com

# 检查服务状态
sudo mihoro status
```

---

## 💡 为什么选择此方案？
1.  **Headless 友好**：完全基于命令行，无图形界面依赖。
2.  **全自动**：订阅更新、内核运行、TUN 路由管理全部由 Systemd 托管。
3.  **稳定**：Shared Network 模式下网络抖动更小，且不受宿主机 VPN 切换影响。
