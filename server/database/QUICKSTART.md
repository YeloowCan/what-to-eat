# 数据库设置快速开始

## 快速步骤

### 1. 安装 PostgreSQL（如果未安装）

**Windows 用户：**
- 访问 https://www.postgresql.org/download/windows/
- 下载并安装 PostgreSQL（推荐版本 14+）
- 记住安装时设置的 postgres 用户密码

### 2. 创建数据库

打开命令提示符或 PowerShell，执行：

```bash
# 连接到 PostgreSQL
psql -U postgres

# 在 psql 中执行
CREATE DATABASE what_to_eat;

# 验证数据库创建
\l

# 退出
\q
```

或者直接执行 SQL 文件：

```bash
psql -U postgres -f database/init.sql
```

### 3. 配置环境变量

确保 `server/.env` 文件包含：

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=你的postgres密码
DB_DATABASE=what_to_eat
```

### 4. 安装依赖并验证

```bash
cd server
pnpm install
pnpm run db:verify
```

如果看到 "✅ 数据库验证完成！"，说明设置成功。

## 遇到问题？

查看 `database/README.md` 获取详细说明和故障排除指南。

