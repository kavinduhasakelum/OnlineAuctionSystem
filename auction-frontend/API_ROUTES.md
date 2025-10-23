# API Routes Reference

## Authentication & User Management
**Controller:** `UsersApiController`
**Base Route:** `/api/UsersApi`

### Endpoints:

#### Register
- **Method:** `POST`
- **Route:** `/api/UsersApi/register`
- **Body:**
  ```json
  {
    "FirstName": "string",
    "LastName": "string",
    "Email": "string",
    "Password": "string",
    "Role": "Buyer" | "Seller" | "Admin"
  }
  ```
- **Response:**
  ```json
  {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "Buyer"
  }
  ```

#### Login
- **Method:** `POST`
- **Route:** `/api/UsersApi/login`
- **Body:**
  ```json
  {
    "Email": "string",
    "Password": "string"
  }
  ```
- **Response:**
  ```json
  {
    "token": "jwt-token-here",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "Buyer"
    }
  }
  ```

#### Get Current User
- **Method:** `GET`
- **Route:** `/api/UsersApi/me`
- **Headers:** `Authorization: Bearer {token}`
- **Response:**
  ```json
  {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "Buyer"
  }
  ```

---

## Admin Management
**Controller:** `AdminApiController`
**Base Route:** `/api/AdminApi`
**Required Role:** Admin

### User Management

#### Get All Users
- **Method:** `GET`
- **Route:** `/api/AdminApi/users?page=1&limit=20&role=&search=`

#### Get User Details
- **Method:** `GET`
- **Route:** `/api/AdminApi/users/{id}`

#### Update User Role
- **Method:** `PUT`
- **Route:** `/api/AdminApi/users/{id}/role`
- **Body:** `{ "Role": "Admin" | "Seller" | "Buyer" }`

#### Delete User
- **Method:** `DELETE`
- **Route:** `/api/AdminApi/users/{id}`
- **Body:** `{ "Reason": "string", "ForceDelete": boolean }`

### Product Management

#### Get Pending Products
- **Method:** `GET`
- **Route:** `/api/AdminApi/products/pending?page=1&limit=20`

#### Get All Products
- **Method:** `GET`
- **Route:** `/api/AdminApi/products?status=&isApproved=&page=1&limit=20`

#### Approve Product
- **Method:** `PUT`
- **Route:** `/api/AdminApi/products/{id}/approve`
- **Body:** `{ "Comment": "string (optional)" }`

#### Reject Product
- **Method:** `PUT`
- **Route:** `/api/AdminApi/products/{id}/reject`
- **Body:** `{ "Reason": "string (required)" }`

#### Force Delete Product
- **Method:** `DELETE`
- **Route:** `/api/AdminApi/products/{id}/force-delete`
- **Body:** `{ "Reason": "string (optional)" }`

### Dashboard

#### Get Dashboard Stats
- **Method:** `GET`
- **Route:** `/api/AdminApi/dashboard/stats`

---

## Products
**Controller:** `ProductsApiController`
**Base Route:** `/api/ProductsApi`

#### Get Active Products
- **Method:** `GET`
- **Route:** `/api/ProductsApi/active?limit=6`

#### Search Products
- **Method:** `GET`
- **Route:** `/api/ProductsApi/search?name={searchTerm}&limit=6`

#### Create Product
- **Method:** `POST`
- **Route:** `/api/ProductsApi`
- **Required Role:** Seller, Admin

---

## Important Notes

1. **Case Sensitivity:** Use exact casing as shown (e.g., `UsersApi`, not `usersapi`)
2. **Authorization:** Include JWT token in header: `Authorization: Bearer {token}`
3. **Base URL:** All routes are relative to `${API_BASE_URL}` (from .env file)
4. **Default Port:** 7096 (configurable in .env)

---

## Frontend Usage Examples

### Using the centralized API instance
```javascript
import api from '../api/api';

// Login
const response = await api.post('/UsersApi/login', { email, password });

// Get current user (token automatically added)
const user = await api.get('/UsersApi/me');

// Admin: Get all users
const users = await api.get('/AdminApi/users?page=1&limit=10');
```

### Using AuthContext
```javascript
import { useAuth } from '../context/AuthContext';

const { login, logout, user } = useAuth();

// Login
await login(email, password);

// Register
await register(firstName, lastName, email, password, role);

// Logout
logout();
```
