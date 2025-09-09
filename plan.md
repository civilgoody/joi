# Joi App Replication Plan

## 📱 App Overview

Replicating the Joi app - a task, meeting, and habit timeline application with a clean onboarding flow and intuitive timeline interface.

## 🎨 Design System

### Color Scheme

- **Primary Background**: Light gray/off-white (`#F8F9FA`)
- **Card Background**: Pure white (`#FFFFFF`)
- **Primary Text**: Near black (`#1A1A1A`)
- **Secondary Text**: Medium gray (`#6B7280`)
- **Accent Orange**: Joi brand color (`#FF6B35` - from logo)
- **Wake-up Color**: Warm yellow/orange (`#FFA726`)
- **Wind-down Color**: Calming blue (`#5C6BC0`)
- **Button Background**: Dark charcoal (`#2D3748`)
- **Button Text**: White (`#FFFFFF`)

### Typography

- **Font Family**: Clean sans-serif (likely Inter or SF Pro)
- **Heading Sizes**:
  - Large titles: `text-4xl font-bold`
  - Step titles: `text-3xl font-bold`
  - Body text: `text-base`
  - Time displays: `text-lg font-medium`

### Spacing & Layout

- **Screen Padding**: `px-6 py-8`
- **Component Spacing**: `space-y-6`
- **Button Radius**: `rounded-xl`
- **Card Radius**: `rounded-lg`

## 📱 Screen Structure

### 1. Welcome Screen (`/`)

- **Layout**: Centered content
- **Components**:
  - Joi logo (centered)
  - Welcome heading
  - Subtitle text
  - "Get started" CTA button
- **Navigation**: Skip button (top-right)

### 2. Onboarding Flow (`/onboarding`)

- **Step 1**: Wake-up & Wind-down times (`/onboarding/step-1`)
- **Step 2**: Missing from screenshots (likely personal info)
- **Step 3**: Notification permissions (`/onboarding/step-3`)
- **Step 4+**: Additional steps leading to timeline

### 3. Timeline/Main App (`/timeline`)

- **Layout**: Daily view with timeline items
- **Components**:
  - Date header with week navigation
  - Timeline items with icons and times
  - Add button (bottom)
  - Navigation controls

## 🧩 Component Architecture

### Core Components

#### 1. Layout Components

```typescript
// components/layout/app-layout.tsx
- Main app container
- Navigation structure
- Screen transitions

// components/layout/onboarding-layout.tsx
- Onboarding-specific layout
- Progress indication
- Back/Skip navigation
```

#### 2. UI Components

```typescript
// components/ui/button.tsx (enhance existing)
- Primary button variant
- Secondary button variant
- Icon button variant

// components/ui/logo.tsx
- Joi logo component
- Responsive sizing

// components/ui/time-picker.tsx
- Time selection input
- 24-hour format
- Touch-friendly

// components/ui/timeline-item.tsx
- Individual timeline entry
- Icon + text + time
- Completion state
```

#### 3. Feature Components

```typescript
// components/onboarding/welcome-screen.tsx
// components/onboarding/time-setup.tsx
// components/onboarding/notification-permission.tsx
// components/timeline/daily-view.tsx
// components/timeline/timeline-header.tsx
```

## 📁 File Structure

```
src/
├── app/
│   ├── page.tsx                    # Welcome screen
│   ├── onboarding/
│   │   ├── page.tsx               # Onboarding router
│   │   ├── step-1/page.tsx        # Time setup
│   │   ├── step-2/page.tsx        # TBD
│   │   └── step-3/page.tsx        # Notifications
│   ├── timeline/
│   │   └── page.tsx               # Main timeline
│   └── globals.css
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── logo.tsx
│   │   ├── time-picker.tsx
│   │   └── timeline-item.tsx
│   ├── layout/
│   │   ├── app-layout.tsx
│   │   └── onboarding-layout.tsx
│   ├── onboarding/
│   │   ├── welcome-screen.tsx
│   │   ├── time-setup.tsx
│   │   └── notification-permission.tsx
│   └── timeline/
│       ├── daily-view.tsx
│       └── timeline-header.tsx
├── lib/
│   ├── utils.ts                   # Existing utilities
│   ├── constants.ts               # App constants
│   └── types.ts                   # TypeScript types
└── hooks/
    ├── use-onboarding.ts          # Onboarding state
    └── use-timeline.ts            # Timeline data
```

## 🔧 Implementation Steps

### Phase 1: Foundation (1-2 hours)

1. **Update color system** in `globals.css`
   - Add Joi brand colors
   - Update CSS variables for wake-up/wind-down
2. **Create base components**

   - Enhanced Button component
   - Logo component with external image
   - Layout components

3. **Set up routing structure**
   - Welcome page
   - Onboarding flow pages
   - Timeline page

### Phase 2: Welcome & Onboarding (2-3 hours)

1. **Welcome Screen**

   - Logo integration
   - Typography styling
   - Navigation setup

2. **Time Setup (Step 1)**

   - Time picker component
   - Form state management
   - Validation

3. **Notification Permission (Step 3)**
   - Permission request handling
   - OS-specific messaging

### Phase 3: Timeline Interface (2-3 hours)

1. **Timeline Components**

   - Date header with navigation
   - Timeline item rendering
   - Item interaction states

2. **Data Management**
   - Mock timeline data
   - State management for timeline
   - CRUD operations for items

### Phase 4: Polish & Transitions (1-2 hours)

1. **Animations**

   - Page transitions
   - Button interactions
   - Timeline item animations

2. **Responsive Design**
   - Mobile-first approach
   - Touch interactions
   - Screen size adaptations

## 📊 Data Models

### User Preferences

```typescript
interface UserPreferences {
  wakeUpTime: string; // "09:00"
  windDownTime: string; // "22:00"
  notificationsEnabled: boolean;
  onboardingCompleted: boolean;
}
```

### Timeline Item

```typescript
interface TimelineItem {
  id: string;
  title: string;
  icon: string; // Icon identifier
  time?: string; // Optional time
  completed: boolean;
  type: "habit" | "task" | "meeting" | "system";
  color?: string; // Custom color
}
```

### Daily Timeline

```typescript
interface DailyTimeline {
  date: string; // "2025-07-19"
  items: TimelineItem[];
}
```

## 🎯 Key Features to Implement

### Core Functionality

- [x] Multi-step onboarding flow
- [x] Time picker for wake/wind-down
- [x] Notification permission handling
- [x] Daily timeline view
- [x] Timeline item management

### Enhanced Features (Future)

- [ ] Habit tracking
- [ ] Meeting integration
- [ ] Task scheduling
- [ ] Progress analytics
- [ ] Custom themes

## 🛠 Technical Considerations

### State Management

- Use React's built-in state for simple cases
- Consider useContext for complex state (timeline data)
- Local storage for user preferences

### Performance

- Lazy load onboarding steps
- Optimize timeline rendering for large datasets
- Image optimization for logos/icons

### Accessibility

- Proper ARIA labels
- Keyboard navigation
- Color contrast compliance
- Screen reader support

### Mobile Optimization

- Touch-friendly hit areas
- Responsive typography
- Smooth animations (60fps)
- Native-like interactions

## 📝 Notes

- Logo URL: https://framerusercontent.com/images/zlVHP5P0VRPQ2PgMh6MdbH1CKpk.png
- Follow user's coding preferences (kebab-case, no switch statements)
- Prioritize simplicity and DRY principles
- Focus on mobile-first responsive design
