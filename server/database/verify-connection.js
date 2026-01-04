/**
 * 数据库连接验证脚本
 * 用于验证 PostgreSQL 数据库是否正确配置和连接
 * 
 * 使用方法：
 * 1. 确保已安装 pg 包：pnpm install pg
 * 2. 确保 .env 文件已配置数据库连接信息
 * 3. 运行：node database/verify-connection.js
 */

require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  user: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE || 'what_to_eat',
});

async function verifyConnection() {
  try {
    console.log('正在连接数据库...');
    console.log(`主机: ${client.host}`);
    console.log(`端口: ${client.port}`);
    console.log(`用户: ${client.user}`);
    console.log(`数据库: ${client.database}`);
    console.log('');

    await client.connect();
    console.log('✅ 数据库连接成功！');
    console.log('');

    // 测试查询
    const result = await client.query('SELECT NOW() as current_time, version() as pg_version');
    console.log('📅 当前时间:', result.rows[0].current_time);
    console.log('📦 PostgreSQL 版本:', result.rows[0].pg_version.split(' ')[0] + ' ' + result.rows[0].pg_version.split(' ')[1]);
    console.log('');

    // 检查数据库编码
    const encodingResult = await client.query("SELECT current_database(), pg_encoding_to_char(encoding) as encoding FROM pg_database WHERE datname = current_database()");
    console.log('💾 数据库编码:', encodingResult.rows[0].encoding);
    console.log('');

    // 列出所有表（如果有）
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    if (tablesResult.rows.length > 0) {
      console.log('📋 当前数据库中的表:');
      tablesResult.rows.forEach(row => {
        console.log(`   - ${row.table_name}`);
      });
    } else {
      console.log('📋 当前数据库中没有表（这是正常的，后续会通过迁移创建）');
    }
    console.log('');

    console.log('✅ 数据库验证完成！可以继续下一步开发。');
    
    await client.end();
    process.exit(0);
  } catch (err) {
    console.error('❌ 数据库连接失败！');
    console.error('');
    console.error('错误信息:', err.message);
    console.error('');
    
    if (err.code === 'ECONNREFUSED') {
      console.error('💡 提示: 请检查 PostgreSQL 服务是否已启动');
      console.error('   Windows: Get-Service postgresql*');
      console.error('   启动服务: Start-Service postgresql-x64-14');
    } else if (err.code === '28P01') {
      console.error('💡 提示: 用户名或密码错误，请检查 .env 文件中的 DB_USERNAME 和 DB_PASSWORD');
    } else if (err.code === '3D000') {
      console.error('💡 提示: 数据库不存在，请先运行 database/init.sql 创建数据库');
    } else if (err.code === 'ENOTFOUND') {
      console.error('💡 提示: 无法找到数据库主机，请检查 .env 文件中的 DB_HOST');
    }
    
    console.error('');
    console.error('请参考 database/README.md 获取详细设置指南');
    
    await client.end().catch(() => {});
    process.exit(1);
  }
}

verifyConnection();

