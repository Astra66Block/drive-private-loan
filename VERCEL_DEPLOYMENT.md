# Vercel Deployment Guide - Drive Private Loan

## 项目概述

Drive Private Loan 是一个基于FHE（全同态加密）技术的隐私保护车辆融资平台，支持RWA（现实世界资产）代币化。

## 部署前准备

### 1. 环境要求
- Node.js 18+ 
- npm 或 yarn
- Vercel 账户
- GitHub 账户

### 2. 项目信息
- **GitHub仓库**: https://github.com/Astra66Block/drive-private-loan
- **项目名称**: drive-private-loan
- **框架**: Vite + React + TypeScript

## 部署步骤

### 方法一：通过Vercel Dashboard部署（推荐）

#### 步骤1：访问Vercel
1. 打开 [https://vercel.com/](https://vercel.com/)
2. 使用GitHub账户登录

#### 步骤2：导入项目
1. 点击 "New Project"
2. 选择 "Import Git Repository"
3. 找到 `Astra66Block/drive-private-loan`
4. 点击 "Import"

#### 步骤3：配置项目
- **Project Name**: `drive-private-loan`
- **Framework Preset**: `Vite` (自动检测)
- **Root Directory**: `./`
- **Build Command**: `npm run build` (自动检测)
- **Output Directory**: `dist` (自动检测)

#### 步骤4：设置环境变量
在 "Environment Variables" 部分添加以下变量：

| Name | Value | Environment |
|------|-------|-------------|
| `VITE_CHAIN_ID` | `11155111` | Production, Preview, Development |
| `VITE_RPC_URL` | `https://sepolia.infura.io/v3/b18fb7e6ca7045ac83c41157ab93f990` | Production, Preview, Development |
| `VITE_WALLET_CONNECT_PROJECT_ID` | `2ec9743d0d0cd7fb94dee1a7e6d33475` | Production, Preview, Development |
| `VITE_INFURA_API_KEY` | `b18fb7e6ca7045ac83c41157ab93f990` | Production, Preview, Development |

#### 步骤5：部署
1. 点击 "Deploy" 按钮
2. 等待构建完成
3. 部署成功后，Vercel会提供一个预览URL

### 方法二：使用Vercel CLI

#### 步骤1：安装CLI
```bash
npm i -g vercel
```

#### 步骤2：登录
```bash
vercel login
```

#### 步骤3：部署
```bash
cd /path/to/drive-private-loan
vercel
```

#### 步骤4：设置环境变量
```bash
vercel env add VITE_CHAIN_ID
# 输入值: 11155111

vercel env add VITE_RPC_URL
# 输入值: https://sepolia.infura.io/v3/b18fb7e6ca7045ac83c41157ab93f990

vercel env add VITE_WALLET_CONNECT_PROJECT_ID
# 输入值: 2ec9743d0d0cd7fb94dee1a7e6d33475

vercel env add VITE_INFURA_API_KEY
# 输入值: b18fb7e6ca7045ac83c41157ab93f990
```

#### 步骤5：生产部署
```bash
vercel --prod
```

## 部署后配置

### 1. 自定义域名（可选）
1. 在Vercel Dashboard中进入项目设置
2. 点击 "Domains"
3. 添加自定义域名
4. 配置DNS记录

### 2. 环境变量管理
- 生产环境变量在Vercel Dashboard中管理
- 开发环境变量在本地 `.env.local` 文件中管理

### 3. 自动部署
- 每次推送到main分支会自动触发部署
- 可以通过Vercel Dashboard查看部署历史

## 故障排除

### 常见问题

#### 1. 构建失败
**错误**: `Environment Variable "VITE_WALLET_CONNECT_PROJECT_ID" references Secret "wallet_connect_project_id", which does not exist.`

**解决方案**: 确保所有环境变量都正确设置在Vercel Dashboard中

#### 2. 钱包连接失败
**错误**: WalletConnect连接失败

**解决方案**: 检查 `VITE_WALLET_CONNECT_PROJECT_ID` 是否正确设置

#### 3. 网络连接问题
**错误**: RPC连接失败

**解决方案**: 检查 `VITE_RPC_URL` 和 `VITE_INFURA_API_KEY` 是否正确

### 调试步骤
1. 检查Vercel构建日志
2. 验证环境变量设置
3. 测试本地开发环境
4. 检查网络连接

## 性能优化

### 1. 构建优化
- 使用 `npm run build` 进行生产构建
- 启用代码分割和懒加载
- 优化图片和静态资源

### 2. 缓存策略
- 配置适当的缓存头
- 使用CDN加速静态资源
- 启用Vercel的Edge Functions

### 3. 监控
- 使用Vercel Analytics监控性能
- 设置错误监控和告警
- 定期检查构建和部署状态

## 安全配置

### 1. 环境变量安全
- 不要在代码中硬编码敏感信息
- 使用Vercel的环境变量管理
- 定期轮换API密钥

### 2. 网络安全
- 配置CORS策略
- 使用HTTPS
- 设置安全头

### 3. 访问控制
- 配置适当的访问权限
- 使用Vercel的团队管理功能
- 定期审查部署权限

## 维护和更新

### 1. 定期更新
- 保持依赖包最新
- 定期更新Vercel CLI
- 监控安全漏洞

### 2. 备份策略
- 定期备份代码仓库
- 保存环境变量配置
- 记录部署配置

### 3. 监控和日志
- 使用Vercel的监控功能
- 设置日志收集
- 配置告警通知

## 联系支持

如果遇到部署问题，可以：
1. 查看Vercel官方文档
2. 检查GitHub Issues
3. 联系项目维护者

---

**部署完成后，您的Drive Private Loan平台将在Vercel上运行，支持隐私保护的车辆融资功能。**
