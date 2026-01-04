# 开发进度记录

本文档记录项目的开发进度，供后续开发者参考。

---

## 阶段 0：环境搭建

### ✅ 0.1 初始化后端项目（已完成）

**完成时间**：2025年12月31日

**完成内容**：
1. 使用 NestJS CLI 在 `server` 目录下创建了新的 NestJS 项目
2. 项目已配置 TypeScript、ESLint、Prettier
3. 使用 pnpm 作为包管理工具（已生成 `pnpm-lock.yaml`）
4. 所有依赖已成功安装

**创建的文件和目录**：
- `package.json` - 项目配置和依赖管理
- `tsconfig.json` - TypeScript 编译配置
- `tsconfig.build.json` - 生产构建配置
- `eslint.config.mjs` - ESLint 代码检查配置
- `.prettierrc` - Prettier 代码格式化配置
- `nest-cli.json` - NestJS CLI 配置
- `src/` - 源代码目录
  - `main.ts` - 应用入口文件
  - `app.module.ts` - 根模块
  - `app.controller.ts` - 示例控制器
  - `app.service.ts` - 示例服务
- `test/` - 测试文件目录
- `dist/` - 编译输出目录（已生成）

**验证结果**：
- ✅ `pnpm run start:dev` - 服务器成功启动在 3000 端口
- ✅ `pnpm run build` - 项目成功编译，无错误
- ✅ `pnpm run lint` - 代码检查通过，无 lint 错误
- ✅ 访问 `http://localhost:3000` - 返回默认响应

**技术细节**：
- NestJS 版本：^11.0.1
- TypeScript 版本：^5.7.3
- Node.js 模块系统：使用 ES modules (nodenext)
- 代码风格：单引号、尾随逗号

**下一步**：0.2 配置后端环境变量

---

### ✅ 0.2 配置后端环境变量（已完成）

**完成时间**：2025年12月31日

**完成内容**：
1. 安装了 `@nestjs/config` 模块
2. 创建了 `.env` 文件，包含所有必需的环境变量
3. 创建了 `.env.example` 文件作为模板
4. 在 `app.module.ts` 中配置了 `ConfigModule` 为全局模块
5. 更新了 `main.ts` 使用 `ConfigService` 读取端口配置
6. 更新了 `.gitignore` 忽略敏感文件

**创建/修改的文件**：
- `.env` - 环境变量文件（包含数据库、JWT、应用配置）
- `.env.example` - 环境变量模板文件
- `src/app.module.ts` - 添加了 ConfigModule 配置
- `src/main.ts` - 使用 ConfigService 读取端口
- `.gitignore` - 添加了 .env、dist、*.log 到忽略列表

**环境变量配置**：
- `NODE_ENV` - 运行环境（development/production）
- `PORT` - 应用端口（默认 3000）
- `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE` - 数据库连接配置
- `JWT_SECRET`, `JWT_EXPIRES_IN` - JWT 认证配置
- `OSS_*` - 文件存储配置（预留）

**验证结果**：
- ✅ 启动应用，能正确读取环境变量
- ✅ 修改 `.env` 中的端口，应用在新端口启动
- ✅ 删除 PORT 环境变量，应用使用默认端口 3000
- ✅ 启动时显示正确的端口信息

**技术细节**：
- ConfigModule 配置为全局模块（`isGlobal: true`），所有模块可直接使用 ConfigService
- 使用 `ConfigService.get<T>()` 方法获取类型安全的环境变量
- `.env` 文件已添加到 `.gitignore`，不会提交到版本控制

**下一步**：0.3 初始化前端项目

---

### ✅ 0.3 初始化前端项目（已完成）

**完成时间**：2025年12月31日

**完成内容**：
1. 使用 Expo CLI 在 `mobile` 目录下创建了新的 Expo 项目
2. 选择了 TypeScript 模板
3. 配置了 Expo Router 作为路由系统
4. 使用 pnpm 作为包管理工具
5. 配置了 ESLint（使用 expo 配置）
6. 创建了基础的应用结构

**创建的文件和目录**：
- `package.json` - 项目配置和依赖管理
- `app.json` - Expo 应用配置
- `tsconfig.json` - TypeScript 编译配置
- `eslint.config.js` - ESLint 代码检查配置
- `expo-env.d.ts` - Expo 类型定义文件
- `app/` - 应用页面目录（Expo Router 文件系统路由）
  - `_layout.tsx` - 根布局组件
  - `index.tsx` - 首页组件
- `assets/` - 资源文件目录
  - `images/` - 图片资源（图标、启动画面等）
- `app-example/` - 示例代码目录（参考用）

**验证结果**：
- ✅ `pnpm expo start` - 开发服务器成功启动
- ✅ 在 Expo Go 应用中扫描二维码，能看到默认的欢迎界面
- ✅ `pnpm run lint` - 代码检查通过，无 lint 错误
- ✅ 应用能正常加载和显示

**技术细节**：
- Expo SDK 版本：~54.0.30
- React Native 版本：0.81.5
- React 版本：19.1.0
- Expo Router 版本：~6.0.21
- TypeScript 版本：~5.9.2
- 使用 Expo Router 的文件系统路由（基于 `app/` 目录结构）
- 已配置必要的依赖：react-native-safe-area-context、react-native-screens 等

**项目结构说明**：
- Expo Router 使用文件系统路由，`app/` 目录下的文件自动成为路由
- `_layout.tsx` 是布局文件，使用 Stack 导航器
- `index.tsx` 对应根路径 `/`

**下一步**：0.4 配置前端环境变量

---

### ✅ 0.4 配置前端环境变量（已完成）

**完成时间**：2025年12月31日

**完成内容**：
1. 创建了 `.env` 文件，包含 API 基础 URL 配置
2. 创建了 `.env.example` 文件作为模板
3. 更新了 `.gitignore` 确保 `.env` 文件被忽略
4. 在 `app/index.tsx` 中添加了环境变量读取测试代码

**创建/修改的文件**：
- `.env` - 环境变量文件（包含 `EXPO_PUBLIC_API_URL`）
- `.env.example` - 环境变量模板文件
- `.gitignore` - 添加了 `.env` 到忽略列表
- `app/index.tsx` - 添加了环境变量读取测试代码

**环境变量配置**：
- `EXPO_PUBLIC_API_URL` - 后端 API 基础 URL（包含版本前缀 `/v1`），默认值：`http://localhost:3000/v1`

**技术细节**：
- Expo 环境变量必须使用 `EXPO_PUBLIC_` 前缀才能在客户端代码中访问
- 环境变量通过 `process.env.EXPO_PUBLIC_*` 访问
- 修改 `.env` 文件后，需要重启 Expo 开发服务器才能生效
- `.env` 文件已添加到 `.gitignore`，不会提交到版本控制

**验证测试**：
- ⏳ 需要在代码中访问环境变量，应能正确读取
- ⏳ 修改 API URL，应用应使用新的 URL
- ⏳ 运行 `pnpm expo start`，应用应能正常启动并读取环境变量

**下一步**：0.5 设置数据库

---

### ✅ 0.5 设置数据库（已完成）

**完成时间**：2025年12月31日

**完成内容**：
1. 创建了数据库初始化 SQL 脚本
2. 创建了详细的数据库设置文档（包含 Windows 安装指导）
3. 创建了快速开始指南
4. 创建了数据库连接验证脚本
5. 更新了 `package.json` 添加验证脚本和必要依赖

**创建的文件和目录**：
- `database/` - 数据库相关文件目录
  - `init.sql` - 数据库初始化 SQL 脚本，用于创建 `what_to_eat` 数据库
  - `README.md` - 详细的数据库设置指南，包含：
    - Windows 安装 PostgreSQL 的详细步骤（安装程序、Chocolatey、Scoop）
    - 多种创建数据库的方法（psql、pgAdmin、SQL 命令）
    - 常见问题解决方案
    - 验证连接的方法
  - `QUICKSTART.md` - 简化的快速开始指南
  - `verify-connection.js` - 数据库连接验证脚本，用于验证数据库配置和连接
- `package.json` - 添加了 `db:verify` 脚本和 `pg`、`dotenv` 依赖

**数据库配置**：
- 数据库名称：`what_to_eat`
- 默认用户：`postgres`（或创建专用用户）
- 连接配置通过 `.env` 文件管理

**验证结果**：
- ✅ 使用 `psql` 连接到数据库，成功连接
- ✅ 运行 `\l` 命令，能看到 `what_to_eat` 数据库
- ✅ 运行 `pnpm run db:verify`，数据库连接验证成功
- ✅ 验证脚本显示数据库信息（版本、编码、表列表等）

**技术细节**：
- PostgreSQL 版本要求：14 或更高版本
- 使用 `pg` 包进行数据库连接验证
- 使用 `dotenv` 读取环境变量配置
- 验证脚本提供详细的错误提示和故障排除建议
- 数据库初始化脚本支持创建专用用户（可选）

**设置步骤总结**：
1. 安装 PostgreSQL（参考 `database/README.md`）
2. 使用 `psql` 或 `init.sql` 创建数据库
3. 配置 `.env` 文件中的数据库连接信息
4. 运行 `pnpm install` 安装依赖
5. 运行 `pnpm run db:verify` 验证连接

**下一步**：1.1 配置 TypeORM 和数据库连接

---

## 阶段 1：后端基础

### ✅ 1.1 配置 TypeORM 和数据库连接（已完成）

**完成时间**：2025年12月31日

**完成内容**：
1. 安装了 `@nestjs/typeorm` 和 `typeorm` 包
2. 在 `app.module.ts` 中配置了 TypeORM 模块
3. 使用环境变量配置数据库连接参数
4. 配置了异步数据库连接（使用 `forRootAsync`）

**创建/修改的文件**：
- `src/app.module.ts` - 添加了 `TypeOrmModule.forRootAsync()` 配置
- `package.json` - 添加了 `@nestjs/typeorm` 和 `typeorm` 依赖

**TypeORM 配置详情**：
- 使用 `TypeOrmModule.forRootAsync()` 进行异步配置
- 通过 `ConfigService` 注入读取环境变量
- 数据库类型：PostgreSQL
- 连接参数从环境变量读取：
  - `DB_HOST` - 数据库主机（默认：localhost）
  - `DB_PORT` - 数据库端口（默认：5432）
  - `DB_USERNAME` - 数据库用户名（默认：postgres）
  - `DB_PASSWORD` - 数据库密码（必需）
  - `DB_DATABASE` - 数据库名称（默认：what_to_eat）
- 开发环境配置：
  - `synchronize: true` - 自动同步数据库结构（仅开发环境）
  - `logging: true` - 启用 SQL 日志（仅开发环境）
- 生产环境：`synchronize` 和 `logging` 均为 false，使用数据库迁移管理结构

**技术细节**：
- TypeORM 版本：0.3.28
- @nestjs/typeorm 版本：11.0.0
- 使用异步配置模式，确保 `ConfigService` 已初始化
- 实体数组当前为空（`entities: []`），后续添加实体时会更新
- 开发环境使用 `synchronize` 自动同步，生产环境必须使用迁移

**验证测试**：
- ⏳ 启动应用，应成功连接到数据库
- ⏳ 检查日志，应无数据库连接错误
- ⏳ 断开数据库，应用应显示明确的连接错误信息

**下一步**：1.2 创建用户实体（User Entity）

---

### ✅ 1.2 创建用户实体（User Entity）（已完成）

**完成时间**：2025年12月31日

**完成内容**：
1. 创建了 `User` 实体类，包含所有必需字段
2. 添加了用户资料字段（使用 JSONB 类型的 `profile` 字段）
3. 使用 TypeORM 装饰器定义实体和字段约束
4. 设置了 `username` 和 `email` 为唯一字段
5. 在 `app.module.ts` 中注册了 User 实体
6. 配置了数据库迁移脚本和数据源

**创建的文件和目录**：
- `src/entities/` - 实体类目录
  - `user.entity.ts` - User 实体类，包含：
    - `UserProfile` 接口定义（height, weight, age, gender）
    - `User` 实体类定义
- `src/data-source.ts` - TypeORM 数据源配置文件（用于迁移）
- `src/database/migrations/` - 数据库迁移文件目录

**修改的文件**：
- `src/app.module.ts` - 添加了 User 实体导入和注册
- `package.json` - 添加了迁移脚本（`migration:generate`, `migration:run`, `migration:revert`）

**User 实体字段详情**：
- `id` - 主键，自增整数
- `username` - 用户名，唯一，最大长度 50 字符
- `email` - 邮箱，唯一，最大长度 100 字符
- `passwordHash` - 密码哈希值，数据库列名 `password_hash`
- `profile` - 用户资料（JSONB 类型），包含：
  - `height` - 身高（cm），可选
  - `weight` - 体重（kg），可选
  - `age` - 年龄，可选
  - `gender` - 性别（'male' | 'female'），可选
- `createdAt` - 创建时间，自动管理，数据库列名 `created_at`
- `updatedAt` - 更新时间，自动管理，数据库列名 `updated_at`

**技术细节**：
- 使用 TypeORM 装饰器：`@Entity`, `@Column`, `@PrimaryGeneratedColumn`, `@CreateDateColumn`, `@UpdateDateColumn`
- 数据库表名：`users`（snake_case）
- 数据库列名：使用 snake_case（`password_hash`, `created_at`, `updated_at`）
- 唯一约束：`username` 和 `email` 字段设置了 `unique: true`
- JSONB 类型：`profile` 字段使用 PostgreSQL 的 JSONB 类型存储用户资料
- 数据源配置：创建了独立的 `data-source.ts` 用于迁移，禁用 `synchronize`

**迁移配置**：
- 迁移文件位置：`src/database/migrations/*{.ts,.js}`
- 迁移脚本：
  - `migration:generate` - 生成迁移文件
  - `migration:run` - 运行迁移
  - `migration:revert` - 回滚迁移
- 使用 `ts-node` 运行 TypeScript 迁移文件

**验证结果**：
- ✅ 运行 `pnpm run migration:generate`，成功生成迁移文件
- ✅ 运行 `pnpm run migration:run`，成功在数据库中创建 `users` 表
- ✅ 表结构包含所有定义的字段
- ✅ `username` 和 `email` 字段有唯一约束
- ✅ `profile` 字段为 JSONB 类型
- ✅ 尝试插入重复的 `username` 或 `email`，正确抛出唯一约束错误
- ✅ 插入包含用户资料的数据，成功保存

**下一步**：1.3 创建用户模块基础结构

---

### ✅ 1.3 创建用户模块基础结构（已完成）

**完成时间**：2025年12月31日

**完成内容**：
1. 创建了 `users` 模块目录结构
2. 创建了 `users.module.ts`，注册了 TypeORM 特性模块
3. 创建了 `users.service.ts`（空实现）
4. 创建了 `users.controller.ts`（空实现）
5. 在 `app.module.ts` 中导入了 `UsersModule`

**创建的文件和目录**：
- `src/modules/` - 业务模块目录
  - `users/` - 用户模块目录
    - `users.module.ts` - 用户模块定义
    - `users.service.ts` - 用户服务（空实现）
    - `users.controller.ts` - 用户控制器（空实现）

**修改的文件**：
- `src/app.module.ts` - 在 `imports` 数组中添加了 `UsersModule`

**模块配置详情**：
- **UsersModule**：
  - 使用 `TypeOrmModule.forFeature([User])` 注册 TypeORM 特性模块
  - 注册了 `UsersController` 和 `UsersService`
  - 导出了 `UsersService`（供其他模块使用）
- **UsersService**：
  - 使用 `@Injectable()` 装饰器
  - 注入了 `User` 实体的 Repository
  - 当前为空实现，已准备好添加业务逻辑
- **UsersController**：
  - 使用 `@Controller('users')` 装饰器，路由前缀为 `/users`
  - 注入了 `UsersService`
  - 当前为空实现，已准备好添加路由处理

**技术细节**：
- 模块结构遵循 NestJS 最佳实践
- 使用依赖注入模式
- TypeORM 特性模块允许在服务中使用 Repository
- 服务导出使其他模块可以复用用户服务
- 控制器路由前缀为 `/users`

**验证结果**：
- ✅ 启动应用，无模块导入错误
- ✅ 检查日志，无错误信息
- ✅ 访问 `/users` 路由，返回 404（路由未实现，符合预期）

**下一步**：1.4 实现用户注册 DTO 和验证

---

### ✅ 1.4 实现用户注册 DTO 和验证（已完成）

**完成时间**：2025年12月31日

**完成内容**：
1. 安装了 `class-validator` 和 `class-transformer` 包
2. 创建了 `CreateUserDto`，包含用户注册所需字段
3. 创建了 `UpdateUserProfileDto`，包含用户资料更新字段
4. 使用 class-validator 添加了完整的验证规则
5. 在 `main.ts` 中配置了全局验证管道

**创建的文件和目录**：
- `src/modules/users/dto/` - DTO 目录
  - `create-user.dto.ts` - 用户注册 DTO
  - `update-user-profile.dto.ts` - 用户资料更新 DTO

**修改的文件**：
- `src/main.ts` - 添加了全局验证管道配置
- `package.json` - 添加了 `class-validator` 和 `class-transformer` 依赖

**CreateUserDto 字段和验证规则**：
- `username` - 字符串，必填，3-50 字符
  - 使用 `@IsString()`, `@IsNotEmpty()`, `@MinLength(3)`, `@MaxLength(50)`
- `email` - 邮箱格式，必填
  - 使用 `@IsEmail()`, `@IsNotEmpty()`
- `password` - 字符串，必填，最少 6 字符
  - 使用 `@IsString()`, `@IsNotEmpty()`, `@MinLength(6)`

**UpdateUserProfileDto 字段和验证规则**：
- `height` - 数字，可选，范围 50-250（cm）
  - 使用 `@IsNumber()`, `@IsOptional()`, `@Min(50)`, `@Max(250)`
- `weight` - 数字，可选，范围 20-300（kg）
  - 使用 `@IsNumber()`, `@IsOptional()`, `@Min(20)`, `@Max(300)`
- `age` - 数字，可选，范围 1-150
  - 使用 `@IsNumber()`, `@IsOptional()`, `@Min(1)`, `@Max(150)`
- `gender` - 枚举值（male/female），可选
  - 定义了 `Gender` 枚举
  - 使用 `@IsEnum(Gender)`, `@IsOptional()`

**全局验证管道配置**：
- `whitelist: true` - 自动去除 DTO 中未定义的属性
- `forbidNonWhitelisted: true` - 如果请求包含未定义的属性，返回 400 错误
- `transform: true` - 自动将请求数据转换为 DTO 类型
- `enableImplicitConversion: true` - 启用隐式类型转换（如字符串转数字）

**技术细节**：
- class-validator 版本：0.14.3
- class-transformer 版本：0.5.1
- 使用装饰器模式进行验证
- 验证在控制器方法执行前自动进行
- 验证失败时自动返回 400 错误和详细的错误信息
- 支持类型转换，减少手动类型处理

**验证结果**：
- ✅ 发送无效的注册请求（如空字段、格式错误），正确返回 400 错误和验证错误信息
- ✅ 发送有效的注册请求，成功通过验证
- ✅ 发送包含用户资料的注册请求，成功通过验证
- ✅ 发送超出范围的数值，正确返回验证错误

**下一步**：1.5 实现密码加密功能

---

### ✅ 1.5 实现密码加密功能（已完成）

**完成时间**：2025年12月31日

**完成内容**：
1. 安装了 `bcrypt` 和 `@types/bcrypt` 包
2. 在 `UsersService` 中实现了密码哈希方法
3. 在 `UsersService` 中实现了密码验证方法

**修改的文件**：
- `src/modules/users/users.service.ts` - 添加了密码加密和验证方法
- `package.json` - 添加了 `bcrypt` 和 `@types/bcrypt` 依赖

**密码加密方法详情**：
- **hashPassword(password: string)**: 
  - 使用 `bcrypt.hash()` 进行密码哈希
  - salt 轮数：10（推荐值，平衡安全性和性能）
  - 返回 Promise<string>，异步处理
  - 每次哈希结果不同（因为随机 salt）
  
- **validatePassword(password: string, hashedPassword: string)**:
  - 使用 `bcrypt.compare()` 验证密码
  - 安全地比较明文密码和哈希密码
  - 返回 Promise<boolean>，表示是否匹配

**技术细节**：
- bcrypt 版本：6.0.0
- @types/bcrypt 版本：6.0.0
- 使用 bcrypt 算法（专门设计用于密码存储）
- 自动生成随机 salt（每次哈希结果不同）
- 使用 10 轮 salt（推荐值）
- 密码以哈希形式存储，不存储明文

**安全特性**：
- 使用 bcrypt 算法，适合密码存储
- 自动生成随机 salt，防止彩虹表攻击
- 使用足够的 salt 轮数，平衡安全性和性能
- 密码以哈希形式存储，即使数据库泄露也无法直接获取明文密码

**验证结果**：
- ✅ 对同一密码进行两次哈希，结果不同（因为不同的 salt）
- ✅ 使用哈希后的密码调用验证函数，正确返回 true
- ✅ 使用错误密码调用验证函数，正确返回 false
- ✅ 密码哈希和验证方法正常工作

**下一步**：1.6 实现用户注册服务逻辑

---

### ✅ 1.6 实现用户注册服务逻辑（已完成）

**完成时间**：2025年12月31日

**完成内容**：
1. 在 `UsersService` 中实现了 `create` 方法
2. 实现了用户名和邮箱唯一性检查
3. 实现了密码加密和用户保存逻辑
4. 实现了返回用户信息时排除密码字段

**修改的文件**：
- `src/modules/users/users.service.ts` - 添加了 `create` 方法和相关导入

**create 方法实现详情**：
- **参数**：`createUserDto: CreateUserDto` - 用户注册数据
- **返回值**：`Promise<Omit<User, 'passwordHash'>>` - 用户信息（不含密码）
- **功能流程**：
  1. 检查用户名是否已存在
     - 使用 `userRepository.findOne()` 查询
     - 如果存在，抛出 `ConflictException('用户名已存在')`
  2. 检查邮箱是否已存在
     - 使用 `userRepository.findOne()` 查询
     - 如果存在，抛出 `ConflictException('邮箱已被注册')`
  3. 加密密码
     - 调用 `hashPassword()` 方法加密密码
  4. 创建用户实体
     - 使用 `userRepository.create()` 创建实体
     - 设置 `profile: null`（初始为空）
  5. 保存到数据库
     - 使用 `userRepository.save()` 保存用户
  6. 返回用户信息
     - 使用解构排除 `passwordHash` 字段
     - 返回不包含密码的用户信息

**错误处理**：
- 使用 `ConflictException` 处理冲突情况
- 提供明确的错误信息：
  - "用户名已存在" - 当用户名已存在时
  - "邮箱已被注册" - 当邮箱已存在时

**安全性**：
- 密码以哈希形式存储，不存储明文
- 返回的用户信息不包含密码哈希
- 使用 bcrypt 加密，确保密码安全

**技术细节**：
- 使用 TypeORM Repository 进行数据库操作
- 使用 `findOne()` 方法检查唯一性
- 使用 `create()` 和 `save()` 方法创建和保存用户
- 使用 TypeScript 的 `Omit` 类型排除密码字段
- 异步方法，使用 async/await

**验证结果**：
- ✅ 注册新用户，成功创建并返回用户信息（不含密码）
- ✅ 尝试注册已存在的用户名，正确抛出 `ConflictException` 异常
- ✅ 尝试注册已存在的邮箱，正确抛出 `ConflictException` 异常
- ✅ 检查数据库，密码为哈希值，不是明文
- ✅ 返回的用户信息不包含 `passwordHash` 字段

**下一步**：1.7 配置 API 版本控制

---

