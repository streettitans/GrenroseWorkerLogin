# Grenrose Worker Login

A modern, responsive worker portal for clocking in/out, managing shifts, and tracking work hours.

## Features

- ✨ **Modern UI** - Built with Tailwind CSS and React
- 🔐 **Secure Login** - Worker authentication with JWT tokens
- ⏱️ **Time Tracking** - Easy clock in/out functionality
- 📅 **Shift Management** - View and manage your work schedule
- ⏰ **Timesheets** - Track and review your work hours
- 📊 **Analytics** - View statistics and performance metrics
- 📱 **Responsive Design** - Perfect on all devices
- ⚡ **Fast Performance** - Optimized with Next.js 14
- 🎯 **TypeScript** - Full type safety

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Date Handling**: date-fns
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/streettitans/GrenroseWorkerLogin
cd GrenroseWorkerLogin

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Start development server (runs on port 3001)
npm run dev
```

Visit [http://localhost:3001](http://localhost:3001) in your browser.

## Configuration

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Project Structure

```
src/
├── app/                  # Next.js app directory
│   ├── dashboard/       # Dashboard pages
│   ├── shifts/         # Shift management pages
│   ├── login/          # Login page
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
├── components/          # React components
│   ├── Navbar.tsx      # Navigation component
│   └── ShiftClock.tsx  # Time clock component
├── lib/                # Utility functions
│   └── api.ts          # API client
├── store/              # Zustand stores
│   └── workerStore.ts  # Worker state management
```

## Available Scripts

- `npm run dev` - Start development server (port 3001)
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Check TypeScript types

## Demo Credentials

```
Worker ID: WRK001
Password: password123
```

## API Integration

Ensure your backend API is running on `NEXT_PUBLIC_API_URL`.

### Required Endpoints

- `POST /worker/login` - Worker login
- `GET /worker/me` - Get current worker
- `GET /worker/shifts` - List shifts
- `POST /worker/clock-in` - Clock in
- `POST /worker/clock-out` - Clock out

## Contributing

1. Create a feature branch
2. Commit changes
3. Push to branch
4. Open a Pull Request

## License

Proprietary and confidential.
