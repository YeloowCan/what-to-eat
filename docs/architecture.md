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
  - 配置 CORS（跨域资源共享）
  - 配置 API 版本控制
  - 配置全局验证管道（`ValidationPipe`）
  - 使用 `ConfigService` 读取环境变量中的端口配置
  - 监听端口（默认 3000，可通过 `.env` 中的 PORT 配置）
  - 启动 HTTP 服务器并输出启动信息
- **CORS 配置**：
  - 使用 `app.enableCors()` 启用跨域支持
  - **开发环境**：`origin: true` - 允许所有来源，便于本地开发测试
  - **生产环境**：从环境变量 `CORS_ORIGIN` 读取允许的来源，提高安全性
  - `credentials: true` - 允许携带凭证（cookies、Authorization 头）
  - `methods` - 允许的 HTTP 方法：GET, POST, PUT, DELETE, PATCH, OPTIONS
  - `allowedHeaders` - 允许的请求头：Content-Type, Authorization
  - 解决前端调用后端 API 时的跨域问题
- **API 版本控制配置**：
  - `app.setGlobalPrefix('v1')` - 设置全局 API 前缀为 `/v1`
  - `app.enableVersioning()` - 启用版本控制
    - `type: VersioningType.URI` - 使用 URI 版本控制方式（版本号在路径中）
    - `defaultVersion: '1'` - 设置默认版本为 1
  - 所有 API 端点自动使用 `/v1` 前缀
  - 例如：`/users` → `/v1/users`
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
- **Swagger 文档配置**：
  - 使用 `DocumentBuilder` 配置 API 文档信息
  - API 标题：What-to-Eat API
  - API 描述：What-to-Eat 智能饮食助手 API 文档
  - API 版本：1.0
  - 标签：users（用户相关接口）
  - 使用 `SwaggerModule.createDocument()` 创建文档
  - 使用 `SwaggerModule.setup('api-docs', app, document)` 设置文档路径
  - 文档路径：`/api-docs`
- **全局异常过滤器配置**：
  - 使用 `app.useGlobalFilters(new HttpExceptionFilter())` 注册全局异常过滤器
  - 所有异常都会被统一处理，返回统一的错误响应格式
  - 错误响应包含：success、error（code 和 message）、timestamp、path
- **启动信息**：
  - 输出应用运行地址：`http://localhost:${port}`
  - 输出 API base URL：`http://localhost:${port}/v1`
  - 输出 Swagger UI 地址：`http://localhost:${port}/api-docs`

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

### 公共目录（src/common/）

#### `common/`
- **作用**：存放公共工具、过滤器、常量等共享代码
- **位置**：`src/common/`
- **包含内容**：
  - `error-codes.ts` - 错误码定义
  - `filters/` - 异常过滤器目录
  - `interfaces/` - 公共接口定义目录

#### `common/error-codes.ts`
- **作用**：统一管理所有错误码和错误消息
- **包含内容**：
  - `ErrorCode` 枚举：定义所有错误码
  - `ErrorMessages` 对象：错误码对应的用户友好消息
- **错误码格式**：`{模块}_{序号}`
  - `AUTH_001 - AUTH_099`：认证相关错误
  - `USER_001 - USER_099`：用户相关错误
  - `DISH_001 - DISH_099`：菜品相关错误
  - `VALIDATION_001 - VALIDATION_099`：验证相关错误
  - `SYSTEM_001 - SYSTEM_099`：系统相关错误
- **使用场景**：
  - 在全局异常过滤器中映射错误码
  - 在服务层抛出异常时引用错误码
  - 统一错误消息，便于维护和国际化
- **优势**：
  - 集中管理所有错误码，便于查找和维护
  - 错误消息统一，确保用户友好
  - 支持错误码扩展，预留了各模块的错误码范围

#### `common/filters/http-exception.filter.ts`
- **作用**：全局异常过滤器，统一处理所有异常并返回统一格式的错误响应
- **功能**：
  - 捕获所有异常（使用 `@Catch()` 装饰器）
  - 统一错误响应格式：`{ success: false, error: { code, message }, timestamp, path }`
  - 智能错误码映射：根据异常类型和消息内容自动映射到具体错误码
  - 用户友好消息：使用预定义的消息，不暴露技术细节
  - 详细日志记录：开发环境记录完整错误信息，生产环境记录关键信息
  - 处理 ValidationPipe 的数组错误响应
- **错误响应格式**：
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
- **错误码映射逻辑**：
  - 根据 HTTP 状态码获取默认错误码
  - 根据异常消息内容智能映射到具体错误码（如"用户名已存在" → USER_002）
  - 支持处理字符串、对象和数组类型的异常响应
- **日志记录策略**：
  - 开发环境：记录完整错误信息、堆栈、请求 URL、请求方法、请求体
  - 生产环境：只记录关键信息（错误码、消息、路径）
- **处理的异常类型**：
  - `HttpException`：NestJS 内置异常（BadRequestException, NotFoundException, UnauthorizedException, ConflictException 等）
  - 未知异常：系统错误，返回 SYSTEM_001 错误码
- **注册方式**：在 `main.ts` 中使用 `app.useGlobalFilters(new HttpExceptionFilter())` 注册

#### `common/interfaces/api-response.interface.ts`
- **作用**：定义统一的 API 响应格式接口
- **包含内容**：
  - `SuccessResponse<T>` 接口：成功响应格式
  - `ErrorResponse` 接口：错误响应格式（参考，实际定义在 `http-exception.filter.ts` 中）
- **成功响应格式**：
  ```typescript
  {
    success: true;
    data: T;
    message: string;
  }
  ```
- **使用场景**：
  - 在控制器方法中作为返回类型
  - 确保所有成功响应格式统一
  - 提供类型安全保证
- **优势**：
  - 统一响应格式，便于前端处理
  - TypeScript 类型安全，编译时检查
  - 支持泛型，可以指定 data 的类型
  - 便于维护和扩展

---

### 业务模块目录（src/modules/）

#### `modules/`
- **作用**：存放业务模块代码
- **位置**：`src/modules/`
- **说明**：每个业务功能对应一个模块目录，包含模块、控制器、服务等文件

#### `modules/auth/`
- **作用**：认证模块目录
- **位置**：`src/modules/auth/`
- **包含内容**：
  - `jwt/` - JWT 认证相关文件
  - `auth.module.ts` - 认证模块定义
  - `auth.service.ts` - 认证服务
  - `auth.controller.ts` - 认证控制器
  - `dto/` - 认证相关 DTO

#### `modules/auth/jwt/jwt.module.ts`
- **作用**：JWT 模块配置
- **功能**：
  - 配置 JWT 模块，设置密钥和过期时间
  - 注册 Passport 模块，设置默认策略为 'jwt'
  - 注册 JWT 策略
  - 导出 JWT 和 Passport 模块供其他模块使用
- **配置内容**：
  - 使用 `JwtModule.registerAsync()` 异步配置
  - 从环境变量读取 `JWT_SECRET`（默认：'your-secret-key'）
  - 从环境变量读取 `JWT_EXPIRES_IN`（默认：'7d'）
  - 注册 `PassportModule`，默认策略为 'jwt'
- **导出内容**：
  - `NestJwtModule` - 供其他模块生成和验证 JWT token
  - `PassportModule` - 供其他模块使用 Passport 功能

#### `modules/auth/jwt/jwt.strategy.ts`
- **作用**：JWT 认证策略
- **功能**：
  - 继承 `PassportStrategy(Strategy)` 实现 JWT 认证策略
  - 从 `Authorization` header 中提取 Bearer token
  - 验证 token 的签名和过期时间
  - 验证 payload 的有效性
- **JWT Payload 接口**：
  ```typescript
  interface JwtPayload {
    sub: number;      // 用户 ID
    username: string; // 用户名
    email: string;    // 邮箱
    iat?: number;     // 签发时间
    exp?: number;     // 过期时间
  }
  ```
- **配置选项**：
  - `jwtFromRequest`: 从 Authorization header 的 Bearer token 中提取
  - `ignoreExpiration`: false（不忽略过期时间）
  - `secretOrKey`: 从环境变量 `JWT_SECRET` 读取
- **验证方法**：
  - `validate(payload: JwtPayload)`: 验证 payload 的有效性
  - 可以在此方法中添加额外的验证逻辑（如检查用户状态）
  - 返回验证后的用户信息
- **使用场景**：
  - 在需要认证的控制器或路由中使用 `@UseGuards(JwtAuthGuard)`
  - 通过 `@Request()` 装饰器获取验证后的用户信息
- **类型处理**：
  - `expiresIn` 使用 `as any` 类型断言，因为 JWT 库支持字符串格式（如 '7d'），但 TypeScript 类型定义较严格

#### `modules/auth/jwt/jwt-auth.guard.ts`
- **作用**：JWT 认证守卫，用于保护需要认证的路由
- **功能**：
  - 继承 `AuthGuard('jwt')`，使用 'jwt' 策略（对应 JwtStrategy）
  - 从请求头中提取 token（由 JwtStrategy 配置）
  - 验证 token 的签名和过期时间（由 Passport 和 JwtStrategy 处理）
  - 将验证后的用户信息注入到 `request.user`（由 JwtStrategy.validate() 返回）
  - 支持公开路由标记（使用 Reflector 检查 'isPublic' 元数据）
- **使用方式**：
  ```typescript
  import { UseGuards } from '@nestjs/common';
  import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
  
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user; // 包含验证后的用户信息（JwtPayload）
  }
  ```
- **工作流程**：
  1. 请求到达受保护的路由
  2. `JwtAuthGuard` 检查路由是否标记为公开（使用 Reflector）
  3. 如果不是公开路由，调用父类的 `canActivate()` 方法
  4. Passport 使用 JwtStrategy 从请求头提取 token
  5. JwtStrategy 验证 token 的签名和过期时间
  6. 如果验证成功，调用 `JwtStrategy.validate()` 方法
  7. 返回的用户信息（JwtPayload）注入到 `request.user`
  8. 请求继续处理，控制器可以通过 `@Request()` 装饰器访问用户信息
- **依赖注入**：
  ```typescript
  constructor(private reflector: Reflector) {
    super();
  }
  ```
- **公开路由支持**：
  - 使用 `Reflector` 检查路由是否标记为 'isPublic'
  - 如果标记为公开，跳过认证，直接返回 `true`
  - 为后续创建 `@Public()` 装饰器预留功能
- **错误处理**：
  - 如果 token 无效或过期，Passport 会自动抛出 `UnauthorizedException`
  - 全局异常过滤器会统一处理错误，返回统一格式的错误响应

#### `modules/auth/auth.module.ts`
- **作用**：认证模块定义文件
- **功能**：
  - 使用 `@Module` 装饰器定义模块
  - 导入 `UsersModule` 和 `JwtModule`
  - 注册认证控制器和服务
  - 导出 `AuthService` 供其他模块使用
- **配置内容**：
  - `imports: [UsersModule, JwtModule]` - 导入用户模块和 JWT 模块
  - `controllers: [AuthController]` - 注册认证控制器
  - `providers: [AuthService]` - 注册认证服务
  - `exports: [AuthService]` - 导出服务（供其他模块使用）

#### `modules/auth/auth.service.ts`
- **作用**：认证服务，处理用户登录逻辑
- **功能**：
  - 使用 `@Injectable()` 装饰器，可被依赖注入
  - 注入 `UsersService` 用于验证用户凭据
  - 注入 `JwtService` 用于生成 JWT token
  - 实现用户登录功能
- **登录方法**：
  - `login(loginDto: LoginDto)`: 用户登录
    - 调用 `usersService.validateUser()` 验证用户凭据
    - 如果验证失败，抛出 `UnauthorizedException`
    - 如果验证成功，构建 JWT payload
    - 使用 `jwtService.sign()` 生成 JWT token
    - 返回 token 和用户信息（不含密码）
- **依赖注入**：
  ```typescript
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}
  ```
- **异常处理**：
  - 使用 `UnauthorizedException` 处理登录失败

#### `modules/auth/auth.controller.ts`
- **作用**：认证控制器，处理认证相关的 HTTP 请求
- **路由前缀**：`/auth`（由 `@Controller('auth')` 定义）
- **功能**：
  - 处理认证相关的 HTTP 请求和响应
  - 调用服务层处理业务逻辑
  - 返回统一的响应格式
- **API 端点**：
  - `POST /v1/auth/login` - 用户登录
    - 使用 `@Post('login')` 装饰器定义路由
    - 使用 `@HttpCode(HttpStatus.OK)` 返回 200 状态码
    - 接收 `LoginDto` 作为请求体
    - 调用 `authService.login()` 处理登录逻辑
    - 返回 `SuccessResponse<LoginResponseData>` 格式
    - 成功响应包含 JWT token 和用户信息
- **Swagger 文档**：
  - 使用 `@ApiTags('auth')` 装饰器将控制器分组到 auth 标签
  - 使用 `@ApiOperation` 添加接口描述
  - 使用 `@ApiBody` 说明请求体
  - 使用 `@ApiResponse` 定义成功和错误响应格式
  - 在 Swagger UI 中显示为独立的接口组，支持在线测试
- **响应格式**：
  - 成功响应：`{ success: true, data: { accessToken, user }, message: string }`
  - 错误响应：由全局异常过滤器统一处理
- **依赖注入**：注入 `AuthService` 用于业务逻辑处理

#### `modules/auth/dto/login.dto.ts`
- **作用**：用户登录 DTO
- **包含字段**：
  - `usernameOrEmail` - 用户名或邮箱（必填）
  - `password` - 密码（必填）
- **验证规则**：
  - 使用 `class-validator` 装饰器进行验证
  - 验证失败时自动返回 400 错误
- **Swagger 文档**：
  - 使用 `@ApiProperty` 装饰器为每个字段添加 API 文档说明
  - 包含字段描述、示例值等信息
  - 自动生成 Swagger API 文档
- **用途**：用于用户登录接口的请求数据验证

#### `modules/auth/decorators/`
- **作用**：存放认证相关的自定义装饰器
- **位置**：`src/modules/auth/decorators/`
- **说明**：装饰器用于简化控制器代码，提供便捷的参数注入功能

#### `modules/auth/decorators/current-user.decorator.ts`
- **作用**：当前用户装饰器，用于从请求中提取当前登录用户信息
- **功能**：
  - 使用 NestJS 的 `createParamDecorator` 创建自定义参数装饰器
  - 从 `ExecutionContext` 中获取 HTTP 请求对象
  - 从 `request.user` 中提取用户信息（由 JwtStrategy 注入）
  - 返回 `JwtPayload` 类型，包含用户 ID、用户名、邮箱等信息
- **使用方式**：
  ```typescript
  import { CurrentUser } from '../auth/decorators/current-user.decorator';
  import { JwtPayload } from '../auth/jwt/jwt.strategy';
  
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@CurrentUser() user: JwtPayload) {
    return user; // 直接获取用户信息，无需访问 request
  }
  ```
- **工作流程**：
  1. 请求到达受保护的路由
  2. `JwtAuthGuard` 验证 token 并将用户信息注入到 `request.user`
  3. 控制器方法执行时，`@CurrentUser()` 装饰器从 `request.user` 中提取用户信息
  4. 用户信息作为参数传递给控制器方法
- **优势**：
  - **代码简洁**：无需在控制器中手动访问 `request.user`
  - **类型安全**：返回 `JwtPayload` 类型，编译时检查
  - **易于使用**：只需在参数前添加装饰器
  - **统一接口**：所有控制器使用相同的方式获取当前用户
- **技术细节**：
  - 使用 `createParamDecorator` 创建参数装饰器
  - 从 `ExecutionContext` 中获取请求对象
  - 类型安全：返回 `JwtPayload` 类型
  - 必须在受 `JwtAuthGuard` 保护的路由中使用

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
- **用户验证方法**：
  - `validateUser(usernameOrEmail: string, password: string)`: 验证用户登录
    - 根据用户名或邮箱查找用户（使用 TypeORM 的 `OR` 查询）
    - 验证密码是否正确
    - 返回用户信息（不含密码）或 `null`
    - 如果用户不存在或密码错误，返回 `null`（不抛出异常）
    - 支持用户名或邮箱登录
- **用户查询方法**：
  - `findOne(id: number)`: 根据用户 ID 查找用户
    - 使用 TypeORM 的 `findOne()` 方法查询数据库
    - 返回用户信息（不含密码）或 `null`
    - 如果用户不存在，返回 `null`
- **用户资料更新方法**：
  - `updateProfile(id: number, updateUserProfileDto: UpdateUserProfileDto)`: 更新用户资料
    - 根据用户 ID 查找用户
    - 如果用户不存在，抛出 `NotFoundException`
    - 支持部分更新：如果用户已有 profile，则合并；否则创建新对象
    - 只更新提供的字段，未提供的字段保持不变
    - 保存更新后的用户信息到数据库
    - 返回更新后的用户信息（不含密码）
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
  - 使用 `NotFoundException` 处理用户不存在的情况

#### `modules/users/users.controller.ts`
- **作用**：用户控制器，处理用户相关的 HTTP 请求
- **路由前缀**：`/users`（由 `@Controller('users')` 定义）
- **功能**：
  - 处理用户相关的 HTTP 请求和响应
  - 调用服务层处理业务逻辑
  - 返回统一的响应格式
- **API 端点**：
  - `POST /v1/users/register` - 用户注册
    - 使用 `@Post('register')` 装饰器定义路由
    - 使用 `@HttpCode(HttpStatus.CREATED)` 返回 201 状态码
    - 接收 `CreateUserDto` 作为请求体
    - 调用 `usersService.create()` 创建用户
    - 返回 `SuccessResponse<Omit<User, 'passwordHash'>>` 格式
    - 成功响应包含用户信息（不含密码）和成功消息
  - `GET /v1/users/profile` - 获取当前用户信息
    - 使用 `@Get('profile')` 装饰器定义路由
    - 使用 `@UseGuards(JwtAuthGuard)` 保护路由，需要 JWT 认证
    - 使用 `@CurrentUser()` 装饰器获取当前登录用户的 JWT payload
    - 从 JWT payload 中提取用户 ID（`jwtPayload.sub`）
    - 调用 `usersService.findOne()` 获取完整用户信息（包含用户资料）
    - 如果用户不存在，抛出 `NotFoundException`
    - 返回 `SuccessResponse<Omit<User, 'passwordHash'>>` 格式
    - 成功响应包含用户完整信息（包括 profile 字段）
  - `POST /v1/users/profile` - 更新当前用户资料
    - 使用 `@Post('profile')` 装饰器定义路由（使用 POST 方法）
    - 使用 `@UseGuards(JwtAuthGuard)` 保护路由，需要 JWT 认证
    - 使用 `@CurrentUser()` 装饰器获取当前登录用户的 JWT payload
    - 接收 `UpdateUserProfileDto` 作为请求体（所有字段可选）
    - 从 JWT payload 中提取用户 ID（`jwtPayload.sub`）
    - 调用 `usersService.updateProfile()` 更新用户资料
    - 支持部分更新：只更新提供的字段，未提供的字段保持不变
    - 返回 `SuccessResponse<Omit<User, 'passwordHash'>>` 格式
    - 成功响应包含更新后的用户信息（包括 profile 字段）
- **Swagger 文档**：
  - 使用 `@ApiTags('users')` 装饰器将控制器分组到 users 标签
  - 使用 `@ApiOperation` 添加接口描述
  - 使用 `@ApiBody` 说明请求体（注册接口）
  - 使用 `@ApiBearerAuth()` 添加 Bearer 认证支持（获取用户信息接口）
  - 使用 `@ApiResponse` 定义成功和错误响应格式
  - 在 Swagger UI 中显示为独立的接口组，支持在线测试
  - 获取用户信息接口支持在 Swagger UI 中直接测试（需要先登录获取 token）
- **响应格式**：
  - 成功响应：`{ success: true, data: {...}, message: string }`
  - 错误响应：由全局异常过滤器统一处理
- **依赖注入**：
  - 注入 `UsersService` 用于业务逻辑处理
  - 使用 `@CurrentUser()` 装饰器获取当前登录用户信息（JwtPayload）
- **类型导入**：
  - 使用 `import type` 导入 `JwtPayload` 类型，避免 TypeScript 编译错误（当启用 `isolatedModules` 和 `emitDecoratorMetadata` 时）

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
- **Swagger 文档**：
  - 使用 `@ApiProperty` 装饰器为每个字段添加 API 文档说明
  - 包含字段描述、示例值、验证规则等信息
  - 自动生成 Swagger API 文档
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
- **Swagger 文档**：
  - 使用 `@ApiProperty` 装饰器为每个字段添加 API 文档说明
  - 包含字段描述、示例值、范围限制、可选标记等信息
  - 枚举字段显示所有可选值
  - 自动生成 Swagger API 文档
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

### 7. API 版本控制
- 使用 NestJS 内置版本控制功能
- 全局 API 前缀设置为 `/v1`
- 使用 URI 版本控制方式（版本号在路径中）
- 所有 API 端点自动包含版本前缀
- 便于未来版本升级和向后兼容

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

### 7. API 版本控制
- 使用 NestJS 内置版本控制功能
- 全局 API 前缀设置为 `/v1`
- 使用 URI 版本控制方式（版本号在路径中）
- 所有 API 端点自动包含版本前缀
- 便于未来版本升级和向后兼容

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

### API 响应格式
- **统一响应格式**：所有 API 端点使用统一的响应格式
- **成功响应格式**：
  ```typescript
  {
    success: true;
    data: T;  // 实际数据
    message: string;  // 成功消息
  }
  ```
- **错误响应格式**：
  ```typescript
  {
    success: false;
    error: {
      code: string;  // 错误码（如 USER_002）
      message: string;  // 错误消息
    };
    timestamp: string;  // 时间戳
    path: string;  // 请求路径
  }
  ```
- **在控制器中使用**：
  ```typescript
  import { SuccessResponse } from '../../common/interfaces/api-response.interface';
  
  @Post('register')
  async register(@Body() dto: CreateUserDto): Promise<SuccessResponse<User>> {
    const user = await this.service.create(dto);
    return {
      success: true,
      data: user,
      message: '注册成功',
    };
  }
  ```
- **类型安全**：使用 TypeScript 接口确保响应格式正确
- **错误处理**：错误响应由全局异常过滤器自动处理，无需手动返回

### API 文档（Swagger）
- 使用 `@nestjs/swagger` 自动生成 API 文档
- 在 `main.ts` 中配置 Swagger：
  ```typescript
  const config = new DocumentBuilder()
    .setTitle('API Title')
    .setDescription('API Description')
    .setVersion('1.0')
    .addTag('tag', 'Tag description')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
  ```
- 为 DTO 添加 `@ApiProperty` 装饰器：
  ```typescript
  @ApiProperty({
    description: '字段描述',
    example: '示例值',
    required: true,
  })
  field: string;
  ```
- 为控制器添加 `@ApiTags('tag')` 装饰器进行分组
- 为控制器方法添加 `@ApiOperation()`, `@ApiResponse()` 等装饰器
- 使用 `@ApiResponse` 定义响应格式：
  ```typescript
  @ApiResponse({
    status: 201,
    description: '创建成功',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: { type: 'object', ... },
        message: { type: 'string', example: '操作成功' },
      },
    },
  })
  ```
- 访问 `/api-docs` 查看 Swagger UI
- 可以在 Swagger UI 中直接测试 API

### 错误处理
- **统一错误响应格式**：所有错误都返回统一格式：
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
- **错误码规范**：
  - 错误码格式：`{模块}_{序号}`（如 `USER_002`, `AUTH_001`）
  - 错误码定义在 `src/common/error-codes.ts` 中
  - 每个错误码都有对应的用户友好消息
  - 错误码范围：
    - `AUTH_001 - AUTH_099`：认证相关错误
    - `USER_001 - USER_099`：用户相关错误
    - `DISH_001 - DISH_099`：菜品相关错误
    - `VALIDATION_001 - VALIDATION_099`：验证相关错误
    - `SYSTEM_001 - SYSTEM_099`：系统相关错误
- **全局异常过滤器**：
  - 位置：`src/common/filters/http-exception.filter.ts`
  - 自动捕获所有异常并转换为统一格式
  - 智能错误码映射：根据异常类型和消息内容自动映射
  - 开发环境记录详细日志，生产环境记录关键信息
- **使用 NestJS 内置异常类**：
  - `ConflictException` - 资源冲突（如用户名、邮箱已存在）→ USER_002 或 USER_003
  - `NotFoundException` - 资源不存在 → SYSTEM_003 或 USER_001
  - `BadRequestException` - 请求参数错误 → VALIDATION_001
  - `UnauthorizedException` - 未授权 → AUTH_001
- **异常使用示例**：
  ```typescript
  if (existingUser) {
    throw new ConflictException('用户名已存在');
  }
  // 全局异常过滤器会自动将 "用户名已存在" 映射到 USER_002
  ```
- **错误码引用**（可选，用于明确指定错误码）：
  ```typescript
  import { ErrorCode } from '../common/error-codes';
  // 在需要明确指定错误码时使用（通常不需要，过滤器会自动映射）
  ```
- **验证错误处理**：
  - ValidationPipe 的验证错误会自动转换为 VALIDATION_001 错误码
  - 多个验证错误时，返回第一个错误消息

### JWT 认证
- **JWT 模块**：位置 `src/modules/auth/jwt/jwt.module.ts`
  - 配置 JWT 密钥和过期时间
  - 从环境变量读取配置：`JWT_SECRET` 和 `JWT_EXPIRES_IN`
  - 导出 `JwtModule` 和 `PassportModule` 供其他模块使用
- **JWT 策略**：位置 `src/modules/auth/jwt/jwt.strategy.ts`
  - 从 `Authorization: Bearer <token>` header 中提取 token
  - 验证 token 签名和过期时间
  - 在 `validate()` 方法中验证 payload
- **生成 JWT token**：
  ```typescript
  import { JwtService } from '@nestjs/jwt';
  
  constructor(private jwtService: JwtService) {}
  
  const payload = { sub: user.id, username: user.username, email: user.email };
  const token = this.jwtService.sign(payload);
  ```
- **保护路由**：
  ```typescript
  import { UseGuards } from '@nestjs/common';
  import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
  import { CurrentUser } from '../auth/decorators/current-user.decorator';
  import { JwtPayload } from '../auth/jwt/jwt.strategy';
  
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@CurrentUser() user: JwtPayload) {
    return user; // 直接获取用户信息，无需访问 request
  }
  ```
- **守卫工作流程**：
  1. 请求到达受保护的路由
  2. `JwtAuthGuard` 检查路由是否标记为公开
  3. 如果不是公开路由，调用父类的 `canActivate()` 方法
  4. Passport 使用 JwtStrategy 从请求头提取 token
  5. JwtStrategy 验证 token 的签名和过期时间
  6. 如果验证成功，调用 `JwtStrategy.validate()` 方法
  7. 返回的用户信息（JwtPayload）注入到 `request.user`
  8. 请求继续处理，控制器可以通过 `@Request()` 装饰器访问用户信息
- **错误处理**：
  - 如果 token 无效或过期，Passport 会自动抛出 `UnauthorizedException`
  - 全局异常过滤器会统一处理错误，返回统一格式的错误响应（AUTH_001 或 AUTH_002）
- **获取当前用户**（使用 `@CurrentUser()` 装饰器）：
  ```typescript
  import { CurrentUser } from '../auth/decorators/current-user.decorator';
  import { JwtPayload } from '../auth/jwt/jwt.strategy';
  
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@CurrentUser() user: JwtPayload) {
    return user; // 直接获取用户信息，类型安全
  }
  ```
  - 装饰器位置：`src/modules/auth/decorators/current-user.decorator.ts`
  - 从 `request.user` 中提取用户信息（由 JwtStrategy 注入）
  - 返回 `JwtPayload` 类型，包含用户 ID、用户名、邮箱
  - 必须在受 `JwtAuthGuard` 保护的路由中使用
  - **优势**：代码简洁、类型安全、易于使用
  - **替代方案**：也可以使用 `@Request() req` 然后访问 `req.user`，但装饰器方式更简洁
- **环境变量配置**：
  ```env
  JWT_SECRET=your-secret-key-change-in-production
  JWT_EXPIRES_IN=7d
  ```
- **JWT Payload 结构**：
  ```typescript
  interface JwtPayload {
    sub: number;      // 用户 ID
    username: string; // 用户名
    email: string;    // 邮箱
    iat?: number;     // 签发时间
    exp?: number;     // 过期时间
  }
  ```

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
- `CORS_ORIGIN` - CORS 允许的来源（生产环境使用，开发环境允许所有来源）
  - 示例：`https://your-frontend-domain.com`
  - 多个来源用逗号分隔
  - 开发环境不需要配置，默认允许所有来源

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
  - `@tanstack/react-query` - React Query 数据获取和缓存库
  - `zustand` - 轻量级状态管理库
  - `axios` - HTTP 客户端库
  - `react-hook-form` - 表单管理和验证库
  - `react-native-paper` - Material Design UI 组件库
  - `react-native-vector-icons` - 图标库

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
  - 配置全局 Provider（React Query、React Native Paper）
- **路由系统**：Expo Router 使用文件系统路由，`app/` 目录下的文件自动成为路由
- **Provider 配置**：
  - **QueryClientProvider**：React Query 的 Provider，提供数据获取和缓存功能
    - 创建了 `QueryClient` 实例，配置了默认选项
    - 默认选项：`retry: 1`（请求失败时重试 1 次），`refetchOnWindowFocus: false`（窗口聚焦时不自动重新获取）
  - **PaperProvider**：React Native Paper 的 Provider，提供 Material Design UI 组件支持
    - 包装整个应用，使所有页面都可以使用 React Native Paper 组件
    - 提供主题支持（后续可以配置自定义主题）
- **组件层次结构**：
  ```
  QueryClientProvider
    └── PaperProvider
        └── Stack (Expo Router)
            └── 所有页面组件
  ```

#### `app/index.tsx`
- **作用**：应用首页组件
- **路由**：对应根路径 `/`
- **功能**：
  - 受保护的首页（需要登录才能访问）
  - 应用路由守卫，未认证时自动重定向到登录页
  - 显示简单的欢迎界面
- **路由守卫**：
  - 使用 `useAuthGuard()` Hook 保护页面
  - 未认证时自动重定向到登录页
  - 登录后可以正常访问

#### `app/login.tsx`
- **作用**：登录页面组件
- **路由**：对应路径 `/login`
- **功能**：
  - 用户登录界面
  - 表单验证和错误处理
  - 登录成功后导航到主页
- **UI 设计**：
  - **主色调**：`#8fd460`（清新绿色）
  - **背景色**：`#f8fbf6`（浅绿色背景）
  - **文字颜色**：深绿色系（`#2c3e2d`、`#6b7c6d`）
  - **错误颜色**：`#e57373`（友好的错误提示色）
  - **布局**：居中表单，响应式设计，支持键盘避让
- **表单字段**：
  - **用户名/邮箱输入框**：
    - 支持用户名或邮箱输入
    - 必填验证
    - 邮箱格式验证（如果输入包含 @）
  - **密码输入框**：
    - 安全文本输入（`secureTextEntry`）
    - 必填验证
    - 最小长度验证（至少 6 个字符）
- **表单管理**：
  - 使用 React Hook Form 管理表单状态
  - 使用 Controller 组件包装 React Native Paper 的 TextInput
  - 实时验证和错误提示
- **错误处理**：
  - **验证错误**：使用 HelperText 显示友好的中文提示
  - **API 错误**：显示 API 返回的友好错误消息
  - 错误信息显示在输入框下方或表单底部
- **加载状态**：
  - 登录按钮显示加载动画
  - 登录时禁用所有输入框和按钮
  - 按钮文本显示"登录中..."
- **登录流程**：
  1. 用户输入用户名/邮箱和密码
  2. 前端验证通过后，调用 `login` API
  3. 登录成功，更新 authStore（保存 user 和 token）
  4. 检查是否有 `returnTo` 参数（从路由参数获取）
  5. 如果有 `returnTo` 参数，则返回到该页面
  6. 如果没有 `returnTo` 参数，则跳转到主页（`router.replace('/')`）
  7. 后续 API 请求自动包含 token（通过请求拦截器）
- **返回路径功能**：
  - 支持从路由参数中获取 `returnTo` 参数
  - 登录成功后，如果有 `returnTo` 参数，则返回到该页面
  - 如果没有 `returnTo` 参数，则默认跳转到主页
  - 使用 `useLocalSearchParams()` Hook 获取路由参数
- **技术细节**：
  - 使用 React Hook Form 进行表单管理
  - 使用 React Native Paper 组件构建 UI
  - 使用 Expo Router 的 `router` 进行导航
  - 使用 `useLocalSearchParams()` Hook 获取路由参数（`returnTo`）
  - 支持 iOS 和 Android 的键盘避让（KeyboardAvoidingView）
  - 响应式布局，适配不同屏幕尺寸

#### `app/register.tsx`
- **作用**：注册页面组件
- **路由**：对应路径 `/register`
- **功能**：
  - 用户注册界面
  - 表单验证和错误处理
  - 注册成功后自动登录并跳转到主页
- **UI 设计**：
  - **主色调**：`#8fd460`（清新绿色，与登录页一致）
  - **背景色**：`#f8fbf6`（浅绿色背景）
  - **文字颜色**：深绿色系（`#2c3e2d`、`#6b7c6d`）
  - **错误颜色**：`#e57373`（友好的错误提示色）
  - **布局**：居中表单，响应式设计，支持键盘避让
  - **登录链接**：底部显示"已有账户？立即登录"链接
- **表单字段**：
  - **用户名输入框**：
    - 必填验证
    - 最小长度验证（至少 3 个字符）
    - 最大长度验证（不超过 50 个字符）
  - **邮箱输入框**：
    - 必填验证
    - 邮箱格式验证（使用正则表达式）
  - **密码输入框**：
    - 安全文本输入（`secureTextEntry`）
    - 必填验证
    - 最小长度验证（至少 6 个字符）
  - **确认密码输入框**：
    - 安全文本输入（`secureTextEntry`）
    - 必填验证
    - 密码匹配验证（必须与密码字段一致）
- **表单管理**：
  - 使用 React Hook Form 管理表单状态
  - 使用 `watch()` 监听密码字段，实现密码匹配验证
  - 使用 Controller 组件包装 React Native Paper 的 TextInput
  - 实时验证和错误提示
  - 自定义验证函数：`validateEmail()` 和 `validatePasswordMatch()`
- **错误处理**：
  - **验证错误**：使用 HelperText 显示友好的中文提示
  - **API 错误**：显示 API 返回的友好错误消息（如"用户名已存在"、"邮箱已被注册"）
  - 错误信息显示在输入框下方或表单底部
- **加载状态**：
  - 注册按钮显示加载动画
  - 注册时禁用所有输入框和按钮
  - 按钮文本显示"注册中..."
- **注册流程**：
  1. 用户输入用户名、邮箱、密码、确认密码
  2. 前端验证通过后，调用 `register` API 创建账户
  3. 注册成功后，使用注册的用户名和密码自动调用 `login` API
  4. 登录成功后，更新 authStore（保存 user 和 token）
  5. 自动跳转到主页（`router.replace('/')`）
  6. 后续 API 请求自动包含 token（通过请求拦截器）
- **自动登录功能**：
  - 注册成功后自动登录，无需用户再次输入密码
  - 使用注册的用户名和密码自动调用登录 API
  - 登录成功后更新 authStore，用户立即可以使用所有需要认证的功能
  - 如果自动登录失败（罕见情况），则跳转到登录页让用户手动登录
- **技术细节**：
  - 使用 React Hook Form 进行表单管理
  - 使用 `watch()` 监听字段值变化，实现密码匹配验证
  - 使用 React Native Paper 组件构建 UI
  - 使用 Expo Router 的 `router` 进行导航
  - 使用 `useAuthStore()` Hook 获取 `login` action
  - 在注册成功后嵌套调用 `login` API 实现自动登录
  - 使用 try-catch 处理自动登录失败的情况
  - 保持加载状态直到整个流程完成（注册 + 自动登录）
  - 支持 iOS 和 Android 的键盘避让（KeyboardAvoidingView）
  - 响应式布局，适配不同屏幕尺寸

#### `app/profile.tsx`
- **作用**：个人中心页面组件
- **路由**：对应路径 `/profile`
- **功能**：
  - 显示当前登录用户的完整信息
  - 显示用户资料（身高、体重、年龄、性别）
  - 应用路由守卫，未认证时自动重定向
  - 实现骨架屏，数据加载时显示占位符
  - 处理错误状态，显示友好的错误信息
- **UI 设计**：
  - **主色调**：`#8fd460`（清新绿色，与应用主题一致）
  - **背景色**：`#f8fbf6`（浅绿色背景）
  - **卡片设计**：使用 Material Design 卡片组件
  - **头像设计**：圆形头像，显示用户名首字母
  - **资料展示**：列表形式，清晰展示各项资料
- **用户信息显示**：
  - **头像**：圆形头像，显示用户名首字母（大写）
  - **用户名**：大号字体，加粗显示
  - **邮箱**：中等字体，次要颜色
- **用户资料显示**：
  - **身高**：显示为 "XXX cm" 或 "未设置"
  - **体重**：显示为 "XXX kg" 或 "未设置"
  - **年龄**：显示为 "XXX 岁" 或 "未设置"
  - **性别**：显示为 "男"、"女" 或 "未设置"
- **骨架屏实现**：
  - 使用自定义组件 `SkeletonLoader`
  - 模拟真实内容布局（头像、文本行）
  - 使用灰色占位符，提供视觉反馈
  - 在数据加载时显示，避免空白页面
- **错误处理**：
  - **网络错误**：显示友好的错误消息和返回按钮
  - **用户不存在**：显示提示信息和返回按钮
  - **错误消息**：使用 API 返回的友好错误消息（不是技术错误）
- **空状态处理**：
  - 无用户资料时显示提示信息："暂无个人资料，请完善您的信息"
- **技术细节**：
  - 使用 `useAuthGuard()` Hook 保护页面
  - 使用 `useUser()` Hook 获取用户信息
  - 使用 React Query 进行数据获取和缓存
  - 使用 React Native Paper 组件构建 UI
  - 使用 Expo Router 进行路由管理
  - 响应式布局，适配不同屏幕尺寸
- **状态处理**：
  - **加载状态**：显示骨架屏
  - **错误状态**：显示错误信息和返回按钮
  - **成功状态**：显示用户信息和资料
  - **空状态**：无资料时显示提示信息

---

### Hooks 目录（hooks/）

#### `hooks/`
- **作用**：存放自定义 React Hooks
- **位置**：`mobile/hooks/`
- **说明**：所有可复用的自定义 Hooks 都在此目录

#### `hooks/useAuthGuard.ts`
- **作用**：受保护路由守卫 Hook
- **功能**：
  - 检查用户是否已认证（从 authStore 读取 `isAuthenticated`）
  - 未认证时自动重定向到登录页
  - 支持传递返回路径参数，登录后可返回到原页面
- **使用方式**：
  ```typescript
  import { useAuthGuard } from '../hooks/useAuthGuard';
  
  export default function ProtectedPage() {
    const isAuthenticated = useAuthGuard();
    
    if (!isAuthenticated) {
      return null; // 重定向中，不渲染内容
    }
    
    // 页面内容
  }
  ```
- **工作流程**：
  1. 使用 `useState` 标记组件挂载状态（`isMounted`）
  2. 使用 `useAuthStore()` Hook 获取认证状态
  3. 使用 `useSegments()` Hook 获取当前路由路径
  4. 使用 `useEffect` 监听认证状态变化
  5. 如果未认证且组件已挂载：
     - 使用 `setTimeout` 延迟执行导航（避免在 Root Layout 挂载前导航）
     - 获取当前页面路径
     - 使用 `router.replace()` 重定向到登录页，并传递 `returnTo` 参数
  6. 返回 `isAuthenticated` 布尔值，方便组件判断是否渲染内容
- **技术细节**：
  - 使用 `useState` 管理组件挂载状态，确保只在组件挂载后执行导航
  - 使用 `setTimeout` 延迟执行导航，避免在 Root Layout 挂载前导航
  - 添加错误处理，捕获导航错误（try-catch）
  - 使用 Expo Router 的 `useSegments()` Hook 获取当前路由路径
  - 使用 Expo Router 的 `router.replace()` 进行导航
  - 通过路由参数传递返回路径（`returnTo`）
  - 返回 `isAuthenticated` 布尔值，方便组件判断
- **问题修复**：
  - **问题**：在 Root Layout 挂载前尝试导航导致 "Attempted to navigate before mounting the Root Layout component" 错误
  - **解决方案**：
    - 添加 `isMounted` 状态，确保组件已挂载
    - 使用 `setTimeout` 延迟执行导航，避免在挂载前导航
    - 添加错误处理，捕获导航错误
- **优势**：
  - **易于使用**：只需在受保护页面中调用 Hook 即可
  - **自动重定向**：未认证时自动重定向，无需手动检查
  - **返回路径**：记录用户访问的页面，登录后自动返回
  - **类型安全**：使用 TypeScript 确保类型正确
  - **用户体验**：登录后自动返回到之前访问的页面
  - **稳定性**：解决了 Root Layout 挂载前导航的问题

#### `hooks/useUser.ts`
- **作用**：获取当前用户信息的 React Query Hook
- **功能**：
  - 使用 React Query 获取用户信息
  - 自动处理加载状态、错误状态和缓存
  - 配置缓存策略和重试策略
- **使用方式**：
  ```typescript
  import { useUser } from '../hooks/useUser';
  
  const { data: user, isLoading, error } = useUser();
  
  if (isLoading) {
    return <SkeletonLoader />;
  }
  
  if (error) {
    return <ErrorMessage error={error} />;
  }
  
  return <UserInfo user={user} />;
  ```
- **配置选项**：
  - `queryKey: ['user', 'profile']` - 查询键，用于缓存
  - `queryFn: getCurrentUser` - 查询函数，调用 API 获取用户信息
  - `enabled: true` - 始终启用查询（由路由守卫控制是否显示页面）
  - `staleTime: 5 * 60 * 1000` - 5 分钟内数据视为新鲜，不重新获取
  - `retry: 1` - 失败时重试 1 次
- **返回数据**：
  - `data: User | undefined` - 用户信息（加载成功时）
  - `isLoading: boolean` - 是否正在加载
  - `error: Error | null` - 错误信息（加载失败时）
  - 其他 React Query 标准返回值
- **技术细节**：
  - 使用 `useQuery` Hook 进行数据获取
  - 自动处理缓存、重新获取、错误重试等
  - 与 React Query Provider 集成（在根布局中配置）
- **优势**：
  - **自动缓存**：数据自动缓存，减少不必要的 API 调用
  - **加载状态**：自动提供加载状态，方便显示骨架屏
  - **错误处理**：自动处理错误状态，方便显示错误信息
  - **类型安全**：使用 TypeScript 确保类型正确

---

### 服务目录（services/）

#### `services/`
- **作用**：存放 API 服务相关代码
- **位置**：`mobile/services/`
- **说明**：所有与后端 API 交互的代码都在此目录

#### `services/api.ts`
- **作用**：axios 实例配置和拦截器
- **功能**：
  - 创建并配置 axios 实例
  - 设置基础 URL（从环境变量读取）
  - 配置请求和响应拦截器
  - 统一错误处理，转换为友好的中文错误消息
- **配置内容**：
  - **baseURL**：从 `EXPO_PUBLIC_API_URL` 环境变量读取，默认 `http://localhost:3000/v1`
  - **timeout**：10 秒
  - **headers**：`Content-Type: application/json`
- **请求拦截器**：
  - **Token 自动添加**：从 Zustand store 获取 token，如果存在则自动添加到请求头的 `Authorization` 字段
    - 格式：`Bearer {token}`（符合 JWT 标准）
    - 使用 `useAuthStore.getState().token` 获取 token（非 React Hook）
    - 所有 API 请求都会自动检查并添加 token（如果存在）
  - 开发环境打印请求日志（方法、URL、参数、数据、hasAuth 标志）
- **响应拦截器**：
  - 开发环境打印响应日志（状态码、响应数据）
  - 直接返回 `response.data`（后端已使用统一格式）
  - 统一错误处理：
    - 识别后端统一错误格式（`{ success: false, error: { code, message } }`）
    - 使用错误码映射转换为友好的中文消息
    - 处理 HTTP 状态码错误（400, 401, 403, 404, 409, 500 等）
    - 处理网络错误（无响应）
    - 处理其他未知错误
- **错误消息映射**：
  - 与后端 `error-codes.ts` 中的错误码保持一致
  - 覆盖所有已定义的错误码（AUTH、USER、DISH、VALIDATION、SYSTEM）
  - 提供友好的中文错误消息
- **错误对象属性**：
  - `message`：友好的错误消息
  - `code`：错误码（如果后端返回）
  - `status`：HTTP 状态码
  - `originalError`：原始错误对象（便于调试）
- **使用方式**：
  ```typescript
  import api from '@/services/api';
  
  // GET 请求
  const response = await api.get('/users/profile');
  
  // POST 请求
  const response = await api.post('/users/register', { username, email, password });
  
  // 错误处理
  try {
    const response = await api.get('/users/profile');
  } catch (error) {
    console.error(error.message); // 友好的错误消息
    console.error(error.code); // 错误码
    console.error(error.status); // HTTP 状态码
  }
  ```

#### `services/users.ts`
- **作用**：用户相关 API 服务
- **功能**：
  - 提供获取用户信息的 API 调用
  - 与后端用户 API 交互
- **包含内容**：
  - `getCurrentUser()` 函数：获取当前用户信息
    - 端点：`GET /v1/users/profile`
    - 返回：`Promise<User>` - 当前登录用户的完整信息（包含用户资料）
    - 认证：需要 JWT token（通过请求拦截器自动添加）
- **使用方式**：
  ```typescript
  import { getCurrentUser } from '@/services/users';
  
  try {
    const user = await getCurrentUser();
    console.log('User:', user);
  } catch (error: any) {
    console.error(error.message); // 友好的错误消息
  }
  ```
- **错误处理**：
  - 自动使用 API 服务的统一错误处理机制
  - 错误消息已转换为友好的中文提示

#### `services/auth.ts`
- **作用**：认证相关 API 服务
- **功能**：
  - 提供用户登录和注册 API 调用
  - 定义认证相关的类型接口
  - 与后端认证 API 交互
- **包含内容**：
  - **登录相关**：
    - `LoginRequest` 接口：登录请求参数
      - `usernameOrEmail: string` - 用户名或邮箱
      - `password: string` - 密码
    - `LoginResponseData` 接口：登录响应数据
      - `accessToken: string` - JWT token
      - `user: User` - 用户信息
    - `login()` 函数：登录 API 调用
      - 参数：`LoginRequest`
      - 返回：`Promise<LoginResponseData>`
      - 端点：`POST /v1/auth/login`
  - **注册相关**：
    - `RegisterRequest` 接口：注册请求参数
      - `username: string` - 用户名（3-50 字符）
      - `email: string` - 邮箱（邮箱格式）
      - `password: string` - 密码（至少 6 字符）
    - `RegisterResponseData` 接口：注册响应数据
      - `id: number` - 用户 ID
      - `username: string` - 用户名
      - `email: string` - 邮箱
      - `profile: User['profile']` - 用户资料（初始为 null）
      - `createdAt: string` - 创建时间
      - `updatedAt: string` - 更新时间
    - `register()` 函数：注册 API 调用
      - 参数：`RegisterRequest`
      - 返回：`Promise<RegisterResponseData>`
      - 端点：`POST /v1/users/register`
- **使用方式**：
  ```typescript
  import { login, register } from '@/services/auth';
  
  // 登录
  try {
    const { accessToken, user } = await login({
      usernameOrEmail: 'zhangsan',
      password: 'password123',
    });
    
    // 使用 token 和用户信息
    console.log('Token:', accessToken);
    console.log('User:', user);
  } catch (error: any) {
    console.error(error.message); // 友好的错误消息（如"用户名或密码错误"）
  }
  
  // 注册
  try {
    const user = await register({
      username: 'zhangsan',
      email: 'zhangsan@example.com',
      password: 'password123',
    });
    
    // 注册成功，跳转到登录页
    console.log('User:', user);
  } catch (error: any) {
    console.error(error.message); // 友好的错误消息（如"用户名已存在"）
  }
  ```
- **错误处理**：
  - 自动使用 API 服务的统一错误处理机制
  - 错误消息已转换为友好的中文提示
  - 支持用户名或邮箱登录（后端已实现）
  - 注册错误包括：用户名已存在、邮箱已被注册、验证失败等
- **与 authStore 集成**：
  - 登录返回的 `user` 类型与 `authStore` 中的 `User` 接口一致
  - 登录返回的 `accessToken` 可以直接用于 `authStore.login()` 方法
  - 注册成功后需要用户手动登录（跳转到登录页）

---

### 类型定义目录（types/）

#### `types/`
- **作用**：存放 TypeScript 类型定义
- **位置**：`mobile/types/`
- **说明**：所有共享的类型定义都在此目录

#### `types/api.ts`
- **作用**：API 相关类型定义
- **包含内容**：
  - `ApiErrorResponse`：错误响应格式接口
    - `success: false`
    - `error: { code: string, message: string }`
    - `timestamp: string`
    - `path: string`
  - `ApiSuccessResponse<T>`：成功响应格式接口（支持泛型）
    - `success: true`
    - `data: T`（泛型，可以是任何类型）
    - `message: string`
  - `ApiResponse<T>`：响应类型（成功或错误的联合类型）
- **与后端保持一致**：
  - 类型定义与后端 `api-response.interface.ts` 保持一致
  - 确保前后端类型同步
- **使用方式**：
  ```typescript
  import type { ApiSuccessResponse, ApiErrorResponse } from '@/types/api';
  
  // 在函数中使用
  async function getUser(): Promise<ApiSuccessResponse<User>> {
    return await api.get('/users/profile');
  }
  ```

---

### 状态管理目录（store/）

#### `store/`
- **作用**：存放 Zustand 状态管理 Store
- **位置**：`mobile/store/`
- **说明**：所有全局状态管理都在此目录

#### `store/authStore.ts`
- **作用**：认证状态管理 Store
- **功能**：
  - 管理用户认证状态（用户信息、token、认证状态）
  - 提供登录、登出、更新用户信息等方法
  - 与 API 服务集成，自动在请求中添加 token
- **状态定义**：
  - `user: User | null` - 当前登录用户信息
  - `token: string | null` - JWT token
  - `isAuthenticated: boolean` - 是否已认证（计算属性，基于 user 和 token）
- **Actions**：
  - `login(user, token)` - 登录，设置用户和 token，更新认证状态
  - `logout()` - 登出，清空用户和 token，重置认证状态
  - `setUser(user)` - 更新用户信息，保持 token 不变
- **User 接口**：
  - 与后端 User 实体保持一致
  - 包含字段：`id`, `username`, `email`, `profile`, `createdAt`, `updatedAt`
  - `profile` 字段为可选，包含用户资料（身高、体重、年龄、性别）
- **使用方式**：
  ```typescript
  import { useAuthStore } from '@/store/authStore';
  
  // 在组件中使用
  const { user, token, isAuthenticated, login, logout } = useAuthStore();
  
  // 登录
  login(userData, tokenString);
  
  // 登出
  logout();
  
  // 更新用户信息
  setUser(updatedUser);
  
  // 在非 React 组件中获取状态（如 API 拦截器）
  const token = useAuthStore.getState().token;
  ```
- **与 API 服务集成**：
  - API 请求拦截器会自动从 store 获取 token
  - 如果 token 存在，自动添加到请求头的 `Authorization` 字段
  - 格式：`Bearer {token}`
- **技术细节**：
  - 使用 Zustand 创建轻量级状态管理
  - 支持在 React 组件中使用（Hook 方式）
  - 支持在非 React 代码中使用（`getState()` 方法）
  - 状态更新会自动触发组件重新渲染

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

### 3. UI 组件和样式管理
- **UI 组件库**：使用 React Native Paper 提供 Material Design 风格的组件
  - 提供丰富的预构建组件（Button、Card、TextInput、Dialog 等）
  - 支持主题定制和暗色模式
  - 通过 `PaperProvider` 在根布局中配置
- **表单管理**：使用 React Hook Form 进行表单状态管理和验证
  - 减少表单相关的样板代码
  - 提供高性能的表单验证
  - 与 React Native Paper 组件良好集成
- **样式管理**：
  - 使用 StyleSheet.create 创建样式
  - 保持样式简洁，避免过度装饰
  - 主色调：`#49aa19`（绿色）

### 4. 状态管理
- **全局状态**：使用 Zustand 进行全局状态管理（如用户认证状态、应用设置等）
- **服务器状态**：使用 React Query 进行数据获取和缓存
  - React Query 自动处理数据缓存、重新获取、错误重试等
  - 减少手动状态管理代码，提高开发效率
- **本地状态**：简单的 UI 状态使用 React 的 `useState` 或 `useReducer`

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

### 页面导航
- 使用 Expo Router 的 `router` 进行导航
- 示例：
  ```typescript
  import { router } from 'expo-router';
  
  // 导航到指定页面
  router.push('/login'); // 添加新页面到导航栈
  router.replace('/'); // 替换当前页面（常用于登录后跳转）
  router.back(); // 返回上一页
  
  // 登录成功后导航到主页
  router.replace('/');
  ```
- **push vs replace**：
  - `push`：添加新页面到导航栈，用户可以返回
  - `replace`：替换当前页面，用户无法返回（常用于登录、注册后跳转）

### 创建登录页面
- 登录页面示例（`app/login.tsx`）：
  - 使用 React Hook Form 管理表单
  - 使用 React Native Paper 组件构建 UI
  - 实现前端验证和友好错误提示
  - 调用登录 API 并更新 authStore
  - 登录成功后导航到主页
- **关键代码**：
  ```typescript
  import { router } from 'expo-router';
  import { login } from '@/services/auth';
  import { useAuthStore } from '@/store/authStore';
  
  const { login: setAuth } = useAuthStore();
  
  const onSubmit = async (data) => {
    const response = await login(data);
    setAuth(response.user, response.accessToken);
    router.replace('/'); // 登录成功后导航
  };
  ```

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

### 使用 API 服务
- 所有 API 调用都通过 `services/api.ts` 中的 axios 实例
- API 服务已配置好基础 URL、超时、错误处理等
- 示例：
  ```typescript
  import api from '@/services/api';
  
  // GET 请求
  const response = await api.get('/users/profile');
  // response 已经是 response.data，包含 { success: true, data: {...}, message: '...' }
  
  // POST 请求
  const response = await api.post('/users/register', {
    username: 'zhangsan',
    email: 'zhangsan@example.com',
    password: 'password123',
  });
  
  // 错误处理
  try {
    const response = await api.get('/users/profile');
    console.log(response.data); // 访问数据
  } catch (error: any) {
    console.error(error.message); // 友好的错误消息（如"未授权，请先登录"）
    console.error(error.code); // 错误码（如"AUTH_001"）
    console.error(error.status); // HTTP 状态码（如 401）
  }
  ```
- **错误处理**：
  - 所有错误都会自动转换为友好的中文消息
  - 错误对象包含 `message`（友好消息）、`code`（错误码）、`status`（HTTP 状态码）
  - 网络错误会显示"网络连接失败，请检查网络设置"
  - 开发环境会在控制台打印详细的错误日志
- **开发环境日志**：
  - 所有请求和响应都会在控制台打印（仅在开发环境）
  - 包含请求方法、URL、参数、数据、响应状态码等

### 使用认证 API 服务
- 认证相关的 API 调用在 `services/auth.ts` 中
- 示例（登录）：
  ```typescript
  import { login } from '@/services/auth';
  import { useAuthStore } from '@/store/authStore';
  
  try {
    const { accessToken, user } = await login({
      usernameOrEmail: 'zhangsan',
      password: 'password123',
    });
    
    // 登录成功后，更新 authStore
    useAuthStore.getState().login(user, accessToken);
  } catch (error: any) {
    console.error(error.message); // 友好的错误消息（如"用户名或密码错误"）
  }
  ```
- **与 authStore 集成**：
  - 登录成功后，使用 `authStore.login(user, accessToken)` 更新状态
  - 之后所有 API 请求会自动包含 token（通过请求拦截器）

### 使用 React Query 进行数据获取
- React Query 已在根布局中配置，所有组件都可以直接使用
- 使用 `useQuery` 获取数据，使用 `useMutation` 进行数据修改
- 示例：
  ```typescript
  import { useQuery } from '@tanstack/react-query';
  import { api } from '@/services/api';
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['dishes'],
    queryFn: () => api.get('/dishes'),
  });
  ```
- React Query 自动处理缓存、重新获取、错误重试等

### 使用 Zustand 进行全局状态管理
- 创建 Store 文件在 `store/` 目录
- 使用 `create` 函数创建 store
- **在 React 组件中使用**（Hook 方式）：
  ```typescript
  import { useAuthStore } from '@/store/authStore';
  
  const { user, token, isAuthenticated, login, logout } = useAuthStore();
  
  // 登录
  login(userData, tokenString);
  
  // 登出
  logout();
  ```
- **在非 React 代码中使用**（如 API 拦截器）：
  ```typescript
  import { useAuthStore } from '@/store/authStore';
  
  // 使用 getState() 获取当前状态（非 Hook）
  const token = useAuthStore.getState().token;
  const user = useAuthStore.getState().user;
  
  // 调用 actions
  useAuthStore.getState().logout();
  ```
- **注意事项**：
  - 在 React 组件中必须使用 Hook 方式（`useAuthStore()`）
  - 在非 React 代码中（如 API 拦截器、工具函数）使用 `getState()` 方法
  - 状态更新会自动触发使用 Hook 的组件重新渲染
  - Store 是全局单例，所有组件共享同一状态

### 使用 React Hook Form 管理表单
- 与 React Native Paper 组件良好集成
- 示例：
  ```typescript
  import { useForm, Controller } from 'react-hook-form';
  import { TextInput, Button } from 'react-native-paper';
  
  const { control, handleSubmit } = useForm();
  
  <Controller
    control={control}
    name="username"
    render={({ field }) => (
      <TextInput
        label="用户名"
        value={field.value}
        onChangeText={field.onChange}
      />
    )}
  />
  ```

### 使用 React Native Paper 组件
- 所有 Paper 组件都可以直接使用，无需额外配置
- 示例：
  ```typescript
  import { Button, Card, TextInput } from 'react-native-paper';
  
  <Button mode="contained" onPress={handlePress}>
    点击我
  </Button>
  ```
- 支持主题定制（后续可以配置）

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

