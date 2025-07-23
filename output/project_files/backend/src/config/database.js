const mysql = require('mysql2/promise')
const winston = require('winston')

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3306,
  database: process.env.DB_NAME || 'inflow_db',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  connectionLimit: 20, // Maximum number of connections in the pool
  queueLimit: 0, // No limit on queued connection requests
  waitForConnections: true, // Wait for connections when limit is reached
  charset: 'utf8mb4',
  timezone: '+00:00', // Use UTC timezone
  typeCast: true, // Cast MySQL types to JavaScript types
  supportBigNumbers: true,
  bigNumberStrings: true
}

// Create connection pool
const pool = mysql.createPool(dbConfig)

// Test database connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection()
    const [result] = await connection.execute('SELECT NOW() as now_time')
    connection.release()
    winston.info('Database connection successful:', result[0])
    return true
  } catch (err) {
    winston.error('Database connection failed:', err)
    return false
  }
}

// Query helper function
const query = async (text, params = []) => {
  const start = Date.now()
  try {
    const [rows, fields] = await pool.execute(text, params)
    const duration = Date.now() - start
    winston.debug('Query executed', { text, duration, rowCount: rows.length })
    
    // Return result in PostgreSQL-like format for compatibility
    // Include insertId for INSERT operations
    return {
      rows: rows,
      rowCount: rows.length,
      fields: fields,
      insertId: rows.insertId // for INSERT operations
    }
  } catch (err) {
    winston.error('Query error', { text, error: err.message })
    throw err
  }
}

// Transaction helper
const transaction = async (callback) => {
  const connection = await pool.getConnection()
  try {
    await connection.beginTransaction()
    
    // Create a query function for the connection
    const connectionQuery = async (text, params = []) => {
      const [rows, fields] = await connection.execute(text, params)
      return {
        rows: rows,
        rowCount: rows.length,
        fields: fields
      }
    }
    
    const result = await callback(connectionQuery)
    await connection.commit()
    return result
  } catch (err) {
    await connection.rollback()
    throw err
  } finally {
    connection.release()
  }
}

// Get connection for complex operations
const getClient = async () => {
  const connection = await pool.getConnection()
  
  // Add query method to connection for compatibility
  connection.query = async (text, params = []) => {
    const [rows, fields] = await connection.execute(text, params)
    return {
      rows: rows,
      rowCount: rows.length,
      fields: fields
    }
  }
  
  return connection
}

// Graceful shutdown
const closePool = async () => {
  try {
    await pool.end()
    winston.info('Database pool closed')
  } catch (err) {
    winston.error('Error closing database pool:', err.message)
  }
}

// Handle process termination
process.on('SIGINT', closePool)
process.on('SIGTERM', closePool)

module.exports = {
  pool,
  query,
  transaction,
  getClient,
  testConnection,
  closePool
}
