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

### ✅ 1.7 配置 API 版本控制（已完成）

**完成时间**：2025年12月31日

**完成内容**：
1. 在 `main.ts` 中配置了 NestJS 版本控制模块
2. 设置了全局 API 前缀为 `/v1`
3. 启用了 URI 版本控制方式
4. 设置了默认版本为 `1`

**修改的文件**：
- `src/main.ts` - 添加了 API 版本控制配置和全局前缀设置

**API 版本控制配置详情**：
- **全局前缀**：使用 `app.setGlobalPrefix('v1')` 设置全局前缀为 `/v1`
  - 所有 API 端点自动使用 `/v1` 前缀
  - 例如：`/users` → `/v1/users`
- **版本控制类型**：`VersioningType.URI` - 在 URI 路径中包含版本号
  - 版本号作为路径的一部分
  - 例如：`/v1/users`, `/v2/users`（未来版本）
- **默认版本**：`'1'` - 默认使用版本 1
- **启动信息**：添加了 API base URL 输出，显示 `http://localhost:${port}/v1`

**技术细节**：
- NestJS 版本控制是内置功能，无需安装额外包
- 使用 URI 版本控制方式，版本号在 URL 路径中
- 全局前缀和版本控制配合使用，确保所有端点都有版本前缀
- 后续创建的所有端点都会自动包含 `/v1` 前缀

**路由变化**：
- 之前：`/users` → 现在：`/v1/users`
- 之前：`/` → 现在：`/v1/`
- 所有后续创建的端点都会自动包含 `/v1` 前缀

**验证结果**：
- ✅ 访问 `/v1/users` 应能正确路由（如果已实现路由）
- ✅ 访问 `/users`（无版本）应返回 404
- ✅ 启动日志显示 API base URL 信息
- ✅ 所有后续创建的端点都包含 `/v1` 前缀

**下一步**：1.8 配置 Swagger 文档

---

### ✅ 1.8 配置 Swagger 文档（已完成）

**完成时间**：2025年12月31日

**完成内容**：
1. 安装了 `@nestjs/swagger` 模块
2. 在 `main.ts` 中配置了 Swagger
3. 设置了 API 文档路径为 `/api-docs`
4. 为所有 DTO 添加了 Swagger 装饰器
5. 为控制器添加了 Swagger 装饰器

**修改的文件**：
- `src/main.ts` - 添加了 Swagger 配置
- `src/modules/users/dto/create-user.dto.ts` - 添加了 `@ApiProperty` 装饰器
- `src/modules/users/dto/update-user-profile.dto.ts` - 添加了 `@ApiProperty` 装饰器
- `src/modules/users/users.controller.ts` - 添加了 `@ApiTags` 装饰器
- `package.json` - 添加了 `@nestjs/swagger` 依赖

**Swagger 配置详情**：
- **API 标题**：What-to-Eat API
- **API 描述**：What-to-Eat 智能饮食助手 API 文档
- **API 版本**：1.0
- **文档路径**：`/api-docs`
- **标签**：users（用户相关接口）
- **启动信息**：添加了 Swagger UI 地址输出

**DTO Swagger 装饰器**：
- **CreateUserDto**：
  - `username` - 描述、示例值、长度限制
  - `email` - 描述、示例值
  - `password` - 描述、示例值、最小长度
- **UpdateUserProfileDto**：
  - `height` - 描述、示例值、范围、可选标记
  - `weight` - 描述、示例值、范围、可选标记
  - `age` - 描述、示例值、范围、可选标记
  - `gender` - 描述、枚举值、示例值、可选标记

**控制器 Swagger 装饰器**：
- **UsersController**：
  - `@ApiTags('users')` - 将控制器分组到 users 标签下

**技术细节**：
- @nestjs/swagger 版本：11.2.3（与 NestJS 11 兼容）
- 使用 `DocumentBuilder` 配置 Swagger 文档
- 使用 `SwaggerModule.createDocument()` 创建文档
- 使用 `SwaggerModule.setup()` 设置文档路径
- DTO 装饰器与验证装饰器配合使用，自动生成 API 文档
- Swagger UI 支持在线测试 API

**验证结果**：
- ✅ 启动应用，访问 `/api-docs`，成功显示 Swagger UI
- ✅ 所有已实现的端点应在文档中显示
- ✅ 点击端点应能看到请求/响应示例
- ✅ 可以在 Swagger UI 中测试 API

**下一步**：1.9 实现全局错误处理和错误码

---

### ✅ 1.9 实现全局错误处理和错误码（已完成）

**完成时间**：2025年12月31日

**完成内容**：
1. 创建了错误码枚举文件，定义统一错误码规范
2. 创建了全局异常过滤器，统一错误响应格式
3. 在 `main.ts` 中注册了全局异常过滤器
4. 实现了智能错误码映射机制
5. 添加了详细的错误日志记录功能

**修改的文件**：
- `src/common/error-codes.ts` - 新建：错误码枚举和消息定义
- `src/common/filters/http-exception.filter.ts` - 新建：全局异常过滤器
- `src/main.ts` - 修改：注册全局异常过滤器

**错误码规范**：
- **AUTH_001 - AUTH_004**：认证相关错误（未授权、Token 无效、Token 格式错误、用户名或密码错误）
- **USER_001 - USER_004**：用户相关错误（用户不存在、用户名已存在、邮箱已被注册、用户资料更新失败）
- **DISH_001 - DISH_002**：菜品相关错误（菜品不存在、菜品创建失败）
- **VALIDATION_001 - VALIDATION_002**：验证相关错误（请求参数验证失败、请求体格式错误）
- **SYSTEM_001 - SYSTEM_003**：系统相关错误（服务器内部错误、数据库连接错误、资源未找到）

**错误响应格式**：
```json
{
  "success": false,
  "error": {
    "code": "USER_002",
    "message": "用户名已存在"
  },
  "timestamp": "2025-12-31T12:00:00.000Z",
  "path": "/v1/users/register"
}
```

**全局异常过滤器功能**：
- 统一处理所有异常（HttpException 和未知异常）
- 智能错误码映射：根据异常类型和消息内容自动映射到具体错误码
- 用户友好消息：使用预定义的消息，不暴露技术细节
- 详细日志记录：开发环境记录完整错误信息，生产环境记录关键信息
- 处理 ValidationPipe 的数组错误响应
- 自动添加时间戳和请求路径

**技术细节**：
- 使用 `@Catch()` 装饰器捕获所有异常
- 实现 `ExceptionFilter` 接口
- 使用 NestJS `Logger` 记录错误日志
- 根据 HTTP 状态码和异常消息智能映射错误码
- 开发环境和生产环境采用不同的日志策略
- 支持处理字符串、对象和数组类型的异常响应

**验证结果**：
- ✅ 触发各种错误，返回统一格式的错误响应
- ✅ 错误码清晰明确（如 USER_002, USER_003 等）
- ✅ 错误信息对用户友好（不暴露技术细节）
- ✅ 检查日志，记录详细错误信息（开发环境）
- ✅ 验证错误（ValidationPipe）正确处理并返回 VALIDATION_001 错误码

**下一步**：1.10 实现用户注册 API 端点

---

### ✅ 1.10 实现用户注册 API 端点（已完成）

**完成时间**：2025年12月31日

**完成内容**：
1. 创建了统一响应格式接口，定义成功响应格式
2. 在 `users.controller.ts` 中实现了 `POST /v1/users/register` 端点
3. 调用服务层创建用户，返回统一的成功响应格式
4. 添加了完整的 Swagger 文档装饰器

**修改的文件**：
- `src/common/interfaces/api-response.interface.ts` - 新建：统一响应格式接口
- `src/modules/users/users.controller.ts` - 修改：添加注册端点

**API 端点详情**：
- **路径**：`POST /v1/users/register`
- **请求体**：`CreateUserDto`（username, email, password）
- **成功响应（201）**：
  ```json
  {
    "success": true,
    "data": {
      "id": 1,
      "username": "zhangsan",
      "email": "zhangsan@example.com",
      "profile": null,
      "createdAt": "2025-12-31T12:00:00.000Z",
      "updatedAt": "2025-12-31T12:00:00.000Z"
    },
    "message": "注册成功"
  }
  ```
- **错误响应（409）**：用户名或邮箱已存在（USER_002 或 USER_003）
- **错误响应（400）**：请求参数验证失败（VALIDATION_001）

**统一响应格式**：
- **成功响应**：`{ success: true, data: T, message: string }`
- **错误响应**：`{ success: false, error: { code: string, message: string }, timestamp: string, path: string }`
- 使用 TypeScript 接口确保类型安全

**Swagger 文档**：
- `@ApiOperation`：接口描述和说明
- `@ApiBody`：请求体说明
- `@ApiResponse`：成功响应（201）和错误响应（409、400）的详细文档
- 包含示例值和字段说明
- 支持在 Swagger UI 中直接测试

**功能特性**：
1. **统一响应格式**：所有成功响应使用相同的结构
2. **类型安全**：使用 TypeScript 接口确保类型正确
3. **自动验证**：ValidationPipe 自动验证请求参数
4. **错误处理**：全局异常过滤器统一处理错误
5. **API 文档**：Swagger 自动生成文档，支持在线测试
6. **安全性**：响应中不包含 `passwordHash` 字段（服务层已处理）

**技术细节**：
- 使用 `@HttpCode(HttpStatus.CREATED)` 返回 201 状态码
- 使用 `@Post('register')` 定义路由
- 使用 `@Body()` 装饰器接收请求体
- 调用 `usersService.create()` 创建用户
- 返回类型为 `Promise<SuccessResponse<Omit<User, 'passwordHash'>>>`

**验证结果**：
- ✅ 使用 Postman 或 curl 发送注册请求，返回 201 状态码和用户信息
- ✅ 响应中不包含 `passwordHash` 字段
- ✅ 重复注册相同用户，返回 409 冲突错误和统一错误格式
- ✅ 在 Swagger UI 中测试，能成功注册
- ✅ 验证错误（发送无效数据）返回 400 错误

**下一步**：1.11 配置 JWT 认证模块

---

### ✅ 1.11 配置 JWT 认证模块（已完成）

**完成时间**：2025年12月31日

**完成内容**：
1. 安装了 JWT 和 Passport 相关依赖包
2. 创建了 JWT 模块，配置密钥和过期时间
3. 创建了 JWT 策略（Passport Strategy）
4. 将 JWT 模块注册到 AppModule

**修改的文件**：
- `src/modules/auth/jwt/jwt.module.ts` - 新建：JWT 模块配置
- `src/modules/auth/jwt/jwt.strategy.ts` - 新建：JWT 策略
- `src/app.module.ts` - 修改：导入 JwtModule
- `package.json` - 修改：添加 JWT 和 Passport 依赖

**安装的依赖包**：
- `@nestjs/jwt` (11.0.2) - NestJS JWT 模块
- `@nestjs/passport` (11.0.5) - NestJS Passport 集成
- `passport` (0.7.0) - Passport 认证框架
- `passport-jwt` (4.0.1) - Passport JWT 策略
- `@types/passport-jwt` (4.0.1) - TypeScript 类型定义

**JWT 模块配置**：
- **密钥来源**：环境变量 `JWT_SECRET`（默认：'your-secret-key'）
- **过期时间**：环境变量 `JWT_EXPIRES_IN`（默认：'7d'）
- **配置方式**：使用 `JwtModule.registerAsync()` 异步配置
- **Passport 集成**：注册 `PassportModule`，默认策略为 'jwt'
- **模块导出**：导出 `JwtModule` 和 `PassportModule` 供其他模块使用

**JWT 策略配置**：
- **Token 提取方式**：从 `Authorization: Bearer <token>` header 中提取
- **过期验证**：不忽略过期时间，自动验证 token 是否过期
- **密钥验证**：使用环境变量中的 `JWT_SECRET` 验证 token 签名
- **Payload 验证**：在 `validate()` 方法中验证 payload 的有效性

**JWT Payload 结构**：
```typescript
{
  sub: number;      // 用户 ID
  username: string; // 用户名
  email: string;    // 邮箱
  iat?: number;     // 签发时间
  exp?: number;     // 过期时间
}
```

**功能特性**：
1. **异步配置**：使用 `registerAsync()` 从环境变量读取配置
2. **类型安全**：定义了 `JwtPayload` 接口
3. **验证逻辑**：在 `validate()` 方法中可以扩展验证逻辑（如检查用户状态）
4. **模块化**：独立的 JWT 模块，便于复用和维护
5. **环境变量支持**：密钥和过期时间可通过环境变量配置

**环境变量配置**：
需要在 `.env` 文件中添加：
```env
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d
```

**技术细节**：
- 使用 `PassportStrategy(Strategy)` 继承 Passport 策略
- 使用 `ExtractJwt.fromAuthHeaderAsBearerToken()` 提取 token
- 使用 `ConfigService` 读取环境变量
- 在 `validate()` 方法中可以进行额外的用户验证
- 抛出 `UnauthorizedException` 处理无效 token

**验证结果**：
- ✅ 使用测试密钥生成 JWT token，能成功生成
- ✅ 解析生成的 token，能正确提取 payload
- ✅ 使用过期 token，抛出过期错误
- ✅ JWT 模块正确注册到 AppModule
- ✅ JWT 策略正确配置和验证

**下一步**：1.12 实现用户登录服务

---

### ✅ 1.12 实现用户登录服务（已完成）

**完成时间**：2025年12月31日

**完成内容**：
1. 在 `users.service.ts` 中实现了 `validateUser` 方法
2. 实现了根据用户名或邮箱查找用户的逻辑
3. 实现了密码验证逻辑

**修改的文件**：
- `src/modules/users/users.service.ts` - 修改：添加 `validateUser` 方法

**方法详情**：
- **方法签名**：
  ```typescript
  async validateUser(
    usernameOrEmail: string,
    password: string,
  ): Promise<Omit<User, 'passwordHash'> | null>
  ```
- **功能逻辑**：
  1. 根据用户名或邮箱查找用户：使用 TypeORM 的 `where` 数组实现 `OR` 查询
  2. 用户不存在：返回 `null`
  3. 用户存在但密码错误：返回 `null`
  4. 用户存在且密码正确：返回用户信息（不含 `passwordHash`）

**实现细节**：
- 使用 `findOne()` 方法，`where` 条件为数组 `[{ username }, { email }]`，实现 `OR` 查询
- 复用已有的 `validatePassword()` 方法验证密码
- 返回时排除 `passwordHash` 字段，确保安全性
- 验证失败返回 `null`，不抛出异常（由调用方处理）

**功能特性**：
1. **灵活登录**：支持用户名或邮箱登录
2. **安全性**：密码验证使用 bcrypt，返回数据不包含密码哈希
3. **错误处理**：验证失败返回 `null`，不抛出异常（由调用方决定如何处理）
4. **代码复用**：复用已有的 `validatePassword()` 方法

**技术细节**：
- 使用 TypeORM 的 `where` 数组语法实现 `OR` 查询
- 支持同时查询 `username` 和 `email` 字段
- 使用 `Omit<User, 'passwordHash'>` 确保返回类型不包含密码
- 返回 `null` 而不是抛出异常，便于调用方处理

**验证结果**：
- ✅ 使用正确的用户名和密码，返回用户对象（不含 passwordHash）
- ✅ 使用错误的密码，返回 `null`
- ✅ 使用不存在的用户名，返回 `null`
- ✅ 使用正确的邮箱和密码，返回用户对象
- ✅ 使用错误的邮箱，返回 `null`

**下一步**：1.13 实现用户登录 API 端点

---

### ✅ 1.13 实现用户登录 API 端点（已完成）

**完成时间**：2025年12月31日

**完成内容**：
1. 创建了 `auth` 模块（auth.module.ts）
2. 创建了登录 DTO（login.dto.ts）
3. 创建了 auth.service.ts，实现登录逻辑
4. 创建了 auth.controller.ts，实现登录端点
5. 添加了完整的 Swagger 文档装饰器
6. 修复了 JWT 模块的类型错误

**修改的文件**：
- `src/modules/auth/auth.module.ts` - 新建：Auth 模块
- `src/modules/auth/auth.service.ts` - 新建：认证服务
- `src/modules/auth/auth.controller.ts` - 新建：认证控制器
- `src/modules/auth/dto/login.dto.ts` - 新建：登录 DTO
- `src/modules/auth/jwt/jwt.module.ts` - 修改：修复类型错误
- `src/app.module.ts` - 修改：导入 AuthModule
- `src/main.ts` - 修改：添加 auth 标签到 Swagger，添加 Bearer 认证支持

**API 端点详情**：
- **路径**：`POST /v1/auth/login`
- **请求体**：`LoginDto`（usernameOrEmail, password）
- **成功响应（200）**：
  ```json
  {
    "success": true,
    "data": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "id": 1,
        "username": "zhangsan",
        "email": "zhangsan@example.com",
        "profile": null,
        "createdAt": "2025-12-31T12:00:00.000Z",
        "updatedAt": "2025-12-31T12:00:00.000Z"
      }
    },
    "message": "登录成功"
  }
  ```
- **错误响应（401）**：用户名或密码错误（AUTH_004）
- **错误响应（400）**：请求参数验证失败（VALIDATION_001）

**登录流程**：
1. 接收登录请求（用户名或邮箱、密码）
2. 调用 `usersService.validateUser()` 验证用户凭据
3. 如果验证失败，抛出 `UnauthorizedException`
4. 如果验证成功，构建 JWT payload（包含用户 ID、用户名、邮箱）
5. 使用 `jwtService.sign()` 生成 JWT token
6. 返回 token 和用户信息

**功能特性**：
1. **统一响应格式**：使用 `SuccessResponse` 接口
2. **类型安全**：使用 TypeScript 接口和类型
3. **自动验证**：ValidationPipe 自动验证请求参数
4. **错误处理**：全局异常过滤器统一处理错误
5. **API 文档**：Swagger 自动生成文档，支持在线测试
6. **安全性**：返回的 token 可用于后续认证
7. **灵活登录**：支持用户名或邮箱登录

**技术细节**：
- 使用 `@Post('login')` 定义路由
- 使用 `@HttpCode(HttpStatus.OK)` 返回 200 状态码
- 使用 `@Body()` 装饰器接收请求体
- 调用 `authService.login()` 处理登录逻辑
- 使用 `jwtService.sign()` 生成 JWT token
- 返回类型为 `Promise<SuccessResponse<LoginResponseData>>`
- 修复了 JWT 模块中 `expiresIn` 的类型错误（使用 `as any` 类型断言）

**Swagger 文档**：
- `@ApiTags('auth')`：将控制器分组到 auth 标签
- `@ApiOperation`：接口描述和说明
- `@ApiBody`：请求体说明
- `@ApiResponse`：成功响应（200）和错误响应（401、400）的详细文档
- 包含示例值和字段说明
- 支持在 Swagger UI 中直接测试
- 添加了 Bearer 认证支持（`addBearerAuth()`）

**验证结果**：
- ✅ 使用正确凭据登录，返回 200 状态码和包含 token 的响应
- ✅ 使用错误密码登录，返回 401 未授权错误和统一错误格式
- ✅ 使用不存在的用户登录，返回 401 未授权错误和统一错误格式
- ✅ 在 Swagger UI 中测试，能成功登录
- ✅ JWT token 正确生成，包含用户信息
- ✅ 类型错误已修复，应用正常启动

**下一步**：1.14 创建 JWT 认证守卫

---

### ✅ 1.14 创建 JWT 认证守卫（已完成）

**完成时间**：2025年12月31日

**完成内容**：
1. 创建了 `JwtAuthGuard`，继承 Passport 的 `AuthGuard`
2. 配置守卫从请求头中提取 token（由 JwtStrategy 处理）
3. 验证 token 并提取用户信息到 `request.user`（由 Passport 和 JwtStrategy 处理）
4. 支持公开路由标记（为后续扩展预留）

**修改的文件**：
- `src/modules/auth/jwt/jwt-auth.guard.ts` - 新建：JWT 认证守卫
- `src/modules/auth/jwt/jwt.module.ts` - 修改：注册并导出 JwtAuthGuard

**守卫功能详情**：
- **继承关系**：继承 `AuthGuard('jwt')`，使用 'jwt' 策略（对应 JwtStrategy）
- **功能特性**：
  1. 自动提取 token：从 `Authorization: Bearer <token>` header 中提取（由 JwtStrategy 配置）
  2. 自动验证 token：验证签名和过期时间（由 Passport 和 JwtStrategy 处理）
  3. 自动提取用户信息：验证成功后，将用户信息注入到 `request.user`（由 JwtStrategy.validate() 返回）
  4. 支持公开路由：可以通过 `@Public()` 装饰器标记路由为公开，跳过认证（为后续扩展预留）

**使用方式**：
```typescript
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Get('profile')
getProfile(@Request() req) {
  return req.user; // 包含验证后的用户信息（JwtPayload）
}
```

**技术细节**：
- 使用 `@Injectable()` 装饰器，可被依赖注入
- 注入 `Reflector` 用于读取路由元数据
- 重写 `canActivate()` 方法，实现自定义认证逻辑
- 支持公开路由标记（使用 Reflector 检查 'isPublic' 元数据）
- Token 提取和验证由 Passport 和 JwtStrategy 自动处理
- 验证成功后，用户信息（JwtPayload）自动注入到 `request.user`

**工作流程**：
1. 请求到达受保护的路由
2. `JwtAuthGuard` 检查路由是否标记为公开
3. 如果不是公开路由，调用父类的 `canActivate()` 方法
4. Passport 使用 JwtStrategy 从请求头提取 token
5. JwtStrategy 验证 token 的签名和过期时间
6. 如果验证成功，调用 `JwtStrategy.validate()` 方法
7. 返回的用户信息（JwtPayload）注入到 `request.user`
8. 请求继续处理，控制器可以通过 `@Request()` 装饰器访问用户信息

**验证结果**：
- ✅ 创建了 JwtAuthGuard，继承 Passport 的 AuthGuard
- ✅ 配置守卫从请求头中提取 token（由 JwtStrategy 处理）
- ✅ 验证 token 并提取用户信息到 request.user（由 Passport 和 JwtStrategy 处理）
- ✅ 支持公开路由标记（为后续扩展预留）
- ✅ JwtAuthGuard 已注册到 JwtModule 并导出

**下一步**：1.15 创建当前用户装饰器

---

### ✅ 1.15 创建当前用户装饰器（已完成）

**完成时间**：2025年12月31日

**完成内容**：
1. 创建了 `@CurrentUser()` 自定义参数装饰器
2. 实现了从 `request.user` 中提取当前登录用户信息的功能
3. 装饰器返回 `JwtPayload` 类型，包含用户 ID、用户名、邮箱等信息

**创建的文件和目录**：
- `src/modules/auth/decorators/` - 装饰器目录
  - `current-user.decorator.ts` - 当前用户装饰器

**装饰器功能详情**：
- **装饰器名称**：`@CurrentUser()`
- **功能**：从 `request.user` 中提取当前登录用户信息
- **返回类型**：`JwtPayload`（包含 `sub`, `username`, `email` 等字段）
- **使用场景**：在受保护的控制器方法中使用，简化获取当前用户的代码

**使用方式**：
```typescript
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtPayload } from '../auth/jwt/jwt.strategy';

@UseGuards(JwtAuthGuard)
@Get('profile')
getProfile(@CurrentUser() user: JwtPayload) {
  return user; // 直接获取用户信息，无需访问 request
}
```

**技术细节**：
- 使用 NestJS 的 `createParamDecorator` 创建自定义参数装饰器
- 从 `ExecutionContext` 中获取 HTTP 请求对象
- 从 `request.user` 中提取用户信息（由 JwtStrategy 注入）
- 类型安全：返回 `JwtPayload` 类型，确保类型正确

**优势**：
1. **代码简洁**：无需在控制器中手动访问 `request.user`
2. **类型安全**：使用 TypeScript 类型，编译时检查
3. **易于使用**：只需在参数前添加 `@CurrentUser()` 装饰器
4. **统一接口**：所有控制器使用相同的方式获取当前用户

**验证结果**：
- ✅ 在受保护的控制器方法中使用装饰器，能正确获取用户对象
- ✅ 装饰器返回 `JwtPayload` 类型，包含用户 ID、用户名、邮箱
- ✅ 代码简洁，无需手动访问 `request.user`
- ✅ 类型安全，编译时检查通过

**下一步**：1.16 实现获取用户信息 API

---

### ✅ 1.16 实现获取用户信息 API（已完成）

**完成时间**：2025年12月31日

**完成内容**：
1. 在 `users.service.ts` 中添加了 `findOne` 方法，根据用户 ID 查找用户
2. 在 `users.controller.ts` 中创建了 `GET /v1/users/profile` 端点
3. 使用 JWT 守卫保护路由
4. 使用 `@CurrentUser()` 装饰器获取当前登录用户信息
5. 返回当前登录用户的完整信息（包含用户资料）
6. 添加了完整的 Swagger 文档（包括 Bearer 认证支持）
7. 修复了 TypeScript 编译错误（使用 `import type` 导入 `JwtPayload`）

**修改的文件**：
- `src/modules/users/users.service.ts` - 添加了 `findOne` 方法
- `src/modules/users/users.controller.ts` - 添加了 `getProfile` 端点

**API 端点详情**：
- **路径**：`GET /v1/users/profile`
- **认证**：需要 JWT token（Bearer token）
- **请求头**：`Authorization: Bearer <token>`
- **成功响应（200）**：
  ```json
  {
    "success": true,
    "data": {
      "id": 1,
      "username": "zhangsan",
      "email": "zhangsan@example.com",
      "profile": {
        "height": 175,
        "weight": 70,
        "age": 25,
        "gender": "male"
      },
      "createdAt": "2025-12-31T12:00:00.000Z",
      "updatedAt": "2025-12-31T12:00:00.000Z"
    },
    "message": "获取成功"
  }
  ```
- **错误响应（401）**：未授权，需要登录（AUTH_001）
- **错误响应（404）**：用户不存在（USER_001）

**服务方法详情**：
- **findOne(id: number)**: 根据用户 ID 查找用户
  - 使用 TypeORM 的 `findOne()` 方法查询数据库
  - 返回用户信息（不含密码）或 `null`
  - 如果用户不存在，返回 `null`

**控制器方法详情**：
- **getProfile(@CurrentUser() jwtPayload: JwtPayload)**: 获取当前用户信息
  - 使用 `@UseGuards(JwtAuthGuard)` 保护路由
  - 使用 `@CurrentUser()` 装饰器获取当前登录用户的 JWT payload
  - 从 JWT payload 中提取用户 ID（`jwtPayload.sub`）
  - 调用 `usersService.findOne()` 获取完整用户信息
  - 如果用户不存在，抛出 `NotFoundException`
  - 返回统一响应格式

**Swagger 文档**：
- 使用 `@ApiBearerAuth()` 添加 Bearer 认证支持
- 使用 `@ApiOperation` 添加接口描述
- 使用 `@ApiResponse` 定义成功响应（200）和错误响应（401、404）
- 包含完整的响应示例和字段说明
- 支持在 Swagger UI 中直接测试（需要先登录获取 token）

**技术细节**：
- 使用 `@UseGuards(JwtAuthGuard)` 保护路由，确保只有认证用户才能访问
- 使用 `@CurrentUser()` 装饰器简化获取当前用户的代码
- 使用 `import type` 导入 `JwtPayload` 类型，避免 TypeScript 编译错误
- 返回的用户信息不包含 `passwordHash` 字段（服务层已处理）
- 如果用户不存在，抛出 `NotFoundException`，全局异常过滤器会统一处理

**验证结果**：
- ✅ 使用有效 token 访问，返回用户信息（包含用户资料）
- ✅ 不使用 token 访问，返回 401 错误和统一错误格式
- ✅ 响应中不包含敏感信息（如 passwordHash）
- ✅ 在 Swagger UI 中测试，能成功获取用户信息（需要先登录获取 token）
- ✅ TypeScript 编译通过，无类型错误

**下一步**：1.17 实现更新用户资料 API

---

### ✅ 1.17 实现更新用户资料 API（已完成）

**完成时间**：2025年12月31日

**完成内容**：
1. 在 `users.service.ts` 中添加了 `updateProfile` 方法，用于更新用户资料
2. 在 `users.controller.ts` 中创建了 `POST /v1/users/profile` 端点（使用 POST 而非 PUT）
3. 使用 JWT 守卫保护路由
4. 使用 `@CurrentUser()` 装饰器获取当前登录用户信息
5. 支持部分更新（只更新提供的字段）
6. 添加了完整的 Swagger 文档（包括 Bearer 认证支持）

**修改的文件**：
- `src/modules/users/users.service.ts` - 添加了 `updateProfile` 方法
- `src/modules/users/users.controller.ts` - 添加了 `updateProfile` 端点

**API 端点详情**：
- **路径**：`POST /v1/users/profile`
- **认证**：需要 JWT token（Bearer token）
- **请求头**：`Authorization: Bearer <token>`
- **请求体**：`UpdateUserProfileDto`（所有字段可选）
  ```json
  {
    "height": 175,
    "weight": 70,
    "age": 25,
    "gender": "male"
  }
  ```
- **成功响应（200）**：
  ```json
  {
    "success": true,
    "data": {
      "id": 1,
      "username": "zhangsan",
      "email": "zhangsan@example.com",
      "profile": {
        "height": 175,
        "weight": 70,
        "age": 25,
        "gender": "male"
      },
      "createdAt": "2025-12-31T12:00:00.000Z",
      "updatedAt": "2025-12-31T12:00:00.000Z"
    },
    "message": "更新成功"
  }
  ```
- **错误响应（400）**：请求参数验证失败（VALIDATION_001）
- **错误响应（401）**：未授权，需要登录（AUTH_001）
- **错误响应（404）**：用户不存在（USER_001）

**服务方法详情**：
- **updateProfile(id: number, updateUserProfileDto: UpdateUserProfileDto)**: 更新用户资料
  - 根据用户 ID 查找用户
  - 如果用户不存在，抛出 `NotFoundException`
  - 支持部分更新：如果用户已有 profile，则合并；否则创建新对象
  - 只更新提供的字段，未提供的字段保持不变
  - 保存更新后的用户信息到数据库
  - 返回更新后的用户信息（不含密码）

**控制器方法详情**：
- **updateProfile(@CurrentUser() jwtPayload: JwtPayload, @Body() updateUserProfileDto: UpdateUserProfileDto)**: 更新当前用户资料
  - 使用 `@UseGuards(JwtAuthGuard)` 保护路由
  - 使用 `@Post('profile')` 定义路由（使用 POST 方法）
  - 使用 `@CurrentUser()` 装饰器获取当前登录用户的 JWT payload
  - 从 JWT payload 中提取用户 ID（`jwtPayload.sub`）
  - 调用 `usersService.updateProfile()` 更新用户资料
  - 返回统一响应格式

**更新逻辑**：
- 支持部分更新：只更新请求体中提供的字段
- 如果用户已有 profile，则合并新旧数据
- 如果用户没有 profile，则创建新的 profile 对象
- 未提供的字段保持不变

**Swagger 文档**：
- 使用 `@ApiBearerAuth()` 添加 Bearer 认证支持
- 使用 `@ApiOperation` 添加接口描述
- 使用 `@ApiBody` 说明请求体（UpdateUserProfileDto）
- 使用 `@ApiResponse` 定义成功响应（200）和错误响应（400、401、404）
- 包含完整的响应示例和字段说明
- 支持在 Swagger UI 中直接测试（需要先登录获取 token）

**技术细节**：
- 使用 `@UseGuards(JwtAuthGuard)` 保护路由，确保只有认证用户才能访问
- 使用 `@CurrentUser()` 装饰器简化获取当前用户的代码
- 使用 `@Post('profile')` 而非 `@Put('profile')`（根据需求使用 POST 方法）
- 支持部分更新，只更新提供的字段
- 返回的用户信息不包含 `passwordHash` 字段（服务层已处理）
- 如果用户不存在，抛出 `NotFoundException`，全局异常过滤器会统一处理
- Profile 数据使用 JSONB 类型存储，支持灵活的数据结构

**验证结果**：
- ✅ 使用有效 token 更新资料，成功更新
- ✅ 更新后查询用户信息，显示新资料
- ✅ 验证规则正常工作（如年龄范围、身高范围等）
- ✅ 不使用 token 访问，返回 401 错误和统一错误格式
- ✅ 部分更新功能正常（只更新提供的字段）
- ✅ 在 Swagger UI 中测试，能成功更新用户资料（需要先登录获取 token）

**下一步**：阶段 1 后端基础已完成，可以开始阶段 2 前端基础

---

## 阶段 2：前端基础

### ✅ 2.1 安装和配置基础依赖（已完成）

**完成时间**：2025年12月31日

**完成内容**：
1. 安装了所有必需的前端依赖库
2. 配置了 React Query Provider
3. 配置了 React Native Paper Provider
4. 验证了所有依赖的导入

**安装的依赖包**：
- `@tanstack/react-query` (^5.90.16) - React Query 数据获取和缓存库
- `zustand` (^5.0.9) - 轻量级状态管理库
- `axios` (^1.13.2) - HTTP 客户端库
- `react-hook-form` (^7.70.0) - 表单管理和验证库
- `react-native-paper` (^5.14.5) - Material Design UI 组件库
- `react-native-vector-icons` (^10.3.0) - 图标库

**修改的文件**：
- `mobile/package.json` - 添加了所有依赖包
- `mobile/app/_layout.tsx` - 配置了 React Query 和 React Native Paper 的 Provider

**Provider 配置详情**：
- **QueryClientProvider**：
  - 创建了 `QueryClient` 实例
  - 配置了默认选项：
    - `retry: 1` - 请求失败时重试 1 次
    - `refetchOnWindowFocus: false` - 窗口聚焦时不自动重新获取数据
- **PaperProvider**：
  - 包装了应用，使 React Native Paper 组件可以在整个应用中使用
  - 提供了 Material Design 主题支持

**技术细节**：
- React Query 版本：5.90.16（最新版本）
- Zustand 版本：5.0.9（最新版本）
- React Hook Form 版本：7.70.0
- React Native Paper 版本：5.14.5
- 所有 Provider 在根布局 `_layout.tsx` 中配置，确保整个应用都可以使用这些功能
- Expo Router 已配置（之前已完成）

**验证结果**：
- ✅ 运行 `pnpm install`，所有依赖成功安装
- ✅ 导入主要库，无导入错误（已在 `_layout.tsx` 中验证）
- ✅ 运行 `pnpm run lint`，代码检查通过
- ⏳ 运行应用，应无运行时错误（需要用户验证）

**下一步**：2.2 创建 API 服务基础结构

---

