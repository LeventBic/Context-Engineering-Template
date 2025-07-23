require('dotenv').config()
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const compression = require('compression')
const rateLimit = require('express-rate-limit')
const winston = require('winston')
const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

// Import configurations and utilities
const { testConnection } = require('./config/database')
const logger = require('./utils/logger')

// Import routes
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/users')
const productRoutes = require('./routes/products')
const inventoryRoutes = require('./routes/inventory')
const productionRoutes = require('./routes/production')
const dashboardRoutes = require('./routes/dashboard')
const bomRoutes = require('./routes/bom')

// Import middleware
const errorHandler = require('./middleware/errorHandler')
const authMiddleware = require('./middleware/auth')

const app = express()
const PORT = process.env.PORT || 3001

// Trust proxy if behind reverse proxy
app.set('trust proxy', 1)

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}))

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: process.env.CORS_CREDENTIALS === 'true',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

// Compression middleware
app.use(compression())

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false
})

app.use('/api/', limiter)

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Logging middleware
app.use((req, res, next) => {
  winston.info(`${req.method} ${req.path} - ${req.ip}`)
  next()
})

// Swagger/OpenAPI documentation
if (process.env.API_DOCS_ENABLED === 'true') {
  const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'inFlow API',
        version: '1.0.0',
        description: 'API documentation for inFlow inventory and manufacturing management system',
        contact: {
          name: 'inFlow Team',
          email: 'support@inflow.com'
        }
      },
      servers: [
        {
          url: `http://localhost:${PORT}`,
          description: 'Development server'
        }
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'
          }
        }
      }
    },
    apis: ['./src/routes/*.js'] // Path to the API docs
  }

  const swaggerSpec = swaggerJsdoc(swaggerOptions)
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  })
})

// API routes
app.use('/api/auth', authRoutes)
app.use('/api/users', authMiddleware.verifyToken, userRoutes)
app.use('/api/products', authMiddleware.verifyToken, productRoutes)
app.use('/api/inventory', authMiddleware.verifyToken, inventoryRoutes)
app.use('/api/production', authMiddleware.verifyToken, productionRoutes)
app.use('/api/dashboard', authMiddleware.verifyToken, dashboardRoutes)
app.use('/api/bom', authMiddleware.verifyToken, bomRoutes)

// Serve static files (uploads)
app.use('/uploads', express.static('uploads'))

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method
  })
})

// Global error handler
app.use(errorHandler)

// Graceful shutdown
process.on('SIGTERM', () => {
  winston.info('SIGTERM received, shutting down gracefully')
  process.exit(0)
})

process.on('SIGINT', () => {
  winston.info('SIGINT received, shutting down gracefully')
  process.exit(0)
})

// Export the app for use in server.js
// Database connection will be tested when the server starts

module.exports = app