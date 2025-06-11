# Frontend Low-Level Design - Home Services Platform

## 1. Project Structure

```
src/
├── app/                      # Next.js App Router structure
│   ├── [locale]/             # Internationalization route groups
│   │   ├── (auth)/           # Authentication route group
│   │   │   ├── login/        # Login page
│   │   │   ├── register/     # Registration page
│   │   │   └── ...           # Other auth pages
│   │   ├── (customer)/       # Customer route group
│   │   │   ├── dashboard/    # Customer dashboard
│   │   │   ├── requests/     # Service requests management
│   │   │   └── ...           # Other customer pages
│   │   ├── (provider)/       # Service provider route group
│   │   │   ├── dashboard/    # Provider dashboard
│   │   │   ├── jobs/         # Jobs management
│   │   │   └── ...           # Other provider pages
│   │   ├── (admin)/          # Admin route group
│   │   │   ├── dashboard/    # Admin dashboard
│   │   │   ├── users/        # User management
│   │   │   └── ...           # Other admin pages
│   │   ├── page.tsx          # Home page
│   │   ├── layout.tsx        # Root layout
│   │   └── ...               # Other public pages
│   ├── api/                  # API routes
│   └── ...                   # Global app files
├── components/               # Reusable components
│   ├── ui/                   # UI components
│   │   ├── Button/           # Button component
│   │   ├── Card/             # Card component
│   │   └── ...               # Other UI components
│   ├── layout/               # Layout components
│   │   ├── Header/           # Header component
│   │   ├── Footer/           # Footer component
│   │   └── ...               # Other layout components
│   ├── features/             # Feature-specific components
│   │   ├── auth/             # Authentication components
│   │   ├── requests/         # Service request components
│   │   └── ...               # Other feature components
│   └── ...                   # Other component categories
├── hooks/                    # Custom React hooks
│   ├── useAuth.ts            # Authentication hook
│   ├── useRequests.ts        # Service requests hook
│   └── ...                   # Other custom hooks
├── lib/                      # Utility functions and libraries
│   ├── api/                  # API client functions
│   ├── utils/                # Utility functions
│   └── ...                   # Other libraries
├── store/                    # State management
│   ├── context/              # React Context providers
│   ├── queries/              # React Query definitions
│   └── ...                   # Other state management
├── styles/                   # Global styles and Tailwind config
│   ├── globals.css           # Global CSS
│   └── ...                   # Other style files
├── types/                    # TypeScript type definitions
│   ├── api.ts                # API response types
│   ├── models.ts             # Data model types
│   └── ...                   # Other type definitions
└── public/                   # Static assets
    ├── images/               # Image assets
    ├── locales/              # Translation files
    └── ...                   # Other static assets
```

## 2. Component Architecture

### 2.1 Component Hierarchy

```
<RootLayout>
  <AuthProvider>
    <ThemeProvider>
      <QueryClientProvider>
        <Header />
        <main>
          {children} // Page content
        </main>
        <Footer />
        <Toaster /> // Notifications
      </QueryClientProvider>
    </ThemeProvider>
  </AuthProvider>
</RootLayout>
```

### 2.2 Component Design Principles

1. **Atomic Design Methodology**
   - Atoms: Basic UI elements (buttons, inputs, icons)
   - Molecules: Simple component combinations (form fields, search bars)
   - Organisms: Complex UI sections (navigation, request cards)
   - Templates: Page layouts without content
   - Pages: Complete views with real content

2. **Component Composition**
   - Favor composition over inheritance
   - Use higher-order components sparingly
   - Implement render props pattern for flexible components

3. **Styling Approach**
   - Use Tailwind utility classes for most styling
   - Create component-specific styles with Tailwind @apply when needed
   - Maintain consistent spacing and color usage via design tokens

4. **Reusability Guidelines**
   - Components should be self-contained with minimal dependencies
   - Accept configuration via props with sensible defaults
   - Document component APIs with TypeScript and JSDoc comments
   - Create storybook stories for visual testing and documentation

## 3. State Management

### 3.1 State Categories

1. **UI State**
   - Managed with React Context API
   - Examples: theme preferences, sidebar open/closed, modal visibility

2. **Server State**
   - Managed with React Query or SWR
   - Examples: service requests data, user profiles, messages

3. **Form State**
   - Managed with React Hook Form
   - Examples: registration forms, service request creation

4. **Authentication State**
   - Managed with custom AuthContext
   - Examples: user session, permissions, role-based access

### 3.2 State Management Implementation

```typescript
// Example AuthContext
import { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types/models';
import { auth } from '@/lib/api/auth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const checkAuth = async () => {
      try {
        const userData = await auth.getCurrentUser();
        setUser(userData);
      } catch (error) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const userData = await auth.login(email, password);
      setUser(userData);
    } finally {
      setIsLoading(false);
    }
  };

  // Other auth methods...

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

## 4. Routing and Navigation

### 4.1 Next.js App Router Structure

- Utilize Next.js 13+ App Router for file-based routing
- Implement route groups for logical organization
- Use dynamic routes for parameterized pages

### 4.2 Route Protection

```typescript
// Example middleware.ts for route protection
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const isAuthenticated = !!token;
  
  // Protected routes pattern
  const isProtectedRoute = 
    request.nextUrl.pathname.startsWith('/customer/') || 
    request.nextUrl.pathname.startsWith('/provider/') || 
    request.nextUrl.pathname.startsWith('/admin/');
  
  // Admin routes pattern
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin/');
  
  // Check if user is trying to access protected routes without authentication
  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // Check if user is trying to access admin routes without admin role
  if (isAdminRoute && token?.role !== 'admin') {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/customer/:path*',
    '/provider/:path*',
    '/admin/:path*',
  ],
};
```

### 4.3 Navigation Components

- Implement responsive navigation with mobile considerations
- Create role-based navigation menus
- Use Next.js Link component for client-side navigation

## 5. API Integration

### 5.1 API Client Structure

```typescript
// Example API client setup
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Handle token refresh for 401 errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post('/api/auth/refresh', { refreshToken });
        const { token } = response.data;
        
        localStorage.setItem('token', token);
        apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
        
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Redirect to login if refresh fails
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
```

### 5.2 API Hooks with React Query

```typescript
// Example React Query hook for service requests
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ServiceRequest } from '@/types/models';
import apiClient from '@/lib/api/apiClient';

// Fetch service requests
export function useServiceRequests(userId: string) {
  return useQuery({
    queryKey: ['serviceRequests', userId],
    queryFn: async () => {
      const { data } = await apiClient.get<ServiceRequest[]>(`/api/requests/user/${userId}`);
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Create service request
export function useCreateServiceRequest() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newRequest: Omit<ServiceRequest, 'id'>) => {
      const { data } = await apiClient.post<ServiceRequest>('/api/requests', newRequest);
      return data;
    },
    onSuccess: (data, variables, context) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['serviceRequests'] });
    },
  });
}

// Update service request
export function useUpdateServiceRequest() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...request }: ServiceRequest) => {
      const { data } = await apiClient.put<ServiceRequest>(`/api/requests/${id}`, request);
      return data;
    },
    onSuccess: (data) => {
      // Update cache directly
      queryClient.setQueryData(['serviceRequest', data.id], data);
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['serviceRequests'] });
    },
  });
}
```

## 6. Authentication and Authorization

### 6.1 Authentication Flow

1. **User Registration**
   - Form validation with Zod schema
   - Multi-step registration process
   - Email verification

2. **User Login**
   - Email/password authentication
   - Social login options (WeChat, Google)
   - Remember me functionality
   - MFA support

3. **Session Management**
   - JWT token storage in HTTP-only cookies
   - Refresh token rotation
   - Automatic session refresh
   - Secure logout process

### 6.2 Role-Based Access Control

```typescript
// Example RBAC component
import { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';

type RoleType = 'customer' | 'provider' | 'admin';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: RoleType[];
  fallback?: ReactNode;
}

export function RoleGuard({ children, allowedRoles, fallback = null }: RoleGuardProps) {
  const { user } = useAuth();
  
  if (!user || !allowedRoles.includes(user.role as RoleType)) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
}

// Usage example
function AdminSection() {
  return (
    <RoleGuard 
      allowedRoles={['admin']} 
      fallback={<p>You don't have permission to view this content.</p>}
    >
      <div>Admin content here</div>
    </RoleGuard>
  );
}
```

## 7. Form Handling

### 7.1 Form Strategy

- Use React Hook Form for form state management
- Implement Zod for schema validation
- Create reusable form components
- Support multi-step forms for complex workflows

### 7.2 Form Implementation

```typescript
// Example form with React Hook Form and Zod
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/hooks/useAuth';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const { login } = useAuth();
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });
  
  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
      // Redirect or show success message
    } catch (error) {
      // Handle error
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <Input
          id="email"
          type="email"
          {...register('email')}
          error={errors.email?.message}
        />
      </div>
      
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <Input
          id="password"
          type="password"
          {...register('password')}
          error={errors.password?.message}
        />
      </div>
      
      <div className="flex items-center">
        <input
          id="rememberMe"
          type="checkbox"
          {...register('rememberMe')}
          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
        />
        <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
          Remember me
        </label>
      </div>
      
      <Button type="submit" isLoading={isSubmitting} className="w-full">
        Sign in
      </Button>
    </form>
  );
}
```

## 8. Internationalization (i18n)

### 8.1 i18n Implementation

- Use next-i18next for translation management
- Support Chinese (Simplified) and English languages
- Implement language detection and switching
- Handle locale-specific formatting (dates, numbers, currencies)

### 8.2 Translation Structure

```
public/
└── locales/
    ├── en/
    │   ├── common.json
    │   ├── auth.json
    │   ├── customer.json
    │   ├── provider.json
    │   └── ...
    └── zh/
        ├── common.json
        ├── auth.json
        ├── customer.json
        ├── provider.json
        └── ...
```

### 8.3 i18n Usage

```typescript
// Example i18n implementation
import { useTranslation } from 'next-i18next';

function WelcomeMessage() {
  const { t } = useTranslation('common');
  
  return (
    <h1 className="text-2xl font-bold">
      {t('welcome.message', { name: user.name })}
    </h1>
  );
}
```

## 9. UI Components

### 9.1 Core UI Components

1. **Button Component**
   - Variants: primary, secondary, outline, ghost
   - Sizes: sm, md, lg
   - States: default, hover, focus, disabled, loading

2. **Input Component**
   - Types: text, email, password, number
   - States: default, focus, error, disabled
   - Validation integration

3. **Card Component**
   - Variants: default, interactive, bordered
   - Header, body, footer sections
   - Loading state

4. **Modal Component**
   - Sizes: sm, md, lg, full
   - Animation options
   - Focus trap for accessibility

5. **Navigation Components**
   - Header with responsive menu
   - Sidebar navigation
   - Breadcrumbs
   - Tabs

### 9.2 Feature-Specific Components

1. **ServiceRequestCard**
   - Display service request details
   - Status indicators
   - Action buttons based on user role and request status

2. **BidComponent**
   - Display bid information
   - Accept/reject actions for customers
   - Edit/delete actions for service providers

3. **ReviewForm**
   - Star rating input
   - Text feedback
   - Photo upload

4. **MessageThread**
   - Message bubbles with sender indication
   - Timestamp display
   - Read receipts
   - Media preview

## 10. Responsive Design

### 10.1 Breakpoint Strategy

- Use Tailwind's default breakpoints:
  - sm: 640px (mobile landscape)
  - md: 768px (tablets)
  - lg: 1024px (laptops)
  - xl: 1280px (desktops)
  - 2xl: 1536px (large screens)

### 10.2 Mobile-First Approach

- Design for mobile screens first
- Progressively enhance for larger screens
- Use Tailwind's responsive utilities (e.g., `md:flex lg:grid`)

### 10.3 Component Adaptations

- Collapsible navigation on mobile
- Stacked layouts on small screens, grid layouts on larger screens
- Touch-friendly UI elements on mobile
- Different density of information based on screen size

## 11. Performance Optimization

### 11.1 Code Optimization

- Implement code splitting with Next.js dynamic imports
- Use React.memo for expensive components
- Virtualize long lists with react-window or react-virtualized
- Optimize event handlers with debounce/throttle

### 11.2 Asset Optimization

- Use next/image for automatic image optimization
- Implement responsive images with srcset
- Lazy load off-screen images and components
- Optimize fonts with next/font

### 11.3 Rendering Optimization

- Use appropriate Next.js rendering methods:
  - Static Generation (SSG) for static pages
  - Server-Side Rendering (SSR) for dynamic pages
  - Incremental Static Regeneration (ISR) for semi-dynamic pages
  - Client-side fetching for highly dynamic content

## 12. Testing Strategy

### 12.1 Unit Testing

- Test individual components with Jest and React Testing Library
- Focus on component behavior rather than implementation details
- Mock external dependencies and API calls

```typescript
// Example component test
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button component', () => {
  test('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });
  
  test('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
  
  test('displays loading state', () => {
    render(<Button isLoading>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });
});
```

### 12.2 Integration Testing

- Test component interactions and page flows
- Use Cypress for end-to-end testing of critical user journeys
- Test API integrations with MSW (Mock Service Worker)

### 12.3 Visual Testing

- Implement Storybook for component documentation and visual testing
- Use Chromatic or Percy for visual regression testing
- Create stories for all reusable components

## 13. Accessibility (a11y)

### 13.1 Accessibility Standards

- Follow WCAG 2.1 AA guidelines
- Support keyboard navigation
- Implement proper ARIA attributes
- Ensure sufficient color contrast

### 13.2 Implementation Approach

- Use semantic HTML elements
- Implement focus management for modals and dialogs
- Provide text alternatives for non-text content
- Test with screen readers

### 13.3 Testing Tools

- Use axe-core for automated accessibility testing
- Implement regular manual testing with screen readers
- Include accessibility checks in CI/CD pipeline

## 14. Error Handling

### 14.1 Error Boundaries

```typescript
// Example Error Boundary component
import { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to monitoring service
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // Render fallback UI
      return this.props.fallback || (
        <div className="p-4 border border-red-300 bg-red-50 rounded-md">
          <h2 className="text-lg font-medium text-red-800">Something went wrong</h2>
          <p className="mt-1 text-sm text-red-700">
            Please try refreshing the page or contact support if the problem persists.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

### 14.2 API Error Handling

- Implement consistent error response format
- Create reusable error handling hooks
- Display user-friendly error messages
- Log detailed errors for debugging

### 14.3 Form Error Handling

- Display inline validation errors
- Provide clear error messages
- Highlight fields with errors
- Support server-side validation errors

## 15. Build and Deployment

### 15.1 Next.js Build Configuration

```javascript
// next.config.js
const { i18n } = require('./next-i18next.config');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n,
  images: {
    domains: ['s3.amazonaws.com', 'localhost'],
    formats: ['image/webp'],
  },
  experimental: {
    serverActions: true,
    serverComponentsExternalPackages: ['@prisma/client'],
  },
  eslint: {
    dirs: ['app', 'components', 'lib', 'hooks', 'store', 'types'],
  },
  webpack(config) {
    // SVG loader configuration
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
};

module.exports = nextConfig;
```

### 15.2 CI/CD Pipeline

- GitHub Actions or AWS CodePipeline for CI/CD
- Automated testing on pull requests
- Staging deployment for review
- Production deployment with approval step

### 15.3 Environment Configuration

- Use .env files for environment variables
- Implement environment-specific configurations
- Secure handling of sensitive information

## 16. Analytics and Monitoring

### 16.1 User Analytics

- Implement Google Analytics or Plausible for page views
- Track custom events for user interactions
- Monitor conversion funnels
- A/B testing framework

### 16.2 Performance Monitoring

- Use Next.js Analytics for Core Web Vitals
- Implement real user monitoring (RUM)
- Track API response times
- Monitor client-side errors

### 16.3 Error Tracking

- Implement Sentry or LogRocket for error tracking
- Capture and group similar errors
- Track error frequency and impact
- Set up alerts for critical issues

## 17. Security Considerations

### 17.1 Frontend Security Best Practices

- Implement Content Security Policy (CSP)
- Use HttpOnly cookies for authentication tokens
- Sanitize user inputs to prevent XSS
- Implement CSRF protection
- Regular dependency updates

### 17.2 API Security

- Validate all API requests
- Implement rate limiting
- Use HTTPS for all communications
- Apply proper CORS configuration

## 18. Development Workflow

### 18.1 Code Quality Tools

- ESLint for code linting
- Prettier for code formatting
- Husky for pre-commit hooks
- TypeScript for type checking

### 18.2 Documentation

- JSDoc comments for functions and components
- README files for key directories
- Storybook for component documentation
- API documentation with Swagger/OpenAPI

### 18.3 Collaboration

- Pull request templates
- Code review guidelines
- Component development workflow
- Feature flag strategy for in-progress work
