# Tennis Racket String Service

A Next.js application for ordering tennis racket stringing services with product selection, location and timeslot booking, phone authentication, and payment processing.

## Features

- **Product Catalog**: Browse and select from multiple tennis string types
- **Order Flow**: Multi-step order process with product, location, and timeslot selection
- **Phone Authentication**: OTP-based phone number verification (simulated)
- **Payment Processing**: Simulated payment redirect and callback handling
- **Responsive Design**: Modern UI built with shadcn/ui and Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
/app
  /order          - Multi-step order form
  /payment        - Payment processing pages
  /payment/callback - Payment callback handler
/components
  /ui             - shadcn/ui base components
  ProductCard.tsx - Product display component
  OrderStepper.tsx - Order progress stepper
  LocationPicker.tsx - Location selection
  TimeslotPicker.tsx - Date/time selection
  OTPInput.tsx    - Phone/OTP authentication
/lib
  /data           - Mock data (products, locations, timeslots)
  /types          - TypeScript type definitions
  /store          - Order state management (localStorage)
```

## Usage

1. Browse products on the home page
2. Click "Select" on a product to start an order
3. Follow the multi-step order process:
   - Select product (if not already selected)
   - Choose pickup location
   - Select delivery date and time
   - Enter phone number and verify OTP (use code: 123456)
   - Review order summary
   - Proceed to payment
4. Payment will be simulated (80% success rate)
5. View order confirmation or retry on failure

## Technologies

- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- React Hook Form
- date-fns
- localStorage for state persistence

## Notes

- OTP verification uses a fixed code: `123456`
- Payment processing is simulated with a 3-second delay
- All data is stored in browser localStorage (frontend only)
- No backend API required for this implementation
