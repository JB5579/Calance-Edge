import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FileText, Presentation, Users, Settings, ChevronRight, Sparkles, Download, Copy, Check, RefreshCw, Plus, Minus, ArrowLeft, ArrowRight, HelpCircle, Menu, X } from 'lucide-react';
import './App.css';

// API Configuration
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

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
        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 text-black rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white resize-none transition-all placeholder:text-gray-500"
      />
    ) : (
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 text-black rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all placeholder:text-gray-500"
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

// Template Selector Component
const TemplateSelector = ({ value, onChange, templates, loading }) => {
  const [selectedTemplate, setSelectedTemplate] = useState(value || 'technology');
  const [templateData, setTemplateData] = useState(null);

  useEffect(() => {
    if (templates && templates.caseStudies) {
      const data = templates.caseStudies[selectedTemplate];
      setTemplateData(data);
    }
  }, [selectedTemplate, templates]);

  const handleIndustryChange = (industryId) => {
    setSelectedTemplate(industryId);
    onChange(industryId);
  };

  const industryConfig = [
    { id: 'technology', name: 'Technology', icon: '💻', color: '#2563eb' },
    { id: 'healthcare', name: 'Healthcare', icon: '🏥', color: '#10b981' },
    { id: 'financial-services', name: 'Financial Services', icon: '🏦', color: '#1e3a5f' },
    { id: 'manufacturing', name: 'Manufacturing', icon: '🏭', color: '#f97316' },
    { id: 'retail', name: 'Retail & E-commerce', icon: '🛒', color: '#dc2626' }
  ];

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-10 bg-gray-200 rounded-xl mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Industry Template <span style={{ color: brand.colors.orange }}>*</span>
      </label>

      {/* Industry Selection Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {industryConfig.map((industry) => (
          <button
            key={industry.id}
            type="button"
            onClick={() => handleIndustryChange(industry.id)}
            className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${
              selectedTemplate === industry.id
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : 'border-gray-200 hover:border-gray-300 bg-white hover:shadow-sm'
            }`}
          >
            <div className="flex flex-col items-center text-center">
              <span className="text-2xl mb-2">{industry.icon}</span>
              <span className={`text-sm font-medium ${
                selectedTemplate === industry.id ? 'text-blue-700' : 'text-gray-700'
              }`}>
                {industry.name}
              </span>
            </div>
            {selectedTemplate === industry.id && (
              <div
                className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs"
                style={{ backgroundColor: industry.color }}
              >
                ✓
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Template Preview */}
      {templateData && (
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 border border-gray-200">
          <div className="flex items-start gap-3">
            <span className="text-2xl">{templateData.icon}</span>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900 mb-1">
                {templateData.industry} Industry Template
              </h4>
              <p className="text-sm text-gray-600 mb-3">
                {templateData.description}
              </p>

              {/* Key Features */}
              <div className="space-y-2">
                <div className="text-xs font-medium text-gray-500">KEY FEATURES:</div>
                <div className="flex flex-wrap gap-1">
                  {templateData.caseStudyPrompts.structured.commonChallenges.slice(0, 3).map((challenge, idx) => (
                    <Badge key={idx} variant="default">
                      {challenge}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Auto-Detection Notice */}
      <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
        <HelpCircle size={16} className="text-blue-600 mt-0.5" />
        <div className="text-sm text-blue-700">
          <span className="font-medium">Smart Enhancement:</span> This template will automatically enhance your content with industry-specific terminology, metrics, and best practices.
        </div>
      </div>
    </div>
  );
};

// ============================================
// CASE STUDY MODULE
// ============================================

// Validation schema for React Hook Form
const caseStudySchema = yup.object().shape({
  clientName: yup.string().required('Client name is required'),
  industry: yup.string().required('Industry is required'),
  challenge: yup.string().required('Business challenge is required'),
  solution: yup.string().required('Solution is required'),
  subtitle: yup.string().optional(),
  technology: yup.string().optional(),
  timeline: yup.string().optional(),
  roi: yup.string().optional(),
  metrics: yup.array().of(
    yup.object().shape({
      label: yup.string().required('Metric label is required'),
      before: yup.string().required('Before value is required'),
      after: yup.string().required('After value is required'),
      improvement: yup.string().optional(),
    })
  ).min(1, 'At least one metric is required'),
  benefits: yup.array().of(
    yup.object().shape({
      text: yup.string().required('Benefit text is required'),
    })
  ).optional(),
});

const CaseStudyForm = ({ onGenerate }) => {
  const [loading, setLoading] = useState(false);
  const [inputMode, setInputMode] = useState('freeform'); // 'freeform' or 'structured'
  const [freeformNotes, setFreeformNotes] = useState('');
  const [templates, setTemplates] = useState(null);
  const [templatesLoading, setTemplatesLoading] = useState(true);

  // Load templates on component mount
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        // Load template configuration
        const configResponse = await fetch('/data/templates/template-config.json');
        const config = await configResponse.json();

        // Load industry templates
        const industryPromises = config.industries
          .filter(industry => industry.enabled)
          .map(async (industry) => {
            const response = await fetch(`/data/templates/case-studies/${industry.id}.json`);
            const data = await response.json();
            return [industry.id, data];
          });

        const industryTemplates = await Promise.all(industryPromises);
        const templatesData = Object.fromEntries(industryTemplates);

        setTemplates({
          config,
          caseStudies: templatesData
        });
      } catch (error) {
        console.error('Failed to load templates:', error);
        // Fallback to basic templates
        setTemplates({
          config: { industries: [] },
          caseStudies: {}
        });
      } finally {
        setTemplatesLoading(false);
      }
    };

    loadTemplates();
  }, []);

  // Initialize React Hook Form
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    getValues,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(caseStudySchema),
    defaultValues: {
      clientName: '',
      industry: 'technology',
      challenge: '',
      solution: '',
      subtitle: '',
      technology: '',
      timeline: '',
      roi: '',
      metrics: [{ label: '', before: '', after: '', improvement: '' }],
      benefits: [{ text: '' }],
    },
    mode: 'onChange',
  });

  // Field arrays for dynamic metrics and benefits
  const { fields: metricFields, append: appendMetric, remove: removeMetric } = useFieldArray({
    control,
    name: 'metrics',
  });

  const { fields: benefitFields, append: appendBenefit, remove: removeBenefit } = useFieldArray({
    control,
    name: 'benefits',
  });

  // Auto-save to localStorage
  useEffect(() => {
    const subscription = watch((value) => {
      localStorage.setItem('caseStudyForm', JSON.stringify(value));
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('caseStudyForm');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        Object.keys(parsed).forEach(key => {
          setValue(key, parsed[key]);
        });
      } catch (error) {
        console.error('Failed to load saved form data:', error);
      }
    }
  }, [setValue]);

  const handleGenerate = async (formData) => {
    setLoading(true);

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 300000); // 5 minute timeout

    try {
      // Prepare data based on input mode
      const requestData = inputMode === 'freeform'
        ? {
            inputMode: 'freeform',
            rawNotes: freeformNotes || formData.freeformInput,
            clientName: formData.clientName || '',
            industry: formData.industry || '',
          }
        : formData;

      console.log('Sending request data:', requestData);

      const response = await fetch(`${API_URL}/api/generate/case-study`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const result = await response.json();
      console.log('Received result:', result);
      onGenerate(result.data);
      // Clear form after successful generation
      localStorage.removeItem('caseStudyForm');
      if (inputMode === 'freeform') {
        setFreeformNotes('');
      }
    } catch (error) {
      clearTimeout(timeoutId);
      console.error('Error generating case study:', error);

      // Provide user-friendly error messages
      if (error.name === 'AbortError') {
        alert('⏱️ Request timed out after 5 minutes.\n\nThis can happen with complex case studies that include AI-generated images. The backend may still be processing. Please try again or use shorter input text.');
      } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        alert('❌ Unable to connect to the server.\n\nThe server may have timed out or lost connection while processing your request. This often happens during AI image generation.\n\nPlease try again. If the problem persists, the Docker backend may need to be restarted.');
      } else {
        alert(`❌ Failed to generate case study:\n\n${error.message}\n\nPlease try again or contact support if the issue persists.`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Wrapper to handle freeform mode bypass
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // In freeform mode, bypass react-hook-form validation
    if (inputMode === 'freeform') {
      if (!freeformNotes.trim()) {
        return; // Button should already be disabled, but double-check
      }
      await handleGenerate(getValues());
    } else {
      // In structured mode, use react-hook-form validation
      handleSubmit(handleGenerate)(e);
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      {/* Input Mode Toggle */}
      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
        <span className="text-sm font-medium text-gray-700">Input Mode:</span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setInputMode('freeform')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              inputMode === 'freeform'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Quick Notes (AI Synthesis)
          </button>
          <button
            type="button"
            onClick={() => setInputMode('structured')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              inputMode === 'structured'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Structured Form
          </button>
        </div>
      </div>

      {/* Freeform Input Mode */}
      {inputMode === 'freeform' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Paste Your Notes <span style={{ color: brand.colors.orange }}>*</span>
          </label>
          <textarea
            value={freeformNotes}
            onChange={(e) => setFreeformNotes(e.target.value)}
            placeholder="Paste meeting notes, emails, or just tell me about the client engagement...

Example:
'Called Beazer Homes VP yesterday - they love the Scout AI platform. Said it cut their land analysis time from weeks to days. They're doing way more deals now. Need to get exact numbers from Jim's Q4 report. Real estate is super competitive right now so this is huge for them.'"
            rows={12}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white resize-none transition-all text-black placeholder:text-gray-500"
          />
          <p className="text-xs text-gray-500 mt-2">
            AI will synthesize a complete case study from your raw notes - no need to pre-structure!
          </p>
        </div>
      )}

      {/* Structured Form Mode */}
      {inputMode === 'structured' && (
        <>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Client Name <span style={{ color: brand.colors.orange }}>*</span>
          </label>
          <input
            {...register('clientName')}
            placeholder="e.g., Beazer Homes"
            className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all text-black placeholder:text-gray-500 ${
              errors.clientName ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.clientName && (
            <p className="text-xs text-red-500 mt-1">{errors.clientName.message}</p>
          )}
        </div>

        <div>
          <Controller
            name="industry"
            control={control}
            render={({ field }) => (
              <TemplateSelector
                value={field.value}
                onChange={field.onChange}
                templates={templates?.caseStudies}
                loading={templatesLoading}
              />
            )}
          />
          {errors.industry && (
            <p className="text-xs text-red-500 mt-1">{errors.industry.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Business Challenge <span style={{ color: brand.colors.orange }}>*</span>
        </label>
        <textarea
          {...register('challenge')}
          placeholder="Describe the problem the client was facing..."
          rows={4}
          className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white resize-none transition-all text-black placeholder:text-gray-500 ${
            errors.challenge ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.challenge && (
          <p className="text-xs text-red-500 mt-1">{errors.challenge.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Solution Delivered <span style={{ color: brand.colors.orange }}>*</span>
        </label>
        <textarea
          {...register('solution')}
          placeholder="Describe how Calance solved the problem..."
          rows={4}
          className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white resize-none transition-all text-black placeholder:text-gray-500 ${
            errors.solution ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.solution && (
          <p className="text-xs text-red-500 mt-1">{errors.solution.message}</p>
        )}
      </div>

      {/* Optional Fields */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Subtitle/Tagline (Optional)</label>
          <input
            {...register('subtitle')}
            placeholder="e.g., A Digital Transformation Success Story"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">ROI Statement (Optional)</label>
          <input
            {...register('roi')}
            placeholder="e.g., 200% ROI within 6 months"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Business Metrics <span style={{ color: brand.colors.orange }}>*</span>
        </label>
        {errors.metrics && (
          <p className="text-xs text-red-500 mt-1 mb-2">{errors.metrics.message}</p>
        )}
        {metricFields.map((field, index) => (
          <div key={field.id} className="grid grid-cols-5 gap-2 p-3 bg-gray-50 rounded-xl mb-2">
            <div>
              <input
                {...register(`metrics.${index}.label`)}
                placeholder="Metric"
                className={`w-full px-3 py-2 border rounded-lg text-sm ${
                  errors.metrics?.[index]?.label ? 'border-red-500' : 'border-gray-200'
                }`}
              />
              {errors.metrics?.[index]?.label && (
                <p className="text-xs text-red-500 mt-1">{errors.metrics[index].label.message}</p>
              )}
            </div>
            <div>
              <input
                {...register(`metrics.${index}.before`)}
                placeholder="Before"
                className={`w-full px-3 py-2 border rounded-lg text-sm ${
                  errors.metrics?.[index]?.before ? 'border-red-500' : 'border-gray-200'
                }`}
              />
              {errors.metrics?.[index]?.before && (
                <p className="text-xs text-red-500 mt-1">{errors.metrics[index].before.message}</p>
              )}
            </div>
            <div>
              <input
                {...register(`metrics.${index}.after`)}
                placeholder="After"
                className={`w-full px-3 py-2 border rounded-lg text-sm ${
                  errors.metrics?.[index]?.after ? 'border-red-500' : 'border-gray-200'
                }`}
              />
              {errors.metrics?.[index]?.after && (
                <p className="text-xs text-red-500 mt-1">{errors.metrics[index].after.message}</p>
              )}
            </div>
            <div>
              <input
                {...register(`metrics.${index}.improvement`)}
                placeholder="Impact %"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              />
            </div>
            <button
              type="button"
              onClick={() => removeMetric(index)}
              className="text-gray-400 hover:text-red-500 flex items-center justify-center"
              disabled={metricFields.length === 1}
            >
              <Minus size={18} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => appendMetric({ label: '', before: '', after: '', improvement: '' })}
          className="text-sm font-medium flex items-center gap-1 hover:opacity-80"
          style={{ color: brand.colors.blue }}
        >
          <Plus size={16} /> Add Metric
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Benefits List (Optional)</label>
        {benefitFields.map((field, index) => (
          <div key={field.id} className="flex gap-2 mb-2">
            <input
              {...register(`benefits.${index}.text`)}
              placeholder="Enter a benefit..."
              className="flex-1 px-4 py-3 bg-gray-50 border border-gray-300 text-black rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all placeholder:text-gray-500"
            />
            <button
              type="button"
              onClick={() => removeBenefit(index)}
              className="text-gray-400 hover:text-red-500 flex items-center justify-center"
            >
              <Minus size={18} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => appendBenefit({ text: '' })}
          className="text-sm font-medium flex items-center gap-1 hover:opacity-80"
          style={{ color: brand.colors.blue }}
        >
          <Plus size={16} /> Add Benefit
        </button>
      </div>
        </>
      )}

      {/* Submit Button */}
      <div className="pt-4">
        <Button
          type="submit"
          icon={Sparkles}
          size="lg"
          loading={loading}
          disabled={inputMode === 'freeform' ? !freeformNotes.trim() : !isValid || loading}
        >
          {loading ? 'Generating...' : 'Generate Case Study Draft'}
        </Button>
        {inputMode === 'freeform' && !freeformNotes.trim() && (
          <p className="text-xs text-gray-500 mt-2">Please enter your notes before generating</p>
        )}
        {inputMode === 'structured' && !isValid && (
          <p className="text-xs text-gray-500 mt-2">Please fill in all required fields before generating</p>
        )}
      </div>
    </form>
  );
};

const CaseStudyPreview = ({ caseStudyData }) => {
  if (!caseStudyData) {
    return (
      <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden" style={{ aspectRatio: '8.5/11' }}>
        <div className="p-6 h-full flex flex-col">
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
  }

  // Check if we have a single infographic image (new approach)
  const hasInfographic = caseStudyData.infographic || (caseStudyData.images && caseStudyData.images.length > 0);
  const infographicUrl = caseStudyData.infographic?.url || caseStudyData.infographic || (caseStudyData.images?.[0]?.url);

  // If we have an infographic, display it prominently
  if (hasInfographic && infographicUrl) {
    return (
      <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b-2" style={{ borderColor: brand.colors.red }}>
          <div className="flex items-center gap-2">
            <div className="px-3 py-1 text-xs font-semibold text-white rounded" style={{ background: brand.colors.navy }}>
              CALANCE
            </div>
            <span className="text-sm font-medium text-gray-700">{caseStudyData.client_name || caseStudyData.clientName}</span>
          </div>
          <div
            className="px-3 py-1 text-xs font-semibold text-white rounded"
            style={{ background: brand.colors.navy }}
          >
            CASE STUDY INFOGRAPHIC
          </div>
        </div>

        <div className="p-4">
          <div className="w-full rounded-lg overflow-hidden bg-gray-50 border border-gray-200 shadow-sm">
            <img
              src={infographicUrl}
              alt={`${caseStudyData.client_name || caseStudyData.clientName || 'Case Study'} Infographic`}
              className="w-full h-auto object-contain"
              style={{ maxHeight: '85vh' }}
            />
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
            <span>8.5" x 11" format - Ready for download</span>
            <span>Tip: Download and print to PDF if needed</span>
          </div>
        </div>
      </div>
    );
  }

  // Fallback: Display text-based preview with bullet points (if no infographic yet)
  return (
    <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden" style={{ minHeight: '600px', maxHeight: '85vh' }}>
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between p-6 pb-4 border-b-2" style={{ borderColor: brand.colors.red }}>
          <div className="flex items-center gap-2">
            <div className="px-3 py-1 text-xs font-semibold text-white rounded" style={{ background: brand.colors.navy }}>
              CALANCE
            </div>
          </div>
          <div
            className="px-3 py-1 text-xs font-semibold text-white rounded"
            style={{ background: brand.colors.navy }}
          >
            CASE STUDY
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          <div>
            <h1 className="text-xl font-bold mb-2" style={{ color: brand.colors.navy }}>
              {caseStudyData.title}
            </h1>
            <p className="text-sm text-gray-600">{caseStudyData.subtitle}</p>
          </div>

          {/* Display metrics with new format */}
          {caseStudyData.metrics && caseStudyData.metrics.length > 0 && (
            <div className="p-4 rounded-lg" style={{ background: `${brand.colors.blue}15` }}>
              <h3 className="font-semibold mb-3" style={{ color: brand.colors.navy }}>Key Results</h3>
              <div className="grid grid-cols-2 gap-3">
                {caseStudyData.metrics.map((metric, index) => (
                  <div key={index} className="text-center p-3 bg-white rounded-lg border border-gray-200">
                    <div className="text-2xl font-bold" style={{ color: brand.colors.orange }}>
                      {metric.value || metric.improvement}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {metric.label}
                      {metric.context && <span className="text-gray-400"> ({metric.context})</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Challenge bullets or text */}
          <div>
            <h3 className="font-semibold mb-2" style={{ color: brand.colors.navy }}>The Challenge</h3>
            <div className="p-3 bg-red-50 rounded-lg border border-red-200 text-sm text-gray-700">
              {caseStudyData.challengeBullets && caseStudyData.challengeBullets.length > 0 ? (
                <ul className="list-disc list-inside space-y-1">
                  {caseStudyData.challengeBullets.map((bullet, idx) => (
                    <li key={idx}>{bullet}</li>
                  ))}
                </ul>
              ) : (
                <div className="whitespace-pre-wrap">{caseStudyData.challenge}</div>
              )}
            </div>
          </div>

          {/* Solution bullets or text */}
          <div>
            <h3 className="font-semibold mb-2" style={{ color: brand.colors.navy }}>Our Solution</h3>
            <div className="p-3 bg-green-50 rounded-lg border border-green-200 text-sm text-gray-700">
              {caseStudyData.solutionBullets && caseStudyData.solutionBullets.length > 0 ? (
                <ul className="list-disc list-inside space-y-1">
                  {caseStudyData.solutionBullets.map((bullet, idx) => (
                    <li key={idx}>{bullet}</li>
                  ))}
                </ul>
              ) : (
                <div className="whitespace-pre-wrap">{caseStudyData.solution}</div>
              )}
            </div>
          </div>

          {/* Results bullets */}
          {caseStudyData.resultsBullets && caseStudyData.resultsBullets.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2" style={{ color: brand.colors.navy }}>Results & Impact</h3>
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 text-sm text-gray-700">
                <ul className="list-disc list-inside space-y-1">
                  {caseStudyData.resultsBullets.map((bullet, idx) => (
                    <li key={idx}>{bullet}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* ROI Statement */}
          {caseStudyData.roi && (
            <div className="p-3 rounded-lg border-l-4" style={{ borderColor: brand.colors.orange, background: `${brand.colors.orange}10` }}>
              <div className="font-semibold text-sm" style={{ color: brand.colors.navy }}>ROI Impact</div>
              <div className="text-sm text-gray-700 mt-1">{caseStudyData.roi}</div>
            </div>
          )}

          {/* Testimonial */}
          {caseStudyData.testimonial && (
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 italic text-sm text-gray-600">
              "{caseStudyData.testimonial}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const FeedbackPanel = ({ onRegenerate, caseStudyData }) => {
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegenerate = async () => {
    if (!feedback.trim()) {
      alert('Please enter feedback for refinement');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/generate/case-study`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...caseStudyData,
          feedback: feedback,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to regenerate case study');
      }

      const result = await response.json();
      onRegenerate(result.data, feedback);
      setFeedback(''); // Clear feedback after successful regeneration
    } catch (error) {
      console.error('Error regenerating case study:', error);
      alert('Failed to regenerate case study. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Refine with Feedback
        </label>
        <textarea
          placeholder="e.g., Make the ROI more prominent in the headline, add more specific metrics, focus on the business impact..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          rows={4}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-300 text-black rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white resize-none placeholder:text-gray-500"
        />
      </div>
      <Button onClick={handleRegenerate} icon={RefreshCw} variant="secondary" loading={loading}>
        {loading ? 'Regenerating...' : 'Regenerate Draft'}
      </Button>
    </div>
  );
};

const ExportPanel = ({ caseStudyData }) => {
  const [downloading, setDownloading] = useState('');

  // Get the infographic URL
  const getInfographicUrl = () => {
    if (!caseStudyData) return null;
    if (caseStudyData.infographic?.url) return caseStudyData.infographic.url;
    if (caseStudyData.infographic) return caseStudyData.infographic;
    if (caseStudyData.images?.[0]?.url) return caseStudyData.images[0].url;
    return null;
  };

  const handleDownloadImage = async () => {
    const imageUrl = getInfographicUrl();
    if (!imageUrl) {
      alert('No infographic image available to download.');
      return;
    }

    setDownloading('image');
    try {
      // Handle base64 data URL
      if (imageUrl.startsWith('data:')) {
        const [header, base64Data] = imageUrl.split(',');
        const mimeType = header.match(/data:([^;]+)/)?.[1] || 'image/png';
        const extension = mimeType.split('/')[1] || 'png';

        const binaryString = atob(base64Data);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: mimeType });

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const clientName = caseStudyData.client_name || caseStudyData.clientName || 'case-study';
        const safeClientName = clientName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
        a.download = `${safeClientName}-infographic.${extension}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        // Handle regular URL - fetch and download
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const clientName = caseStudyData.client_name || caseStudyData.clientName || 'case-study';
        const safeClientName = clientName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
        a.download = `${safeClientName}-infographic.png`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error downloading image:', error);
      alert('Failed to download image. Please try again.');
    } finally {
      setDownloading('');
    }
  };

  const hasInfographic = !!getInfographicUrl();

  return (
    <div className="p-4 bg-gray-50 rounded-xl space-y-3">
      <h4 className="font-medium text-gray-900">Export Infographic</h4>

      {hasInfographic ? (
        <div className="space-y-3">
          <Button
            variant="primary"
            icon={Download}
            size="sm"
            onClick={handleDownloadImage}
            loading={downloading === 'image'}
            disabled={downloading !== ''}
            className="w-full justify-center"
          >
            {downloading === 'image' ? 'Downloading...' : 'Download Infographic Image'}
          </Button>
          <p className="text-xs text-gray-500">
            Downloads as PNG image (8.5" x 11" format). Print to PDF if needed.
          </p>
        </div>
      ) : (
        <div className="text-center py-4">
          <p className="text-sm text-gray-500">
            {caseStudyData ? 'Generating infographic...' : 'Generate a case study first to download the infographic'}
          </p>
        </div>
      )}
    </div>
  );
};

// ============================================
// PRESENTATION MODULE
// ============================================

// Validation schema for React Hook Form
const presentationSchema = yup.object().shape({
  title: yup.string().required('Presentation title is required'),
  objective: yup.string().required('Objective is required'),
  audience: yup.string().required('Target audience is required'),
  duration: yup.string().required('Duration is required'),
  keyPoints: yup.array().of(
    yup.object().shape({
      text: yup.string().required('Key point is required'),
    })
  ).min(3, 'At least 3 key points are required'),
});

const SlidePreview = ({ presentationData, currentSlide, setCurrentSlide, onSlideFeedback }) => {
  if (!presentationData || !presentationData.slides || presentationData.slides.length === 0) {
    return (
      <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden" style={{ aspectRatio: '16/9' }}>
        <div className="p-8 h-full flex flex-col">
          <div className="flex items-center justify-between pb-4 border-b-2" style={{ borderColor: brand.colors.red }}>
            <div className="flex items-center gap-2">
              <div className="w-24 h-8 rounded" style={{ background: brand.colors.navy }}></div>
            </div>
            <div
              className="px-3 py-1 text-xs font-semibold text-white rounded"
              style={{ background: brand.colors.navy }}
            >
              PRESENTATION
            </div>
          </div>

          <div className="flex-1 py-8 space-y-4">
            <div>
              <div className="h-8 w-3/4 rounded mb-4" style={{ background: brand.colors.navy }}></div>
              <div className="space-y-2">
                <div className="h-4 w-full bg-gray-300 rounded"></div>
                <div className="h-4 w-5/6 bg-gray-300 rounded"></div>
                <div className="h-4 w-4/6 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const slide = presentationData.slides[currentSlide];
  const totalSlides = presentationData.slides.length;

  return (
    <div className="space-y-4">
      {/* Slide Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
          disabled={currentSlide === 0}
          className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft size={18} />
        </button>

        <span className="text-sm font-medium text-gray-600">
          Slide {currentSlide + 1} of {totalSlides}
        </span>

        <button
          onClick={() => setCurrentSlide(Math.min(totalSlides - 1, currentSlide + 1))}
          disabled={currentSlide === totalSlides - 1}
          className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowRight size={18} />
        </button>
      </div>

      {/* Slide Preview */}
      <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden" style={{ aspectRatio: '16/9' }}>
        <div className="p-8 h-full flex flex-col">
          {/* Slide Header */}
          <div className="flex items-center justify-between pb-4 border-b-2" style={{ borderColor: brand.colors.red }}>
            <div className="flex items-center gap-2">
              <div className="px-3 py-1 text-xs font-semibold text-white rounded" style={{ background: brand.colors.navy }}>
                {presentationData.title}
              </div>
            </div>
            <div
              className="px-3 py-1 text-xs font-semibold text-white rounded"
              style={{ background: brand.colors.navy }}
            >
              {currentSlide + 1}/{totalSlides}
            </div>
          </div>

          {/* Slide Content */}
          <div className="flex-1 py-8">
            {slide.type === 'title' ? (
              <div className="text-center">
                <h1 className="text-4xl font-bold mb-4" style={{ color: brand.colors.navy }}>
                  {slide.title}
                </h1>
                {slide.subtitle && (
                  <p className="text-xl text-gray-600">{slide.subtitle}</p>
                )}
              </div>
            ) : slide.type === 'content' ? (
              <div>
                <h2 className="text-2xl font-bold mb-6" style={{ color: brand.colors.navy }}>
                  {slide.title}
                </h2>
                <div className="space-y-4">
                  {slide.content && slide.content.map((point, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: brand.colors.orange }}></div>
                      <p className="text-gray-700">{point}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-bold mb-6" style={{ color: brand.colors.navy }}>
                  {slide.title}
                </h2>
                <p className="text-gray-700 whitespace-pre-wrap">{slide.content}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Slide Feedback */}
      {onSlideFeedback && (
        <div className="p-4 bg-gray-50 rounded-xl">
          <textarea
            placeholder={`Feedback for slide ${currentSlide + 1}... (e.g., Make this more concise, add more details, change the focus...)`}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 text-black rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white resize-none placeholder:text-gray-500"
            rows={3}
            id={`slide-feedback-${currentSlide}`}
          />
          <div className="mt-2 flex justify-end">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                const feedback = document.getElementById(`slide-feedback-${currentSlide}`).value;
                if (feedback.trim()) {
                  onSlideFeedback(currentSlide, feedback);
                  document.getElementById(`slide-feedback-${currentSlide}`).value = '';
                }
              }}
            >
              Apply Feedback
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

const PresentationExportPanel = ({ presentationData }) => {
  const [downloading, setDownloading] = useState('');

  const handleExportHTML = async () => {
    if (!presentationData) return;

    setDownloading('html');
    try {
      const response = await fetch(`${API_URL}/api/presentation/export/html`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          presentation: presentationData,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to export presentation');
      }

      const result = await response.json();

      // Create blob and download
      const blob = new Blob([result.content], { type: 'text/html' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${presentationData.title || 'presentation'}-${Date.now()}.html`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error exporting presentation:', error);
      alert('Failed to export presentation. Please try again.');
    } finally {
      setDownloading('');
    }
  };

  return (
    <div className="p-4 bg-gray-50 rounded-xl space-y-3">
      <h4 className="font-medium text-gray-900">Export Presentation</h4>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="primary"
          icon={Download}
          size="sm"
          onClick={handleExportHTML}
          loading={downloading === 'html'}
          disabled={!presentationData || downloading !== ''}
        >
          {downloading === 'html' ? 'Exporting...' : 'Download HTML'}
        </Button>
      </div>
      {!presentationData && (
        <p className="text-xs text-gray-500 mt-2">Generate a presentation first to enable export options</p>
      )}
      {presentationData && (
        <p className="text-xs text-gray-500 mt-2">
          HTML export includes keyboard navigation (arrow keys, spacebar)
        </p>
      )}
    </div>
  );
};

const PresentationWizard = ({ onGenerate }) => {
  const [loading, setLoading] = useState(false);

  // Initialize React Hook Form
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    getValues,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(presentationSchema),
    defaultValues: {
      title: '',
      objective: '',
      audience: '',
      duration: '30',
      keyPoints: [{ text: '' }, { text: '' }, { text: '' }],
    },
    mode: 'onChange',
  });

  // Field arrays for dynamic key points
  const { fields: keyPointFields, append: appendKeyPoint, remove: removeKeyPoint } = useFieldArray({
    control,
    name: 'keyPoints',
  });

  // Auto-save to localStorage
  useEffect(() => {
    const subscription = watch((value) => {
      localStorage.setItem('presentationForm', JSON.stringify(value));
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('presentationForm');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        Object.keys(parsed).forEach(key => {
          setValue(key, parsed[key]);
        });
      } catch (error) {
        console.error('Failed to load saved form data:', error);
      }
    }
  }, [setValue]);

  const handleGenerate = async (formData) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/presentation/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to generate presentation');
      }

      const result = await response.json();
      onGenerate(result.data);
      // Clear form after successful generation
      localStorage.removeItem('presentationForm');
    } catch (error) {
      console.error('Error generating presentation:', error);
      alert('Failed to generate presentation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleGenerate)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Presentation Title <span style={{ color: brand.colors.orange }}>*</span>
        </label>
        <input
          {...register('title')}
          placeholder="e.g., Q4 Sales Strategy & Results"
          className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all text-black placeholder:text-gray-500 ${
            errors.title ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.title && (
          <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Primary Objective <span style={{ color: brand.colors.orange }}>*</span>
        </label>
        <textarea
          {...register('objective')}
          placeholder="What do you want to achieve with this presentation?"
          rows={3}
          className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white resize-none transition-all text-black placeholder:text-gray-500 ${
            errors.objective ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.objective && (
          <p className="text-xs text-red-500 mt-1">{errors.objective.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Target Audience <span style={{ color: brand.colors.orange }}>*</span>
          </label>
          <select
            {...register('audience')}
            className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all text-black ${
              errors.audience ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select Audience</option>
            <option value="executives">Senior Executives</option>
            <option value="directors">Directors & VPs</option>
            <option value="managers">Managers</option>
            <option value="technical">Technical Team</option>
            <option value="sales">Sales Team</option>
            <option value="clients">Potential Clients</option>
            <option value="investors">Investors</option>
            <option value="mixed">Mixed Audience</option>
          </select>
          {errors.audience && (
            <p className="text-xs text-red-500 mt-1">{errors.audience.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Duration <span style={{ color: brand.colors.orange }}>*</span>
          </label>
          <select
            {...register('duration')}
            className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all text-black ${
              errors.duration ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="15">15 minutes</option>
            <option value="30">30 minutes</option>
            <option value="45">45 minutes</option>
            <option value="60">60 minutes</option>
            <option value="90">90 minutes</option>
          </select>
          {errors.duration && (
            <p className="text-xs text-red-500 mt-1">{errors.duration.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Key Talking Points <span style={{ color: brand.colors.orange }}>*</span>
        </label>
        {errors.keyPoints && (
          <p className="text-xs text-red-500 mt-1 mb-2">{errors.keyPoints.message}</p>
        )}
        {keyPointFields.map((field, index) => (
          <div key={field.id} className="flex gap-2 mb-2">
            <div className="flex-1">
              <input
                {...register(`keyPoints.${index}.text`)}
                placeholder={`Key point ${index + 1}`}
                className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all text-black placeholder:text-gray-500 ${
                  errors.keyPoints?.[index]?.text ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.keyPoints?.[index]?.text && (
                <p className="text-xs text-red-500 mt-1">{errors.keyPoints[index].text.message}</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => removeKeyPoint(index)}
              className="text-gray-400 hover:text-red-500 flex items-center justify-center px-3"
              disabled={keyPointFields.length === 3}
            >
              <Minus size={18} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => appendKeyPoint({ text: '' })}
          className="text-sm font-medium flex items-center gap-1 hover:opacity-80"
          style={{ color: brand.colors.blue }}
        >
          <Plus size={16} /> Add Key Point
        </button>
      </div>

      <div className="pt-4">
        <Button
          type="submit"
          icon={Sparkles}
          size="lg"
          loading={loading}
          disabled={!isValid || loading}
        >
          {loading ? 'Generating...' : 'Generate Presentation Draft'}
        </Button>
        {!isValid && (
          <p className="text-xs text-gray-500 mt-2">Please fill in all required fields before generating</p>
        )}
      </div>
    </form>
  );
};

// ============================================
// RECRUITING MODULE
// ============================================

const RecruitingToolkit = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState({});

  const recruitingTools = [
    {
      id: 'jd-enhancer',
      label: 'JD Enhancer',
      description: 'Improve job descriptions',
      placeholder: 'Paste your job description here...',
      prompt: 'Improve this job description to make it more compelling, inclusive, and effective for attracting top talent.'
    },
    {
      id: 'sourcing-email',
      label: 'Sourcing Email',
      description: 'Generate outreach emails',
      placeholder: 'Describe the role and candidate profile...',
      prompt: 'Create a personalized sourcing email to engage potential candidates for this role. Make it compelling and professional.'
    },
    {
      id: 'boolean-search',
      label: 'Boolean Search',
      description: 'Create search strings',
      placeholder: 'Enter keywords and requirements (e.g., Python developer, 5+ years, remote)...',
      prompt: 'Generate effective Boolean search strings for recruitment databases and LinkedIn based on these requirements.'
    },
    {
      id: 'candidate-submittal',
      label: 'Candidate Submittal',
      description: 'Write submittal summaries',
      placeholder: 'Describe the candidate and role details...',
      prompt: 'Create a professional candidate submittal summary highlighting why this candidate is ideal for the position.'
    },
    {
      id: 'interview-prep',
      label: 'Interview Prep Email',
      description: 'Prepare interview invitations',
      placeholder: 'Enter interview details and role information...',
      prompt: 'Generate a comprehensive interview preparation email with details, expectations, and helpful tips for the candidate.'
    },
    {
      id: 'mock-interview',
      label: 'Mock Interview Questions',
      description: 'Generate interview questions',
      placeholder: 'Describe the role, seniority, and key skills to assess...',
      prompt: 'Create relevant and insightful interview questions to effectively assess candidates for this position.'
    },
    {
      id: 'skills-extractor',
      label: 'Skills/Title Extractor',
      description: 'Extract from unstructured text',
      placeholder: 'Paste resume, job description, or any text...',
      prompt: 'Extract and categorize key skills, job titles, and locations from the provided text.'
    },
    {
      id: 'executive-summary',
      label: 'Executive Summary',
      description: 'Create candidate summaries',
      placeholder: 'Enter candidate details, experience, and qualifications...',
      prompt: 'Write a concise executive summary of this candidate suitable for hiring managers and executives.'
    }
  ];

  const handleGenerate = async (toolIndex) => {
    const tool = recruitingTools[toolIndex];
    const textarea = document.getElementById(`input-${tool.id}`);
    const input = textarea?.value || '';

    if (!input || !input.trim()) {
      alert('Please enter input text before generating');
      return;
    }

    setLoading(prev => ({ ...prev, [tool.id]: true }));

    const requestData = {
      tool: tool.id,
      input: input,
      prompt: tool.prompt
    };

    console.log('Sending request data:', requestData);

    try {
      const response = await fetch(`${API_URL}/api/recruiting/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Error response:', errorData);
        throw new Error(errorData.error || 'Failed to generate content');
      }

      const result = await response.json();
      setResults(prev => ({
        ...prev,
        [tool.id]: result.data.content
      }));
    } catch (error) {
      console.error('Error generating content:', error);
      alert(`Failed to generate content: ${error.message}`);
    } finally {
      setLoading(prev => ({ ...prev, [tool.id]: false }));
    }
  };

  const handleCopy = (content) => {
    navigator.clipboard.writeText(content).then(() => {
      // You could add a toast notification here
    });
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {recruitingTools.map((tool, index) => (
            <button
              key={tool.id}
              onClick={() => setActiveTab(index)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === index
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tool.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tool Content */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {recruitingTools[activeTab].label}
          </h3>
          <p className="text-sm text-gray-500">
            {recruitingTools[activeTab].description}
          </p>
        </div>

        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <textarea
                id={`input-${recruitingTools[activeTab].id}`}
                placeholder={recruitingTools[activeTab].placeholder}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 text-black rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white resize-none placeholder:text-gray-500"
                rows={6}
                defaultValue=""
              />
            </div>

            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">
                AI-powered content generation
              </span>
              <Button
                onClick={() => handleGenerate(activeTab)}
                loading={loading[recruitingTools[activeTab].id]}
                disabled={loading[recruitingTools[activeTab].id]}
              >
                {loading[recruitingTools[activeTab].id] ? 'Generating...' : 'Generate'}
              </Button>
            </div>

            {results[recruitingTools[activeTab].id] && (
              <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-medium text-gray-900">Generated Result</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Copy}
                    onClick={() => handleCopy(results[recruitingTools[activeTab].id])}
                  >
                    Copy
                  </Button>
                </div>
                <div className="text-gray-700 whitespace-pre-wrap">
                  {results[recruitingTools[activeTab].id]}
                </div>
              </div>
            )}
          </div>
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
  const [caseStudyData, setCaseStudyData] = useState(null);
  const [generationId, setGenerationId] = useState(null);
  const [versionHistory, setVersionHistory] = useState([]);

  // Presentation module states
  const [presentationData, setPresentationData] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [presentationVersionHistory, setPresentationVersionHistory] = useState([]);

  // Version history functions
  const handleGenerate = (data, generation_id = null) => {
    setCaseStudyData(data);
    setGenerationId(generation_id);
    setShowPreview(true);

    // Add to version history
    if (data && !generation_id) {
      // Initial generation
      const newVersion = { data, timestamp: new Date().toISOString(), type: 'initial' };
      setVersionHistory(prev => [newVersion, ...prev.slice(0, 2)]); // Keep last 3 versions
    }
  };

  const handleRegenerateWithVersion = (newData, feedback) => {
    setCaseStudyData(newData);

    // Add to version history
    const newVersion = { data: newData, timestamp: new Date().toISOString(), type: 'refinement', feedback };
    setVersionHistory(prev => [newVersion, ...prev.slice(0, 2)]); // Keep last 3 versions
  };

  // Presentation module handlers
  const handlePresentationGenerate = (data) => {
    setPresentationData(data);
    setCurrentSlide(0);
    setShowPreview(true);

    // Add to presentation version history
    const newVersion = { data, timestamp: new Date().toISOString(), type: 'initial' };
    setPresentationVersionHistory(prev => [newVersion, ...prev.slice(0, 2)]);
  };

  const handleSlideFeedback = async (slideIndex, feedback) => {
    if (!presentationData) return;

    try {
      const response = await fetch(`${API_URL}/api/presentation/refine`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          presentation: presentationData,
          slideIndex,
          feedback,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to refine slide');
      }

      const result = await response.json();
      setPresentationData(result.data);

      // Add to version history
      const newVersion = {
        data: result.data,
        timestamp: new Date().toISOString(),
        type: 'refinement',
        feedback,
        slideIndex
      };
      setPresentationVersionHistory(prev => [newVersion, ...prev.slice(0, 2)]);
    } catch (error) {
      console.error('Error refining slide:', error);
      alert('Failed to refine slide. Please try again.');
    }
  };

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
                onClick={() => {
                  setCurrentModule(module.id);
                  setShowPreview(false);
                  setCaseStudyData(null);
                  setPresentationData(null);
                  setCurrentSlide(0);
                }}
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
                <CaseStudyForm onGenerate={handleGenerate} />
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
                      <CaseStudyPreview caseStudyData={caseStudyData} />
                    </Card>

                    <Card className="p-6">
                      <FeedbackPanel
                        onRegenerate={handleRegenerateWithVersion}
                        caseStudyData={caseStudyData}
                      />
                    </Card>

                    <ExportPanel caseStudyData={caseStudyData} />

                    {versionHistory.length > 0 && (
                      <Card className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-sm font-medium text-gray-700">Version History</span>
                          <span className="text-xs text-gray-500">({versionHistory.length} versions)</span>
                        </div>
                        <div className="space-y-2">
                          {versionHistory.map((version, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium text-gray-900">
                                    {version.type === 'initial' ? 'Initial Draft' : `Refinement ${index}`}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {new Date(version.timestamp).toLocaleTimeString()}
                                  </span>
                                </div>
                                {version.feedback && (
                                  <p className="text-xs text-gray-600 mt-1">Feedback: "{version.feedback}"</p>
                                )}
                              </div>
                              <button
                                onClick={() => setCaseStudyData(version.data)}
                                className="ml-4 px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100"
                                disabled={index === 0}
                              >
                                {index === 0 ? 'Current' : 'Restore'}
                              </button>
                            </div>
                          ))}
                        </div>
                      </Card>
                    )}
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
                  <h3 className="font-semibold text-gray-900">Create Presentation</h3>
                </div>
                <PresentationWizard onGenerate={handlePresentationGenerate} />
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
                      <SlidePreview
                        presentationData={presentationData}
                        currentSlide={currentSlide}
                        setCurrentSlide={setCurrentSlide}
                        onSlideFeedback={handleSlideFeedback}
                      />
                    </Card>

                    <PresentationExportPanel presentationData={presentationData} />

                    {presentationVersionHistory.length > 0 && (
                      <Card className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-sm font-medium text-gray-700">Version History</span>
                          <span className="text-xs text-gray-500">({presentationVersionHistory.length} versions)</span>
                        </div>
                        <div className="space-y-2">
                          {presentationVersionHistory.map((version, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium text-gray-900">
                                    {version.type === 'initial' ? 'Initial Draft' : `Refinement ${index}`}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {new Date(version.timestamp).toLocaleTimeString()}
                                  </span>
                                </div>
                                {version.feedback && (
                                  <p className="text-xs text-gray-600 mt-1">
                                    Feedback on slide {version.slideIndex + 1}: "{version.feedback}"
                                  </p>
                                )}
                              </div>
                              <button
                                onClick={() => {
                                  setPresentationData(version.data);
                                  setCurrentSlide(0);
                                }}
                                className="ml-4 px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100"
                                disabled={index === 0}
                              >
                                {index === 0 ? 'Current' : 'Restore'}
                              </button>
                            </div>
                          ))}
                        </div>
                      </Card>
                    )}
                  </>
                ) : (
                  <Card className="p-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                      <Presentation size={24} className="text-gray-400" />
                    </div>
                    <h3 className="font-medium text-gray-900 mb-2">Preview will appear here</h3>
                    <p className="text-sm text-gray-500">Fill out the form and click "Generate" to see your presentation</p>
                  </Card>
                )}
              </div>
            </div>
          )}

          {/* Recruiting Module */}
          {currentModule === 'recruiting' && (
            <div>
              <RecruitingToolkit />
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Powered by Calance AI Labs</span>
          <span>Internal Use Only</span>
          <span>v1.0.0</span>
        </div>
      </footer>
    </div>
  );
}