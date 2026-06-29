# Class Creation Components

This folder contains the enhanced class creation components for the school admin system.

## Components

### CreateClassDialog
A dialog component that wraps the class creation form with proper state management and success handling.

**Features:**
- Opens/closes dialog state
- Handles form submission
- Shows loading states
- Triggers success callbacks

### CreateClassForm
An enhanced form component for creating classes with sections and teacher assignments.

**Features:**
- Class name input
- Dynamic section management (A-Z dropdown)
- Teacher assignment for each section
- Form validation with Zod
- Real-time section availability checking
- Visual feedback for assigned teachers

## Usage

```tsx
import { CreateClassDialog } from './components'

// Basic usage
<CreateClassDialog onSuccess={() => console.log('Class created!')} />

// Custom trigger
<CreateClassDialog onSuccess={handleSuccess}>
  <Button>Create New Class</Button>
</CreateClassDialog>
```

## Data Structure

The form creates classes with the following structure:

```typescript
type CreateClassData = {
  name: string
  sections: Array<{
    name: string // A, B, C, etc.
    teacherId?: string // Optional teacher assignment
  }>
}
```

## Features

- **Section Management**: Automatically suggests next available section (A-Z)
- **Teacher Assignment**: Dropdown with all available teachers
- **Validation**: Ensures no duplicate sections and required fields
- **Visual Feedback**: Shows assigned teachers and section summary
- **Responsive Design**: Works on mobile and desktop

## Dependencies

- React Hook Form for form management
- Zod for validation
- Radix UI components for UI elements
- Lucide React for icons
- Sonner for toast notifications
