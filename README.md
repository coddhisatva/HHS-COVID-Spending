(I ran into some issues here, so I'm going to restart on a fresh repo here, but I'll keep this here for now)

I wanted to dive into the federal account data from usaspending.gov, so I started with HHS Covid-related Allocation and De-allocation in 2025 (most recent period available).

site: https://vercel.com/conor-egans-projects/hhs-covid-spending/deployments

Website to access this data: https://www.usaspending.gov/download_center/custom_account_data

Upon reaching the website, there are many parameters to select, to filter the data you receive. Below are the parameters I selected for this initial project (and why), for purposes of insight and replication:

| PARAMETER | SELECTED | REASONING |
Budget Function | All | To capture everything
Agency | Department of Health and Human Services | Covid related spending would fall in this domain, and the HHS is of interest to me
Federal Account | All | To capture everything
Account level | Federal Account | To maximize data by including aggregate of treasury accounts
File Type | Account Breakdown by Reward | I initially ran a download for all 3 options here, but Account Breakdown by Reward provides the most detailed insights, which separate into 3 further categories -- contract, financial assistance, and unlinked -- the first two of which I've captured to start out with

Data is provided in csv files, which I've added to this repo.

# HHS COVID Spending Dashboard

This project provides a comprehensive visualization dashboard for Department of Health and Human Services (HHS) funding data, with a unified view of both contracts and financial assistance, focusing on emergency funding acts and geographic distribution.

## Features

- **Financial Categorization**:
  - Toggle between "Allocations" (money out), "Deallocations" (money back), and "All"
  - Filter by "All Financial Activity", "Commitments Only", or "Payments Only"
  - Visual distinction between categories using consistent color schemes

- **Data Selection**:
  - Toggle between contracts data, financial assistance data, or combined view
  - Filter by emergency funding act (CARES Act, American Rescue Plan, etc.)
  - Filter by recipients and programs

- **Visualizations**:
  - Pie chart showing distribution by emergency funding act
  - Bar charts for top recipients and programs
  - Interactive charts with cross-filtering capability

- **Summary Metrics**:
  - Key financial figures with visual indicators
  - Dynamic updates based on applied filters

## Tech Stack

- **Frontend**: Next.js with App Router
- **Styling**: Tailwind CSS
- **State Management**: React Context
- **Data Visualization**: Recharts
- **Data Handling**: TypeScript for type safety

## Getting Started

### Prerequisites

- Node.js (version 18 or later)
- npm or yarn

### Installation

1. Clone the repository
   ```
   git clone https://github.com/your-username/hhs-covid-spending.git
   cd hhs-covid-spending
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Start the development server
   ```
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
src/
├── app/                  # Next.js App Router
├── components/           # React components
│   ├── charts/           # Data visualization components
│   ├── dashboard/        # Dashboard UI components
│   └── filters/          # Filter components
├── context/              # React Context for state management
├── data/                 # Sample data and data processing
├── types/                # TypeScript type definitions
└── utils/                # Utility functions
```

## Usage

1. **View Summary Metrics**: The dashboard displays key metrics at the top showing total allocations, deallocations, and outlays.

2. **Apply Filters**: Use the sidebar to filter data by:
   - Financial activity type (allocations/deallocations)
   - Transaction type (commitments/payments)
   - Data source (contracts/financial assistance)
   - Emergency funding act

3. **Explore Visualizations**: 
   - Click on segments in the pie chart to filter by emergency funding act
   - Use the bar charts to see top recipients and programs
   - Toggle between allocations and deallocations in bar charts

4. **Reset Filters**: Use the "Reset All Filters" button to clear all applied filters