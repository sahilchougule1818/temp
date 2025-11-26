# ERP UI Design for Seema Biotech

## Overview
This ERP UI application for Seema Biotech manages indoor operations (media preparation, subculturing, incubation), outdoor operations (hardening, fertilization, contamination tracking), and sales/inventory. It features role-based access control and comprehensive reporting, aiming to streamline biotech operational workflows.

## User Preferences
- None specified yet

## System Architecture
The application is built with **React 18.3.1** and **TypeScript**, using **Vite 6.4.1** for building. Styling is handled by **Tailwind CSS v4** with **Radix UI** components, **Recharts** for data visualization, **React Hook Form** for form management, and **Lucide React** for icons. State management relies on React's **Context API**.

**Key Features include:**
- **Authentication System**: Role-based access control for owner, indoor-operator, outdoor-operator, and sales-analyst roles.
- **Indoor Operations Management**: Modules for media preparation, subculturing, incubation, and quality control.
- **Outdoor Operations Management**: Functionality for primary/secondary hardening, shifting registers, contamination tracking, fertilization, holding areas, and batch timelines.
- **Sales & Inventory Management**: An inventory dashboard, sales entry, and sales list.
- **Reporting**: A comprehensive system for generating various reports.

**UI/UX Decisions**:
- The UI follows a green theme, aligning with the biotech and agriculture industry.
- Consistent UI patterns are applied across modules, such as a search-gated edit workflow for intentional record selection and date-based filtering.
- Responsive layouts are implemented for components like the tunnel schematic.
- Input fields leverage native date pickers for improved user experience.

**Technical Implementations**:
- Reusable custom hooks (e.g., `useSearchFilter`, `useEditRecordSelector`) are used for managing filter states and date-based record selection logic.
- Error handling is implemented for local storage operations to prevent application crashes.
- TypeScript is extensively used for type safety and code quality, ensuring explicit type annotations throughout the codebase.

## External Dependencies
- **React**: Frontend JavaScript library for building user interfaces.
- **TypeScript**: Superset of JavaScript that adds static typing.
- **Vite**: Next-generation frontend tooling.
- **Tailwind CSS**: A utility-first CSS framework.
- **Radix UI**: Unstyled, accessible UI components.
- **Recharts**: A composable charting library built with React and D3.
- **React Hook Form**: Performant, flexible, and extensible forms with easy-to-use validation.
- **Lucide React**: A collection of beautiful hand-crafted SVG icons.
- **localStorage**: Browser API used for client-side storage of authentication state.