# 数据库设置指南

本文档说明如何设置 What-to-Eat 项目的 PostgreSQL 数据库。

## 前置要求

- PostgreSQL 14 或更高版本
- 具有创建数据库权限的用户（通常是 `postgres` 用户）

## Windows 安装 PostgreSQL

### 方法 1：使用安装程序（推荐）

1. 访问 PostgreSQL 官网：https://www.postgresql.org/download/windows/
2. 下载 Windows 安装程序（推荐使用 EnterpriseDB 提供的安装程序）
3. 运行安装程序，按照向导完成安装
4. 记住设置的 postgres 用户密码（后续连接需要）
5. 安装完成后，PostgreSQL 服务会自动启动

### 方法 2：使用包管理器

#### 使用 Chocolatey

```powershell
# 安装 Chocolatey（如果未安装）
# 访问 https://chocolatey.org/install

# 安装 PostgreSQL
choco install postgresql
```

#### 使用 Scoop

```powershell
# 安装 Scoop（如果未安装）
# 访问 https://scoop.sh/

# 安装 PostgreSQL
scoop install postgresql
```

### 验证安装

打开命令提示符或 PowerShell，运行：

```bash
psql --version
```

如果显示版本号，说明安装成功。

## 创建数据库

### 方法 1：使用 psql 命令行（推荐）

1. 打开命令提示符或 PowerShell

2. 连接到 PostgreSQL（使用默认 postgres 用户）：
   ```bash
   psql -U postgres
   ```
   输入安装时设置的 postgres 用户密码

3. 执行初始化脚本：
   ```bash
   \i database/init.sql
   ```
   或者直接复制脚本内容到 psql 中执行

4. 验证数据库创建：
   ```sql
   \l
   ```
   应该能看到 `what_to_eat` 数据库

5. 连接到新数据库：
   ```sql
   \c what_to_eat
   ```

6. 退出 psql：
   ```sql
   \q
   ```

### 方法 2：使用 pgAdmin（图形界面）

1. 打开 pgAdmin（PostgreSQL 安装时通常会自动安装）
2. 连接到 PostgreSQL 服务器（使用 postgres 用户）
3. 右键点击 "Databases" -> "Create" -> "Database"
4. 输入数据库名称：`what_to_eat`
5. 点击 "Save" 完成创建

### 方法 3：使用 SQL 命令直接创建

```bash
# 在命令行中执行（需要设置 PGPASSWORD 环境变量或在提示时输入密码）
psql -U postgres -c "CREATE DATABASE what_to_eat;"
```

## 配置环境变量

确保 `server/.env` 文件中包含正确的数据库连接配置：

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_postgres_password
DB_DATABASE=what_to_eat
```

**注意**：将 `your_postgres_password` 替换为实际的 postgres 用户密码。

## 验证数据库连接

### 使用 psql 验证

```bash
psql -U postgres -d what_to_eat
```

如果成功连接，会显示：
```
psql (14.x)
Type "help" for help.

what_to_eat=#
```

### 使用 Node.js 脚本验证（可选）

创建测试脚本 `test-db-connection.js`：

```javascript
const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'your_password',
  database: 'what_to_eat',
});

client.connect()
  .then(() => {
    console.log('✅ 数据库连接成功！');
    return client.query('SELECT NOW()');
  })
  .then((result) => {
    console.log('当前时间:', result.rows[0].now);
    client.end();
  })
  .catch((err) => {
    console.error('❌ 数据库连接失败:', err.message);
    process.exit(1);
  });
```

运行：
```bash
node test-db-connection.js
```

## 常见问题

### 1. 无法连接到 PostgreSQL

**问题**：`psql: error: connection to server at "localhost" (127.0.0.1), port 5432 failed`

**解决方案**：
- 检查 PostgreSQL 服务是否启动：
  ```powershell
  # Windows
  Get-Service postgresql*
  ```
- 如果服务未启动，启动服务：
  ```powershell
  Start-Service postgresql-x64-14  # 版本号可能不同
  ```

### 2. 密码认证失败

**问题**：`password authentication failed for user "postgres"`

**解决方案**：
- 确认密码是否正确
- 如果忘记密码，可以重置：
  1. 编辑 `pg_hba.conf` 文件（通常在 `C:\Program Files\PostgreSQL\14\data\`）
  2. 将认证方式改为 `trust`
  3. 重启 PostgreSQL 服务
  4. 使用 psql 连接并修改密码
  5. 恢复 `pg_hba.conf` 设置并重启服务

### 3. 数据库已存在

**问题**：`ERROR: database "what_to_eat" already exists`

**解决方案**：
- 如果数据库已存在且需要重新创建：
  ```sql
  DROP DATABASE what_to_eat;
  CREATE DATABASE what_to_eat;
  ```
- 或者直接使用现有数据库

### 4. 权限不足

**问题**：`ERROR: permission denied to create database`

**解决方案**：
- 使用具有创建数据库权限的用户（通常是 `postgres` 用户）
- 或者让 postgres 用户授予权限：
  ```sql
  ALTER USER your_user WITH CREATEDB;
  ```

## 下一步

数据库创建完成后，可以继续：
- 配置 TypeORM 连接（阶段 1.1）
- 创建用户实体和迁移（阶段 1.2）

## 参考资源

- PostgreSQL 官方文档：https://www.postgresql.org/docs/
- PostgreSQL Windows 安装指南：https://www.postgresql.org/download/windows/
- TypeORM 文档：https://typeorm.io/

