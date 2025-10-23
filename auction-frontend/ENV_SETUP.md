# Environment Configuration

## Setup Instructions

1. **Copy the environment template:**
   ```bash
   cp .env.example .env
   ```

2. **Configure your API URL:**
   Edit `.env` and set your backend API URL:
   ```env
   REACT_APP_API_BASE_URL=http://localhost:7096/api
   ```

3. **Restart the development server:**
   ```bash
   npm start
   ```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_API_BASE_URL` | Backend API base URL | `http://localhost:7096/api` |

## Important Notes

- ⚠️ **Always restart your React app after changing `.env` files**
- 🔒 **Never commit `.env` to version control** (it's in `.gitignore`)
- 📝 **Update `.env.example` when adding new environment variables**
- ✅ **All environment variables must start with `REACT_APP_`** in Create React App

## Different Environments

### Development
```env
REACT_APP_API_BASE_URL=http://localhost:7096/api
```

### Production
```env
REACT_APP_API_BASE_URL=https://your-production-api.com/api
```

### Staging
```env
REACT_APP_API_BASE_URL=https://staging-api.com/api
```
