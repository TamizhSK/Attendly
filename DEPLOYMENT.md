# Attendly Deployment Guide

## 🚀 Vercel Frontend Deployment

### Prerequisites
1. Push your code to GitHub
2. Create a Vercel account at [vercel.com](https://vercel.com)

### Deploy to Vercel
1. **Import Project**: Go to Vercel dashboard → "New Project" → Import your GitHub repo
2. **Framework Preset**: Vercel will auto-detect Next.js
3. **Root Directory**: Set to `frontend`
4. **Environment Variables**: Add these in Vercel dashboard:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-domain.com
   ```
5. **Deploy**: Click "Deploy"

Your frontend will be available at: `https://your-project-name.vercel.app`

### Update Backend CORS
Once deployed, update your backend's `.env` file:
```bash
FRONTEND_URL=https://your-project-name.vercel.app
```

## 🐳 Docker Deployment

### Quick Start
```bash
# Clone the repository
git clone <your-repo-url>
cd Attendly

# Start all services
docker-compose up -d

# Check logs
docker-compose logs -f
```

### Services
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000  
- **Database**: PostgreSQL on port 5432

### Environment Setup
1. Copy environment files:
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env.local
   ```

2. Update environment variables:
   - Change database passwords
   - Set strong JWT secrets
   - Update API URLs

### Production Deployment
1. **Update docker-compose.yml**:
   - Use production database credentials
   - Set secure JWT secrets
   - Configure proper volumes for data persistence

2. **SSL/HTTPS Setup**:
   - Add nginx reverse proxy
   - Configure SSL certificates
   - Update CORS settings

## 🌐 Backend Hosting Options

### Railway
1. Connect GitHub repo
2. Set environment variables
3. Deploy from `backend` folder

### Heroku
1. Create new app
2. Add PostgreSQL addon
3. Set config vars
4. Deploy

### DigitalOcean App Platform
1. Create new app
2. Connect GitHub
3. Configure build settings
4. Add database component

## 📋 Environment Variables

### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=https://your-backend-domain.com
```

### Backend (.env)
```bash
DATABASE_URL=postgresql://username:password@host:port/database
JWT_SECRET=your-super-secret-jwt-key
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

## 🔧 Production Checklist

### Security
- [ ] Change default database passwords
- [ ] Set strong JWT secrets
- [ ] Enable HTTPS
- [ ] Configure CORS properly
- [ ] Set secure headers

### Performance
- [ ] Enable compression
- [ ] Configure caching
- [ ] Optimize images
- [ ] Monitor performance

### Monitoring
- [ ] Set up error tracking
- [ ] Configure logging
- [ ] Monitor database performance
- [ ] Set up health checks

## 🚨 Troubleshooting

### Common Issues
1. **CORS Errors**: Check FRONTEND_URL in backend
2. **Database Connection**: Verify DATABASE_URL
3. **Build Errors**: Check Node.js version compatibility
4. **Environment Variables**: Ensure all required vars are set

### Docker Issues
```bash
# Reset everything
docker-compose down -v
docker-compose up --build

# View logs
docker-compose logs backend
docker-compose logs frontend
```

### Vercel Deployment Issues
1. Check build logs in Vercel dashboard
2. Verify environment variables
3. Ensure Node.js version compatibility

## 📞 Support
For deployment issues, check:
- Vercel documentation
- Docker documentation  
- Your hosting provider's docs