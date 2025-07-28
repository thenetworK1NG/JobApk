# Job Management System PWA

A complete Progressive Web App (PWA) for managing customer job cards with Firebase backend integration.

## Features

### 🏠 Main Dashboard
- Modern, responsive interface
- Quick navigation to Create and View sections
- PWA installation prompt
- Offline support with service worker

### ➕ Create Jobs (`/create/`)
- Customer information form
- Financial tracking (totals, deposits, balance due)
- Job description and requirements
- Multiple service options (stickers, banners, boards, etc.)
- Staff assignment system
- Form save/load functionality
- Firebase integration for data persistence

### 👁️ View Jobs (`/view/`)
- Grid view of all job cards
- Filter by assigned staff member
- Search by customer name
- Job status tracking (completed/in progress)
- Detailed job view modal
- Mark jobs as complete/incomplete
- Delete jobs with confirmation
- Real-time updates from Firebase

## Installation & Setup

### 1. GitHub Deployment
1. Upload all files to your GitHub repository
2. Enable GitHub Pages in repository settings
3. Set source to "Deploy from a branch" and select `main` branch
4. Your app will be available at `https://yourusername.github.io/repository-name/`

### 2. Firebase Configuration
The app is pre-configured with Firebase. If you want to use your own Firebase project:

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Realtime Database
3. Update the Firebase configuration in:
   - `/create/app.js` (lines 5-14)
   - `/view/app.js` (lines 5-14)

### 3. PWA Installation
Users can install the app on their devices:
- **Desktop**: Click the install button in the address bar or use the app's install prompt
- **Mobile**: Use "Add to Home Screen" option in browser menu

## File Structure

```
/
├── index.html              # Main dashboard/landing page
├── manifest.json           # PWA manifest file
├── sw.js                  # Service worker for offline support
├── icon-192.png           # App icon (192x192)
├── icon-512.png           # App icon (512x512)
├── create/                # Job creation module
│   ├── index.html
│   ├── style.css
│   └── app.js
└── view/                  # Job viewing module
    ├── index.html
    ├── style.css
    └── app.js
```

## Key Features

### Progressive Web App
- **Installable**: Can be installed on desktop and mobile devices
- **Offline Support**: Service worker caches essential files
- **Responsive**: Works on all screen sizes
- **App-like Experience**: Fullscreen mode when installed

### Firebase Integration
- **Realtime Database**: All job data stored and synced in real-time
- **No Backend Required**: Serverless architecture
- **Automatic Backups**: Firebase handles data persistence

### Modern UI/UX
- **Glassmorphism Design**: Modern translucent interface
- **Smooth Animations**: Enhanced user interactions
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Mobile-First**: Optimized for mobile devices

## Usage

### Creating Jobs
1. Navigate to "Create New Job"
2. Fill in customer information
3. Add financial details
4. Describe the job requirements
5. Select applicable services/options
6. Assign to a staff member
7. Save to Firebase

### Viewing Jobs
1. Navigate to "View Jobs"
2. Use filters to find specific jobs
3. Click on any job card for detailed view
4. Mark jobs as complete when finished
5. Delete completed or cancelled jobs

### Staff Management
Current staff members:
- Andre
- Francois
- Yolandie
- Neil

To modify staff list, update the select options in:
- `/create/index.html` (lines 127-131)
- `/view/index.html` (lines 31-35)

## Browser Support

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers

## Development

For local development:
1. Clone the repository
2. Serve files using a local web server (due to CORS restrictions with Firebase)
3. For example: `python -m http.server 8000` or use Live Server extension in VS Code

## Security Notes

- Firebase rules should be configured for production use
- Consider implementing authentication for sensitive data
- The current configuration allows read/write access for demonstration purposes

## License

This project is open source and available under the MIT License.

## Support

For issues or questions:
1. Check the browser console for error messages
2. Ensure internet connection for Firebase operations
3. Verify Firebase configuration is correct
4. Test in different browsers if issues persist
