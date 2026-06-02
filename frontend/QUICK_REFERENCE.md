# 🎨 Goto Frontend - Quick Reference & Code Examples

## 🎯 Quick Start Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview build locally
npm run preview

# Run linter
npm lint
```

---

## 🔗 Key Imports

### Use Theme Hook
```jsx
import { useTheme } from '../context/ThemeContext';

function MyComponent() {
  const { isDark, toggleTheme } = useTheme();
  return <button onClick={toggleTheme}>Toggle Theme</button>;
}
```

### Use Auth Hook
```jsx
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { user, loading } = useAuth();
  if (loading) return <p>Loading...</p>;
  return <p>Hello, {user?.name}</p>;
}
```

### Use React Router
```jsx
import { useNavigate, Link } from 'react-router-dom';

function MyComponent() {
  const navigate = useNavigate();
  return (
    <>
      <Link to="/dashboard">Go to Dashboard</Link>
      <button onClick={() => navigate('/login')}>Login</button>
    </>
  );
}
```

### Show Toast Notification
```jsx
import toast from 'react-hot-toast';

// Success
toast.success('Operation successful!');

// Error
toast.error('Something went wrong');

// Loading
const id = toast.loading('Processing...');
// Later: toast.success('Done!', { id });
```

---

## 🎨 Common Styling Patterns

### Dark Mode Conditional Classes
```jsx
<div className={`
  p-6 rounded-lg border transition-colors duration-300
  ${isDark 
    ? 'bg-slate-900 border-slate-800 text-white'
    : 'bg-white border-slate-200 text-slate-900'
  }
`}>
  Content
</div>
```

### Gradient Buttons
```jsx
<button className="
  px-6 py-3 rounded-lg
  bg-gradient-to-r from-indigo-600 to-indigo-500
  hover:from-indigo-700 hover:to-indigo-600
  text-white font-semibold
  transition-all duration-200
">
  Click me
</button>
```

### Responsive Grid
```jsx
<div className="
  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4
">
  {/* Items automatically stack on mobile */}
</div>
```

### Input with Icon
```jsx
<div className="flex items-center border rounded-lg bg-slate-800 border-slate-700">
  <SearchIcon className="ml-3 text-slate-500" />
  <input
    type="text"
    className="flex-1 px-4 py-3 bg-transparent border-0 outline-none"
    placeholder="Search..."
  />
</div>
```

---

## 🎬 Animation Examples

### Fade In
```jsx
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
>
  Content
</motion.div>
```

### Slide & Fade
```jsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
>
  Content
</motion.div>
```

### Button Interactions
```jsx
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  Click me
</motion.button>
```

### Staggered List Items
```jsx
<motion.div initial="hidden" animate="visible" variants={{
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}}>
  {items.map((item) => (
    <motion.div key={item.id} variants={{
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 }
    }}>
      {item.name}
    </motion.div>
  ))}
</motion.div>
```

---

## 📋 Form Patterns

### Basic Form with Validation
```jsx
import { useState } from 'react';
import toast from 'react-hot-toast';

function MyForm() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // API call here
      await apiCall(form);
      toast.success('Success!');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        disabled={loading}
      />
      <button disabled={loading}>
        {loading ? 'Loading...' : 'Submit'}
      </button>
    </form>
  );
}
```

---

## 🔄 API Call Examples

### Get Request
```jsx
import { useEffect, useState } from 'react';
import { getAllUrls } from '../api/api';

function MyComponent() {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUrls = async () => {
      try {
        const data = await getAllUrls();
        setUrls(data.urls || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUrls();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  
  return <ul>{urls.map(url => <li key={url._id}>{url.shortCode}</li>)}</ul>;
}
```

### Post Request
```jsx
import { createUrl } from '../api/api';
import toast from 'react-hot-toast';

async function handleCreateUrl(urlData) {
  try {
    const result = await createUrl(urlData);
    toast.success('URL created!');
    return result;
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to create URL');
  }
}
```

---

## 🎯 Layout Patterns

### Dashboard Page
```jsx
import DashboardLayout from '../components/layouts/DashboardLayout';
import { useAuth } from '../context/AuthContext';

export default function MyPage() {
  const { user } = useAuth();

  return (
    <DashboardLayout user={user}>
      <div className="space-y-8">
        <h1>Welcome to My Page</h1>
        {/* Your content */}
      </div>
    </DashboardLayout>
  );
}
```

### Auth Page
```jsx
import AuthLayout from '../components/layouts/AuthLayout';

export default function MyAuthPage() {
  return (
    <AuthLayout 
      title="My Auth Page" 
      subtitle="Do something"
    >
      {/* Your form */}
    </AuthLayout>
  );
}
```

---

## 🎨 Theme-Aware Component

### Template
```jsx
import { useTheme } from '../context/ThemeContext';

export default function MyComponent() {
  const { isDark } = useTheme();

  return (
    <div className={`
      p-4 rounded-lg border transition-colors duration-300
      ${isDark
        ? 'bg-slate-900 border-slate-800 text-slate-100'
        : 'bg-white border-slate-200 text-slate-900'
      }
    `}>
      <h3 className={isDark ? 'text-white' : 'text-slate-900'}>
        Heading
      </h3>
      <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
        Description
      </p>
    </div>
  );
}
```

---

## 📊 Empty State Handling

```jsx
export default function MyList({ items, loading }) {
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
        <p className="mt-4 text-slate-400">Loading...</p>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg font-semibold text-slate-900">No items yet</p>
        <p className="text-slate-600">Create your first item to get started</p>
      </div>
    );
  }

  return (
    <div>
      {items.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
}
```

---

## 🎨 Color Utilities

### Slate Colors
```
50: #f8fafc    | 600: #475569   |
100: #f1f5f9   | 700: #334155   |
200: #e2e8f0   | 800: #1e293b   |
300: #cbd5e1   | 900: #0f172a   |
400: #94a3b8   | 950: #0f172a   |
500: #64748b   |
```

### Indigo Colors (Accent)
```
400: #818cf8   (dark mode accent)
500: #6366f1   |
600: #4f46e5   (light mode accent)
700: #4338ca   |
```

---

## 🔐 Protected Route Pattern

```jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedPage() {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  
  if (!user) return <Navigate to="/login" />;

  return (
    <div>
      {/* Protected content */}
    </div>
  );
}
```

---

## 📱 Responsive Utilities

### Hide on Mobile
```jsx
<div className="hidden md:block">
  {/* Only visible on tablets and above */}
</div>
```

### Show Only on Mobile
```jsx
<div className="md:hidden">
  {/* Only visible on mobile */}
</div>
```

### Responsive Font Sizes
```jsx
<h1 className="text-2xl md:text-3xl lg:text-4xl">
  Responsive Heading
</h1>
```

### Responsive Spacing
```jsx
<div className="p-4 md:p-6 lg:p-8">
  Responsive padding
</div>
```

---

## ⌚ Loading States

### Button Loading
```jsx
<button disabled={loading} className="disabled:opacity-50">
  {loading ? (
    <>
      <span className="inline-block animate-spin mr-2">⚙️</span>
      Loading...
    </>
  ) : (
    'Submit'
  )}
</button>
```

### Skeleton Loader
```jsx
<div className="space-y-4">
  {[...Array(3)].map((_, i) => (
    <div key={i} className="h-12 bg-slate-200 rounded animate-pulse" />
  ))}
</div>
```

---

## 🚨 Error Handling

### Try-Catch Pattern
```jsx
async function safeFetch(asyncFn) {
  try {
    const result = await asyncFn();
    toast.success('Success!');
    return result;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    toast.error(message);
    console.error('Error:', error);
  }
}
```

---

## 🎯 Quick Debugging

### Check Tailwind Classes
```javascript
// In browser console
document.body.className = 'dark'; // Enable dark mode
document.body.className = ''; // Disable dark mode
```

### Log Component State
```jsx
useEffect(() => {
  console.log('Component mounted with user:', user);
  console.log('Theme:', isDark ? 'dark' : 'light');
}, [user, isDark]);
```

### Check localStorage
```javascript
// View all data
console.log(localStorage);

// Get specific item
console.log(localStorage.getItem('theme-mode'));

// Clear all
localStorage.clear();
```

---

## 📝 JSDoc Comments Template

```jsx
/**
 * Brief description of component
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - Title text
 * @param {number} props.count - Item count
 * @param {Function} props.onSubmit - Submit callback
 * @returns {JSX.Element} Rendered component
 * 
 * @example
 * <MyComponent title="Hello" count={5} onSubmit={handleSubmit} />
 */
export default function MyComponent({ title, count, onSubmit }) {
  return <div>{title}</div>;
}
```

---

## 🎓 Resources & Links

- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [React Docs](https://react.dev)
- [React Router Docs](https://reactrouter.com)
- [Framer Motion Docs](https://www.framer.com/motion/)
- [Lucide Icons](https://lucide.dev)
- [React Hot Toast](https://react-hot-toast.com)

---

**Last Updated**: June 2026  
**Version**: 1.0
