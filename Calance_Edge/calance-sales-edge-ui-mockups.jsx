import React, { useState } from 'react';
import { FileText, Presentation, Users, Settings, ChevronRight, Sparkles, Download, Copy, Check, RefreshCw, Plus, Minus, ArrowLeft, ArrowRight, HelpCircle, Menu, X } from 'lucide-react';

// ============================================
// CALANCE SALES EDGE - UI MOCKUPS
// ============================================

// Brand Configuration
const brand = {
  colors: {
    navy: '#1e3a5f',
    blue: '#2563eb',
    orange: '#f97316',
    red: '#dc2626',
    dark: '#1f2937',
    gray: '#6b7280',
    light: '#f3f4f6',
    white: '#ffffff',
  }
};

// ============================================
// SHARED COMPONENTS
// ============================================

const Logo = () => (
  <div className="flex items-center gap-3">
    <div 
      className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg"
      style={{ background: `linear-gradient(135deg, ${brand.colors.navy} 0%, ${brand.colors.blue} 100%)` }}
    >
      C
    </div>
    <div>
      <div className="font-semibold text-gray-900 tracking-tight">CALANCE</div>
      <div className="text-xs font-medium tracking-widest" style={{ color: brand.colors.orange }}>SALES EDGE</div>
    </div>
  </div>
);

const NavItem = ({ icon: Icon, label, active, onClick, collapsed }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
      active 
        ? 'bg-white shadow-md text-gray-900' 
        : 'text-gray-600 hover:bg-white/50 hover:text-gray-900'
    }`}
    style={active ? { borderLeft: `3px solid ${brand.colors.orange}` } : {}}
  >
    <Icon size={20} style={active ? { color: brand.colors.navy } : {}} />
    {!collapsed && <span className="font-medium">{label}</span>}
  </button>
);

const Button = ({ children, variant = 'primary', icon: Icon, onClick, loading, disabled, size = 'md' }) => {
  const baseStyles = "inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 disabled:opacity-50";
  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5",
    lg: "px-6 py-3 text-lg"
  };
  const variantStyles = {
    primary: `text-white shadow-lg hover:shadow-xl hover:scale-[1.02]`,
    secondary: "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50",
    ghost: "text-gray-600 hover:bg-gray-100"
  };
  
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]}`}
      style={variant === 'primary' ? { background: `linear-gradient(135deg, ${brand.colors.navy} 0%, ${brand.colors.blue} 100%)` } : {}}
    >
      {loading ? (
        <RefreshCw size={18} className="animate-spin" />
      ) : Icon && (
        <Icon size={18} />
      )}
      {children}
    </button>
  );
};

const Input = ({ label, placeholder, value, onChange, required, multiline, helpText }) => (
  <div className="space-y-1.5">
    <label className="block text-sm font-medium text-gray-700">
      {label} {required && <span style={{ color: brand.colors.orange }}>*</span>}
    </label>
    {multiline ? (
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
      />
    ) : (
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
      />
    )}
    {helpText && <p className="text-xs text-gray-500">{helpText}</p>}
  </div>
);

const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 ${className}`}>
    {children}
  </div>
);

const Badge = ({ children, variant = 'default' }) => {
  const styles = {
    default: 'bg-gray-100 text-gray-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-orange-100 text-orange-700',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[variant]}`}>
      {children}
    </span>
  );
};

// ============================================
// CASE STUDY MODULE
// ============================================

const CaseStudyForm = ({ onGenerate }) => {
  const [formData, setFormData] = useState({
    clientName: '',
    industry: 'Technology',
    challenge: '',
    solution: '',
  });
  const [metrics, setMetrics] = useState([{ label: '', before: '', after: '', improvement: '' }]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Client Name"
          placeholder="e.g., Beazer Homes"
          value={formData.clientName}
          onChange={(v) => setFormData({...formData, clientName: v})}
          required
        />
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700">Industry <span style={{ color: brand.colors.orange }}>*</span></label>
          <select 
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
            value={formData.industry}
            onChange={(e) => setFormData({...formData, industry: e.target.value})}
          >
            <option>Technology</option>
            <option>Real Estate</option>
            <option>Healthcare</option>
            <option>Financial Services</option>
            <option>Manufacturing</option>
            <option>Retail</option>
          </select>
        </div>
      </div>
      
      <Input
        label="Business Challenge"
        placeholder="Describe the problem the client was facing..."
        value={formData.challenge}
        onChange={(v) => setFormData({...formData, challenge: v})}
        multiline
        required
      />
      
      <Input
        label="Solution Delivered"
        placeholder="Describe how Calance solved the problem..."
        value={formData.solution}
        onChange={(v) => setFormData({...formData, solution: v})}
        multiline
        required
      />

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">Business Metrics</label>
          <button 
            onClick={() => setMetrics([...metrics, { label: '', before: '', after: '', improvement: '' }])}
            className="text-sm font-medium flex items-center gap-1 hover:opacity-80"
            style={{ color: brand.colors.blue }}
          >
            <Plus size={16} /> Add Metric
          </button>
        </div>
        {metrics.map((metric, i) => (
          <div key={i} className="grid grid-cols-5 gap-2 p-3 bg-gray-50 rounded-xl">
            <input placeholder="Metric" className="px-3 py-2 border rounded-lg text-sm" />
            <input placeholder="Before" className="px-3 py-2 border rounded-lg text-sm" />
            <input placeholder="After" className="px-3 py-2 border rounded-lg text-sm" />
            <input placeholder="Impact" className="px-3 py-2 border rounded-lg text-sm" />
            <button 
              onClick={() => setMetrics(metrics.filter((_, idx) => idx !== i))}
              className="text-gray-400 hover:text-red-500 flex items-center justify-center"
            >
              <Minus size={18} />
            </button>
          </div>
        ))}
      </div>

      <div className="pt-4">
        <Button onClick={onGenerate} icon={Sparkles} size="lg">
          Generate Case Study Draft
        </Button>
      </div>
    </div>
  );
};

const CaseStudyPreview = () => (
  <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden" style={{ aspectRatio: '8.5/11' }}>
    {/* PDF Preview Mock */}
    <div className="p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b-2" style={{ borderColor: brand.colors.red }}>
        <div className="flex items-center gap-2">
          <div className="w-24 h-8 rounded" style={{ background: brand.colors.navy }}></div>
        </div>
        <div 
          className="px-3 py-1 text-xs font-semibold text-white rounded"
          style={{ background: brand.colors.navy }}
        >
          CASE STUDY
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 py-4 space-y-4">
        <div>
          <div className="h-6 w-3/4 rounded" style={{ background: brand.colors.navy }}></div>
          <div className="h-4 w-1/2 bg-gray-300 rounded mt-2"></div>
        </div>
        
        <div className="p-3 rounded-lg" style={{ background: `${brand.colors.blue}15` }}>
          <div className="grid grid-cols-2 gap-2">
            <div className="h-3 bg-gray-300 rounded"></div>
            <div className="h-3 bg-gray-300 rounded"></div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="h-4 w-1/3 rounded" style={{ background: brand.colors.navy }}></div>
          <div className="p-3 bg-red-50 rounded-lg border border-red-200">
            <div className="space-y-1.5">
              <div className="h-2 bg-gray-300 rounded w-full"></div>
              <div className="h-2 bg-gray-300 rounded w-5/6"></div>
              <div className="h-2 bg-gray-300 rounded w-4/6"></div>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="h-4 w-1/3 rounded" style={{ background: brand.colors.navy }}></div>
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="space-y-1.5">
              <div className="h-2 bg-gray-300 rounded w-full"></div>
              <div className="h-2 bg-gray-300 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const FeedbackPanel = ({ onRegenerate }) => {
  const [feedback, setFeedback] = useState('');
  
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Refine with Feedback
        </label>
        <textarea
          placeholder="e.g., Make the ROI more prominent in the headline..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          rows={4}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>
      <Button onClick={onRegenerate} icon={RefreshCw} variant="secondary">
        Regenerate Draft
      </Button>
    </div>
  );
};

const ExportPanel = () => {
  const [copied, setCopied] = useState(false);
  
  return (
    <div className="p-4 bg-gray-50 rounded-xl space-y-3">
      <h4 className="font-medium text-gray-900">Export Options</h4>
      <div className="flex flex-wrap gap-2">
        <Button variant="primary" icon={Download} size="sm">
          Download PDF
        </Button>
        <Button variant="secondary" icon={Download} size="sm">
          Download HTML
        </Button>
        <Button 
          variant="ghost" 
          icon={copied ? Check : Copy} 
          size="sm"
          onClick={() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }}
        >
          {copied ? 'Copied!' : 'Copy Link'}
        </Button>
      </div>
    </div>
  );
};

// ============================================
// PRESENTATION MODULE
// ============================================

const PresentationWizard = ({ onGenerate }) => {
  const [keyPoints, setKeyPoints] = useState([
    'Introduction and context',
    'Problem statement',
    'Our solution approach',
    ''
  ]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Presentation Title"
          placeholder="e.g., Q4 Sales Strategy"
          required
        />
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700">Theme</label>
          <select className="w-full px-4 py-3 border border-gray-200 rounded-xl">
            <option>Professional</option>
            <option>Executive</option>
            <option>Technical</option>
            <option>Energetic</option>
          </select>
        </div>
      </div>
      
      <Input
        label="Purpose / Goal"
        placeholder="What should the audience take away?"
        multiline
        required
      />
      
      <Input
        label="Target Audience"
        placeholder="e.g., C-level executives, IT managers"
        required
      />

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">
            Key Points <span className="text-gray-400">(1 slide per point)</span>
          </label>
          <button 
            onClick={() => setKeyPoints([...keyPoints, ''])}
            className="text-sm font-medium flex items-center gap-1 hover:opacity-80"
            style={{ color: brand.colors.blue }}
          >
            <Plus size={16} /> Add Point
          </button>
        </div>
        {keyPoints.map((point, i) => (
          <div key={i} className="flex gap-2">
            <div className="flex items-center justify-center w-8 h-10 rounded-lg bg-gray-100 text-sm font-medium text-gray-500">
              {i + 1}
            </div>
            <input 
              value={point}
              onChange={(e) => {
                const newPoints = [...keyPoints];
                newPoints[i] = e.target.value;
                setKeyPoints(newPoints);
              }}
              placeholder="Enter key talking point..."
              className="flex-1 px-4 py-2 border border-gray-200 rounded-xl"
            />
            <button 
              onClick={() => setKeyPoints(keyPoints.filter((_, idx) => idx !== i))}
              className="text-gray-400 hover:text-red-500 px-2"
            >
              <Minus size={18} />
            </button>
          </div>
        ))}
      </div>

      <Input
        label="Knowledge Base (Optional)"
        placeholder="Paste any relevant information the AI should reference..."
        multiline
        helpText="Context, data, or background information"
      />

      <div className="pt-4">
        <Button onClick={onGenerate} icon={Sparkles} size="lg">
          Generate Presentation
        </Button>
      </div>
    </div>
  );
};

const SlidePreview = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 6;
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
          className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30"
          disabled={currentSlide === 0}
        >
          <ArrowLeft size={20} />
        </button>
        <span className="text-sm text-gray-600">
          Slide {currentSlide + 1} of {totalSlides}
        </span>
        <button 
          onClick={() => setCurrentSlide(Math.min(totalSlides - 1, currentSlide + 1))}
          className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30"
          disabled={currentSlide === totalSlides - 1}
        >
          <ArrowRight size={20} />
        </button>
      </div>
      
      {/* 16:9 Slide Preview */}
      <div 
        className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-lg"
        style={{ aspectRatio: '16/9' }}
      >
        <div className="h-full p-6 flex flex-col" style={{ background: `linear-gradient(135deg, ${brand.colors.navy} 0%, #2d4a6f 100%)` }}>
          {currentSlide === 0 ? (
            // Title slide
            <div className="flex-1 flex flex-col items-center justify-center text-white text-center">
              <div className="w-16 h-16 rounded-xl bg-white/20 mb-4 flex items-center justify-center text-2xl font-bold">
                C
              </div>
              <h1 className="text-2xl font-bold mb-2">Q4 Sales Strategy</h1>
              <p className="text-white/70">Accelerating Growth Through Innovation</p>
            </div>
          ) : (
            // Content slide
            <div className="flex-1 flex flex-col text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-4 bg-white/20 rounded"></div>
                <div className="text-xs text-white/50">CALANCE</div>
              </div>
              <h2 className="text-xl font-semibold mb-4">Key Point {currentSlide}</h2>
              <div className="space-y-2 flex-1">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full mt-1.5" style={{ background: brand.colors.orange }}></div>
                  <div className="h-3 bg-white/30 rounded w-3/4"></div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full mt-1.5" style={{ background: brand.colors.orange }}></div>
                  <div className="h-3 bg-white/30 rounded w-2/3"></div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full mt-1.5" style={{ background: brand.colors.orange }}></div>
                  <div className="h-3 bg-white/30 rounded w-4/5"></div>
                </div>
              </div>
            </div>
          )}
          <div className="flex items-center justify-between text-white/50 text-xs pt-4 border-t border-white/10">
            <span>www.calance.com</span>
            <span>{currentSlide + 1} / {totalSlides}</span>
          </div>
        </div>
      </div>
      
      {/* Slide indicators */}
      <div className="flex justify-center gap-2">
        {Array.from({ length: totalSlides }).map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            className={`w-2 h-2 rounded-full transition-all ${
              i === currentSlide ? 'w-6' : ''
            }`}
            style={{ background: i === currentSlide ? brand.colors.orange : '#e5e7eb' }}
          />
        ))}
      </div>
    </div>
  );
};

// ============================================
// RECRUITING MODULE
// ============================================

const RecruitingToolkit = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  
  const tabs = [
    { id: 'jd', label: 'JD Enhancer' },
    { id: 'email', label: 'Sourcing Email' },
    { id: 'boolean', label: 'Search Strings' },
    { id: 'submittal', label: 'Submittal' },
    { id: 'prep', label: 'Interview Prep' },
    { id: 'mock', label: 'Mock Q&A' },
    { id: 'skills', label: 'Skills Extract' },
    { id: 'summary', label: 'Exec Summary' },
  ];

  const sampleOutput = `**Our Client:** A leading technology company revolutionizing the retail industry through innovative AI-powered solutions.

**Position:** Senior Full Stack Engineer
**Duration:** Full-time
**Location:** Remote (US-based)
**Work Arrangement:** Fully Remote

**Role Summary:**
Join a dynamic team building next-generation retail analytics platforms. You'll architect scalable solutions that process millions of transactions daily while collaborating with data scientists and product managers to deliver exceptional user experiences.

**Responsibilities:**
• Design and implement microservices architecture using Node.js and Python
• Lead code reviews and mentor junior developers
• Collaborate with cross-functional teams to define technical requirements
• Optimize application performance and database queries

**Required Skills/Experience:**
• 5+ years of full-stack development experience
• Strong proficiency in React, Node.js, and PostgreSQL
• Experience with AWS services (EC2, S3, Lambda)
• Understanding of CI/CD pipelines and DevOps practices`;

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-xl overflow-x-auto">
        {tabs.map((tab, i) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(i)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === i
                ? 'bg-white shadow text-gray-900'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Input */}
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Input</h3>
          <div className="space-y-4">
            <Input
              label="Job Description"
              placeholder="Paste the full job description here..."
              multiline
              required
            />
            <Button 
              icon={Sparkles}
              onClick={() => setOutput(sampleOutput)}
            >
              Generate Enhanced JD
            </Button>
          </div>
        </Card>

        {/* Output */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Output</h3>
            {output && (
              <Button
                variant="ghost"
                size="sm"
                icon={copied ? Check : Copy}
                onClick={() => { 
                  navigator.clipboard.writeText(output);
                  setCopied(true); 
                  setTimeout(() => setCopied(false), 2000); 
                }}
              >
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            )}
          </div>
          {output ? (
            <div className="p-4 bg-gray-50 rounded-xl text-sm font-mono whitespace-pre-wrap max-h-80 overflow-y-auto">
              {output}
            </div>
          ) : (
            <div className="p-8 bg-gray-50 rounded-xl text-center text-gray-500">
              Output will appear here after generation
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

// ============================================
// MAIN APPLICATION
// ============================================

export default function CalanceSalesEdge() {
  const [currentModule, setCurrentModule] = useState('case-studies');
  const [showPreview, setShowPreview] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const modules = [
    { id: 'case-studies', label: 'Case Studies', icon: FileText },
    { id: 'presentations', label: 'Presentations', icon: Presentation },
    { id: 'recruiting', label: 'Recruiting Toolkit', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
              <HelpCircle size={20} />
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-100/50 border-r border-gray-200 min-h-[calc(100vh-73px)] p-4">
          <nav className="space-y-2">
            {modules.map((module) => (
              <NavItem
                key={module.id}
                icon={module.icon}
                label={module.label}
                active={currentModule === module.id}
                onClick={() => { setCurrentModule(module.id); setShowPreview(false); }}
              />
            ))}
          </nav>
          
          <div className="mt-8 pt-8 border-t border-gray-200">
            <NavItem
              icon={Settings}
              label="Settings"
              active={false}
              onClick={() => {}}
            />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {/* Module Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              {modules.find(m => m.id === currentModule)?.label}
            </h1>
            <p className="text-gray-500 mt-1">
              {currentModule === 'case-studies' && 'Create professional client success stories'}
              {currentModule === 'presentations' && 'Build compelling sales presentations'}
              {currentModule === 'recruiting' && 'Generate staffing artifacts with AI'}
            </p>
          </div>

          {/* Case Studies Module */}
          {currentModule === 'case-studies' && (
            <div className="grid grid-cols-2 gap-8">
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${brand.colors.blue}20` }}>
                    <span className="text-sm font-bold" style={{ color: brand.colors.blue }}>1</span>
                  </div>
                  <h3 className="font-semibold text-gray-900">Enter Details</h3>
                </div>
                <CaseStudyForm onGenerate={() => setShowPreview(true)} />
              </Card>

              <div className="space-y-6">
                {showPreview ? (
                  <>
                    <Card className="p-6">
                      <div className="flex items-center gap-2 mb-6">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${brand.colors.blue}20` }}>
                          <span className="text-sm font-bold" style={{ color: brand.colors.blue }}>2</span>
                        </div>
                        <h3 className="font-semibold text-gray-900">Preview & Refine</h3>
                        <Badge variant="success">Draft Ready</Badge>
                      </div>
                      <CaseStudyPreview />
                    </Card>
                    
                    <Card className="p-6">
                      <FeedbackPanel />
                    </Card>
                    
                    <ExportPanel />
                  </>
                ) : (
                  <Card className="p-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                      <FileText size={24} className="text-gray-400" />
                    </div>
                    <h3 className="font-medium text-gray-900 mb-2">Preview will appear here</h3>
                    <p className="text-sm text-gray-500">Fill out the form and click "Generate" to see your case study</p>
                  </Card>
                )}
              </div>
            </div>
          )}

          {/* Presentations Module */}
          {currentModule === 'presentations' && (
            <div className="grid grid-cols-2 gap-8">
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${brand.colors.blue}20` }}>
                    <span className="text-sm font-bold" style={{ color: brand.colors.blue }}>1</span>
                  </div>
                  <h3 className="font-semibold text-gray-900">Configure Presentation</h3>
                </div>
                <PresentationWizard onGenerate={() => setShowPreview(true)} />
              </Card>

              <div className="space-y-6">
                {showPreview ? (
                  <>
                    <Card className="p-6">
                      <div className="flex items-center gap-2 mb-6">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${brand.colors.blue}20` }}>
                          <span className="text-sm font-bold" style={{ color: brand.colors.blue }}>2</span>
                        </div>
                        <h3 className="font-semibold text-gray-900">Preview Slides</h3>
                        <Badge variant="success">6 Slides Generated</Badge>
                      </div>
                      <SlidePreview />
                    </Card>
                    
                    <Card className="p-6">
                      <FeedbackPanel />
                    </Card>
                    
                    <div className="p-4 bg-gray-50 rounded-xl space-y-3">
                      <h4 className="font-medium text-gray-900">Export Options</h4>
                      <div className="flex flex-wrap gap-2">
                        <Button variant="primary" icon={Download} size="sm">
                          Download HTML
                        </Button>
                        <Button variant="secondary" icon={Copy} size="sm">
                          Copy Shareable Link
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500">
                        💡 HTML presentations work great for screen sharing via Teams/Zoom
                      </p>
                    </div>
                  </>
                ) : (
                  <Card className="p-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                      <Presentation size={24} className="text-gray-400" />
                    </div>
                    <h3 className="font-medium text-gray-900 mb-2">Preview will appear here</h3>
                    <p className="text-sm text-gray-500">Configure your presentation and click "Generate" to see slides</p>
                  </Card>
                )}
              </div>
            </div>
          )}

          {/* Recruiting Module */}
          {currentModule === 'recruiting' && (
            <RecruitingToolkit />
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Powered by AI • OpenRouter</span>
          <span>Internal Use Only</span>
          <span>v1.0.0</span>
        </div>
      </footer>
    </div>
  );
}
