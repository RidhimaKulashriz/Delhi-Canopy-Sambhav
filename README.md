#  DelhiCanopy  
### AI Command Center for Urban Green Intelligence

DelhiCanopy is an AI-powered urban climate intelligence platform designed to help governments, planners, and environmental agencies **monitor, analyze, and optimize urban green infrastructure** using geospatial data, machine learning, and predictive analytics.

The system transforms fragmented environmental data into **actionable insights** for tackling heat stress, air pollution, and green cover loss in dense cities like Delhi.

![Satellite Data](https://img.shields.io/badge/Satellite-Imagery-0ea5e9?style=for-the-badge)
![Computer Vision](https://img.shields.io/badge/Computer-Vision-red?style=for-the-badge)
![Predictive Analytics](https://img.shields.io/badge/Predictive-Analytics-blueviolet?style=for-the-badge)
![Machine Learning](https://img.shields.io/badge/Machine-Learning-orange?style=for-the-badge)
![GIS](https://img.shields.io/badge/GIS-Enabled-success?style=for-the-badge)
![Decision Intelligence](https://img.shields.io/badge/Decision-Intelligence-purple?style=for-the-badge)

---

##  Problem Statement

Urban cities such as Delhi face:

- Extreme **heat waves and urban heat islands**
- Rapid **loss of green cover due to construction**
- **Uneven plantation efforts** with little data-backed planning
- Fragmented monitoring systems with **no predictive intelligence**

Despite large-scale plantation drives, there is **no centralized, AI-driven system** that answers:

- Where should trees be planted first?
- Which areas face the highest heat risk?
- Where is illegal tree loss happening?
- What is the real impact of green cover on urban heat?

DelhiCanopy addresses this gap by treating **urban greening as a data and intelligence problem**, not just a policy action.

---

## 💡 Solution Overview

DelhiCanopy functions as a **Geo-Spatial AI Command Center** that:

- Monitors green cover density using satellite imagery
- Maps urban heat stress across wards
- Detects vegetation loss and deforestation risks
- Generates AI-driven plantation strategies
- Provides a visual, map-based decision dashboard

The platform is designed for **government-scale deployment**, while remaining explainable and auditable.

---

##  Core Features

###  Green Cover Intelligence
- Ward-level vegetation density analysis
- NDVI-based green health scoring
- Temporal change detection

###  Urban Heat Stress Mapping
- Land Surface Temperature (LST) analysis
- Identification of Urban Heat Islands (UHI)
- Heat-risk zoning

###  Tree Loss & Risk Detection
- Change detection across time-series satellite data
- Identification of rapid vegetation loss
- Risk zone classification

###  AI-Powered Decision Support
- Priority scoring for plantation zones
- Estimated heat reduction impact
- Actionable recommendations for planners

### Interactive Command Dashboard
- Map-based visualization
- Layer toggles (green cover, heat, risk)
- Policy-ready insights

---

##  Role of AI & ML

DelhiCanopy uses AI to handle the **complex, multi-variable nature of urban climate systems**, which are impossible to manage manually at city scale.

### AI Techniques Used
- **Computer Vision** for satellite image analysis
- **NDVI / EVI computation** for vegetation health
- **Predictive modeling** for heat stress estimation
- **Change detection models** for tree loss alerts
- **LLM-assisted planning agents** for recommendation generation

### Agentic Workflow (Planned)
- Vision Agent → Detects vegetation change
- Correlation Agent → Links green loss with heat rise
- Strategy Agent → Generates plantation plans

This agent-based approach ensures decisions are **traceable, explainable, and auditable**.

---


##  System Architecture 

```text
Satellite & Climate Data
        ↓
 Spatio-Temporal Processing
        ↓
     AI Agent Pipeline
        ↓
 Decision Intelligence Engine
        ↓
 Interactive Smart City Dashboard

```
 
---


##  Current Project Status

###  Implemented (MVP)
- Fully functional frontend dashboard
- Interactive map-based UI
- Climate intelligence visualization
- Modular architecture ready for backend integration

###  In Progress / Planned
- Real satellite data ingestion
- NDVI & heat model inference
- Backend APIs (FastAPI)
- AI agent orchestration
- Automated reports & alerts
- User roles (Govt / NGO / Public)

> **Note:** The current version is a working prototype demonstrating system design, workflow, and UI. AI outputs are partially simulated for MVP demonstration.

---

##  Tech Stack

### Frontend
- Next.js
- Interactive Maps
- Data Visualization (charts & overlays)

### Backend (Planned)
- FastAPI / Django Ninja
- PostgreSQL + PostGIS
- Redis (caching)
- Background workers (Celery / Cloud Tasks)

### AI / ML
- Python
- Computer Vision (satellite imagery)
- Geospatial analysis
- Predictive modeling
- LLM-assisted planning agents

### Deployment
- Cloud-native (Serverless-ready)
- Scalable to city and state level

---

##  Installation & Local Development

### Prerequisites

Ensure your development environment meets the following requirements:

- **Node.js**: Version 18.x or 20.x (recommended)
- **npm**: Version 9.x or later
- **Git**: For version control
- **Supabase Account**: For backend services (optional for frontend-only development)

### Quick Start

1. **Clone the Repository**
   ```bash
   git clone https://github.com/hitakshijoshi20072911/Delhi-Canopy-Sambhav.git
   cd Delhi-Canopy-Sambhav
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   
   Create a `.env` file in the project root:
   ```env
   # Supabase Configuration (required for full functionality)
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   
   # Optional: API Endpoints
   VITE_API_BASE_URL=http://localhost:3001
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

### Build & Production Deployment

#### Local Production Build

1. **Build for Production**
   ```bash
   npm run build
   ```

2. **Preview Production Build**
   ```bash
   npm run preview
   ```

   The production build will be served at `http://localhost:4173`

#### Vercel Deployment

1. **Connect Repository**
   - Sign in to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New..." → "Project"
   - Import the `Delhi-Canopy-Sambhav` repository

2. **Configure Build Settings**
   ```
   Framework Preset: Vite
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   Node.js Version: 18.x or 20.x
   ```

3. **Environment Variables**
   Add the same environment variables from your `.env` file to Vercel's environment settings.

4. **Deploy**
   Click "Deploy" to initiate the build and deployment process.

#### Alternative Deployment Options

**Netlify:**
```bash
# Build command
npm run build

# Publish directory
dist
```

**Docker Deployment:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 4173
CMD ["npm", "run", "preview"]
```

### Development Workflow

#### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run build:dev` - Build in development mode
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality checks
- `npm run test` - Run test suite
- `npm run test:watch` - Run tests in watch mode

#### Code Quality

The project includes comprehensive linting and testing configurations:

```bash
# Lint all files
npm run lint

# Run tests
npm run test

# Watch mode for development
npm run test:watch
```

### Project Structure

```
Delhi-Canopy-Sambhav/
├── public/                 # Static assets
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── ui/           # Base UI components (shadcn/ui)
│   │   ├── charts/       # Data visualization components
│   │   ├── dashboard/    # Dashboard-specific components
│   │   └── map/          # Map-related components
│   ├── pages/            # Route components
│   ├── hooks/            # Custom React hooks
│   ├── services/         # API service layers
│   ├── integrations/     # External service integrations
│   ├── data/            # Mock data and constants
│   └── lib/             # Utility functions
├── supabase/            # Supabase configuration and functions
└── dist/               # Production build output
```

### Troubleshooting

#### Common Issues

1. **Build Failures**
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Environment Variable Issues**
   - Ensure all required variables are set in `.env`
   - Restart development server after environment changes

3. **Supabase Connection Errors**
   - Verify Supabase URL and keys are correct
   - Check Supabase project status and network connectivity

#### Performance Optimization

- Use `npm run build:dev` for faster development builds
- Enable source maps in development for debugging
- Monitor bundle size with build output warnings

### Contributing Guidelines

1. **Branch Strategy**
   - `main` - Production-ready code
   - `develop` - Integration branch
   - `feature/*` - Feature-specific branches

2. **Code Standards**
   - Follow ESLint configuration
   - Use TypeScript for type safety
   - Write tests for new features

3. **Commit Convention**
   ```
   feat: Add new feature
   fix: Bug fix
   docs: Documentation update
   refactor: Code refactoring
   test: Test additions/modifications
   ```

---

##  Impact & Use Cases

### For Government & Planners
- Data-backed plantation planning
- Heat-risk mitigation strategies
- Optimized allocation of resources

### For Cities
- Reduced heat stress
- Improved air quality
- Climate-resilient urban design

### System-Level Impact
Moves urban governance from:
> **Reactive environmental response → Predictive climate intelligence**

---

##  Future Scope

- IoT-based air quality sensors
- Drone-based green cover mapping
- Citizen participation apps
- Carbon credit estimation
- Climate resilience simulations

---

##  Disclaimer

DelhiCanopy is developed as part of an innovation and hackathon initiative.  
Data sources and AI models may use simulated datasets in early stages and are designed to be replaceable with real-world integrations.

---

## 🌱 Vision

DelhiCanopy aims to become the **digital nervous system for urban green governance**, enabling smarter, cooler, and more livable cities through AI-driven environmental intelligence.

---

