-- What-to-Eat 数据库初始化脚本
-- 此脚本用于创建数据库和用户

-- 注意：此脚本需要在 PostgreSQL 的 postgres 数据库中执行
-- 或者使用具有创建数据库权限的用户执行

-- 创建数据库
CREATE DATABASE what_to_eat
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.UTF-8'
    LC_CTYPE = 'en_US.UTF-8'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

-- 创建专用用户（可选，如果使用默认 postgres 用户可跳过）
-- CREATE USER what_to_eat_user WITH PASSWORD 'your_password_here';
-- GRANT ALL PRIVILEGES ON DATABASE what_to_eat TO what_to_eat_user;

-- 连接到新创建的数据库
\c what_to_eat

-- 授予用户权限（如果创建了专用用户）
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO what_to_eat_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO what_to_eat_user;
-- ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO what_to_eat_user;
-- ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO what_to_eat_user;

-- 显示数据库信息
SELECT datname, datcollate, datctype FROM pg_database WHERE datname = 'what_to_eat';

