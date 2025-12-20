# Calance Edge

A unified web application that consolidates sales enablement tools for Calance leadership. This AI-powered platform transforms manual sales artifact creation into an efficient, automated workflow.

## 🚀 Features

### Core Modules
- **Case Study Edge**: Transform client stories into professional case studies with AI
- **Presentation Edge**: Build compelling sales presentations automatically
- **Recruiting Toolkit**: Generate staffing artifacts with AI assistance

### Key Capabilities
- Zero-training interface designed for sales leadership
- Consistent Input → Generate → Preview → Refine → Export workflow
- Multi-format export (PDF, HTML, sharing links)
- Real-time AI-powered content generation
- Professional, brand-compliant output

## 🏗️ Architecture

### Frontend (React + Vite)
- **Tech Stack**: React 18, Vite, Tailwind CSS, Lucide Icons
- **Location**: `./frontend/`
- **Dev Server**: http://localhost:5173

### Backend (Flask + Python)
- **Tech Stack**: Flask 3.0, Python 3.11, OpenRouter AI API
- **Location**: `./backend/`
- **Dev Server**: http://localhost:5000

### Deployment
- **Containerization**: Docker with docker-compose
- **Production Ready**: Nginx reverse proxy, Gunicorn WSGI server

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+
- Python 3.11+
- Docker & Docker Compose
- OpenRouter API key

### Quick Start

1. **Clone and Navigate**
   ```bash
   cd D:\Calance_Apps\Calance_Edge
   ```

2. **Environment Configuration**
   ```bash
   # Backend environment
   cd backend
   cp .env.example .env
   # Edit .env with your OpenRouter API key
   ```

3. **Install Dependencies**
   ```bash
   # Frontend dependencies
   cd frontend
   npm install

   # Backend dependencies
   cd ../backend
   pip install -r requirements.txt
   ```

4. **Start Development Servers**

   **Option A: Manual (Recommended for development)**
   ```bash
   # Terminal 1 - Frontend
   cd frontend
   npm run dev

   # Terminal 2 - Backend
   cd backend
   python app.py
   ```

   **Option B: Docker (Recommended for production/testing)**
   ```bash
   # From project root
   docker-compose up --build
   ```

### Access Points
- **Frontend**: http://localhost:5173 (manual) or http://localhost:3000 (Docker)
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

## 📁 Project Structure

```
Calance_Edge/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── App.jsx          # Main application component
│   │   ├── App.css          # Tailwind CSS + custom styles
│   │   └── ...             # React components
│   ├── public/              # Static assets
│   ├── Dockerfile          # Frontend container config
│   ├── nginx.conf          # Nginx configuration
│   ├── tailwind.config.js  # Tailwind CSS config
│   └── package.json        # Node.js dependencies
├── backend/                 # Flask backend application
│   ├── app.py             # Main Flask application
│   ├── requirements.txt   # Python dependencies
│   ├── .env.example      # Environment variables template
│   └── Dockerfile        # Backend container config
├── docs/                   # Project documentation
│   ├── analysis/          # Product brief and analysis
│   ├── sprint-artifacts/  # Epics, stories, sprint plans
│   └── ...               # Additional documentation
├── docker-compose.yml     # Multi-container orchestration
└── README.md             # This file
```

## 🔧 Configuration

### Environment Variables

**Backend (.env)**
- `OPENROUTER_API_KEY`: Your OpenRouter API key (required)
- `FLASK_DEBUG`: Enable Flask debugging (default: False)
- `PORT`: Backend server port (default: 5000)

**Frontend**
- `VITE_API_URL`: Backend API URL (default: http://localhost:5000/api)

## 📊 Development Workflow

This project follows the **BMad Method** workflow:

1. **Discovery**: Product brief and market analysis ✅
2. **Planning**: Requirements, architecture, and user stories ✅
3. **Solutioning**: Technical design and implementation planning ✅
4. **Implementation**: Agile development with 5-day MVP sprint 🚧

### Current Status
- ✅ Product requirements and technical specifications complete
- ✅ UI/UX mockups and user flows finalized
- ✅ React frontend structure implemented with Tailwind CSS
- ✅ Flask backend structure implemented with API endpoints
- ✅ Docker containerization configured
- ✅ Full-stack servers running (Frontend: localhost:5173, Backend: localhost:5000)
- ✅ API endpoints tested and functional
- ✅ Case Study generation endpoint working
- 🚧 Frontend-backend integration in progress
- 🚧 OpenRouter AI integration structure ready

## 🎯 Implementation Status - COMPLETE ✅

### 5-Day Sprint Achievement (Dec 3-19, 2025)
- ✅ **Day 1**: Frontend structure + backend setup + API testing
- ✅ **Day 2**: Case Study Edge full integration + real-time preview
- ✅ **Day 3**: Presentation Edge implementation
- ✅ **Day 4**: Recruiting Toolkit implementation
- ✅ **Day 5**: Integration, testing, and deployment

### Key Enhancements Beyond MVP
- ✅ **Advanced AI Architecture**: Two-step processing with model specialization
- ✅ **Unified Output Approach**: Single-page infographic generation
- ✅ **Model Upgrades**: Latest generation AI models (Claude 4.5, Gemini 3 Pro)
- ✅ **Enhanced UX**: Freeform input mode with AI synthesis
- ✅ **Production Deployment**: Docker containerization complete

### Current Features
- ✅ **Case Study Edge**: Dual input modes, AI-powered synthesis, professional infographics
- ✅ **Presentation Edge**: Multi-slide presentations with navigation
- ✅ **Recruiting Toolkit**: 8 specialized AI-powered recruiting tools
- ✅ **Export System**: PDF, HTML, high-resolution JPEG outputs
- ✅ **Brand Integration**: Calance branding in all outputs

## 🔐 Security Notes

- Internal use only - not intended for public deployment
- API keys should be properly secured and never committed to version control
- CORS is configured for development endpoints only
- Production deployment requires additional security measures

## 📞 Support

For technical questions or issues:
1. Check the health endpoint: `/api/health`
2. Review container logs: `docker-compose logs`
3. Verify environment configuration
4. Consult the technical specification document

## 🚀 Future Development

**Enhancement Roadmap**: See [docs/ENHANCEMENT_ROADMAP.md](docs/ENHANCEMENT_ROADMAP.md) for planned features and development priorities

**Current Implementation**: Detailed status available in [docs/CURRENT_IMPLEMENTATION_STATUS.md](docs/CURRENT_IMPLEMENTATION_STATUS.md)

---

**Version**: 1.0.0
**Last Updated**: 2025-12-19
**Status**: Production Ready - MVP Complete