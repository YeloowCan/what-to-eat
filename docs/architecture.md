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
  - `db:verify` - 验证数据库连接（使用 `database/verify-connection.js`）
- **包管理工具**：pnpm
- **数据库相关依赖**：
  - `pg` - PostgreSQL 客户端库（用于验证脚本）
  - `dotenv` - 环境变量加载（用于验证脚本）

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
  - 配置全局验证管道（`ValidationPipe`）
  - 使用 `ConfigService` 读取环境变量中的端口配置
  - 监听端口（默认 3000，可通过 `.env` 中的 PORT 配置）
  - 启动 HTTP 服务器并输出启动信息
- **全局验证管道配置**：
  - `whitelist: true` - 自动去除 DTO 中未定义的属性
  - `forbidNonWhitelisted: true` - 禁止未定义的属性，返回 400 错误
  - `transform: true` - 自动转换类型（如字符串转数字）
  - `enableImplicitConversion: true` - 启用隐式类型转换
- **验证流程**：
  - 所有请求在到达控制器前都会经过验证管道
  - 使用 DTO 中的 `class-validator` 装饰器进行验证
  - 验证失败时自动返回 400 错误和详细错误信息
- **环境变量使用**：
  - 通过 `ConfigService.get<number>('PORT')` 获取端口
  - 如果未配置，使用默认值 3000

#### `app.module.ts`
- **作用**：根模块，应用的依赖注入容器
- **当前配置**：
  - 导入：
    - `ConfigModule` - 环境变量配置模块（全局模块）
    - `TypeOrmModule` - TypeORM 数据库模块
  - 控制器：AppController（示例）
  - 提供者：AppService（示例）
- **ConfigModule 配置**：
  - `isGlobal: true` - 设置为全局模块，所有模块可直接注入 `ConfigService`
  - `envFilePath: '.env'` - 指定环境变量文件路径
- **TypeOrmModule 配置**：
  - 使用 `forRootAsync()` 进行异步配置，确保 `ConfigService` 已初始化
  - 数据库类型：PostgreSQL
  - 连接参数从环境变量读取（`DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE`）
  - 开发环境启用 `synchronize`（自动同步数据库结构）和 `logging`（SQL 日志）
  - 生产环境禁用 `synchronize`，使用数据库迁移管理结构
  - 实体数组：`[User]`（已注册 User 实体）
- **已导入模块**：
  - `UsersModule` - 用户模块
- **后续扩展**：将添加更多业务模块（菜品、饮食记录、健康分析等）

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

### 实体目录（src/entities/）

#### `entities/`
- **作用**：存放 TypeORM 实体类定义
- **位置**：`src/entities/`
- **说明**：每个实体类对应数据库中的一个表

#### `entities/user.entity.ts`
- **作用**：用户实体类定义
- **对应表**：`users`
- **包含内容**：
  - `UserProfile` 接口 - 用户资料类型定义
    - `height?: number` - 身高（cm）
    - `weight?: number` - 体重（kg）
    - `age?: number` - 年龄
    - `gender?: 'male' | 'female'` - 性别
  - `User` 实体类 - 用户实体
    - `id` - 主键，自增整数
    - `username` - 用户名，唯一，最大 50 字符
    - `email` - 邮箱，唯一，最大 100 字符
    - `passwordHash` - 密码哈希值（数据库列名：`password_hash`）
    - `profile` - 用户资料（JSONB 类型，可为空）
    - `createdAt` - 创建时间（数据库列名：`created_at`）
    - `updatedAt` - 更新时间（数据库列名：`updated_at`）
- **约束**：
  - `username` 和 `email` 字段设置了唯一约束
  - `profile` 字段使用 PostgreSQL JSONB 类型
- **用途**：用于用户认证、健康分析、个性化推荐等功能

---

### 数据源配置（src/data-source.ts）

#### `data-source.ts`
- **作用**：TypeORM 数据源配置文件，用于数据库迁移
- **功能**：
  - 定义数据库连接配置
  - 指定实体和迁移文件位置
  - 提供迁移命令使用的数据源
- **配置内容**：
  - 数据库连接参数（从环境变量读取）
  - 实体列表：`[User]`
  - 迁移文件路径：`src/database/migrations/*{.ts,.js}`
  - `synchronize: false` - 迁移时禁用自动同步
- **使用场景**：
  - 运行迁移命令时使用
  - 生成迁移文件时使用
  - 回滚迁移时使用
- **注意**：此文件独立于 `app.module.ts` 中的 TypeORM 配置，专门用于迁移操作

---

### 迁移目录（src/database/migrations/）

#### `database/migrations/`
- **作用**：存放数据库迁移文件
- **位置**：`src/database/migrations/`
- **文件命名**：`{timestamp}-{name}.ts`
- **用途**：
  - 管理数据库结构变更
  - 版本控制数据库结构
  - 支持数据库结构回滚
- **迁移脚本**（在 `package.json` 中）：
  - `migration:generate` - 生成迁移文件
  - `migration:run` - 运行迁移
  - `migration:revert` - 回滚迁移

---

### 业务模块目录（src/modules/）

#### `modules/`
- **作用**：存放业务模块代码
- **位置**：`src/modules/`
- **说明**：每个业务功能对应一个模块目录，包含模块、控制器、服务等文件

#### `modules/users/`
- **作用**：用户模块目录
- **位置**：`src/modules/users/`
- **包含文件**：
  - `users.module.ts` - 用户模块定义
  - `users.service.ts` - 用户服务
  - `users.controller.ts` - 用户控制器

#### `modules/users/users.module.ts`
- **作用**：用户模块定义文件
- **功能**：
  - 使用 `@Module` 装饰器定义模块
  - 使用 `TypeOrmModule.forFeature([User])` 注册 TypeORM 特性模块
  - 注册控制器和服务
  - 导出服务供其他模块使用
- **配置内容**：
  - `imports: [TypeOrmModule.forFeature([User])]` - 注册 User 实体的 Repository
  - `controllers: [UsersController]` - 注册控制器
  - `providers: [UsersService]` - 注册服务
  - `exports: [UsersService]` - 导出服务（供其他模块使用）

#### `modules/users/users.service.ts`
- **作用**：用户服务，包含用户相关的业务逻辑
- **功能**：
  - 使用 `@Injectable()` 装饰器，可被依赖注入
  - 注入 `User` 实体的 Repository，用于数据库操作
  - 实现用户相关的业务逻辑方法
  - 提供密码加密和验证功能
  - 实现用户注册功能
- **密码加密方法**：
  - `hashPassword(password: string)`: 使用 bcrypt 对密码进行哈希加密
    - 使用 10 轮 salt（推荐值）
    - 每次哈希结果不同（因为随机 salt）
    - 返回 Promise<string>
  - `validatePassword(password: string, hashedPassword: string)`: 验证密码
    - 使用 bcrypt.compare() 安全地比较密码
    - 返回 Promise<boolean>
- **用户注册方法**：
  - `create(createUserDto: CreateUserDto)`: 创建新用户
    - 检查用户名和邮箱唯一性
    - 加密密码
    - 保存用户到数据库
    - 返回用户信息（不含密码）
    - 如果用户名或邮箱已存在，抛出 `ConflictException`
- **依赖注入**：
  ```typescript
  @InjectRepository(User)
  private readonly userRepository: Repository<User>
  ```
- **依赖库**：
  - `bcrypt` - 密码哈希和验证库
- **异常处理**：
  - 使用 `ConflictException` 处理用户名和邮箱冲突

#### `modules/users/users.controller.ts`
- **作用**：用户控制器，处理用户相关的 HTTP 请求
- **路由前缀**：`/users`（由 `@Controller('users')` 定义）
- **功能**：
  - 处理用户相关的 HTTP 请求和响应
  - 调用服务层处理业务逻辑
  - 返回统一的响应格式
- **当前状态**：空实现，已准备好添加路由处理
- **依赖注入**：注入 `UsersService` 用于业务逻辑处理

#### `modules/users/dto/`
- **作用**：存放用户模块的 DTO（数据传输对象）文件
- **位置**：`src/modules/users/dto/`
- **说明**：DTO 用于定义 API 请求和响应的数据结构，并包含验证规则

#### `modules/users/dto/create-user.dto.ts`
- **作用**：用户注册 DTO
- **包含字段**：
  - `username` - 用户名（3-50 字符，必填）
  - `email` - 邮箱（邮箱格式，必填）
  - `password` - 密码（最少 6 字符，必填）
- **验证规则**：
  - 使用 `class-validator` 装饰器进行验证
  - 验证失败时自动返回 400 错误
- **用途**：用于用户注册接口的请求数据验证

#### `modules/users/dto/update-user-profile.dto.ts`
- **作用**：用户资料更新 DTO
- **包含字段**（全部可选）：
  - `height` - 身高（50-250 cm）
  - `weight` - 体重（20-300 kg）
  - `age` - 年龄（1-150）
  - `gender` - 性别（male/female 枚举）
- **验证规则**：
  - 所有字段都是可选的（`@IsOptional()`）
  - 数值字段有范围限制（`@Min()`, `@Max()`）
  - 性别字段使用枚举验证（`@IsEnum(Gender)`）
- **包含内容**：
  - `Gender` 枚举定义（MALE = 'male', FEMALE = 'female'）
- **用途**：用于更新用户资料接口的请求数据验证

---

### 测试目录（test/）

#### `app.e2e-spec.ts`
- **作用**：端到端测试文件
- **测试内容**：测试整个应用的 HTTP 请求流程

#### `jest-e2e.json`
- **作用**：E2E 测试的 Jest 配置

---

### 数据库目录（database/）

#### `database/`
- **作用**：存放数据库相关的脚本和文档
- **位置**：`server/database/`

#### `database/init.sql`
- **作用**：数据库初始化 SQL 脚本
- **功能**：
  - 创建 `what_to_eat` 数据库
  - 设置数据库编码为 UTF-8
  - 可选的用户创建和权限授予（已注释）
- **使用方法**：
  ```bash
  psql -U postgres -f database/init.sql
  ```
  或在 psql 中执行：
  ```sql
  \i database/init.sql
  ```

#### `database/README.md`
- **作用**：详细的数据库设置指南
- **内容**：
  - Windows 安装 PostgreSQL 的多种方法（安装程序、Chocolatey、Scoop）
  - 创建数据库的多种方法（psql、pgAdmin、SQL 命令）
  - 环境变量配置说明
  - 数据库连接验证方法
  - 常见问题解决方案和故障排除
- **用途**：供开发者在首次设置数据库时参考

#### `database/QUICKSTART.md`
- **作用**：简化的快速开始指南
- **内容**：最简化的设置步骤，适合快速上手
- **用途**：有经验的开发者可以快速参考

#### `database/verify-connection.js`
- **作用**：数据库连接验证脚本
- **功能**：
  - 验证数据库连接配置是否正确
  - 显示数据库信息（版本、编码、当前时间）
  - 列出数据库中的表（如果有）
  - 提供详细的错误提示和故障排除建议
- **使用方法**：
  ```bash
  pnpm run db:verify
  ```
- **依赖**：需要安装 `pg` 和 `dotenv` 包
- **环境变量**：从 `.env` 文件读取数据库连接配置

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
- 业务模块放在 `src/modules/` 目录
- 每个模块包含：module、controller、service 文件
- 使用 `TypeOrmModule.forFeature()` 注册实体 Repository
- 服务可以导出供其他模块使用

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

### 6. 数据库管理
- 使用 PostgreSQL 作为关系型数据库
- 使用 TypeORM 作为 ORM 框架，提供类型安全的数据库操作
- 数据库初始化脚本位于 `database/init.sql`
- 提供详细的设置文档和快速开始指南
- 使用验证脚本确保数据库连接配置正确
- 开发环境使用 `synchronize` 自动同步数据库结构
- 生产环境使用数据库迁移管理结构变更
- TypeORM 配置通过环境变量管理，支持灵活的部署配置
- 实体类定义在 `src/entities/` 目录
- 使用 JSONB 类型存储复杂数据结构（如用户资料）
- 数据库列名使用 snake_case，实体属性使用 camelCase
- 迁移文件使用独立的数据源配置（`data-source.ts`）

---

## 后续开发指南

### 添加新模块
1. 在 `src/modules/` 目录下创建模块目录（如 `users/`）
2. 创建模块文件 `*.module.ts`：
   ```typescript
   @Module({
     imports: [TypeOrmModule.forFeature([Entity])], // 注册实体
     controllers: [Controller],
     providers: [Service],
     exports: [Service], // 可选：导出服务供其他模块使用
   })
   export class ModuleName {}
   ```
3. 创建服务文件 `*.service.ts`：
   ```typescript
   @Injectable()
   export class ServiceName {
     constructor(
       @InjectRepository(Entity)
       private readonly repository: Repository<Entity>,
     ) {}
   }
   ```
4. 创建控制器文件 `*.controller.ts`：
   ```typescript
   @Controller('route-prefix')
   export class ControllerName {
     constructor(private readonly service: ServiceName) {}
   }
   ```
5. 在 `app.module.ts` 的 `imports` 数组中导入新模块

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

### DTO 和验证
- DTO 文件放在模块的 `dto/` 目录
- 使用 `class-validator` 装饰器添加验证规则
- 在控制器方法中使用 DTO 作为参数类型：
  ```typescript
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    // createUserDto 已经过验证
  }
  ```
- 验证规则示例：
  ```typescript
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  username: string;
  ```
- 全局验证管道自动验证所有请求
- 验证失败时返回 400 错误和详细错误信息

### 密码安全
- 使用 bcrypt 进行密码哈希和验证
- 密码哈希方法：`hashPassword(password: string)`
  - 使用 10 轮 salt（推荐值）
  - 每次哈希结果不同（因为随机 salt）
- 密码验证方法：`validatePassword(password: string, hashedPassword: string)`
  - 使用 bcrypt.compare() 安全地比较密码
- 密码以哈希形式存储，不存储明文
- 使用足够的 salt 轮数，平衡安全性和性能

### 数据库操作
- 使用 TypeORM Repository 进行数据库操作
- 在模块中使用 `TypeOrmModule.forFeature([Entity])` 注册实体
- 在服务中注入 Repository：
  ```typescript
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  ```
- 使用 Query Builder 进行复杂查询
- 使用事务处理多个操作
- 开发环境使用 `synchronize` 自动同步，生产环境使用迁移
- 唯一性检查：使用 `findOne()` 方法检查字段唯一性
- 创建实体：使用 `create()` 创建实体，`save()` 保存到数据库
- 返回数据时排除敏感字段（如密码哈希）

### 实体定义
- 实体类放在 `src/entities/` 目录
- 使用 TypeORM 装饰器定义实体和字段
- 表名使用 snake_case（如 `users`）
- 数据库列名使用 snake_case（如 `password_hash`, `created_at`）
- 实体属性使用 camelCase（如 `passwordHash`, `createdAt`）
- 使用 JSONB 类型存储复杂数据结构
- 唯一约束使用 `@Column({ unique: true })`

### 数据库迁移
- 迁移文件放在 `src/database/migrations/` 目录
- 使用 `data-source.ts` 作为迁移数据源
- 生成迁移：`pnpm run migration:generate -- src/database/migrations/MigrationName`
- 运行迁移：`pnpm run migration:run`
- 回滚迁移：`pnpm run migration:revert`
- 每次数据库结构变更都要创建迁移文件

### 错误处理
- 使用 NestJS 内置异常类处理错误
- 常见异常类型：
  - `ConflictException` - 资源冲突（如用户名、邮箱已存在）
  - `NotFoundException` - 资源不存在
  - `BadRequestException` - 请求参数错误
  - `UnauthorizedException` - 未授权
- 异常使用示例：
  ```typescript
  if (existingUser) {
    throw new ConflictException('用户名已存在');
  }
  ```
- 异常会自动转换为 HTTP 状态码和错误响应

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

#### 数据库配置（已配置）
- `DB_HOST` - 数据库主机地址（默认：localhost）
- `DB_PORT` - 数据库端口（PostgreSQL 默认：5432）
- `DB_USERNAME` - 数据库用户名（默认：postgres）
- `DB_PASSWORD` - 数据库密码（必需，安装 PostgreSQL 时设置）
- `DB_DATABASE` - 数据库名称（默认：what_to_eat）
- **注意**：数据库需要在运行应用前创建，参考 `database/README.md` 或 `database/QUICKSTART.md`

#### JWT 配置（后续步骤配置）
- `JWT_SECRET` - JWT 签名密钥（生产环境必须使用强密钥）
- `JWT_EXPIRES_IN` - Token 过期时间（如：7d, 24h）

### 环境变量使用流程

1. 复制 `.env.example` 为 `.env`
2. 根据实际环境修改 `.env` 中的配置值
3. 应用启动时自动读取 `.env` 文件
4. 通过 `ConfigService` 在代码中访问环境变量

---

---

## 前端项目结构（mobile/）

### 根目录配置文件

#### `package.json`
- **作用**：项目依赖管理和脚本配置
- **关键脚本**：
  - `start` - 启动 Expo 开发服务器
  - `android` - 在 Android 设备/模拟器上运行
  - `ios` - 在 iOS 设备/模拟器上运行
  - `web` - 在 Web 浏览器中运行
  - `lint` - 运行 ESLint 代码检查
- **包管理工具**：pnpm
- **主要依赖**：
  - `expo` - Expo SDK 核心
  - `expo-router` - 文件系统路由
  - `react-native` - React Native 框架
  - `react-native-safe-area-context` - 安全区域上下文
  - `react-native-screens` - 原生屏幕组件

#### `app.json`
- **作用**：Expo 应用配置文件
- **配置内容**：
  - 应用名称、版本、图标配置
  - 启动画面配置（背景色：`#49aa19`）
  - 平台特定配置（iOS、Android、Web）
  - Expo Router 插件配置
- **注意**：当前使用 Expo 默认图标，未配置自定义图标路径

#### `tsconfig.json`
- **作用**：TypeScript 编译器配置
- **关键配置**：
  - `extends: "expo/tsconfig.base"` - 继承 Expo 基础配置
  - `strict: true` - 启用严格模式
  - `paths: { "@/*": ["./*"] }` - 路径别名配置

#### `eslint.config.js`
- **作用**：ESLint 代码质量检查配置
- **配置**：使用 `eslint-config-expo` 作为基础配置

#### `expo-env.d.ts`
- **作用**：Expo 类型定义文件
- **内容**：引用 Expo 的类型定义

#### `.gitignore`
- **作用**：Git 版本控制忽略文件配置
- **忽略内容**：
  - `node_modules/` - 依赖包目录
  - `.expo/` - Expo 构建缓存
  - `dist/` - 构建输出目录
  - `web-build/` - Web 构建输出
  - `.env` - 环境变量文件（包含敏感信息）
  - `*.log` - 日志文件

#### `.env`
- **作用**：环境变量配置文件（本地开发使用）
- **包含配置**：
  - `EXPO_PUBLIC_API_URL` - 后端 API 基础 URL（包含版本前缀 `/v1`）
- **注意**：此文件不应提交到版本控制，每个开发者需要根据 `.env.example` 创建自己的 `.env` 文件
- **环境变量访问**：在代码中通过 `process.env.EXPO_PUBLIC_*` 访问
- **生效方式**：修改 `.env` 文件后，需要重启 Expo 开发服务器才能生效

#### `.env.example`
- **作用**：环境变量模板文件
- **用途**：作为 `.env` 的参考模板，团队成员可以复制此文件创建自己的 `.env`
- **特点**：不包含敏感信息，可以提交到版本控制
- **包含配置说明**：API URL 配置说明和注意事项

#### `pnpm-lock.yaml`
- **作用**：pnpm 依赖锁定文件，确保团队成员安装相同版本的依赖

---

### 应用目录（app/）

#### `app/_layout.tsx`
- **作用**：Expo Router 根布局组件
- **功能**：
  - 定义应用的根导航结构
  - 使用 `Stack` 导航器提供堆栈导航
  - 所有页面都在此布局下渲染
- **路由系统**：Expo Router 使用文件系统路由，`app/` 目录下的文件自动成为路由

#### `app/index.tsx`
- **作用**：应用首页组件
- **路由**：对应根路径 `/`
- **当前内容**：显示简单的欢迎界面

---

### 资源目录（assets/）

#### `assets/images/`
- **作用**：存放应用的图片资源
- **包含文件**：
  - `icon.png` - 应用图标
  - `splash-icon.png` - 启动画面图标
  - `favicon.png` - Web 图标
  - `android-icon-*.png` - Android 自适应图标资源
- **注意**：当前 `app.json` 未引用这些文件，使用 Expo 默认图标

---

### 示例代码目录（app-example/）

#### `app-example/`
- **作用**：Expo 提供的示例代码，供参考学习
- **包含内容**：
  - 标签导航示例
  - 主题化组件示例
  - 各种 UI 组件示例
- **注意**：此目录仅作参考，不影响应用运行

---

## 前端架构设计原则

### 1. 文件系统路由
- 使用 Expo Router 的文件系统路由
- `app/` 目录下的文件自动成为路由
- `_layout.tsx` 文件定义布局和嵌套路由
- 文件名对应路由路径

### 2. 组件化设计
- 每个页面是一个独立的组件
- 可复用组件放在 `components/` 目录（后续创建）
- 使用 TypeScript 提供类型安全

### 3. 样式管理
- 使用 StyleSheet.create 创建样式
- 保持样式简洁，避免过度装饰
- 主色调：`#49aa19`（绿色）

### 4. 状态管理
- 后续将使用 Zustand 进行全局状态管理
- 使用 React Query 进行数据获取和缓存

### 5. 环境变量管理
- 使用 `.env` 文件管理环境变量
- 环境变量必须使用 `EXPO_PUBLIC_` 前缀才能在客户端代码中访问
- 通过 `process.env.EXPO_PUBLIC_*` 在代码中访问环境变量
- `.env` 文件不提交到版本控制，使用 `.env.example` 作为模板
- 修改环境变量后需要重启 Expo 开发服务器才能生效

---

## 前端开发指南

### 添加新页面
1. 在 `app/` 目录下创建新的 `.tsx` 文件
2. 文件名对应路由路径（如 `app/about.tsx` 对应 `/about`）
3. 导出默认组件

### 添加布局
1. 创建 `_layout.tsx` 文件定义布局
2. 使用 `Stack`、`Tabs` 等导航器
3. 嵌套布局支持

### 环境变量使用
- 在代码中通过 `process.env.EXPO_PUBLIC_*` 访问环境变量
- 所有环境变量必须使用 `EXPO_PUBLIC_` 前缀
- 修改 `.env` 文件后需要重启 Expo 开发服务器
- 示例：
  ```typescript
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  ```

### 代码规范
- 遵循 `.cursorrules` 中的规范
- 使用单引号
- 使用尾随逗号
- 运行 `pnpm run lint` 检查代码

---

**最后更新**：2025年12月31日

---

## 前端环境变量说明

### 必需的环境变量

#### API 配置
- `EXPO_PUBLIC_API_URL` - 后端 API 基础 URL（包含版本前缀 `/v1`）
  - 默认值（开发环境）：`http://localhost:3000/v1`
  - 生产环境需要根据实际部署地址修改

### 环境变量使用流程

1. 复制 `.env.example` 为 `.env`
2. 根据实际环境修改 `.env` 中的配置值
3. 重启 Expo 开发服务器（`pnpm expo start`）
4. 在代码中通过 `process.env.EXPO_PUBLIC_*` 访问环境变量

### 注意事项

- **前缀要求**：Expo 环境变量必须使用 `EXPO_PUBLIC_` 前缀才能在客户端代码中访问
- **重启要求**：修改 `.env` 文件后，必须重启 Expo 开发服务器才能生效
- **安全考虑**：`.env` 文件包含配置信息，不应提交到版本控制
- **模板文件**：`.env.example` 作为模板文件，可以提交到版本控制

