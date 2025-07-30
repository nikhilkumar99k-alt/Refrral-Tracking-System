import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import authRoutes from './auth/routes/auth.routes';
import leadRoutes from './leads/routes/lead.routes';
import customerRoutes from './customers/routes/customer.routes';
import paymentRoutes from './payments/routes/payment.routes';
import referralRoutes from './referral/routes/referral.routes';
import adminRoutes from './admin/routes/admin.routes';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;
const HTTPS_PORT = process.env.HTTPS_PORT || 3443;

// CORS configuration - allow all origins
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
}));

// Set Referrer-Policy to allow referrers for all requests
app.use((req, res, next) => {
  res.setHeader('Referrer-Policy', 'unsafe-url');
  next();
});

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0'
  });
});

app.use('/auth', authRoutes);
app.use('/leads', leadRoutes);
app.use('/customers', customerRoutes);
app.use('/payments', paymentRoutes);
app.use('/referral', referralRoutes);
app.use('/admin', adminRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Check if SSL certificates exist
const sslKeyPath = path.join(__dirname, '../ssl/private.key');
const sslCertPath = path.join(__dirname, '../ssl/certificate.crt');

const sslCertificatesExist = fs.existsSync(sslKeyPath) && fs.existsSync(sslCertPath);

if (sslCertificatesExist) {
  // SSL Certificate configuration
  const sslOptions = {
    key: fs.readFileSync(sslKeyPath),
    cert: fs.readFileSync(sslCertPath)
  };

  // Create HTTPS server
  const httpsServer = https.createServer(sslOptions, app);

  // Create HTTP server (for redirecting to HTTPS)
  const httpApp = express();
  httpApp.use((req, res) => {
    res.redirect(`https://${req.headers.host}${req.url}`);
  });
  const httpServer = http.createServer(httpApp);

  // Start both servers
  httpsServer.listen(HTTPS_PORT, () => {
    console.log('🔒 HTTPS Server started successfully!');
    console.log(`📍 HTTPS Server is running on port ${HTTPS_PORT}`);
    console.log(`🏥 Health check available at: https://localhost:${HTTPS_PORT}/health`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`⏰ Started at: ${new Date().toISOString()}`);
    console.log('✅ All routes are ready to serve requests');
  });

  httpServer.listen(PORT, () => {
    console.log('🌐 HTTP Server started successfully!');
    console.log(`📍 HTTP Server is running on port ${PORT}`);
    console.log(`🔄 Redirecting HTTP to HTTPS`);
  });
} else {
  // Fallback to HTTP only if SSL certificates don't exist
  console.log('⚠️  SSL certificates not found. Starting HTTP server only.');
  console.log('📝 Run ./generate-ssl.sh to generate SSL certificates for HTTPS support.');
  
  app.listen(PORT, () => {
    console.log('🚀 HTTP Server started successfully!');
    console.log(`📍 Server is running on port ${PORT}`);
    console.log(`🏥 Health check available at: http://localhost:${PORT}/health`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`⏰ Started at: ${new Date().toISOString()}`);
    console.log('✅ All routes are ready to serve requests');
  });
}

process.on('beforeExit', async () => {
  await prisma.$disconnect();
});


