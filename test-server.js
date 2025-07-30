const express = require("express");
const app = express();

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    message: "Test server is running",
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.send("Test server is running!");
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("🚀 Test server started successfully!");
  console.log(`📍 Server is running on port ${PORT}`);
  console.log(`🏥 Health check available at: http://localhost:${PORT}/health`);
  console.log(`⏰ Started at: ${new Date().toISOString()}`);
  console.log("✅ Test server is ready to serve requests");
});

// Handle graceful shutdown
process.on("SIGINT", () => {
  console.log("\n🛑 Shutting down test server...");
  process.exit(0);
});
