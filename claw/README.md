# 🦅 OpenClaw VM 环境文档

这里记录了 OpenClaw 开发与运行所需的虚拟机环境配置、网络架构及代理策略。

## 📑 文档索引

1.  **[环境基础 (VM Environment)](./env-setup.md)**
    *   虚拟机软件 (UTM) 配置、操作系统信息。
    *   SSH 快速连接与端口转发设置。
2.  **[网络与代理 (Network & Proxy)](./network-proxy.md)**
    *   网络模式切换（Shared Network）。
    *   虚拟机内部代理 (mihomo + mihoro) 的安装与配置。
3.  **[服务管理 (Service Management)](./services.md)**
    *   OpenClaw Gateway 服务的运行与监控。

---

## 🛠 快速开始

如果你是第一次配置环境，请按以下顺序操作：
1.  参考 [环境基础](./env-setup.md) 完成 UTM 虚拟机的创建与基础系统安装。
2.  参考 [网络与代理](./network-proxy.md) 配置虚拟机内部的全局透明代理，解决网络访问问题。
3.  按照 OpenClaw 项目本身的 README 进行代码部署。
