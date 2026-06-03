
## 📦 Dependencies Used

- **React 19.2.6**: UI library
- **React Router 7.16.0**: Client-side routing
- **Tailwind CSS 4.3.0**: Utility-first CSS
- **Framer Motion 12.40.0**: Smooth animations
- **Lucide React 1.17.0**: Beautiful icons
- **React Hot Toast 2.6.0**: Toast notifications
- **Axios 1.16.1**: HTTP requests
- **React Icons 5.6.0**: Icon library

---

## 🔄 Integration Points

### Backend API Expected Endpoints
- `POST /user/login` - Login endpoint
- `POST /user/signup` - Signup endpoint
- `POST /user/forget` - Request password reset OTP
- `POST /user/reset` - Reset password with OTP
- `GET /user` - Get current user info
- `GET /urls/all` - Get all URLs for user
- `GET /urls/logs/today` - Get today's analytics
- `POST /urls` - Create new shortened URL
- `DELETE /urls/:id` - Delete URL

## 📱 Responsive Breakpoints

- **Mobile**: < 640px (sm)
- **Tablet**: 640px - 1024px (md, lg)
- **Desktop**: > 1024px (xl)

---

## ⚡ Performance Optimizations

- Lazy loading of images
- Optimized re-renders with React.memo
- Efficient state management
- CSS-in-JS with Tailwind (minimal CSS)
- Icons from Lucide (SVG, scalable)

---

## 🔐 Security Features

- JWT token storage in localStorage (production: use httpOnly cookies)
- Protected routes with authentication checks
- CORS enabled for API requests
- Input validation on forms
- XSS protection through React

---
