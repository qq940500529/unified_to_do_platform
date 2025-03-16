import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// 创建连接池
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'todo_platform',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 执行查询
export const query = async (sql, params) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.execute(sql, params);
    return rows;
  } catch (error) {
    throw new Error(`数据库查询错误: ${error.message}`);
  } finally {
    if (connection) connection.release();
  }
};

// 执行事务
export const transaction = async (callback) => {
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const result = await callback(connection);

    await connection.commit();
    return result;
  } catch (error) {
    if (connection) await connection.rollback();
    throw new Error(`事务执行失败: ${error.message}`);
  } finally {
    if (connection) connection.release();
  }
};

// 测试数据库连接
export const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    return true;
  } catch (error) {
    throw new Error(`数据库连接失败: ${error.message}`);
  }
};

// 初始化数据库
export const initDatabase = async () => {
  try {
    // 测试连接
    await testConnection();

    // 执行初始化脚本
    const initSql = await fs.promises.readFile(
      path.join(__dirname, '../../database/init.sql'),
      'utf8'
    );

    await transaction(async (connection) => {
      const statements = initSql.split(';').filter(s => s.trim());
      for (const statement of statements) {
        await connection.execute(statement);
      }
    });

    console.log('数据库初始化成功');
    return true;
  } catch (error) {
    console.error('数据库初始化失败:', error);
    throw error;
  }
};

export default {
  query,
  transaction,
  testConnection,
  initDatabase
};
