const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

async function createUsers() {
  try {
    // Database bağlantısı
    const connection = await mysql.createConnection({
      host: 'inflow_mysql',
      port: 3306,
      user: 'root',
      password: 'mysql123',
      database: 'inflow_db'
    });

    console.log('🔗 Database bağlantısı kuruldu');

    // Kullanıcı verileri
    const users = [
      {
        username: 'admin',
        email: 'admin@inflow.com',
        password: '20202020',
        first_name: 'Admin',
        last_name: 'User',
        role: 'admin'
      },
      {
        username: 'levent',
        email: 'levent@inflow.com',
        password: '20202020',
        first_name: 'Levent',
        last_name: 'Bicakci',
        role: 'admin'
      },
      {
        username: 'yunus',
        email: 'yunus@inflow.com',
        password: '20202020',
        first_name: 'Yunus',
        last_name: 'User',
        role: 'admin'
      },
      {
        username: 'operator1',
        email: 'operator1@inflow.com',
        password: '11111111',
        first_name: 'Operator',
        last_name: 'One',
        role: 'operator'
      },
      {
        username: 'operator2',
        email: 'operator2@inflow.com',
        password: '11111111',
        first_name: 'Operator',
        last_name: 'Two',
        role: 'operator'
      },
      {
        username: 'viewer1',
        email: 'viewer1@inflow.com',
        password: '11111111',
        first_name: 'Viewer',
        last_name: 'One',
        role: 'viewer'
      },
      {
        username: 'viewer2',
        email: 'viewer2@inflow.com',
        password: '11111111',
        first_name: 'Viewer',
        last_name: 'Two',
        role: 'viewer'
      }
    ];

    console.log('🔐 Passwordlar hashleniyor...');

    // Her kullanıcı için password hash'le ve database'e ekle
    for (const userData of users) {
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      
      const query = `
        INSERT INTO users (username, email, password_hash, first_name, last_name, role, is_active)
        VALUES (?, ?, ?, ?, ?, ?, 1)
      `;
      
      await connection.execute(query, [
        userData.username,
        userData.email,
        hashedPassword,
        userData.first_name,
        userData.last_name,
        userData.role
      ]);

      console.log(`✅ ${userData.username} (${userData.role}) eklendi`);
    }

    // Toplam kullanıcı sayısını kontrol et
    const [rows] = await connection.execute('SELECT COUNT(*) as total FROM users');
    console.log(`\n🎉 Toplam ${rows[0].total} kullanıcı başarıyla eklendi!`);

    // Kullanıcıları listele
    const [userList] = await connection.execute('SELECT id, username, email, role FROM users ORDER BY id');
    console.log('\n👥 Eklenen kullanıcılar:');
    userList.forEach(user => {
      console.log(`   ${user.id}. ${user.username} (${user.email}) - ${user.role}`);
    });

    await connection.end();
    console.log('\n✅ İşlem tamamlandı!');

  } catch (error) {
    console.error('❌ Hata:', error.message);
    process.exit(1);
  }
}

createUsers(); 