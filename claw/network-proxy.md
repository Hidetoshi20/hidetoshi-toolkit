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
# 使用官方安装脚本
curl -fsSL https://raw.githubusercontent.com/spencerwooo/mihoro/main/install.sh | sh

# 默认安装在 ~/.local/bin/mihoro
# 建议将其加入 PATH 或移动到 ~/bin
mv ~/.local/bin/mihoro ~/bin/mihoro
```

### 3. 初始化与订阅配置

编辑 `~/.config/mihoro.toml`：
```toml
remote_config_url = 'https://sub.xeton.dev/sub?target=clash&url=你的订阅'
mihomo_binary_path = '/home/willa/bin/mihomo'
# ... 其他基础配置

[mihomo_config]
mixed_port = 7890
external_controller = "0.0.0.0:9090"

# 推荐：使用层级化配置注入 TUN (mihoro 0.10.0+)
[mihomo_config.tun]
enable = true
stack = "system"
auto-route = true
auto-detect-interface = true

[mihomo_config.dns]
enable = true
ipv6 = false
enhanced-mode = "fake-ip"
listen = "0.0.0.0:1053"
```

#### ⚠️ 重要：权限配置 (TUN 模式必需)
由于 `mihomo` 运行在用户态，开启 TUN 需要授予二进制文件网络管理权限：
```bash
sudo setcap "cap_net_admin,cap_net_raw=+ep" ~/bin/mihomo
```
如果不执行此步，`utun` 网卡将无法创建。

#### 🛠 故障排查：配置未生效
如果 `mihoro update` 后 `config.yaml` 头部没有出现 `tun:` 字段，可以使用以下命令强制注入：
```bash
sed -i "1i tun:\n  enable: true\n  stack: system\n  auto-route: true\n  auto-detect-interface: true" ~/.config/mihomo/config.yaml
systemctl --user restart mihomo
```


运行应用并启动：
```bash
# 更新订阅并生成配置
mihoro update

# 管理服务 (User Level)
systemctl --user start mihomo
systemctl --user restart mihomo
systemctl --user status mihomo
```

### 4. 节点切换与管理
- **Web Dashboard**: 访问 `http://192.168.64.2:9090/ui`。
- **命令行查看日志**: `journalctl --user -u mihomo -f`。

---

## 🔍 验证代理状态
```bash
# 验证 HTTP 代理
curl -x http://127.0.0.1:7890 -I https://www.google.com

# 如果开启了 TUN，可直接验证
curl -I https://www.google.com
```

---

## 💡 为什么选择此方案？
1.  **Headless 友好**：完全基于命令行，无图形界面依赖。
2.  **全自动**：订阅更新、内核运行、TUN 路由管理全部由 Systemd 托管。
3.  **稳定**：Shared Network 模式下网络抖动更小，且不受宿主机 VPN 切换影响。
