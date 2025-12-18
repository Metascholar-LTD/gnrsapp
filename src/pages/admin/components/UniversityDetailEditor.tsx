import { useState, useEffect, useRef } from "react";
import { 
  Save, X, Plus, Trash2, Edit2, Eye, 
  GraduationCap, DollarSign, UserCheck, Users, 
  BookOpen, Image as ImageIcon, MapPin, Globe,
  Phone, Mail, Award, TrendingUp, Upload, Link as LinkIcon
} from "lucide-react";
import { toast } from "sonner";
import { BREAKPOINTS, MEDIA_QUERIES } from "@/lib/breakpoints";

interface University {
  id: string;
  name: string;
  region: string;
  type: string;
  tuitionFee: string;
  admissionCutOff: string;
  programs: string;
  specialization: string;
  logo?: string;
  description: string;
  campus?: string[];
  studentPopulation?: string;
  yearEstablished?: string;
  website?: string;
  abbreviation?: string;
  photos?: string[];
  acceptanceRate?: string;
  averageGrantAid?: string;
  undergraduatePopulation?: string;
  fullTimePercentage?: number;
  partTimePercentage?: number;
  malePercentage?: number;
  femalePercentage?: number;
  programEnrollment?: { label: string; percentage: number; color: string }[];
  academics?: {
    studentFacultyRatio?: string;
    graduationRate?: string;
    retentionRate?: string;
  };
  financialAid?: {
    averageAid?: string;
    aidPercentage?: string;
    scholarshipAvailability?: string;
  };
  admissions?: {
    acceptanceRate?: string;
    yieldRate?: string;
    satRange?: string;
    actRange?: string;
  };
  studentLife?: {
    campusHousing?: string;
    clubsAndOrganizations?: string;
    athletics?: string;
  };
  rankings?: { list: string; position: string }[];
  courses?: Record<string, string[]>; // College/Department -> Courses[]
  mastersCourses?: Record<string, Record<string, string[]>>; // College -> Department -> Courses[]
  contact?: {
    address?: string;
    phone?: string;
    email?: string;
  };
}

interface UniversityDetailEditorProps {
  university: University;
  onSave: (data: University) => void;
  onClose: () => void;
  onView?: () => void;
}

const UniversityDetailEditor: React.FC<UniversityDetailEditorProps> = ({
  university,
  onSave,
  onClose,
  onView,
}) => {
  const [activeTab, setActiveTab] = useState<'basic' | 'academics' | 'financial' | 'admissions' | 'student' | 'courses' | 'media' | 'contact'>('basic');
  const [formData, setFormData] = useState<University>(university);
  const [saving, setSaving] = useState(false);
  const [editingCourse, setEditingCourse] = useState<{ college: string; department?: string; level: 'undergraduate' | 'masters' } | null>(null);
  const [newCourseName, setNewCourseName] = useState("");
  const [newPhotoUrl, setNewPhotoUrl] = useState("");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFormData(university);
  }, [university]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof University] as any),
          [child]: type === 'checkbox' ? checked : value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : (type === 'number' ? Number(value) : value),
      }));
    }
  };

  const handleSave = () => {
    onSave(formData);
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success("University details saved successfully");
    }, 500);
  };

  const addArrayItem = (field: string, value: string) => {
    if (!value.trim()) return;
    const currentArray = (formData[field as keyof University] as any[]) || [];
    setFormData(prev => ({
      ...prev,
      [field]: [...currentArray, value.trim()],
    }));
  };

  const removeArrayItem = (field: string, index: number) => {
    const currentArray = (formData[field as keyof University] as any[]) || [];
    setFormData(prev => ({
      ...prev,
      [field]: currentArray.filter((_, i) => i !== index),
    }));
  };

  // Predefined color palette
  const availableColors = [
    { value: "#3b82f6", name: "Blue" },
    { value: "#ef4444", name: "Red" },
    { value: "#10b981", name: "Green" },
    { value: "#f59e0b", name: "Amber" },
    { value: "#8b5cf6", name: "Purple" },
    { value: "#ec4899", name: "Pink" },
    { value: "#06b6d4", name: "Cyan" },
    { value: "#f97316", name: "Orange" },
    { value: "#84cc16", name: "Lime" },
    { value: "#6366f1", name: "Indigo" },
  ];

  const getAvailableColorsForProgram = (currentIndex: number) => {
    const currentProgram = formData.programEnrollment?.[currentIndex];
    const currentColor = currentProgram?.color;
    const usedColors = (formData.programEnrollment || [])
      .map((p, idx) => idx !== currentIndex ? p.color : null)
      .filter(Boolean) as string[];
    
    // Always include the currently selected color, even if it's used elsewhere
    return availableColors.filter(color => 
      !usedColors.includes(color.value) || color.value === currentColor
    );
  };

  const addProgramEnrollment = () => {
    const usedColors = (formData.programEnrollment || []).map(p => p.color);
    const firstAvailableColor = availableColors.find(c => !usedColors.includes(c.value)) || availableColors[0];
    
    const newProgram = {
      label: "",
      percentage: 0,
      color: firstAvailableColor.value,
    };
    setFormData(prev => ({
      ...prev,
      programEnrollment: [...(prev.programEnrollment || []), newProgram],
    }));
  };

  const updateProgramEnrollment = (index: number, field: string, value: string | number) => {
    const programs = [...(formData.programEnrollment || [])];
    programs[index] = { ...programs[index], [field]: value };
    setFormData(prev => ({ ...prev, programEnrollment: programs }));
  };

  const removeProgramEnrollment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      programEnrollment: (prev.programEnrollment || []).filter((_, i) => i !== index),
    }));
  };

  const addRanking = () => {
    const newRanking = { list: "", position: "" };
    setFormData(prev => ({
      ...prev,
      rankings: [...(prev.rankings || []), newRanking],
    }));
  };

  const updateRanking = (index: number, field: string, value: string) => {
    const rankings = [...(formData.rankings || [])];
    rankings[index] = { ...rankings[index], [field]: value };
    setFormData(prev => ({ ...prev, rankings }));
  };

  const removeRanking = (index: number) => {
    setFormData(prev => ({
      ...prev,
      rankings: (prev.rankings || []).filter((_, i) => i !== index),
    }));
  };

  const addCollege = (level: 'undergraduate' | 'masters') => {
    const collegeName = prompt("Enter college/department name:");
    if (!collegeName) return;
    
    if (level === 'undergraduate') {
      setFormData(prev => ({
        ...prev,
        courses: {
          ...(prev.courses || {}),
          [collegeName]: [],
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        mastersCourses: {
          ...(prev.mastersCourses || {}),
          [collegeName]: {},
        },
      }));
    }
  };

  const addCourse = (college: string, department?: string) => {
    if (!newCourseName.trim()) return;
    
    if (department) {
      // Masters course
      setFormData(prev => ({
        ...prev,
        mastersCourses: {
          ...(prev.mastersCourses || {}),
          [college]: {
            ...(prev.mastersCourses?.[college] || {}),
            [department]: [
              ...(prev.mastersCourses?.[college]?.[department] || []),
              newCourseName.trim(),
            ],
          },
        },
      }));
    } else {
      // Undergraduate course
      setFormData(prev => ({
        ...prev,
        courses: {
          ...(prev.courses || {}),
          [college]: [
            ...(prev.courses?.[college] || []),
            newCourseName.trim(),
          ],
        },
      }));
    }
    setNewCourseName("");
    setEditingCourse(null);
  };

  const removeCourse = (college: string, courseIndex: number, department?: string) => {
    if (department) {
      const deptCourses = [...(formData.mastersCourses?.[college]?.[department] || [])];
      deptCourses.splice(courseIndex, 1);
      setFormData(prev => ({
        ...prev,
        mastersCourses: {
          ...(prev.mastersCourses || {}),
          [college]: {
            ...(prev.mastersCourses?.[college] || {}),
            [department]: deptCourses,
          },
        },
      }));
    } else {
      const collegeCourses = [...(formData.courses?.[college] || [])];
      collegeCourses.splice(courseIndex, 1);
      setFormData(prev => ({
        ...prev,
        courses: {
          ...(prev.courses || {}),
          [college]: collegeCourses,
        },
      }));
    }
  };

  const addDepartment = (college: string) => {
    const deptName = prompt("Enter department name:");
    if (!deptName) return;
    setFormData(prev => ({
      ...prev,
      mastersCourses: {
        ...(prev.mastersCourses || {}),
        [college]: {
          ...(prev.mastersCourses?.[college] || {}),
          [deptName]: [],
        },
      },
    }));
  };

  const addPhotoUrl = () => {
    if (!newPhotoUrl.trim()) {
      toast.error("Please enter a valid photo URL");
      return;
    }
    addArrayItem("photos", newPhotoUrl.trim());
    setNewPhotoUrl("");
    toast.success("Photo URL added");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    setUploadingPhoto(true);
    try {
      // Convert file to base64 or upload to cloud storage
      // For now, we'll create a local object URL as a placeholder
      // In production, you'd upload to Cloudinary, AWS S3, etc.
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // For now, we'll use the object URL. In production, replace with actual upload URL
        const objectUrl = URL.createObjectURL(file);
        addArrayItem("photos", objectUrl);
        setUploadingPhoto(false);
        toast.success("Photo uploaded successfully");
      };
      reader.onerror = () => {
        setUploadingPhoto(false);
        toast.error("Failed to read file");
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setUploadingPhoto(false);
      toast.error("Failed to upload photo");
      console.error("Upload error:", error);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const updatePhotoUrl = (index: number, url: string) => {
    const photos = [...(formData.photos || [])];
    photos[index] = url;
    setFormData(prev => ({ ...prev, photos }));
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: GraduationCap },
    { id: 'academics', label: 'Academics', icon: BookOpen },
    { id: 'financial', label: 'Financial Aid', icon: DollarSign },
    { id: 'admissions', label: 'Admissions', icon: UserCheck },
    { id: 'student', label: 'Student Life', icon: Users },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'media', label: 'Media', icon: ImageIcon },
    { id: 'contact', label: 'Contact', icon: Phone },
  ];

  const isolatedStyles = `
    #ude-wrapper {
      width: 100%;
      background: #ffffff;
      border-radius: 0.5rem;
      border: 1px solid #e5e7eb;
      overflow: hidden;
    }

      #ude-header {
        padding: 1.5rem 2rem;
        border-bottom: 3px solid #dc2626;
        background: #000000;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

    #ude-header-left {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

      #ude-title {
        font-size: 1.5rem;
        font-weight: 700;
        color: #ffffff;
        margin: 0;
      }

    #ude-header-actions {
      display: flex;
      gap: 0.75rem;
    }

    .ude-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.625rem 1.25rem;
      border: none;
      border-radius: 0.375rem;
      cursor: pointer;
      font-size: 0.875rem;
      font-weight: 500;
      transition: all 0.2s;
    }

    .ude-btn-primary {
      background: #2563eb;
      color: #ffffff;
    }

    .ude-btn-primary:hover:not(:disabled) {
      background: #1d4ed8;
    }

    .ude-btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .ude-btn-secondary {
      background: #374151;
      color: #ffffff;
      border: 1px solid #374151;
    }

    .ude-btn-secondary:hover {
      background: #4b5563;
      border-color: #4b5563;
    }

    #ude-tabs {
      display: flex;
      border-bottom: 1px solid #e5e7eb;
      background: #ffffff;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
    }

    #ude-tabs::-webkit-scrollbar {
      height: 4px;
    }

    #ude-tabs::-webkit-scrollbar-track {
      background: #f3f4f6;
    }

    #ude-tabs::-webkit-scrollbar-thumb {
      background: #d1d5db;
      border-radius: 2px;
    }

    .ude-tab {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem 1.5rem;
      border: none;
      background: none;
      cursor: pointer;
      font-size: 0.875rem;
      font-weight: 500;
      color: #6b7280;
      border-bottom: 2px solid transparent;
      transition: all 0.2s;
      white-space: nowrap;
    }

    .ude-tab:hover {
      color: #374151;
      background: #f9fafb;
    }

    .ude-tab.active {
      color: #2563eb;
      border-bottom-color: #2563eb;
      background: #f0f7ff;
    }

    #ude-content {
      padding: 2rem;
      min-height: 400px;
    }

    .ude-section {
      display: none;
    }

    .ude-section.active {
      display: block;
    }

    .ude-form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .ude-form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .ude-form-group-full {
      grid-column: 1 / -1;
    }

    .ude-form-label {
      font-size: 0.75rem;
      font-weight: 600;
      color: #374151;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .ude-form-label .required {
      color: #ef4444;
    }

    .ude-form-input,
    .ude-form-textarea,
    .ude-form-select {
      padding: 0.625rem 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      color: #111827;
      background: #ffffff;
      transition: all 0.2s;
      font-family: inherit;
    }

    .ude-form-textarea {
      resize: vertical;
      min-height: 100px;
    }

    .ude-form-input:focus,
    .ude-form-textarea:focus,
    .ude-form-select:focus {
      outline: none;
      border-color: #2563eb;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }

    .ude-array-input-group {
      display: flex;
      gap: 0.5rem;
      margin-top: 0.5rem;
    }

    .ude-array-input {
      flex: 1;
    }

    .ude-array-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-top: 0.5rem;
    }

    .ude-array-tag {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.375rem 0.75rem;
      background: #f3f4f6;
      border: 1px solid #d1d5db;
      border-radius: 0.375rem;
      font-size: 0.75rem;
      color: #374151;
    }

    .ude-array-tag-remove {
      cursor: pointer;
      color: #6b7280;
      transition: color 0.2s;
    }

    .ude-array-tag-remove:hover {
      color: #ef4444;
    }

    .ude-item-card {
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 0.375rem;
      padding: 1rem;
      margin-bottom: 0.75rem;
    }

    .ude-item-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;
    }

    .ude-item-card-title {
      font-weight: 600;
      color: #111827;
      font-size: 0.875rem;
    }

    .ude-item-card-actions {
      display: flex;
      gap: 0.5rem;
    }

    .ude-icon-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      padding: 0;
      border: 1px solid #4b5563;
      border-radius: 0.375rem;
      background: #374151;
      color: #ffffff;
      cursor: pointer;
      transition: all 0.2s;
    }

    .ude-icon-btn:hover {
      background: #4b5563;
      border-color: #6b7280;
      color: #ffffff;
    }

    .ude-icon-btn-danger:hover {
      background: #dc2626;
      border-color: #dc2626;
      color: #ffffff;
    }

    .ude-courses-level-tabs {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
      border-bottom: 1px solid #e5e7eb;
    }

    .ude-courses-level-tab {
      padding: 0.75rem 1.5rem;
      border: none;
      background: none;
      cursor: pointer;
      font-size: 0.875rem;
      font-weight: 500;
      color: #6b7280;
      border-bottom: 2px solid transparent;
      transition: all 0.2s;
    }

    .ude-courses-level-tab.active {
      color: #2563eb;
      border-bottom-color: #2563eb;
    }

    .ude-college-card {
      background: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
      padding: 1.5rem;
      margin-bottom: 1rem;
    }

    .ude-college-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid #e5e7eb;
    }

    .ude-college-title {
      font-size: 1rem;
      font-weight: 600;
      color: #111827;
    }

    .ude-course-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .ude-course-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem 0.75rem;
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      color: #374151;
    }

    .ude-section-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: #111827;
      margin: 0 0 1.5rem 0;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid #e5e7eb;
    }

    .ude-program-table-header {
      display: grid;
      grid-template-columns: 30px 2fr 100px 140px 40px;
      gap: 0.75rem;
      padding: 0.625rem 0.75rem;
    }

    .ude-program-table-row {
      display: grid;
      grid-template-columns: 30px 2fr 100px 140px 40px;
      gap: 0.75rem;
      padding: 0.625rem 0.75rem;
      align-items: center;
    }

    .ude-photo-table-header {
      display: grid;
      grid-template-columns: 30px 80px 1fr 40px;
      gap: 0.75rem;
      padding: 0.625rem 0.75rem;
    }

    .ude-photo-table-row {
      display: grid;
      grid-template-columns: 30px 80px 1fr 40px;
      gap: 0.75rem;
      padding: 0.625rem 0.75rem;
      align-items: center;
    }

    ${MEDIA_QUERIES.MOBILE} {
      #ude-header {
        padding: 1rem;
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }

      #ude-header-actions {
        width: 100%;
        justify-content: flex-end;
      }

      #ude-content {
        padding: 1rem;
      }

      .ude-form-grid {
        grid-template-columns: 1fr;
      }

      .ude-program-table-header {
        display: none;
      }

      .ude-program-table-row {
        grid-template-columns: 1fr;
        gap: 0.5rem;
        padding: 0.75rem;
        border-bottom: 1px solid #e5e7eb !important;
      }
      
      .ude-program-table-row > div:first-child {
        display: none;
      }

      .ude-program-table-row input,
      .ude-program-table-row select {
        width: 100%;
      }

      .ude-program-table-row > div:last-child {
        display: flex;
        justify-content: flex-end;
        margin-top: 0.5rem;
      }

      .ude-photo-table-header {
        display: none;
      }

      .ude-photo-table-row {
        grid-template-columns: 1fr;
        gap: 0.5rem;
        padding: 0.75rem;
        border-bottom: 1px solid #e5e7eb !important;
      }
      
      .ude-photo-table-row > div:first-child {
        display: none;
      }

      .ude-photo-table-row input {
        width: 100%;
      }

      .ude-photo-table-row > div:last-child {
        display: flex;
        justify-content: flex-end;
        margin-top: 0.5rem;
      }
    }
  `;

  return (
    <div id="ude-wrapper">
      <style>{isolatedStyles}</style>
      
      <div id="ude-header">
        <div id="ude-header-left">
          <h2 id="ude-title">{formData.name} - Detailed Editor</h2>
        </div>
        <div id="ude-header-actions">
          {onView && (
            <button className="ude-btn ude-btn-secondary" onClick={onView}>
              <Eye size={16} />
              View Page
            </button>
          )}
          <button className="ude-btn ude-btn-secondary" onClick={onClose}>
            <X size={16} />
            Close
          </button>
          <button className="ude-btn ude-btn-primary" onClick={handleSave} disabled={saving}>
            <Save size={16} />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <div id="ude-tabs">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              className={`ude-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id as any)}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div id="ude-content">
        {/* Basic Info Tab */}
        <div className={`ude-section ${activeTab === 'basic' ? 'active' : ''}`}>
          <h3 className="ude-section-title">Basic Information</h3>
          <div className="ude-form-grid">
            <div className="ude-form-group">
              <label className="ude-form-label">
                University Name <span className="required">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="ude-form-input"
              />
            </div>

            <div className="ude-form-group">
              <label className="ude-form-label">
                Abbreviation
              </label>
              <input
                type="text"
                name="abbreviation"
                value={formData.abbreviation || ""}
                onChange={handleInputChange}
                className="ude-form-input"
                placeholder="e.g., UG, KNUST"
              />
            </div>

            <div className="ude-form-group" style={{ gridColumn: "span 1" }}>
              <label className="ude-form-label">
                Region <span className="required">*</span>
              </label>
              <input
                type="text"
                name="region"
                value={formData.region}
                onChange={handleInputChange}
                className="ude-form-input"
              />
            </div>

            <div className="ude-form-group" style={{ gridColumn: "span 1" }}>
              <label className="ude-form-label">
                Type <span className="required">*</span>
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="ude-form-select"
              >
                <option value="Public">Public</option>
                <option value="Private">Private</option>
              </select>
            </div>

            <div className="ude-form-group" style={{ gridColumn: "span 1" }}>
              <label className="ude-form-label">Year Established</label>
              <input
                type="text"
                name="yearEstablished"
                value={formData.yearEstablished || ""}
                onChange={handleInputChange}
                className="ude-form-input"
                placeholder="e.g., 1948"
              />
            </div>

            <div className="ude-form-group">
              <label className="ude-form-label">Student Population</label>
              <input
                type="text"
                name="studentPopulation"
                value={formData.studentPopulation || ""}
                onChange={handleInputChange}
                className="ude-form-input"
                placeholder="e.g., 40,000+"
              />
            </div>

            <div className="ude-form-group">
              <label className="ude-form-label">Tuition Fee</label>
              <input
                type="text"
                name="tuitionFee"
                value={formData.tuitionFee}
                onChange={handleInputChange}
                className="ude-form-input"
                placeholder="e.g., GHS 2,500 - 4,500"
              />
            </div>

            <div className="ude-form-group">
              <label className="ude-form-label">Admission Cut-off</label>
              <input
                type="text"
                name="admissionCutOff"
                value={formData.admissionCutOff}
                onChange={handleInputChange}
                className="ude-form-input"
                placeholder="e.g., Aggregate 6-24"
              />
            </div>

            <div className="ude-form-group">
              <label className="ude-form-label">Programs</label>
              <input
                type="text"
                name="programs"
                value={formData.programs}
                onChange={handleInputChange}
                className="ude-form-input"
                placeholder="e.g., 100+ Programs"
              />
            </div>

            <div className="ude-form-group">
              <label className="ude-form-label">Logo URL</label>
              <input
                type="text"
                name="logo"
                value={formData.logo || ""}
                onChange={handleInputChange}
                className="ude-form-input"
                placeholder="https://..."
              />
            </div>

            <div className="ude-form-group">
              <label className="ude-form-label">Website</label>
              <input
                type="text"
                name="website"
                value={formData.website || ""}
                onChange={handleInputChange}
                className="ude-form-input"
                placeholder="www.university.edu.gh"
              />
            </div>

            <div className="ude-form-group au-form-group-full">
              <label className="ude-form-label">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="ude-form-textarea"
                rows={6}
              />
            </div>

            <div className="ude-form-group au-form-group-full">
              <label className="ude-form-label">Campus Locations</label>
              <div className="ude-array-input-group">
                <input
                  type="text"
                  className="ude-form-input ude-array-input"
                  placeholder="Add campus location..."
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addArrayItem("campus", e.currentTarget.value);
                      e.currentTarget.value = "";
                    }
                  }}
                />
              </div>
              {(formData.campus || []).length > 0 && (
                <div className="ude-array-tags">
                  {(formData.campus || []).map((campus, index) => (
                    <div key={index} className="ude-array-tag">
                      <span>{campus}</span>
                      <span
                        className="ude-array-tag-remove"
                        onClick={() => removeArrayItem("campus", index)}
                      >
                        <X size={12} />
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Academics Tab */}
        <div className={`ude-section ${activeTab === 'academics' ? 'active' : ''}`}>
          <h3 className="ude-section-title">Academic Information</h3>
          <div className="ude-form-grid">
            <div className="ude-form-group">
              <label className="ude-form-label">Student-Faculty Ratio</label>
              <input
                type="text"
                name="academics.studentFacultyRatio"
                value={formData.academics?.studentFacultyRatio || ""}
                onChange={handleInputChange}
                className="ude-form-input"
                placeholder="e.g., 18:1"
              />
            </div>

            <div className="ude-form-group">
              <label className="ude-form-label">Graduation Rate</label>
              <input
                type="text"
                name="academics.graduationRate"
                value={formData.academics?.graduationRate || ""}
                onChange={handleInputChange}
                className="ude-form-input"
                placeholder="e.g., 75%"
              />
            </div>

            <div className="ude-form-group">
              <label className="ude-form-label">Retention Rate</label>
              <input
                type="text"
                name="academics.retentionRate"
                value={formData.academics?.retentionRate || ""}
                onChange={handleInputChange}
                className="ude-form-input"
                placeholder="e.g., 85%"
              />
            </div>

            <div className="ude-form-group">
              <label className="ude-form-label">Full-Time Percentage</label>
              <input
                type="number"
                name="fullTimePercentage"
                value={formData.fullTimePercentage || ""}
                onChange={handleInputChange}
                className="ude-form-input"
                placeholder="e.g., 85"
                min="0"
                max="100"
              />
            </div>

            <div className="ude-form-group">
              <label className="ude-form-label">Part-Time Percentage</label>
              <input
                type="number"
                name="partTimePercentage"
                value={formData.partTimePercentage || ""}
                onChange={handleInputChange}
                className="ude-form-input"
                placeholder="e.g., 15"
                min="0"
                max="100"
              />
            </div>

            <div className="ude-form-group">
              <label className="ude-form-label">Male Percentage</label>
              <input
                type="number"
                name="malePercentage"
                value={formData.malePercentage || ""}
                onChange={handleInputChange}
                className="ude-form-input"
                placeholder="e.g., 55"
                min="0"
                max="100"
              />
            </div>

            <div className="ude-form-group">
              <label className="ude-form-label">Female Percentage</label>
              <input
                type="number"
                name="femalePercentage"
                value={formData.femalePercentage || ""}
                onChange={handleInputChange}
                className="ude-form-input"
                placeholder="e.g., 45"
                min="0"
                max="100"
              />
            </div>

            <div className="ude-form-group">
              <label className="ude-form-label">Undergraduate Population</label>
              <input
                type="text"
                name="undergraduatePopulation"
                value={formData.undergraduatePopulation || ""}
                onChange={handleInputChange}
                className="ude-form-input"
                placeholder="e.g., 35,000"
              />
            </div>
          </div>

          <div style={{ marginTop: "2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
              <h4 style={{ fontSize: "0.875rem", fontWeight: 600, color: "#374151", margin: 0, textTransform: "uppercase", letterSpacing: "0.05em" }}>Program Enrollment</h4>
              <button
                className="ude-btn ude-btn-secondary"
                onClick={addProgramEnrollment}
                style={{ padding: "0.4rem 0.75rem", fontSize: "0.75rem" }}
              >
                <Plus size={12} />
                Add Program
              </button>
            </div>
            <div style={{ 
              background: "#ffffff", 
              border: "1px solid #e5e7eb", 
              borderRadius: "0.5rem",
              overflow: "hidden"
            }}>
              {(formData.programEnrollment || []).length === 0 ? (
                <div style={{ 
                  textAlign: "center", 
                  padding: "1.5rem", 
                  color: "#6b7280",
                  fontSize: "0.875rem"
                }}>
                  No programs added yet. Click "Add Program" to get started.
                </div>
              ) : (
                <>
                  {/* Table Header */}
                  <div className="ude-program-table-header" style={{
                    display: "grid",
                    gridTemplateColumns: "30px 2fr 100px 140px 40px",
                    gap: "0.75rem",
                    padding: "0.625rem 0.75rem",
                    background: "#f9fafb",
                    borderBottom: "1px solid #e5e7eb",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: "#6b7280",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em"
                  }}>
                    <div>#</div>
                    <div>Program Name</div>
                    <div>Percentage</div>
                    <div>Color</div>
                    <div></div>
                  </div>
                  {/* Program Rows */}
                  {(formData.programEnrollment || []).map((program, index) => {
                    const availableColors = getAvailableColorsForProgram(index);
                    return (
                      <div 
                        key={index}
                        className="ude-program-table-row"
                        style={{
                          display: "grid",
                          gridTemplateColumns: "30px 2fr 100px 140px 40px",
                          gap: "0.75rem",
                          padding: "0.625rem 0.75rem",
                          borderBottom: index < (formData.programEnrollment?.length || 0) - 1 ? "1px solid #f3f4f6" : "none",
                          alignItems: "center",
                          transition: "background 0.15s"
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "#f9fafb"}
                        onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                      >
                        <div style={{ fontSize: "0.875rem", color: "#6b7280", fontWeight: 500 }}>
                          {index + 1}
                        </div>
                        <input
                          type="text"
                          value={program.label}
                          onChange={(e) => updateProgramEnrollment(index, "label", e.target.value)}
                          className="ude-form-input"
                          placeholder="Enter program name"
                          style={{ 
                            padding: "0.5rem 0.625rem",
                            fontSize: "0.875rem",
                            margin: 0
                          }}
                        />
                        <input
                          type="number"
                          value={program.percentage}
                          onChange={(e) => updateProgramEnrollment(index, "percentage", Number(e.target.value))}
                          className="ude-form-input"
                          placeholder="0"
                          min="0"
                          max="100"
                          style={{ 
                            padding: "0.5rem 0.625rem",
                            fontSize: "0.875rem",
                            margin: 0
                          }}
                        />
                        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                          <div style={{
                            width: "24px",
                            height: "24px",
                            backgroundColor: program.color,
                            borderRadius: "0.25rem",
                            border: "1px solid #d1d5db",
                            flexShrink: 0
                          }} />
                          <select
                            value={program.color}
                            onChange={(e) => updateProgramEnrollment(index, "color", e.target.value)}
                            className="ude-form-select"
                            style={{ 
                              flex: 1,
                              padding: "0.5rem 0.625rem",
                              fontSize: "0.875rem",
                              margin: 0
                            }}
                          >
                            {availableColors.length === 0 ? (
                              <option value={program.color}>
                                {availableColors.find(c => c.value === program.color)?.name || "No colors"}
                              </option>
                            ) : (
                              availableColors.map((color) => (
                                <option key={color.value} value={color.value}>
                                  {color.name}
                                </option>
                              ))
                            )}
                          </select>
                        </div>
                        <button
                          className="ude-icon-btn ude-icon-btn-danger"
                          onClick={() => removeProgramEnrollment(index)}
                          style={{ width: "28px", height: "28px" }}
                          title="Remove program"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Financial Aid Tab */}
        <div className={`ude-section ${activeTab === 'financial' ? 'active' : ''}`}>
          <h3 className="ude-section-title">Financial Aid Information</h3>
          <div className="ude-form-grid">
            <div className="ude-form-group">
              <label className="ude-form-label">Average Aid</label>
              <input
                type="text"
                name="financialAid.averageAid"
                value={formData.financialAid?.averageAid || ""}
                onChange={handleInputChange}
                className="ude-form-input"
                placeholder="e.g., GHS 800 - 1,500"
              />
            </div>

            <div className="ude-form-group">
              <label className="ude-form-label">Aid Percentage</label>
              <input
                type="text"
                name="financialAid.aidPercentage"
                value={formData.financialAid?.aidPercentage || ""}
                onChange={handleInputChange}
                className="ude-form-input"
                placeholder="e.g., 45%"
              />
            </div>

            <div className="ude-form-group">
              <label className="ude-form-label">Scholarship Availability</label>
              <input
                type="text"
                name="financialAid.scholarshipAvailability"
                value={formData.financialAid?.scholarshipAvailability || ""}
                onChange={handleInputChange}
                className="ude-form-input"
                placeholder="e.g., Available"
              />
            </div>

            <div className="ude-form-group">
              <label className="ude-form-label">Average Grant Aid</label>
              <input
                type="text"
                name="averageGrantAid"
                value={formData.averageGrantAid || ""}
                onChange={handleInputChange}
                className="ude-form-input"
                placeholder="e.g., GHS 800 - 1,500"
              />
            </div>
          </div>
        </div>

        {/* Admissions Tab */}
        <div className={`ude-section ${activeTab === 'admissions' ? 'active' : ''}`}>
          <h3 className="ude-section-title">Admissions Information</h3>
          <div className="ude-form-grid">
            <div className="ude-form-group">
              <label className="ude-form-label">Acceptance Rate</label>
              <input
                type="text"
                name="admissions.acceptanceRate"
                value={formData.admissions?.acceptanceRate || ""}
                onChange={handleInputChange}
                className="ude-form-input"
                placeholder="e.g., 65%"
              />
            </div>

            <div className="ude-form-group">
              <label className="ude-form-label">Yield Rate</label>
              <input
                type="text"
                name="admissions.yieldRate"
                value={formData.admissions?.yieldRate || ""}
                onChange={handleInputChange}
                className="ude-form-input"
                placeholder="e.g., 40%"
              />
            </div>

            <div className="ude-form-group">
              <label className="ude-form-label">SAT Range</label>
              <input
                type="text"
                name="admissions.satRange"
                value={formData.admissions?.satRange || ""}
                onChange={handleInputChange}
                className="ude-form-input"
                placeholder="e.g., 1200-1400"
              />
            </div>

            <div className="ude-form-group">
              <label className="ude-form-label">ACT Range</label>
              <input
                type="text"
                name="admissions.actRange"
                value={formData.admissions?.actRange || ""}
                onChange={handleInputChange}
                className="ude-form-input"
                placeholder="e.g., 25-30"
              />
            </div>
          </div>
        </div>

        {/* Student Life Tab */}
        <div className={`ude-section ${activeTab === 'student' ? 'active' : ''}`}>
          <h3 className="ude-section-title">Student Life Information</h3>
          <div className="ude-form-grid">
            <div className="ude-form-group">
              <label className="ude-form-label">Campus Housing</label>
              <input
                type="text"
                name="studentLife.campusHousing"
                value={formData.studentLife?.campusHousing || ""}
                onChange={handleInputChange}
                className="ude-form-input"
                placeholder="e.g., Available"
              />
            </div>

            <div className="ude-form-group">
              <label className="ude-form-label">Clubs & Organizations</label>
              <input
                type="text"
                name="studentLife.clubsAndOrganizations"
                value={formData.studentLife?.clubsAndOrganizations || ""}
                onChange={handleInputChange}
                className="ude-form-input"
                placeholder="e.g., 100+"
              />
            </div>

            <div className="ude-form-group">
              <label className="ude-form-label">Athletics</label>
              <input
                type="text"
                name="studentLife.athletics"
                value={formData.studentLife?.athletics || ""}
                onChange={handleInputChange}
                className="ude-form-input"
                placeholder="e.g., Active"
              />
            </div>
          </div>

          <div style={{ marginTop: "2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h4 style={{ fontSize: "1rem", fontWeight: 600, color: "#111827", margin: 0 }}>Rankings</h4>
              <button
                className="ude-btn ude-btn-secondary"
                onClick={addRanking}
                style={{ padding: "0.5rem 1rem", fontSize: "0.75rem" }}
              >
                <Plus size={14} />
                Add Ranking
              </button>
            </div>
            {(formData.rankings || []).map((ranking, index) => (
              <div key={index} className="ude-item-card">
                <div className="ude-item-card-header">
                  <span className="ude-item-card-title">Ranking {index + 1}</span>
                  <div className="ude-item-card-actions">
                    <button
                      className="ude-icon-btn ude-icon-btn-danger"
                      onClick={() => removeRanking(index)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <div className="ude-form-grid" style={{ gap: "1rem" }}>
                  <div className="ude-form-group">
                    <label className="ude-form-label">List Name</label>
                    <input
                      type="text"
                      value={ranking.list}
                      onChange={(e) => updateRanking(index, "list", e.target.value)}
                      className="ude-form-input"
                      placeholder="e.g., Top Universities in Ghana"
                    />
                  </div>
                  <div className="ude-form-group">
                    <label className="ude-form-label">Position</label>
                    <input
                      type="text"
                      value={ranking.position}
                      onChange={(e) => updateRanking(index, "position", e.target.value)}
                      className="ude-form-input"
                      placeholder="e.g., #1"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Courses Tab */}
        <div className={`ude-section ${activeTab === 'courses' ? 'active' : ''}`}>
          <h3 className="ude-section-title">Courses Offered</h3>
          
          <div className="ude-courses-level-tabs">
            <button
              className={`ude-courses-level-tab ${!editingCourse || editingCourse.level === 'undergraduate' ? 'active' : ''}`}
              onClick={() => setEditingCourse(null)}
            >
              Undergraduate
            </button>
            <button
              className={`ude-courses-level-tab ${editingCourse?.level === 'masters' ? 'active' : ''}`}
              onClick={() => setEditingCourse(null)}
            >
              Postgraduate/Masters
            </button>
          </div>

          {/* Undergraduate Courses */}
          {(!editingCourse || editingCourse.level === 'undergraduate') && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <h4 style={{ fontSize: "1rem", fontWeight: 600, color: "#111827", margin: 0 }}>Undergraduate Courses</h4>
                <button
                  className="ude-btn ude-btn-secondary"
                  onClick={() => addCollege('undergraduate')}
                  style={{ padding: "0.5rem 1rem", fontSize: "0.75rem" }}
                >
                  <Plus size={14} />
                  Add College/Department
                </button>
              </div>

              {Object.entries(formData.courses || {}).map(([college, courses]) => (
                <div key={college} className="ude-college-card">
                  <div className="ude-college-header">
                    <h5 className="ude-college-title">{college}</h5>
                    <div className="ude-item-card-actions">
                      <button
                        className="ude-icon-btn"
                        onClick={() => {
                          setEditingCourse({ college, level: 'undergraduate' });
                          setNewCourseName("");
                        }}
                      >
                        <Plus size={14} />
                      </button>
                      <button
                        className="ude-icon-btn ude-icon-btn-danger"
                        onClick={() => {
                          const newCourses = { ...formData.courses };
                          delete newCourses[college];
                          setFormData(prev => ({ ...prev, courses: newCourses }));
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {editingCourse?.college === college && editingCourse.level === 'undergraduate' && (
                    <div className="ude-array-input-group" style={{ marginBottom: "0.75rem" }}>
                      <input
                        type="text"
                        className="ude-form-input ude-array-input"
                        placeholder="Enter course name..."
                        value={newCourseName}
                        onChange={(e) => setNewCourseName(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addCourse(college);
                          }
                        }}
                      />
                      <button
                        className="ude-btn ude-btn-primary"
                        onClick={() => addCourse(college)}
                        style={{ padding: "0.5rem 1rem" }}
                      >
                        Add
                      </button>
                      <button
                        className="ude-btn ude-btn-secondary"
                        onClick={() => setEditingCourse(null)}
                        style={{ padding: "0.5rem 1rem" }}
                      >
                        Cancel
                      </button>
                    </div>
                  )}

                  <div className="ude-course-list">
                    {courses.map((course, courseIndex) => (
                      <div key={courseIndex} className="ude-course-item">
                        <span>{course}</span>
                        <button
                          className="ude-icon-btn ude-icon-btn-danger"
                          onClick={() => removeCourse(college, courseIndex)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Masters Courses */}
          {editingCourse?.level === 'masters' && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <h4 style={{ fontSize: "1rem", fontWeight: 600, color: "#111827", margin: 0 }}>Postgraduate/Masters Courses</h4>
                <button
                  className="ude-btn ude-btn-secondary"
                  onClick={() => addCollege('masters')}
                  style={{ padding: "0.5rem 1rem", fontSize: "0.75rem" }}
                >
                  <Plus size={14} />
                  Add College
                </button>
              </div>

              {Object.entries(formData.mastersCourses || {}).map(([college, departments]) => (
                <div key={college} className="ude-college-card">
                  <div className="ude-college-header">
                    <h5 className="ude-college-title">{college}</h5>
                    <div className="ude-item-card-actions">
                      <button
                        className="ude-icon-btn"
                        onClick={() => addDepartment(college)}
                      >
                        <Plus size={14} />
                      </button>
                      <button
                        className="ude-icon-btn ude-icon-btn-danger"
                        onClick={() => {
                          const newMastersCourses = { ...formData.mastersCourses };
                          delete newMastersCourses[college];
                          setFormData(prev => ({ ...prev, mastersCourses: newMastersCourses }));
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {Object.entries(departments).map(([department, courses]) => (
                    <div key={department} style={{ marginBottom: "1rem", paddingLeft: "1rem", borderLeft: "2px solid #e5e7eb" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                        <h6 style={{ fontSize: "0.875rem", fontWeight: 600, color: "#374151", margin: 0 }}>{department}</h6>
                        <div className="ude-item-card-actions">
                          <button
                            className="ude-icon-btn"
                            onClick={() => {
                              setEditingCourse({ college, department, level: 'masters' });
                              setNewCourseName("");
                            }}
                          >
                            <Plus size={14} />
                          </button>
                          <button
                            className="ude-icon-btn ude-icon-btn-danger"
                            onClick={() => {
                              const newDepts = { ...formData.mastersCourses?.[college] };
                              delete newDepts[department];
                              setFormData(prev => ({
                                ...prev,
                                mastersCourses: {
                                  ...(prev.mastersCourses || {}),
                                  [college]: newDepts,
                                },
                              }));
                            }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      {editingCourse?.college === college && editingCourse.department === department && (
                        <div className="ude-array-input-group" style={{ marginBottom: "0.75rem" }}>
                          <input
                            type="text"
                            className="ude-form-input ude-array-input"
                            placeholder="Enter course name..."
                            value={newCourseName}
                            onChange={(e) => setNewCourseName(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                addCourse(college, department);
                              }
                            }}
                          />
                          <button
                            className="ude-btn ude-btn-primary"
                            onClick={() => addCourse(college, department)}
                            style={{ padding: "0.5rem 1rem" }}
                          >
                            Add
                          </button>
                          <button
                            className="ude-btn ude-btn-secondary"
                            onClick={() => setEditingCourse(null)}
                            style={{ padding: "0.5rem 1rem" }}
                          >
                            Cancel
                          </button>
                        </div>
                      )}

                      <div className="ude-course-list">
                        {courses.map((course, courseIndex) => (
                          <div key={courseIndex} className="ude-course-item">
                            <span>{course}</span>
                            <button
                              className="ude-icon-btn ude-icon-btn-danger"
                              onClick={() => removeCourse(college, courseIndex, department)}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Media Tab */}
        <div className={`ude-section ${activeTab === 'media' ? 'active' : ''}`}>
          <h3 className="ude-section-title">Media & Photos</h3>
          
          <div style={{ marginTop: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
              <h4 style={{ fontSize: "0.875rem", fontWeight: 600, color: "#374151", margin: 0, textTransform: "uppercase", letterSpacing: "0.05em" }}>Photos</h4>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  className="ude-btn ude-btn-secondary"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingPhoto}
                  style={{ padding: "0.4rem 0.75rem", fontSize: "0.75rem" }}
                >
                  <Upload size={12} />
                  {uploadingPhoto ? "Uploading..." : "Upload Photo"}
                </button>
                <button
                  className="ude-btn ude-btn-secondary"
                  onClick={() => {
                    const url = prompt("Enter photo URL:");
                    if (url && url.trim()) {
                      addArrayItem("photos", url.trim());
                      toast.success("Photo URL added");
                    }
                  }}
                  style={{ padding: "0.4rem 0.75rem", fontSize: "0.75rem" }}
                >
                  <LinkIcon size={12} />
                  Add URL
                </button>
              </div>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              style={{ display: "none" }}
            />

            <div style={{ 
              background: "#ffffff", 
              border: "1px solid #e5e7eb", 
              borderRadius: "0.5rem",
              overflow: "hidden"
            }}>
              {(formData.photos || []).length === 0 ? (
                <div style={{ 
                  textAlign: "center", 
                  padding: "1.5rem", 
                  color: "#6b7280",
                  fontSize: "0.875rem"
                }}>
                  No photos added yet. Click "Upload Photo" or "Add URL" to get started.
                </div>
              ) : (
                <>
                  {/* Table Header */}
                  <div className="ude-photo-table-header" style={{
                    display: "grid",
                    gridTemplateColumns: "30px 80px 1fr 40px",
                    gap: "0.75rem",
                    padding: "0.625rem 0.75rem",
                    background: "#f9fafb",
                    borderBottom: "1px solid #e5e7eb",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: "#6b7280",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em"
                  }}>
                    <div>#</div>
                    <div>Preview</div>
                    <div>Photo URL</div>
                    <div></div>
                  </div>
                  {/* Photo Rows */}
                  {(formData.photos || []).map((photo, index) => (
                    <div 
                      key={index}
                      className="ude-photo-table-row"
                      style={{
                        display: "grid",
                        gridTemplateColumns: "30px 80px 1fr 40px",
                        gap: "0.75rem",
                        padding: "0.625rem 0.75rem",
                        borderBottom: index < (formData.photos?.length || 0) - 1 ? "1px solid #f3f4f6" : "none",
                        alignItems: "center",
                        transition: "background 0.15s"
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "#f9fafb"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                    >
                      <div style={{ fontSize: "0.875rem", color: "#6b7280", fontWeight: 500 }}>
                        {index + 1}
                      </div>
                      <div style={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "0.375rem",
                        overflow: "hidden",
                        border: "1px solid #e5e7eb",
                        background: "#f3f4f6",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0
                      }}>
                        {photo ? (
                          <img 
                            src={photo} 
                            alt={`Photo ${index + 1}`}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover"
                            }}
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = "none";
                              (e.target as HTMLImageElement).parentElement!.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; color: #9ca3af; font-size: 0.75rem;">No Image</div>';
                            }}
                          />
                        ) : (
                          <div style={{ color: "#9ca3af", fontSize: "0.75rem" }}>No Image</div>
                        )}
                      </div>
                      <input
                        type="text"
                        value={photo}
                        onChange={(e) => updatePhotoUrl(index, e.target.value)}
                        className="ude-form-input"
                        placeholder="Enter photo URL"
                        style={{ 
                          padding: "0.5rem 0.625rem",
                          fontSize: "0.875rem",
                          margin: 0
                        }}
                      />
                      <button
                        className="ude-icon-btn ude-icon-btn-danger"
                        onClick={() => removeArrayItem("photos", index)}
                        style={{ width: "28px", height: "28px" }}
                        title="Remove photo"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Contact Tab */}
        <div className={`ude-section ${activeTab === 'contact' ? 'active' : ''}`}>
          <h3 className="ude-section-title">Contact Information</h3>
          <div className="ude-form-grid">
            <div className="ude-form-group au-form-group-full">
              <label className="ude-form-label">Address</label>
              <textarea
                name="contact.address"
                value={formData.contact?.address || ""}
                onChange={handleInputChange}
                className="ude-form-textarea"
                rows={3}
                placeholder="Full address..."
              />
            </div>

            <div className="ude-form-group">
              <label className="ude-form-label">Phone</label>
              <input
                type="text"
                name="contact.phone"
                value={formData.contact?.phone || ""}
                onChange={handleInputChange}
                className="ude-form-input"
                placeholder="e.g., +233 XX XXX XXXX"
              />
            </div>

            <div className="ude-form-group">
              <label className="ude-form-label">Email</label>
              <input
                type="email"
                name="contact.email"
                value={formData.contact?.email || ""}
                onChange={handleInputChange}
                className="ude-form-input"
                placeholder="info@university.edu.gh"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniversityDetailEditor;

