# Security Analysis Summary

## Overview

This document summarizes the intentional security vulnerabilities in the Blue Mountain Travel backend implementation.

## CodeQL Analysis Results

### Findings: 8 Alerts (All Intentional)

#### 1-7. Missing Rate Limiting (js/missing-rate-limiting)
**Severity**: Medium  
**Status**: ⚠️ Intentional for training  

**Affected Endpoints:**
- `/api/users` (line 63)
- `/api/flights` (line 98)
- `/api/hotels` (line 123)
- `/api/register` (line 145)
- `/api/bookings/:userId` (line 180)
- `/api/bookings` (line 199)
- `/api/execute` (line 248)

**Issue**: Route handlers perform database access without rate limiting, allowing potential DoS attacks through rapid requests.

**Training Value**: Demonstrates the importance of rate limiting for API endpoints, especially those that perform expensive operations like database queries.

**Remediation** (not implemented): Add rate limiting middleware like `express-rate-limit`:
```javascript
const rateLimit = require('express-rate-limit');
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', apiLimiter);
```

#### 8. Sensitive GET Query (js/sensitive-get-query)
**Severity**: Medium  
**Status**: ⚠️ Intentional for training  

**Affected Endpoint:**
- `/api/users` (line 65)

**Issue**: GET request handler uses query parameter (`password`) as sensitive data. Sensitive data in URLs can be logged, cached, and exposed in browser history.

**Training Value**: Demonstrates why sensitive data like passwords should be sent via POST body, not GET parameters.

**Remediation** (not implemented): 
```javascript
// Instead of GET with query parameters
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body; // From POST body, not query params
  // ... authentication logic
});
```

## Additional Intentional Vulnerabilities (Not Detected by CodeQL)

### SQL Injection
**Severity**: Critical  
**Locations**: Multiple endpoints

All database queries use string concatenation, allowing SQL injection:
```javascript
query += ` AND Email = '${email}'`; // VULNERABLE
```

**Training Value**: Classic SQL injection demonstration.

### Exposed Credentials
**Severity**: Critical  
**Location**: `server.js` lines 11-23, `/api/config` endpoint

Database credentials hardcoded in source code and exposed via API endpoint.

### Arbitrary SQL Execution
**Severity**: Critical  
**Location**: `/api/execute` endpoint (line 248)

Allows execution of any SQL query without validation:
```javascript
const result = await pool.request().query(query); // Executes anything!
```

### No Authentication/Authorization
**Severity**: Critical  
**Locations**: All endpoints

No authentication checks on any endpoint. Anyone can:
- Access all users' data
- View any user's bookings (IDOR)
- Create bookings for any user
- Execute arbitrary SQL

### Plain Text Password Storage
**Severity**: Critical  
**Location**: `/api/register` (line 145)

Passwords stored directly in database without hashing:
```javascript
INSERT INTO Users ... VALUES (..., '${password}', ...)
```

### Verbose Error Messages
**Severity**: Low-Medium  
**Locations**: All catch blocks

Error responses include full stack traces and query details:
```javascript
res.status(500).json({ 
  error: err.message,
  stack: err.stack,
  query: req.url
});
```

## Conclusion

All CodeQL alerts are **expected and intentional** for this security training application. The application successfully demonstrates:

✅ Missing rate limiting vulnerabilities  
✅ Sensitive data in GET parameters  
✅ SQL injection vulnerabilities  
✅ Exposed credentials  
✅ Arbitrary code/SQL execution  
✅ Lack of authentication/authorization  
✅ Plain text password storage  
✅ Verbose error messages  

**This application should NEVER be deployed to production.**

## Learning Objectives

Students using this application should:
1. Identify all vulnerabilities using security scanning tools
2. Exploit vulnerabilities in a safe environment
3. Understand the impact of each vulnerability
4. Learn proper remediation techniques
5. Practice secure coding patterns

---

**Last Updated**: 2026-01-06  
**CodeQL Analysis**: javascript  
**Total Alerts**: 8 (all intentional)
