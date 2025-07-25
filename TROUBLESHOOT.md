# Troubleshooting User Management API Issues

## Problem
The `fetchUsers` API call is failing in the frontend dashboard.

## Debugging Steps

### 1. Check Backend Server Status
```bash
cd D:\Projects\Attendly\backend
npm start
```

The server should start on port 5000 and show:
```
Database connected successfully
Server running on port 5000
Environment: development
```

### 2. Test the API Endpoint
Run the test script to verify the backend:
```bash
cd D:\Projects\Attendly\backend
node test-users-endpoint.js
```

### 3. Check Frontend Console
Open browser developer tools and look for console logs when clicking "Load Users":
- Check if the API URL is correct
- Verify the user role is 'admin'
- Check if the token exists in localStorage

### 4. Common Issues and Solutions

#### Issue 1: Backend Server Not Running
**Symptom**: "Connection Error" toast message
**Solution**: Start the backend server
```bash
cd D:\Projects\Attendly\backend
npm start
```

#### Issue 2: User Not Admin
**Symptom**: "Access Denied" toast message
**Solution**: Log in with an admin account or create one:
```bash
# In your database, update a user to be admin
# Or create a new admin user through the signup page with role 'admin'
```

#### Issue 3: Token Expired
**Symptom**: "Authentication Failed" toast message
**Solution**: Log out and log back in to get a fresh token

#### Issue 4: CORS Issues
**Symptom**: CORS error in browser console
**Solution**: Check if frontend is running on port 3000 (allowed in CORS config)

### 5. Manual Testing
You can test the API manually using curl:

```bash
# First, login to get a token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@test.com", "password": "admin123"}'

# Use the token from the response
curl -X GET http://localhost:5000/api/auth/users \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 6. Expected Responses

#### Successful Response (200):
```json
[
  {
    "id": "user-id",
    "name": "User Name",
    "email": "user@example.com",
    "role": "faculty",
    "createdAt": "2023-12-01T00:00:00.000Z",
    "updatedAt": "2023-12-01T00:00:00.000Z"
  }
]
```

#### Error Responses:
- **401**: Token expired or invalid
- **403**: User is not admin
- **404**: Endpoint not found (server not running)
- **500**: Database or server error

### 7. Database Check
Verify you have users in the database:
```bash
# Connect to your database and run:
SELECT id, name, email, role FROM User;
```

Make sure at least one user has `role = 'admin'`.

## Quick Fix Commands

```bash
# 1. Start backend server
cd D:\Projects\Attendly\backend && npm start

# 2. Start frontend server (in another terminal)
cd D:\Projects\Attendly\frontend && npm run dev

# 3. Test the endpoint
cd D:\Projects\Attendly\backend && node test-users-endpoint.js
```

## Logs to Check
- Backend console for middleware logs
- Browser developer tools console for frontend logs
- Network tab in browser for HTTP request details