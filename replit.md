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
- **2025-11-22**: Four-Part Enhancement Update
  - **PART 1 - Subculturing Filter Bar**:
    - Added Batch Code as third filter field between Crop Name and Media Name
    - Implemented three-field cascading filter: Crop Name → Batch Code → Media Name
    - Updated FilterBar component to support optional third field
    - Enhanced useSearchFilter hook with field3 support and proper cascading reset logic
  - **PART 2 - Inventory Withdraw Form**:
    - Converted Item Name to dropdown (Select) populated from available items
    - Implemented auto-fill for Previous Quantity when item is selected
    - Previous Quantity field now disabled (auto-populated)
    - Current Updated Quantity auto-calculates live based on Previous - Withdraw
    - Fixed handleSaveWithdrawal to correctly persist calculated currentStock
  - **PART 3 - Outdoor Register Table Styling**:
    - Updated DataTable component styling to match Indoor Subculturing Register
    - Applied "border rounded-lg overflow-hidden" with white background and shadow
    - Consistent styling across all Outdoor modules: Primary Hardening, Secondary Hardening, Shifting, Mortality, Fertilization, Holding Area, Batch Timeline, Outdoor Sampling
  - **PART 4 - Tunnel Schematic Redesign**:
    - Enhanced outer container with larger rounded corners (rounded-2xl) and increased padding
    - Redesigned tunnel cards with thicker borders (border-[3px]) and smoother edges (rounded-2xl)
    - Added soft green/red tinted backgrounds (bg-green-50/60, bg-red-50/60)
    - Mortality alert tunnel now displays red background icon with white AlertTriangle
    - Improved tray grid with better spacing (gap-1.5) and hover effects
    - Enhanced legend formatting with top border and improved spacing

- **2025-11-21**: UI Improvements and Terminology Updates
  - **Media Preparation Module**:
    - Verified "Save Changes" buttons are present in both Autoclave and Media Batch edit dialogs
    - Confirmed pre-popup date and media code selection functionality works correctly
  - **Incubation Module**:
    - Renamed "Contamination Record" to "Mortality Record" throughout the module
    - Updated tab name from "Contamination Register" to "Mortality Record"
    - Changed button text from "Record Contamination" to "Record Mortality"
    - Updated table column header from "Type of Contamination" to "Type of Mortality"
    - Updated all dialog titles and labels to use "Mortality" terminology
  - **Subculturing Module**:
    - Renamed "Contamination" column to "Mortality" in table and forms
    - Updated all form labels to use "Mortality" terminology
  - **FilterBar Component**:
    - Fixed Search button alignment and visibility issues
    - Added invisible label to ensure proper vertical alignment with input fields
    - Set explicit button height (h-10) for consistent sizing
    - Search button is now properly visible next to the Crop Name dropdown in all outdoor modules
    - Applied to all outdoor modules: Primary Hardening, Secondary Hardening, Shifting, Fertilization, Holding Area, Outdoor Sampling, and Outdoor Contamination

- **2025-11-21**: Project imported to Replit
  - Successfully imported GitHub repository
  - Installed all Node.js dependencies (206 packages)
  - Configured workflow "Start application" to run `npm run dev` on port 5000
  - Verified Vite configuration is properly set up for Replit environment:
    - Host: 0.0.0.0 (accepts all connections)
    - Port: 5000 (frontend)
    - allowedHosts: true (enables proxy access)
    - HMR configured for WSS on port 443
  - Configured deployment settings for static site hosting (build output to /build directory)
  - Application running successfully and displaying login screen

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
