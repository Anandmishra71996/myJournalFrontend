# Toast Service Usage Guide

The toast service is globally available throughout the application and provides convenient methods for showing notifications.

## Import

```typescript
// Option 1: Import from utils (recommended)
import { toast } from '@/lib/utils';

// Option 2: Import directly from service
import { toastService } from '@/services/toast.service';
// or
import toastService from '@/services/toast.service';
```

## Basic Usage

### Success Toast
```typescript
import { toast } from '@/lib/utils';

// Simple success message
toast.success('Operation completed successfully!');

// With description
toast.success('File uploaded', 'Your document has been processed');
```

### Error Toast
```typescript
// Simple error message
toast.error('Something went wrong!');

// With description
toast.error('Upload failed', 'Please check your file size and try again');
```

### Warning Toast
```typescript
// Simple warning message
toast.warn('This action cannot be undone');

// With description
toast.warn('Storage limit', 'You are approaching your storage limit');
```

### Info Toast
```typescript
// Simple info message
toast.info('New features available');

// With description
toast.info('Update available', 'Click here to learn more');
```

## Advanced Usage

### Loading Toast
```typescript
// Show loading toast
const loadingToastId = toast.loading('Processing your request...');

// Later dismiss it
toast.dismiss(loadingToastId);
```

### Promise Toast (Auto-updates based on promise state)
```typescript
const uploadPromise = uploadFile(file);

toast.promise(uploadPromise, {
  loading: 'Uploading file...',
  success: 'File uploaded successfully!',
  error: 'Failed to upload file',
});

// With dynamic messages
toast.promise(fetchData(), {
  loading: 'Fetching data...',
  success: (data) => `Loaded ${data.length} items`,
  error: (err) => `Error: ${err.message}`,
});
```

### Dismiss Toasts
```typescript
// Dismiss a specific toast
toast.dismiss(toastId);

// Dismiss all toasts
toast.dismiss();
```

## Real-world Examples

### In API calls
```typescript
import { toast } from '@/lib/utils';
import api from '@/lib/api';

async function handleLogin(email: string, password: string) {
  try {
    const response = await api.post('/auth/login', { email, password });
    toast.success('Welcome back!', 'You have successfully logged in');
    return response.data;
  } catch (error) {
    toast.error('Login failed', 'Please check your credentials');
    throw error;
  }
}
```

### In form submissions
```typescript
async function handleSubmit(formData: FormData) {
  const submitPromise = api.post('/documents', formData);
  
  toast.promise(submitPromise, {
    loading: 'Uploading document...',
    success: 'Document uploaded successfully!',
    error: 'Failed to upload document. Please try again.',
  });
  
  return submitPromise;
}
```

### In async operations
```typescript
async function deleteDocument(id: string) {
  try {
    await api.delete(`/documents/${id}`);
    toast.success('Document deleted', 'The document has been removed');
  } catch (error) {
    toast.error('Delete failed', 'Unable to delete the document');
  }
}
```

## Configuration

The toast notifications are configured in the root layout with:
- Position: top-right
- Rich colors: enabled (provides better visual feedback)

You can customize the appearance by modifying the `Toaster` component in `src/app/layout.tsx`.
