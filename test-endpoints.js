const axios = require("axios");

const BASE_URL = "http://localhost:3000";

async function testEndpoint(url, name) {
  try {
    console.log(`🧪 Testing ${name}...`);
    const response = await axios.get(url, { timeout: 5000 });
    console.log(`✅ ${name} - Status: ${response.status}`);
    console.log(`📄 Response:`, response.data);
    return true;
  } catch (error) {
    console.log(`❌ ${name} - Error: ${error.message}`);
    if (error.response) {
      console.log(`   Status: ${error.response.status}`);
      console.log(`   Data: ${error.response.data}`);
    }
    return false;
  }
}

async function runTests() {
  console.log("🚀 Starting endpoint tests...\n");

  // Test root endpoint
  await testEndpoint(`${BASE_URL}/`, "Root endpoint");
  console.log("");

  // Test health endpoint
  await testEndpoint(`${BASE_URL}/health`, "Health endpoint");
  console.log("");

  console.log("🏁 Test completed!");
}

// Run tests
runTests().catch(console.error);
