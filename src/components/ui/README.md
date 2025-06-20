# UI Components

## Toast System

The toast system provides a simple way to show notifications throughout the application.

### Setup

The `ToastProvider` is already added to the main `App.tsx` component, so you can use the `useToast` hook in any component.

### Usage

```tsx
import { useToast } from '../../components/ui/toast'

export default function MyComponent() {
  const { toast } = useToast()

  const handleSuccess = () => {
    toast({
      title: 'Success!',
      description: 'Operation completed successfully.',
      type: 'success',
      duration: 5000 // optional, defaults to 5000ms
    })
  }

  const handleError = () => {
    toast({
      title: 'Error!',
      description: 'Something went wrong.',
      type: 'error'
    })
  }

  const handleInfo = () => {
    toast({
      title: 'Info',
      description: 'Here is some information.',
      type: 'info'
    })
  }

  const handleWarning = () => {
    toast({
      title: 'Warning',
      description: 'Please be careful.',
      type: 'warning'
    })
  }

  return (
    <div>
      <button onClick={handleSuccess}>Show Success Toast</button>
      <button onClick={handleError}>Show Error Toast</button>
      <button onClick={handleInfo}>Show Info Toast</button>
      <button onClick={handleWarning}>Show Warning Toast</button>
    </div>
  )
}
```

### Toast Types

- `success` - Green toast with checkmark icon
- `error` - Red toast with alert icon  
- `warning` - Yellow toast with warning icon
- `info` - Blue toast with info icon

### Toast Options

- `title` (required) - The main message
- `description` (optional) - Additional details
- `type` (optional) - Toast type, defaults to 'info'
- `duration` (optional) - Auto-dismiss time in milliseconds, defaults to 5000ms

### Features

- Auto-dismiss after specified duration
- Manual dismiss with X button
- Slide-in animation from right
- Responsive design
- Multiple toasts can be shown simultaneously
- Context-based, no external dependencies 