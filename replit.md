# ERP UI Design for Seema Biotech

## Overview
This is a comprehensive ERP (Enterprise Resource Planning) UI application designed for Seema Biotech. The application manages indoor operations (media preparation, subculturing, incubation), outdoor operations (hardening, fertilization, contamination tracking), and sales/inventory management with role-based access control.

## Project Architecture

### Tech Stack
- **Frontend Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite 6.4.1
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI components
- **Charts**: Recharts
- **Form Management**: React Hook Form
- **Icons**: Lucide React
- **State Management**: React Context API

### Project Structure
```
├── src/
│   ├── components/
│   │   ├── Auth/          # Login and signup components
│   │   ├── Dashboard/     # Main dashboard
│   │   ├── Indoor/        # Indoor operations management
│   │   ├── Outdoor/       # Outdoor operations management
│   │   ├── Sales/         # Sales and inventory management
│   │   ├── Reports/       # Reporting functionality
│   │   ├── Layout/        # Header and sidebar components
│   │   └── ui/            # Reusable UI components (Radix-based)
│   ├── contexts/          # React Context providers (AuthContext)
│   ├── styles/            # Global CSS and theme configuration
│   ├── App.tsx            # Main application component
│   └── main.tsx           # Application entry point
├── public/                # Static assets
├── vite.config.ts         # Vite configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Dependencies and scripts
```

### Key Features
1. **Authentication System**: Role-based access control with different user roles (owner, indoor-operator, outdoor-operator, sales-analyst)
2. **Indoor Operations**: Media preparation, subculturing, incubation, and quality control
3. **Outdoor Operations**: Primary/secondary hardening, shifting register, contamination tracking, fertilization, holding area, batch timeline
4. **Sales & Inventory**: Inventory dashboard, sales entry, sales list
5. **Reports**: Comprehensive reporting system

## Replit Configuration

### Development Server
- **Port**: 5000 (configured for Replit)
- **Host**: 0.0.0.0 (accepts all connections)
- **HMR**: WebSocket Secure (WSS) on port 443

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production

## Recent Changes
- **2025-11-18**: Enhanced Edit Workflow Implementation
  - Created reusable custom hook `useEditRecordSelector.ts` for date-based record selection logic
  - Implemented enhanced edit workflow across all indoor modules:
    - **MediaPreparation**: Date → mediaCode dropdown → auto-fill (both Autoclave and Media Batch tabs)
    - **Subculturing**: Date → mediaCode → batchCode cascade with auto-fill
    - **Incubation**: Date → mediaCode → batchNumber cascade (Incubation tab) and date → batchNumber (Contamination tab) with auto-fill
    - **QualityControl**: Date → operator → area cascade (Cleaning tab) and date → machineName (Deep Cleaning tab) with auto-fill
  - All edit dialogs now feature cascading dropdowns that automatically filter options based on selected date/filters
  - Forms auto-populate when a record is selected from the dropdown
  - State resets correctly when date changes or modal closes

- **2025-11-18**: Initial Replit setup
  - Configured Vite for Replit environment (port 5000, host 0.0.0.0, allowedHosts enabled)
  - Added TypeScript configuration files (tsconfig.json, tsconfig.node.json)
  - Set up development workflow
  - Installed all dependencies including Tailwind CSS v4 and @tailwindcss/postcss
  - Fixed React Hooks order issue in App.tsx
  - Configured PostCSS with @tailwindcss/postcss plugin
  - Set up deployment configuration for static hosting
  - Added proper .gitignore for Node.js/React projects

## User Preferences
- None specified yet

## Notes
- The application uses localStorage for authentication state
- Default login credentials are stored in the AuthContext
- The UI follows a green theme (matching biotech/agriculture industry)
