# BudgetGuard - Personal Finance Tracker

A modern, responsive personal finance tracking application built with React, TypeScript, and Tailwind CSS.

## Features

- 📊 **Budget Management**: Set and track monthly budgets across different categories
- 💳 **Transaction Tracking**: Monitor your spending with detailed transaction history
- 🏦 **Bank Integration**: Connect your bank account using Plaid for real-time transaction data
- 📱 **Responsive Design**: Optimized for both desktop and mobile devices
- 🎨 **Modern UI**: Clean, intuitive interface built with shadcn/ui components

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui
- **Banking**: Plaid API integration
- **Icons**: Lucide React
- **Charts**: Recharts

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Plaid API credentials (for bank integration)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd budget-guard-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Configure your Plaid credentials in `.env`:
```env
VITE_PLAID_API_URL=http://localhost:8090
VITE_PLAID_ACCESS_TOKEN=your_access_token
VITE_PLAID_START_DATE=2024-01-01
VITE_PLAID_END_DATE=2024-12-31
```

5. Start the development server:
```bash
npm run dev
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Deployment

Build the application for production:

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment to any static hosting service.

## License

This project is licensed under the MIT License.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Support

For support or questions, please open an issue in the GitHub repository.