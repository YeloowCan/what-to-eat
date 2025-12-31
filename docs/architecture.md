# 架构文档

本文档解释项目的架构设计和每个文件的作用。

---

## 后端项目结构（server/）

### 根目录配置文件

#### `package.json`
- **作用**：项目依赖管理和脚本配置
- **关键脚本**：
  - `start:dev` - 开发模式启动（热重载）
  - `build` - 编译 TypeScript 到 JavaScript
  - `lint` - 运行 ESLint 代码检查
  - `test` - 运行单元测试
- **包管理工具**：pnpm

#### `tsconfig.json`
- **作用**：TypeScript 编译器配置
- **关键配置**：
  - `target: ES2023` - 编译目标版本
  - `module: nodenext` - 使用 Node.js ES 模块系统
  - `strictNullChecks: true` - 启用严格空值检查
  - `experimentalDecorators: true` - 支持装饰器（NestJS 必需）

#### `tsconfig.build.json`
- **作用**：生产构建时的 TypeScript 配置
- **特点**：排除测试文件和 node_modules，仅编译源代码

#### `eslint.config.mjs`
- **作用**：ESLint 代码质量检查配置
- **集成**：TypeScript ESLint、Prettier
- **规则**：已配置 Prettier 集成，禁用部分严格规则以适应 NestJS 开发

#### `.prettierrc`
- **作用**：Prettier 代码格式化配置
- **规则**：
  - `singleQuote: true` - 使用单引号
  - `trailingComma: all` - 所有位置使用尾随逗号

#### `nest-cli.json`
- **作用**：NestJS CLI 工具配置
- **配置**：
  - `sourceRoot: src` - 源代码根目录
  - `deleteOutDir: true` - 构建前删除输出目录

#### `pnpm-lock.yaml`
- **作用**：pnpm 依赖锁定文件，确保团队成员安装相同版本的依赖

#### `.gitignore`
- **作用**：Git 版本控制忽略文件配置
- **忽略内容**：
  - `node_modules/` - 依赖包目录
  - `dist/` - 编译输出目录
  - `.env` - 环境变量文件（包含敏感信息）
  - `*.log` - 日志文件

#### `.env`
- **作用**：环境变量配置文件（本地开发使用）
- **包含配置**：
  - 应用配置（NODE_ENV, PORT）
  - 数据库连接配置
  - JWT 认证配置
  - 文件存储配置（预留）
- **注意**：此文件不应提交到版本控制，每个开发者需要根据 `.env.example` 创建自己的 `.env` 文件

#### `.env.example`
- **作用**：环境变量模板文件
- **用途**：作为 `.env` 的参考模板，团队成员可以复制此文件创建自己的 `.env`
- **特点**：不包含敏感信息，可以提交到版本控制

---

### 源代码目录（src/）

#### `main.ts`
- **作用**：应用入口文件，启动 NestJS 应用
- **功能**：
  - 创建 NestJS 应用实例
  - 使用 `ConfigService` 读取环境变量中的端口配置
  - 监听端口（默认 3000，可通过 `.env` 中的 PORT 配置）
  - 启动 HTTP 服务器并输出启动信息
- **环境变量使用**：
  - 通过 `ConfigService.get<number>('PORT')` 获取端口
  - 如果未配置，使用默认值 3000

#### `app.module.ts`
- **作用**：根模块，应用的依赖注入容器
- **当前配置**：
  - 导入：
    - `ConfigModule` - 环境变量配置模块（全局模块）
  - 控制器：AppController（示例）
  - 提供者：AppService（示例）
- **ConfigModule 配置**：
  - `isGlobal: true` - 设置为全局模块，所有模块可直接注入 `ConfigService`
  - `envFilePath: '.env'` - 指定环境变量文件路径
- **后续扩展**：将添加数据库模块、认证模块等

#### `app.controller.ts`
- **作用**：示例控制器，演示 NestJS 路由处理
- **当前路由**：
  - `GET /` - 返回 "Hello World!"

#### `app.service.ts`
- **作用**：示例服务，演示业务逻辑层
- **当前方法**：
  - `getHello()` - 返回问候语

#### `app.controller.spec.ts`
- **作用**：AppController 的单元测试文件
- **测试框架**：Jest

---

### 测试目录（test/）

#### `app.e2e-spec.ts`
- **作用**：端到端测试文件
- **测试内容**：测试整个应用的 HTTP 请求流程

#### `jest-e2e.json`
- **作用**：E2E 测试的 Jest 配置

---

### 构建输出目录（dist/）

#### `dist/`
- **作用**：TypeScript 编译后的 JavaScript 文件输出目录
- **内容**：编译后的 `.js`、`.d.ts`（类型定义）、`.js.map`（源码映射）文件
- **注意**：此目录不应提交到版本控制

---

## 架构设计原则

### 1. 模块化设计
- 使用 NestJS 的模块系统组织代码
- 每个功能模块独立，便于维护和测试

### 2. 分层架构
- **Controller 层**：处理 HTTP 请求和响应
- **Service 层**：业务逻辑处理
- **Module 层**：依赖注入和模块组织

### 3. 类型安全
- 使用 TypeScript 提供类型检查
- 启用严格模式确保代码质量

### 4. 代码质量
- ESLint 进行代码检查
- Prettier 统一代码格式
- 单元测试和 E2E 测试

### 5. 环境变量管理
- 使用 `@nestjs/config` 模块统一管理环境变量
- ConfigModule 配置为全局模块，便于在所有模块中使用
- 使用 `ConfigService` 提供类型安全的环境变量访问
- `.env` 文件不提交到版本控制，使用 `.env.example` 作为模板

---

## 后续开发指南

### 添加新模块
1. 使用 `nest g module <module-name>` 生成模块
2. 使用 `nest g controller <controller-name>` 生成控制器
3. 使用 `nest g service <service-name>` 生成服务
4. 在模块中注册控制器和服务

### 代码规范
- 遵循 `.cursorrules` 中的规范
- 使用单引号
- 使用尾随逗号
- 运行 `pnpm run lint` 检查代码

### 环境变量使用
- 在服务或控制器中注入 `ConfigService`：
  ```typescript
  constructor(private configService: ConfigService) {}
  ```
- 使用类型安全的方式获取环境变量：
  ```typescript
  const port = this.configService.get<number>('PORT');
  ```
- 所有敏感配置（数据库密码、JWT密钥等）必须使用环境变量

### 测试
- 单元测试：`pnpm run test`
- E2E 测试：`pnpm run test:e2e`
- 测试覆盖率：`pnpm run test:cov`

---

---

## 环境变量说明

### 必需的环境变量

#### 应用配置
- `NODE_ENV` - 运行环境：`development` 或 `production`
- `PORT` - 应用监听端口（默认：3000）

#### 数据库配置（后续步骤配置）
- `DB_HOST` - 数据库主机地址
- `DB_PORT` - 数据库端口（PostgreSQL 默认：5432）
- `DB_USERNAME` - 数据库用户名
- `DB_PASSWORD` - 数据库密码
- `DB_DATABASE` - 数据库名称

#### JWT 配置（后续步骤配置）
- `JWT_SECRET` - JWT 签名密钥（生产环境必须使用强密钥）
- `JWT_EXPIRES_IN` - Token 过期时间（如：7d, 24h）

### 环境变量使用流程

1. 复制 `.env.example` 为 `.env`
2. 根据实际环境修改 `.env` 中的配置值
3. 应用启动时自动读取 `.env` 文件
4. 通过 `ConfigService` 在代码中访问环境变量

---

**最后更新**：2025年12月31日

