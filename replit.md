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
- **2025-11-24**: Dashboard UX Improvements and Search-Gated Edit Workflow
  - **Indoor Dashboard Enhancements**:
    - Removed date display (from/till) that appeared below the heading
    - Removed monthly/weekly report toggle buttons
    - Added "Report Range" button that opens a dialog with date selectors
    - Dialog contains From Date and Till Date inputs with a "View Report" button
    - Dashboard data now filters based on the selected date range
  - **Header Simplification**:
    - Removed search panel from the top of all modules for cleaner interface
  - **Inventory & Supplier - Search-Gated Edit Workflow**:
    - Implemented date → item → Search button flow for Purchase Register (SupplierDetail)
    - Implemented date → item → Search button flow for Inventory Record withdrawal edit
    - Form fields remain disabled until Search button is clicked and a record is found
    - Save Changes and Delete buttons only become active after successful search
    - This ensures intentional, explicit record selection before editing

- **2025-11-24**: Edit Dialog UX Enhancement and Table Spacing Fix
  - **Media Preparation Module**:
    - Implemented Search button pattern in edit dialogs for both Autoclave Cycle and Media Batch registers
    - Changed workflow: users now select date and media code, click Search to load data, then see Save Changes/Delete buttons
    - Initial state shows only Search and Cancel buttons; Save Changes and Delete buttons appear only after clicking Search
  - **Outdoor Modules - Date Selector Implementation**:
    - Updated all Outdoor modules (SecondaryHardening, Shifting, Fertilization, HoldingArea, OutdoorSampling, OutdoorContamination) to use `<Input type="date">` instead of date dropdown selectors
    - Provides better user experience with native date picker across different browsers and devices
  - **Outdoor Modules - Search Button Pattern**:
    - Implemented consistent Search button functionality across all Outdoor modules
    - Removed auto-loading behavior when batch/media code is selected
    - Users must explicitly click Search button to load record data
    - Save Changes and Delete buttons only appear after successful search
  - **Inventory Record Table Improvements**:
    - Fixed purchase/withdrawal register table column spacing to be symmetric and evenly distributed
    - Applied `table-fixed` layout for consistent column widths (each column set to w-1/6 for 6 equal columns)
    - Increased horizontal padding from px-4 to px-6 for better visual spacing
    - Center-aligned numeric columns (quantities, dates) for better readability
    - Kept Item Name column left-aligned as it contains text data

- **2025-11-22**: Seven-Part UI Enhancement Update (Session 2)
  - **PART 5 - Subculturing Filter Simplification**:
    - Removed Media Name dropdown from Subculturing filter bar
    - Simplified to 2-field cascading filter: Crop Name → Batch Code only
    - Updated FilterBar and useSearchFilter to support 2-field configuration
  - **PART 1 - Tunnel Schematic Responsive Layout**:
    - Fixed overlapping tunnel cards on smaller screens
    - Implemented responsive grid: 1 column (mobile), 2 columns (tablet md:), 4 columns (desktop lg:)
    - Standardized tunnel card sizing across all breakpoints
  - **PART 2 - Supplier Detail Table Font Consistency**:
    - Updated table header fonts to match Outdoor register tables (text-sm)
    - Removed uppercase and letter-spacing from custom table headers
    - Applied consistent styling across supplier detail registers
  - **PART 3 - Inventory Record Tab Restructure**:
    - Removed "Edit Record" button from CardHeader (top right corner)
    - Created tab navigation system with "Edit" tab appearing before "Add Data" tab
    - Moved Edit functionality to dedicated Edit tab with "Edit Register" button
    - Moved Add Data functionality to dedicated Add Data tab
    - Fixed activeTab state and handleEditRegister to work with new tab values
  - **PART 4 - Inventory Withdraw Register Column Addition**:
    - Added "Quantity When Purchased" column as second column in withdrawal tables
    - Calculated as previousStock + withdrawQuantity
    - Applied to both Edit and Add Data tab tables
  - **PART 6 - Batch Timeline Layout Fix**:
    - Fixed button overflow on smaller screens
    - Changed button container from flex-shrink-0 to flex-wrap for responsive wrapping
    - Reduced spacing gaps from 6 to 4 for tighter, more compact layout
    - Reduced min-width from 240px to 200px and padding from pl-6 to pl-4
  - **PART 7 - Batch Timeline Current Status**:
    - Verified Current Status label and Badge rendering correctly in header
    - Current Status displays with green badge showing "In Holding Area"

- **2025-11-22**: Four-Part Enhancement Update (Session 1)
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
