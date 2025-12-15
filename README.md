# TaskGrid - Web3 Freelance Marketplace

<div align="center">
  <img src="client/public/logo.svg" width="120" height="120" alt="TaskGrid Logo">
  <h1>TaskGrid</h1>
  <p><strong>A decentralized freelance marketplace with built-in trust, escrow, and proof-of-work NFTs — powered by Polygon & SideShift API</strong></p>
  
  [![Built on Polygon](https://img.shields.io/badge/Built%20on-Polygon-8247E5?style=for-the-badge&logo=polygon&logoColor=white)](https://polygon.technology)
  [![SideShift API](https://img.shields.io/badge/SideShift-API-00D9FF?style=for-the-badge)](https://sideshift.ai)
  [![Smart Contract](https://img.shields.io/badge/Smart%20Contract-Deployed-success?style=for-the-badge&logo=ethereum&logoColor=white)](https://polygonscan.com/address/0xE1517864005fae94974A56BEc337F4aA63f60867)
</div>

## 🌟 What is TaskGrid?

TaskGrid is a revolutionary **Web3 freelance marketplace** that combines the power of blockchain technology with seamless cryptocurrency payments. Built for the **SideShift API Wavehack**, TaskGrid enables:

- **Multi-Coin Payments**: Job posters can pay in ANY cryptocurrency (BTC, ETH, MATIC, USDT, etc.)
- **Automatic Conversion**: All payments are automatically converted to USDC using SideShift API for consistency
- **Trustless Escrow**: Smart contracts on Polygon ensure secure, dispute-free transactions
- **Proof-of-Work NFTs**: Freelancers earn verifiable on-chain credentials for completed work
- **Zero Platform Fees**: Direct peer-to-peer transactions with minimal gas costs
- **AI-Powered Matching**: Intelligent job matching based on skills and work history

## 🚀 Key Features

### 💰 Multi-Coin Payment System (Powered by SideShift API)
- **Pay in Any Coin**: Job posters can choose from 100+ supported cryptocurrencies
- **Automatic Conversion**: All payments converted to USDC via SideShift API
- **Real-Time Quotes**: Live conversion rates displayed during job posting
- **Seamless Experience**: Conversion happens automatically when funding escrow
- **Standalone Converter**: Built-in cryptocurrency converter tool for users

### 🔒 Trust & Security
- **Smart Contract Escrow**: Funds locked on Polygon until work is verified
- **Dispute Resolution**: AI-powered dispute handling with transparent resolution
- **Verified Reputation**: On-chain proof-of-work NFTs for completed jobs
- **No Middlemen**: Direct client-freelancer relationships

### 🎯 User Experience
- **Role-Based Dashboards**: Separate interfaces for freelancers and job posters
- **Real-Time Chat**: Encrypted messaging for project collaboration
- **AI Job Matching**: Intelligent recommendations based on skills and history
- **Portfolio Management**: Showcase work history with verifiable NFTs

## 🧩 The Problem We're Solving

Traditional freelance platforms have several limitations:
- **High Platform Fees**: Up to 20% commission on transactions
- **Limited Payment Options**: Restricted to fiat or single cryptocurrencies
- **Payment Delays**: Withdrawal holds and processing times
- **Lack of Transparency**: Opaque reputation systems
- **Geographic Restrictions**: Limited cross-border payment support
- **Trust Issues**: Disputes and payment conflicts

TaskGrid solves these by leveraging blockchain technology and SideShift API for seamless multi-coin payments.

## 🔄 How SideShift API Integration Works

### For Job Posters:
1. **Post a Job**: Create a job listing with budget and requirements
2. **Choose Payment Currency**: Select from 100+ cryptocurrencies (BTC, ETH, MATIC, USDT, etc.)
3. **See Real-Time Conversion**: View live conversion rate to USDC
4. **Fund Escrow**: Pay in your chosen cryptocurrency
5. **Automatic Conversion**: SideShift API converts payment to USDC automatically
6. **Freelancer Receives USDC**: Consistent payment currency for all freelancers

### For Freelancers:
1. **Browse Jobs**: Find opportunities matching your skills
2. **Apply**: Submit proposals with portfolio and experience
3. **Get Hired**: Receive job assignment
4. **Complete Work**: Deliver quality results
5. **Get Paid in USDC**: Receive payment in stable USDC currency (regardless of what client paid in)
6. **Earn NFT**: Receive proof-of-work NFT for completed job

### Standalone Converter:
- Visit `/converter` to use the built-in cryptocurrency converter
- Get real-time quotes for any coin pair
- Create swaps directly through SideShift API

## 📋 How It Works

1. **Choose Your Role**: Freelancer or Job Poster
2. **Complete Onboarding**:
   - **Freelancer**: Profile, skills, portfolio, wallet connection
   - **Job Poster**: Company info, requirements, wallet connection
3. **Post or Find Jobs**:
   - **Posters**: Create jobs with multi-coin payment options
   - **Freelancers**: Browse and apply to opportunities
4. **Secure Escrow**: Funds locked in smart contract
5. **Work & Collaborate**: Real-time chat and project management
6. **Complete & Get Paid**: Automatic payment release + NFT minting

## 💡 Why It's Useful

- **Zero Platform Fees**: Direct peer-to-peer transactions
- **Multi-Coin Support**: Pay in any cryptocurrency via SideShift API
- **Automatic Conversion**: Seamless conversion to USDC for consistency
- **Near-Instant Payments**: Blockchain-based, no withdrawal delays
- **Transparent Reputation**: On-chain proof-of-work NFTs
- **Secure Escrow**: Smart contracts reduce disputes
- **Borderless**: Work with anyone, anywhere
- **AI-Powered**: Intelligent job matching and dispute resolution

## 🛠️ Tech Stack

- **Frontend**: React + Vite + TypeScript, ShadCN UI, Wouter
- **Backend**: Express + Drizzle ORM
- **Blockchain**: Polygon (PoS)
- **Smart Contracts**: Solidity, Hardhat
- **Payment Integration**: **SideShift API** for multi-coin swaps
- **Database**: PostgreSQL (via Drizzle ORM)
- **AI**: OpenAI integration for job matching and disputes

## 🔧 SideShift API Integration

### Environment Variables

Create a `.env` file in the root directory:

```env
# SideShift API Configuration
SIDESHIFT_SECRET=your_sideshift_secret_key
SIDESHIFT_AFFILIATE_ID=your_affiliate_id

# Database
DATABASE_URL=your_database_url

# Other environment variables...
```

### API Endpoints

- `GET /api/sideshift/coins` - Get available cryptocurrencies
- `GET /api/sideshift/quote` - Get conversion quote
- `POST /api/sideshift/shift` - Create a swap/shift
- `GET /api/sideshift/shift/:id` - Get shift status
- `POST /api/sideshift/convert` - Convert currency to base (USDC)

### How to Get SideShift API Credentials

1. Visit [SideShift.ai](https://sideshift.ai)
2. Create an account
3. Navigate to API settings
4. Generate your secret key (`x-sideshift-secret`)
5. Get your affiliate ID (optional, for referral rewards)

## 🚀 Local Development

### Prerequisites
- Node.js 18+ 
- npm or yarn
- PostgreSQL database (or use provided MongoDB option)

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd TaskGrid-main
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

4. **Set up database**
   ```bash
   npm run db:push
   ```

5. **Run development server**
   ```bash
   npm run dev
   ```

6. **Access the application**
   - Frontend: `http://localhost:5000`
   - API: `http://localhost:5000/api`

## 📦 Deployment

### Smart Contract
```bash
npm run chain:compile
npm run chain:deploy:amoy  # For Polygon Amoy testnet
```

### Application
- Build: `npm run build`
- Start: `npm start`

## 📝 Smart Contract

**TaskGridEscrow** deployed at: `0xE1517864005fae94974A56BEc337F4aA63f60867`

## 🎯 Use Cases

1. **Global Freelance Marketplace**: Connect clients and freelancers worldwide
2. **Multi-Currency Payments**: Accept payments in any cryptocurrency
3. **Portfolio Building**: Build verifiable on-chain work history
4. **Trustless Transactions**: Smart contract escrow eliminates payment disputes
5. **Cryptocurrency Converter**: Standalone tool for coin swaps

## 🤝 Contributing

This project was built for the **SideShift API Wavehack**. Contributions and improvements are welcome!

## 📄 License

MIT

## 🙏 Acknowledgments

- **Polygon** for blockchain infrastructure
- **SideShift.ai** for cryptocurrency swap API
- **ShadCN** for beautiful UI components