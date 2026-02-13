# 📦 VM 基础环境配置 (UTM)

> 最后更新: 2026-02-12

---

## 🖥️ 虚拟机基本信息

| 项目           | VM-Hidetoshi (Primary)                    | VM-Willa (Secondary)                      |
| -------------- | ----------------------------------------- | ----------------------------------------- |
| **虚拟化软件** | UTM                                       | UTM                                       |
| **操作系统**   | Ubuntu 24.04 LTS (ARM64)                  | Ubuntu 24.04 LTS (ARM64)                  |
| **存储位置**   | 外接硬盘 (启动前请确保已挂载)             | 外接硬盘                                  |
| **网络模式**   | **Shared Network**                        | **Shared Network**                        |
| **IP 地址**    | 192.168.64.2                              | 192.168.64.3                              |
| **用户名**     | `hidetoshi`                               | `willa`                                   |

---

## 🌐 网络拓扑 (Shared Network)

在 **Shared Network** 模式下：
1.  虚拟机位于一个由 UTM 管理的私有网络中（通常是 `192.168.64.0/24`）。
2.  宿主机可以通过分配的内网 IP 直接访问虚拟机。
3.  **注意**：此模式不再自动“继承”宿主机的 VPN 流量。因此，我们需要在虚拟机内部安装代理服务。
4.  **注意**：此模式下 UTM 不提供端口转发功能，请通过 IP 直接访问。

---

## 🔐 快速连接 (SSH)

由于宿主机可以直接访问虚拟机，建议在 `~/.ssh/config` 中固定内网 IP。

### SSH Config 推荐配置
修改 Mac `~/.ssh/config`：

```ssh
# Hidetoshi's VM
Host vm
    HostName 192.168.64.2
    User hidetoshi
    IdentityFile ~/.ssh/id_vm

# Willa's VM
Host vm-willa
    HostName 192.168.64.3
    User willa
    IdentityFile ~/.ssh/id_vm
```

配置完成后，分别使用 `ssh vm` 或 `ssh vm-willa` 登录。

---

## 📋 维护日志
- **2026-02-12**: 完成 `vm-willa` (192.168.64.3) 的基础配置：
    - 配置 Mac 本地 SSH 免密登录。
    - 安装 `mihomo` + `mihoro`。
    - 成功开启 **TUN 模式** 透明代理（需手动执行 `setcap`）。
- **2026-02-12**: 移除端口转发配置，改为直连内网 IP。网络模式确定为 **Shared Network**。
- **2026-02-11**: 初始 UTM 配置。
