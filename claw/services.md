# 🦀 OpenClaw 服务管理

> 这里记录了在虚拟机中运行的 OpenClaw 相关服务的状态与管理命令。

---

## 🚀 OpenClaw Gateway

OpenClaw 已配置为 systemd 用户服务，虚拟机重启后会自动启动。

### 服务信息
- **服务名称**: `openclaw-gateway.service`
- **服务定义**: `~/.config/systemd/user/openclaw-gateway.service`
- **日志路径**: `/tmp/openclaw/openclaw-*.log`
- **访问地址**: `http://127.0.0.1:18789/` (Dashboard)

### 常用命令
```bash
# 查看 Gateway 运行状态 (推荐)
openclaw gateway status

# 查看 systemd 服务状态
systemctl --user status openclaw-gateway

# 手动管理
systemctl --user start openclaw-gateway
systemctl --user stop openclaw-gateway
systemctl --user restart openclaw-gateway

# 实时查看日志
journalctl --user -u openclaw-gateway -f

# 检查日志文件
tail -f /tmp/openclaw/openclaw-*.log
```

---

## 🌐 端口访问一览

在 **Shared Network** 模式下，直接通过 `VM_IP:Port` 访问。

| 服务       | 端口     | 访问地址示例 (假设 IP 为 192.168.64.2) |
| ---------- | -------- | --------------------------------------- |
| Dashboard  | `18789`  | http://192.168.64.2:18789               |
| API Server | (待补充) |                                         |

---

## 🛠️ 故障排查
如果 Dashboard 无法访问：
1.  检查虚拟机内服务是否启动：`systemctl --user status openclaw-gateway`。
2.  检查代理是否干扰了本地回环：确保代理配置中 `skip-proxy` 包含 `127.0.0.1` 和 `localhost`。
3.  确保 Mac 与 VM 处于同一网段，尝试 `ping 192.168.64.x`。
