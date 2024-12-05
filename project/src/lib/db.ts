import { createClient } from '@libsql/client';
import { hashPassword, verifyPassword } from './auth';

let client: ReturnType<typeof createClient>;

function getClient() {
  if (!client) {
    client = createClient({
      url: 'file:local.db',
      syncUrl: 'file:local.db',
    });
  }
  return client;
}

export async function initDb() {
  try {
    const db = getClient();
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    return { success: true };
  } catch (error) {
    console.error('Database initialization error:', error);
    return { success: false, error: 'Failed to initialize database' };
  }
}

export async function createUser(username: string, password: string) {
  const db = getClient();
  const hashedPassword = await hashPassword(password);
  
  try {
    const result = await db.execute({
      sql: 'INSERT INTO users (username, password) VALUES (?, ?)',
      args: [username, hashedPassword]
    });
    return { success: true, id: result.lastInsertId };
  } catch (error: any) {
    if (error.message.includes('UNIQUE constraint failed')) {
      return { success: false, error: 'اسم المستخدم موجود بالفعل' };
    }
    return { success: false, error: 'حدث خطأ أثناء إنشاء الحساب' };
  }
}

export async function verifyUser(username: string, password: string) {
  const db = getClient();
  try {
    const result = await db.execute({
      sql: 'SELECT * FROM users WHERE username = ?',
      args: [username]
    });

    const user = result.rows[0];
    if (!user) {
      return { success: false, error: 'اسم المستخدم أو كلمة المرور غير صحيحة' };
    }

    const isValid = await verifyPassword(password, user.password as string);
    if (!isValid) {
      return { success: false, error: 'اسم المستخدم أو كلمة المرور غير صحيحة' };
    }

    return { 
      success: true, 
      user: { 
        id: Number(user.id), 
        username: user.username as string 
      } 
    };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'حدث خطأ أثناء تسجيل الدخول' };
  }
}