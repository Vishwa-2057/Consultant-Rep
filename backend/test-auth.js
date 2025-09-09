// Test auth middleware import
try {
  const authModule = require('./middleware/auth');
  console.log('Auth module:', authModule);
  console.log('Auth function type:', typeof authModule.auth);
  console.log('Authorize function type:', typeof authModule.authorize);
  
  if (typeof authModule.auth === 'function') {
    console.log('✅ Auth middleware imported successfully');
  } else {
    console.log('❌ Auth middleware is not a function');
  }
} catch (error) {
  console.error('❌ Error importing auth middleware:', error.message);
}
