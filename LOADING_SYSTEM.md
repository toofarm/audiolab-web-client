# Loading System Documentation

This document explains how to use the loading system implemented in the AudioLab application.

## Overview

The loading system provides three levels of loading feedback:

1. **Navigation Loading** - Shows during route transitions
2. **Form Submission Loading** - Shows during server actions
3. **Component Loading** - Shows for individual component operations

## Components

### LoadingProvider
The main context provider that manages global loading state. Wraps the entire application in `layout.tsx`.

### LoadingOverlay
A full-screen overlay that appears during loading states with a spinner and custom message.

### LoadingSpinner
A reusable spinner component with different sizes (sm, md, lg).

### FormWithLoading
A wrapper component that handles form submission loading states automatically.

### NavigationLoading
Shows a small loading indicator during route transitions.

### DeleteTrackButton
A button component with built-in loading state for track deletion.

## Usage Examples

### 1. Using the Loading Context

```tsx
'use client';
import { useLoading } from '@/contexts/LoadingContext';

const MyComponent = () => {
  const { startLoading, stopLoading, isLoading } = useLoading();

  const handleSomeAction = async () => {
    startLoading('Processing your request...');
    try {
      // Do something
      await someAsyncOperation();
    } finally {
      stopLoading();
    }
  };

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      <button onClick={handleSomeAction}>Do Something</button>
    </div>
  );
};
```

### 2. Using FormWithLoading

```tsx
import FormWithLoading from '@/components/FormWithLoading';
import { myServerAction } from '@/app/actions/myAction';

const MyForm = () => {
  return (
    <FormWithLoading
      action={myServerAction}
      loadingMessage="Saving your changes..."
      className="my-form-class"
    >
      <input name="field1" />
      <button type="submit">Save</button>
    </FormWithLoading>
  );
};
```

### 3. Using the Button Component with Loading

```tsx
import Button from '@/components/Button';

const MyButton = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      await someAsyncOperation();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleClick}
      loading={isLoading}
      disabled={isLoading}
    >
      {isLoading ? 'Processing...' : 'Click Me'}
    </Button>
  );
};
```

### 4. Using LoadingSpinner

```tsx
import LoadingSpinner from '@/components/LoadingSpinner';

const MyComponent = () => {
  return (
    <div>
      <LoadingSpinner size="sm" />
      <LoadingSpinner size="md" />
      <LoadingSpinner size="lg" />
    </div>
  );
};
```

## Custom Hook

### useFormLoading

A custom hook that simplifies form loading state management:

```tsx
import { useFormLoading } from '@/hooks/useFormLoading';

const MyForm = () => {
  const { isSubmitting, handleSubmit } = useFormLoading('Processing...');

  const onSubmit = async (formData: FormData) => {
    await handleSubmit(myServerAction, formData, 'Custom loading message...');
  };

  return (
    <form onSubmit={onSubmit}>
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
};
```

## Best Practices

1. **Always provide meaningful loading messages** - Users should know what's happening
2. **Use appropriate loading indicators** - Full overlay for major operations, inline spinners for minor ones
3. **Disable interactive elements during loading** - Prevent multiple submissions
4. **Handle errors gracefully** - Always stop loading state in error cases
5. **Use consistent loading patterns** - Maintain UX consistency across the app

## File Structure

```
src/
├── contexts/
│   └── LoadingContext.tsx          # Main loading context
├── components/
│   ├── LoadingOverlay/
│   │   └── index.tsx               # Full-screen loading overlay
│   ├── LoadingSpinner/
│   │   └── index.tsx               # Reusable spinner component
│   ├── FormWithLoading/
│   │   └── index.tsx               # Form wrapper with loading
│   ├── NavigationLoading/
│   │   └── index.tsx               # Route transition loading
│   ├── DeleteTrackButton/
│   │   └── index.tsx               # Delete button with loading
│   └── Button/
│       └── index.tsx               # Enhanced button with loading
├── hooks/
│   └── useFormLoading.ts           # Custom form loading hook
└── app/
    └── layout.tsx                  # LoadingProvider setup
``` 