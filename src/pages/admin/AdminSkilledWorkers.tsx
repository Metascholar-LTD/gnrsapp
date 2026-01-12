import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Chart from "chart.js";
import {
  Users,
  UserCheck,
  Clock,
  TrendingUp,
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Tag,
  MapPin,
  Star,
  Phone,
  Mail,
  Briefcase,
  Shield,
  Filter,
  Download,
  Upload,
  RefreshCw,
  Zap,
  Hammer,
  Droplet,
  Building2,
  Flame,
  Paintbrush,
  Scissors,
  User,
  Wrench,
  UtensilsCrossed,
  Sparkles,
  Car,
  ChefHat,
  Home,
  Wind,
  Package,
  Shirt,
  CheckCircle,
  Grid3x3,
  List
} from "lucide-react";
import {
  AddWorkerModal,
  EditWorkerModal,
  ViewWorkerModal,
  ApprovalModal,
  RejectConfirmModal,
  AddCategoryModal,
  EditCategoryModal,
  DeleteConfirmModal
} from "./components/SkilledWorkersModals";

// Helper function to get initials from name
const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const AdminSkilledWorkers = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [categoryViewMode, setCategoryViewMode] = useState<"grid" | "list">("grid");
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);
  
  // Chart refs
  const growthChartRef = useRef<HTMLCanvasElement>(null);
  const overviewChartRef = useRef<HTMLCanvasElement>(null);
  const categoryChartRef = useRef<HTMLCanvasElement>(null);
  const locationChartRef = useRef<HTMLCanvasElement>(null);
  const ratingChartRef = useRef<HTMLCanvasElement>(null);
  const statusChartRef = useRef<HTMLCanvasElement>(null);

  // Modal states
  const [showAddWorker, setShowAddWorker] = useState(false);
  const [showEditWorker, setShowEditWorker] = useState(false);
  const [showViewWorker, setShowViewWorker] = useState(false);
  const [showApproval, setShowApproval] = useState(false);
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showEditCategory, setShowEditCategory] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ type: "worker" | "category"; id: number; name: string } | null>(null);

  // Set active tab based on route
  useEffect(() => {
    if (location.pathname.includes("/approval")) {
      setActiveTab("approval");
    } else if (location.pathname.includes("/categories")) {
      setActiveTab("categories");
    } else if (location.pathname.includes("/profiles")) {
      setActiveTab("workers");
    }
  }, [location.pathname]);

  useEffect(() => {
    // Handle sticky tabs spacing - account for navbar
    const handleScroll = () => {
      if (!tabsContainerRef.current || !spacerRef.current) return;

      const navbar = document.querySelector('#admin-scope .navbar');
      const navbarHeight = navbar ? navbar.getBoundingClientRect().height : 0;

      const rect = tabsContainerRef.current.getBoundingClientRect();
      const isSticky = rect.top <= navbarHeight;

      if (isSticky) {
        tabsContainerRef.current.classList.add('sticky-active');
        spacerRef.current.style.height = `${rect.height}px`;
      } else {
        tabsContainerRef.current.classList.remove('sticky-active');
        spacerRef.current.style.height = '0px';
      }
    };

    const contentArea = document.querySelector('#admin-scope .content');
    if (contentArea) {
      contentArea.addEventListener('scroll', handleScroll);
      handleScroll();
      return () => contentArea.removeEventListener('scroll', handleScroll);
    }

    return () => {};
  }, []);

  // Initialize charts when analytics or overview tab is active
  useEffect(() => {
    if (activeTab !== "analytics" && activeTab !== "overview") return;

    const chartInstances: Chart[] = [];

    // Overview Activity Chart (Worker Growth)
    if (overviewChartRef.current && activeTab === "overview") {
      const ctx = overviewChartRef.current.getContext("2d");
      if (ctx) {
        const gradient = ctx.createLinearGradient(0, 0, 0, 200);
        gradient.addColorStop(0, "rgba(59, 130, 246, 0.3)");
        gradient.addColorStop(1, "rgba(59, 130, 246, 0.05)");

        const chart = new Chart(ctx, {
          type: "line",
          data: {
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            datasets: [{
              label: "New Workers",
              data: [12, 19, 15, 25, 22, 30, 28, 35, 32, 40, 38, 45],
              borderColor: "#3b82f6",
              backgroundColor: gradient,
              borderWidth: 3,
              fill: true,
              lineTension: 0.4,
              pointRadius: 4,
              pointHoverRadius: 6,
              pointBackgroundColor: "#3b82f6",
              pointBorderColor: "#ffffff",
              pointBorderWidth: 2,
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
              display: false
            } as any,
            tooltips: {
              backgroundColor: "#1f2937",
              xPadding: 12,
              yPadding: 12,
              titleFontSize: 14,
              titleFontStyle: "600",
              bodyFontSize: 13,
              cornerRadius: 8,
              displayColors: false,
            },
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: true,
                  fontColor: "#6b7280",
                  fontSize: 11
                },
                gridLines: {
                  color: "#f3f4f6",
                  drawBorder: false,
                }
              }],
              xAxes: [{
                gridLines: {
                  display: false,
                },
                ticks: {
                  fontColor: "#6b7280",
                  fontSize: 11
                }
              }]
            }
          }
        });
        chartInstances.push(chart);
      }
    }

    // Worker Growth Line Chart (Analytics)
    if (growthChartRef.current && activeTab === "analytics") {
      const ctx = growthChartRef.current.getContext("2d");
      if (ctx) {
        const gradient = ctx.createLinearGradient(0, 0, 0, 200);
        gradient.addColorStop(0, "rgba(59, 130, 246, 0.3)");
        gradient.addColorStop(1, "rgba(59, 130, 246, 0.05)");

        const chart = new Chart(ctx, {
          type: "line",
          data: {
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            datasets: [{
              label: "New Workers",
              data: [12, 19, 15, 25, 22, 30, 28, 35, 32, 40, 38, 45],
              borderColor: "#3b82f6",
              backgroundColor: gradient,
              borderWidth: 3,
              fill: true,
              lineTension: 0.4,
              pointRadius: 4,
              pointHoverRadius: 6,
              pointBackgroundColor: "#3b82f6",
              pointBorderColor: "#ffffff",
              pointBorderWidth: 2,
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
              display: false
            } as any,
            tooltips: {
              backgroundColor: "#1f2937",
              xPadding: 12,
              yPadding: 12,
              titleFontSize: 14,
              titleFontStyle: "600",
              bodyFontSize: 13,
              cornerRadius: 8,
              displayColors: false,
            },
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: true,
                  fontColor: "#6b7280",
                  fontSize: 11
                },
                gridLines: {
                  color: "#f3f4f6",
                  drawBorder: false,
                }
              }],
              xAxes: [{
                gridLines: {
                  display: false,
                },
                ticks: {
                  fontColor: "#6b7280",
                  fontSize: 11
                }
              }]
            }
          }
        });
        chartInstances.push(chart);
      }
    }

    // Category Distribution Doughnut Chart
    if (categoryChartRef.current && activeTab === "analytics") {
      const ctx = categoryChartRef.current.getContext("2d");
      if (ctx) {
        const chart = new Chart(ctx, {
          type: "doughnut",
          data: {
            labels: ["Electrician", "Carpenter", "Plumber", "Mason", "Welder", "Painter", "Others"],
            datasets: [{
              data: [18, 15, 12, 10, 8, 7, 30],
              backgroundColor: [
                "#3b82f6",
                "#10b981",
                "#f59e0b",
                "#ef4444",
                "#8b5cf6",
                "#ec4899",
                "#6b7280"
              ],
              borderWidth: 0,
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
              position: "right",
              labels: {
                padding: 15,
                usePointStyle: true,
                fontSize: 12,
                fontColor: "#374151"
              }
            },
            tooltips: {
              backgroundColor: "#1f2937",
              xPadding: 12,
              yPadding: 12,
              titleFontSize: 14,
              titleFontStyle: "600",
              bodyFontSize: 13,
              cornerRadius: 8,
              callbacks: {
                label: function(tooltipItem: any, data: any) {
                  const label = data.labels[tooltipItem.index] || '';
                  const value = data.datasets[0].data[tooltipItem.index];
                  const total = data.datasets[0].data.reduce((a: number, b: number) => a + b, 0);
                  const percentage = ((value / total) * 100).toFixed(1);
                  return `${label}: ${value} (${percentage}%)`;
                }
              }
            }
          }
        });
        chartInstances.push(chart);
      }
    }

    // Location Distribution Bar Chart
    if (locationChartRef.current && activeTab === "analytics") {
      const ctx = locationChartRef.current.getContext("2d");
      if (ctx) {
        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, "#3b82f6");
        gradient.addColorStop(1, "#1d4ed8");

        const chart = new Chart(ctx, {
          type: "bar",
          data: {
            labels: ["Accra", "Kumasi", "Tamale", "Takoradi", "Cape Coast", "Sunyani"],
            datasets: [{
              label: "Workers",
              data: [45, 32, 18, 15, 12, 8],
              backgroundColor: gradient,
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
              display: false
            } as any,
            tooltips: {
              backgroundColor: "#1f2937",
              xPadding: 12,
              yPadding: 12,
              titleFontSize: 14,
              titleFontStyle: "600",
              bodyFontSize: 13,
              cornerRadius: 8,
              displayColors: false,
            },
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: true,
                  fontColor: "#6b7280",
                  fontSize: 11,
                  stepSize: 10
                },
                gridLines: {
                  color: "#f3f4f6",
                  drawBorder: false,
                }
              }],
              xAxes: [{
                gridLines: {
                  display: false,
                },
                ticks: {
                  fontColor: "#6b7280",
                  fontSize: 11
                }
              }]
            }
          }
        });
        chartInstances.push(chart);
      }
    }

    // Rating Distribution Bar Chart
    if (ratingChartRef.current && activeTab === "analytics") {
      const ctx = ratingChartRef.current.getContext("2d");
      if (ctx) {
        const chart = new Chart(ctx, {
          type: "bar",
          data: {
            labels: ["1 Star", "2 Stars", "3 Stars", "4 Stars", "5 Stars"],
            datasets: [{
              label: "Workers",
              data: [2, 5, 12, 35, 46],
              backgroundColor: [
                "#ef4444",
                "#f59e0b",
                "#eab308",
                "#84cc16",
                "#10b981"
              ],
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
              display: false
            } as any,
            tooltips: {
              backgroundColor: "#1f2937",
              xPadding: 12,
              yPadding: 12,
              titleFontSize: 14,
              titleFontStyle: "600",
              bodyFontSize: 13,
              cornerRadius: 8,
              displayColors: false,
            },
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: true,
                  fontColor: "#6b7280",
                  fontSize: 11,
                  stepSize: 10
                },
                gridLines: {
                  color: "#f3f4f6",
                  drawBorder: false,
                }
              }],
              xAxes: [{
                gridLines: {
                  display: false,
                },
                ticks: {
                  fontColor: "#6b7280",
                  fontSize: 11
                }
              }]
            }
          }
        });
        chartInstances.push(chart);
      }
    }

    // Status Distribution Pie Chart
    if (statusChartRef.current && activeTab === "analytics") {
      const ctx = statusChartRef.current.getContext("2d");
      if (ctx) {
        const chart = new Chart(ctx, {
          type: "pie",
          data: {
            labels: ["Active", "Pending", "Inactive"],
            datasets: [{
              data: [75, 15, 10],
              backgroundColor: [
                "#10b981",
                "#f59e0b",
                "#ef4444"
              ],
              borderWidth: 0,
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
              position: "right",
              labels: {
                padding: 15,
                usePointStyle: true,
                fontSize: 12,
                fontColor: "#374151"
              }
            },
            tooltips: {
              backgroundColor: "#1f2937",
              xPadding: 12,
              yPadding: 12,
              titleFontSize: 14,
              titleFontStyle: "600",
              bodyFontSize: 13,
              cornerRadius: 8,
              callbacks: {
                label: function(tooltipItem: any, data: any) {
                  const label = data.labels[tooltipItem.index] || '';
                  const value = data.datasets[0].data[tooltipItem.index];
                  const total = data.datasets[0].data.reduce((a: number, b: number) => a + b, 0);
                  const percentage = ((value / total) * 100).toFixed(1);
                  return `${label}: ${value} (${percentage}%)`;
                }
              }
            }
          }
        });
        chartInstances.push(chart);
      }
    }

    return () => {
      chartInstances.forEach(chart => chart.destroy());
    };
  }, [activeTab]);

  // Mock statistics data
  const stats = [
    {
      id: 1,
      label: "Total Workers",
      value: "1,247",
      change: "+12.5%",
      trend: "up",
      icon: Users,
      color: "#3b82f6",
      bgColor: "#eff6ff"
    },
    {
      id: 2,
      label: "Verified Workers",
      value: "892",
      change: "+8.2%",
      trend: "up",
      icon: UserCheck,
      color: "#10b981",
      bgColor: "#f0fdf4"
    },
    {
      id: 3,
      label: "Pending Reviews",
      value: "34",
      change: "-5.3%",
      trend: "down",
      icon: Clock,
      color: "#f59e0b",
      bgColor: "#fef3c7"
    },
    {
      id: 4,
      label: "Active Categories",
      value: "12",
      change: "+2",
      trend: "up",
      icon: Tag,
      color: "#8b5cf6",
      bgColor: "#f5f3ff"
    }
  ];

  // Mock workers data
  const workers = [
    {
      id: 1,
      name: "Kwame Mensah",
      category: "Electrician",
      location: "Accra, Greater Accra",
      rating: 4.8,
      reviews: 156,
      phone: "+233 24 123 4567",
      email: "kwame.mensah@example.com",
      verified: true,
      status: "active",
      joinedDate: "2024-01-15",
      completedJobs: 245,
      profilePicture: undefined as string | undefined
    },
    {
      id: 2,
      name: "Ama Serwaa",
      category: "Tailor",
      location: "Kumasi, Ashanti",
      rating: 4.9,
      reviews: 203,
      phone: "+233 24 234 5678",
      email: "ama.serwaa@example.com",
      verified: true,
      status: "active",
      joinedDate: "2024-02-10",
      completedJobs: 312
    },
    {
      id: 3,
      name: "Kofi Boateng",
      category: "Carpenter",
      location: "Cape Coast, Central",
      rating: 4.7,
      reviews: 98,
      phone: "+233 24 345 6789",
      email: "kofi.boateng@example.com",
      verified: false,
      status: "pending",
      joinedDate: "2024-03-05",
      completedJobs: 67
    },
    {
      id: 4,
      name: "Efua Osei",
      category: "Hairdresser",
      location: "Takoradi, Western",
      rating: 4.6,
      reviews: 142,
      phone: "+233 24 456 7890",
      email: "efua.osei@example.com",
      verified: true,
      status: "active",
      joinedDate: "2024-01-20",
      completedJobs: 189
    },
    {
      id: 5,
      name: "Yaw Asante",
      category: "Plumber",
      location: "Accra, Greater Accra",
      rating: 4.5,
      reviews: 87,
      phone: "+233 24 567 8901",
      email: "yaw.asante@example.com",
      verified: true,
      status: "active",
      joinedDate: "2024-02-15",
      completedJobs: 134
    }
  ];

  // All categories from browse page with icons
  const getCategoryIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('electric') || lower.includes('electrical')) return Zap;
    if (lower.includes('carpenter') || lower.includes('wood') || lower.includes('furniture')) return Hammer;
    if (lower.includes('plumb')) return Droplet;
    if (lower.includes('mason') || lower.includes('brick')) return Building2;
    if (lower.includes('weld')) return Flame;
    if (lower.includes('paint')) return Paintbrush;
    if (lower.includes('tailor') || lower.includes('seamstress') || lower.includes('upholster')) return Scissors;
    if (lower.includes('barber')) return Scissors;
    if (lower.includes('hair')) return User;
    if (lower.includes('auto') || lower.includes('mechanic') || lower.includes('tire') || lower.includes('diesel') || lower.includes('truck')) return Car;
    if (lower.includes('cater') || lower.includes('chef') || lower.includes('cake') || lower.includes('food')) return ChefHat;
    if (lower.includes('clean') || lower.includes('janitor')) return Sparkles;
    if (lower.includes('ac') || lower.includes('hvac') || lower.includes('heating') || lower.includes('refrigeration') || lower.includes('elevator') || lower.includes('appliance') || lower.includes('locksmith') || lower.includes('security') || lower.includes('power tool')) return Wrench;
    if (lower.includes('construction') || lower.includes('contractor') || lower.includes('roof') || lower.includes('floor') || lower.includes('tile') || lower.includes('window') || lower.includes('fence') || lower.includes('landscape') || lower.includes('solar') || lower.includes('steel') || lower.includes('iron') || lower.includes('concrete') || lower.includes('drywall') || lower.includes('glazier') || lower.includes('crane') || lower.includes('surveyor') || lower.includes('asphalt') || lower.includes('architectural') || lower.includes('civil') || lower.includes('interior')) return Building2;
    if (lower.includes('makeup') || lower.includes('nail') || lower.includes('jewel')) return Sparkles;
    return Briefcase;
  };

  // All categories from browse page
  const allCategoryNames = [
    '3D Printing Specialist', '3D Modeling Expert',
    'AC Repair Technician', 'Appliance Repair Specialist', 'Auto Body Repair Expert', 'Auto Electrician', 'Auto Mechanic', 'Auto Parts Specialist', 'Architectural Drafter', 'Asphalt Paving Contractor',
    'Barber', 'Bricklayer', 'Building Inspector', 'Building Maintenance Worker',
    'Cake Baker & Designer', 'Carpenter', 'Caterer', 'Chef', 'Civil Engineer', 'Cleaner', 'Commercial Painter', 'Concrete Finisher', 'Construction Manager', 'Crane Operator',
    'Diesel Mechanic', 'Drywall Installer',
    'Electrician', 'Elevator Technician', 'Event Caterer',
    'Fence Installer', 'Flooring Installer', 'Furniture Maker',
    'General Contractor', 'Glazier',
    'Hairdresser', 'Hair Stylist', 'Heating Technician', 'HVAC Technician',
    'Interior Designer', 'Ironworker',
    'Janitor', 'Jeweler',
    'Landscaper', 'Locksmith',
    'Mason', 'Makeup Artist', 'Mechanic', 'Metal Fabricator', 'Mobile Mechanic',
    'Nail Technician',
    'Painter', 'Plumber', 'Plumbing Contractor', 'Power Tool Repair',
    'Refrigeration Technician', 'Roofer',
    'Seamstress', 'Security System Installer', 'Sheet Metal Worker', 'Shoe Repair Specialist', 'Solar Panel Installer', 'Steel Worker', 'Surveyor',
    'Tailor', 'Tile Installer', 'Tire Specialist', 'Truck Mechanic',
    'Upholsterer',
    'Welder', 'Window Installer', 'Woodworker'
  ];

  const categories = allCategoryNames.map((name, index) => {
    const Icon = getCategoryIcon(name);
    return {
      id: index + 1,
      name: name,
      count: Math.floor(Math.random() * 200) + 20, // Random count for demo
      icon: Icon,
      color: "#1f2937",
      bgColor: "#f3f4f6",
      status: "active" as const
    };
  });

  const tabs = [
    { id: "overview", label: "Overview", icon: Users },
    { id: "workers", label: "Workers Management", icon: UserCheck },
    { id: "approval", label: "Workers Approval", icon: CheckCircle },
    { id: "categories", label: "Categories", icon: Tag },
    { id: "analytics", label: "Analytics", icon: TrendingUp }
  ];

  const filteredWorkers = workers.filter(worker => {
    const matchesSearch = worker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          worker.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          worker.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || worker.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || worker.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Modal handlers
  const handleViewWorker = (worker: any) => {
    setSelectedWorker(worker);
    setShowViewWorker(true);
  };

  const handleEditWorker = (worker: any) => {
    setSelectedWorker(worker);
    setShowEditWorker(true);
  };

  const handleDeleteWorker = (worker: any) => {
    setDeleteTarget({ type: "worker", id: worker.id, name: worker.name });
    setShowDeleteConfirm(true);
  };

  const handleApproveClick = (worker: any) => {
    setSelectedWorker(worker);
    setShowApproval(true);
  };

  const handleRejectClick = (worker: any) => {
    setSelectedWorker(worker);
    setShowRejectConfirm(true);
  };

  const handleEditCategory = (category: any) => {
    setSelectedCategory(category);
    setShowEditCategory(true);
  };

  const handleDeleteCategory = (category: any) => {
    setDeleteTarget({ type: "category", id: category.id, name: category.name });
    setShowDeleteConfirm(true);
  };

  const handleSaveWorker = (worker: any) => {
    // Add API call here
  };

  const handleSaveCategory = (category: any) => {
    // Add API call here
  };

  const handleApprove = (id: number) => {
    // Update worker status to 'active' and set approval timestamp
    // This will be connected to Supabase
    const now = new Date().toISOString();
    // TODO: Add API call to update worker with:
    // - status: 'active'
    // - approvedAt: now
    // - approvedBy: current admin user ID
    // - rejectionReason: null (clear if exists)
    console.log('Approving worker:', id, 'at', now);
  };

  const handleReject = (id: number, reason: string) => {
    // Update worker status to 'inactive' and store rejection reason
    // This will be connected to Supabase
    const now = new Date().toISOString();
    // TODO: Add API call to update worker with:
    // - status: 'inactive'
    // - rejectedAt: now
    // - rejectedBy: current admin user ID
    // - rejectionReason: reason
    console.log('Rejecting worker:', id, 'reason:', reason, 'at', now);
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      // Add API call here
    }
    setShowDeleteConfirm(false);
    setDeleteTarget(null);
  };

  const isolatedStyles = `
    #asw-wrapper {
      width: 100%;
      padding: 0;
      margin: 0;
      background: #f8fafc;
      min-height: 100vh;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', sans-serif;
    }

    /* Remove default content padding for this page */
    #admin-scope .content #asw-wrapper {
      margin: -20px;
      padding: 0;
    }

    /* Header Section */
    #asw-header {
      padding: 2rem 2rem 1.5rem;
      background: white;
      border-bottom: 1px solid #e5e7eb;
      margin: 0;
    }

    #asw-header-content {
      width: 100%;
      max-width: 100%;
      margin: 0;
    }

    #asw-title {
      font-size: 1.875rem;
      font-weight: 700;
      color: #111827;
      margin: 0 0 0.5rem 0;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    #asw-title-icon {
      color: #3b82f6;
    }

    #asw-subtitle {
      font-size: 0.875rem;
      color: #6b7280;
      margin: 0;
    }

    /* Stats Cards */
    #asw-stats {
      padding: 1.5rem 2rem;
      background: white;
      border-bottom: 1px solid #e5e7eb;
    }

    #asw-stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 1.25rem;
    }

    .asw-stat-card {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 1.25rem;
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      transition: all 0.2s;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }

    .asw-stat-card:hover {
      border-color: #cbd5e1;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      transform: translateY(-2px);
    }

    .asw-stat-icon {
      width: 48px;
      height: 48px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .asw-stat-content {
      flex: 1;
      min-width: 0;
    }

    .asw-stat-label {
      font-size: 0.875rem;
      color: #6b7280;
      margin: 0 0 0.25rem 0;
      font-weight: 500;
    }

    .asw-stat-value {
      font-size: 1.75rem;
      font-weight: 700;
      color: #111827;
      margin: 0 0 0.25rem 0;
      line-height: 1;
    }

    .asw-stat-change {
      font-size: 0.75rem;
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      padding: 0.125rem 0.5rem;
      border-radius: 4px;
      font-weight: 600;
    }

    .asw-stat-change.up {
      background: #dcfce7;
      color: #16a34a;
    }

    .asw-stat-change.down {
      background: #fee2e2;
      color: #dc2626;
    }

    /* Tabs */
    #asw-tabs-container {
      background-color: #ffffff;
      border-bottom: 1px solid #e5e7eb;
      padding: 0 2rem;
      display: flex;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: thin;
      scrollbar-color: #cbd5e1 #f1f5f9;
      position: sticky;
      top: -20px;
      margin-top: 0;
      margin-left: -20px;
      margin-right: -20px;
      padding-left: calc(20px + 2rem);
      padding-right: calc(20px + 2rem);
      z-index: 50;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      gap: 0.25rem;
    }

    #asw-tabs-container.sticky-active {
      top: -20px;
      margin-top: 0;
    }

    #asw-tabs-container::-webkit-scrollbar {
      height: 6px;
    }

    #asw-tabs-container::-webkit-scrollbar-track {
      background: #f1f5f9;
    }

    #asw-tabs-container::-webkit-scrollbar-thumb {
      background: #3b82f6;
      border-radius: 3px;
    }

    .asw-tab {
      flex-shrink: 0;
      padding: 1rem 1.5rem;
      background: transparent;
      border: none;
      border-bottom: 3px solid transparent;
      cursor: pointer;
      font-size: 0.875rem;
      font-weight: 600;
      color: #6b7280;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      white-space: nowrap;
    }

    .asw-tab:hover {
      color: #3b82f6;
      background: #eff6ff;
    }

    .asw-tab.active {
      color: #3b82f6;
      border-bottom-color: #3b82f6;
      background: #eff6ff;
    }

    .asw-tab-icon {
      width: 18px;
      height: 18px;
    }

    /* Content Area */
    #asw-content {
      padding: 2rem;
    }

    /* Filters Bar */
    #asw-filters {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 1.25rem;
      margin-bottom: 1.5rem;
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      align-items: center;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }

    #asw-search-wrapper {
      position: relative;
      flex: 1;
      min-width: 280px;
    }

    #asw-search-icon {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      color: #9ca3af;
      width: 18px;
      height: 18px;
      pointer-events: none;
    }

    #asw-search-input {
      width: 100%;
      padding: 0.625rem 1rem 0.625rem 2.75rem;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      font-size: 0.875rem;
      background: #f9fafb;
      transition: all 0.2s;
    }

    #asw-search-input:focus {
      outline: none;
      border-color: #3b82f6;
      background: white;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .asw-filter-select {
      padding: 0.625rem 2.5rem 0.625rem 1rem;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      font-size: 0.875rem;
      background: #f9fafb;
      color: #374151;
      cursor: pointer;
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 0.75rem center;
      transition: all 0.2s;
    }

    .asw-filter-select:focus {
      outline: none;
      border-color: #3b82f6;
      background-color: white;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .asw-btn {
      padding: 0.625rem 1.25rem;
      border-radius: 8px;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      border: none;
    }

    .asw-btn-primary {
      background: #3b82f6;
      color: white;
      box-shadow: 0 1px 3px rgba(59, 130, 246, 0.3);
    }

    .asw-btn-primary:hover {
      background: #2563eb;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
      transform: translateY(-1px);
    }

    .asw-btn-secondary {
      background: white;
      color: #374151;
      border: 1px solid #e5e7eb;
    }

    .asw-btn-secondary:hover {
      background: #f9fafb;
      border-color: #cbd5e1;
    }

    .asw-btn-icon {
      width: 16px;
      height: 16px;
    }

    /* Workers Table */
    #asw-table-container {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }

    #asw-table {
      width: 100%;
      border-collapse: collapse;
    }

    #asw-table thead {
      background: #f9fafb;
      border-bottom: 1px solid #e5e7eb;
    }

    #asw-table th {
      padding: 0.875rem 1rem;
      text-align: left;
      font-size: 0.75rem;
      font-weight: 700;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      white-space: nowrap;
    }

    #asw-table tbody tr {
      border-bottom: 1px solid #f3f4f6;
      transition: background 0.15s;
    }

    #asw-table tbody tr:last-child {
      border-bottom: none;
    }

    #asw-table tbody tr:hover {
      background: #f9fafb;
    }

    #asw-table td {
      padding: 1rem;
      font-size: 0.875rem;
      color: #374151;
      vertical-align: middle;
    }

    .asw-worker-cell {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .asw-worker-avatar {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      object-fit: cover;
      background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 0.875rem;
      font-weight: 700;
    }

    .asw-worker-avatar img {
      width: 100%;
      height: 100%;
      border-radius: 8px;
      object-fit: cover;
    }

    .asw-worker-info {
      min-width: 0;
    }

    .asw-worker-name {
      font-weight: 600;
      color: #111827;
      margin: 0 0 0.125rem 0;
      display: flex;
      align-items: center;
      gap: 0.375rem;
    }

    .asw-worker-category {
      font-size: 0.75rem;
      color: #6b7280;
      margin: 0;
    }

    .asw-verified-badge {
      width: 16px;
      height: 16px;
      color: #3b82f6;
      flex-shrink: 0;
    }

    .asw-rating {
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .asw-rating-star {
      width: 14px;
      height: 14px;
      color: #fbbf24;
      fill: #fbbf24;
    }

    .asw-rating-text {
      font-size: 0.875rem;
      font-weight: 600;
      color: #111827;
      margin-left: 0.25rem;
    }

    .asw-rating-count {
      font-size: 0.75rem;
      color: #9ca3af;
    }

    .asw-status-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      padding: 0.375rem 0.75rem;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 600;
      white-space: nowrap;
    }

    .asw-status-badge.active {
      background: #dcfce7;
      color: #16a34a;
    }

    .asw-status-badge.pending {
      background: #fef3c7;
      color: #d97706;
    }

    .asw-status-badge.inactive {
      background: #fee2e2;
      color: #dc2626;
    }

    .asw-status-icon {
      width: 12px;
      height: 12px;
    }

    .asw-actions {
      display: flex;
      gap: 0.375rem;
    }

    .asw-action-btn {
      width: 32px;
      height: 32px;
      border-radius: 6px;
      border: 1px solid #e5e7eb;
      background: white;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
      padding: 0;
      position: relative;
      z-index: 1;
    }

    .asw-action-btn:hover {
      background: #f9fafb;
      border-color: #cbd5e1;
    }

    .asw-action-btn.view:hover {
      background: #eff6ff;
      border-color: #3b82f6;
      color: #3b82f6;
    }

    .asw-action-btn.edit:hover {
      background: #f0fdf4;
      border-color: #10b981;
      color: #10b981;
    }

    .asw-action-btn.delete:hover {
      background: #fef2f2;
      border-color: #ef4444;
      color: #ef4444;
    }

    .asw-action-icon {
      width: 16px;
      height: 16px;
      color: #6b7280;
    }

    /* Categories Grid */
    #asw-categories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.25rem;
    }

    #asw-categories-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .asw-category-card {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 1.5rem;
      transition: all 0.2s;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }

    .asw-category-card:hover {
      border-color: #cbd5e1;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      transform: translateY(-2px);
    }

    .asw-category-card.list-view {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 1.5rem;
    }

    .asw-category-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .asw-category-card.list-view .asw-category-header {
      margin-bottom: 0;
      flex: 1;
    }

    .asw-category-info {
      flex: 1;
    }

    .asw-category-name {
      font-size: 1rem;
      font-weight: 600;
      color: #111827;
      margin: 0 0 0.25rem 0;
    }

    .asw-category-card.list-view .asw-category-name {
      margin: 0;
      font-size: 0.9375rem;
    }

    .asw-category-count {
      font-size: 0.875rem;
      color: #6b7280;
      margin: 0;
    }

    .asw-category-card.list-view .asw-category-count {
      font-size: 0.8125rem;
      margin-left: 0.75rem;
    }

    .asw-category-actions {
      display: flex;
      gap: 0.5rem;
      padding-top: 1rem;
      border-top: 1px solid #f3f4f6;
    }

    .asw-category-card.list-view .asw-category-actions {
      padding-top: 0;
      border-top: none;
      margin-left: 1rem;
    }

    .asw-view-toggle {
      display: flex;
      gap: 0.5rem;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 0.25rem;
    }

    .asw-view-toggle-btn {
      padding: 0.5rem;
      border: none;
      background: transparent;
      border-radius: 6px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #6b7280;
      transition: all 0.2s;
    }

    .asw-view-toggle-btn:hover {
      background: #f9fafb;
      color: #374151;
    }

    .asw-view-toggle-btn.active {
      background: #3b82f6;
      color: white;
    }

    /* Analytics */
    #asw-analytics-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem;
    }

    .asw-analytics-card {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      transition: all 0.2s;
    }

    .asw-analytics-card:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      transform: translateY(-2px);
    }

    .asw-chart-card-full {
      grid-column: 1 / -1;
    }

    .asw-chart-header {
      margin-bottom: 1.25rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #f3f4f6;
    }

    .asw-analytics-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: #111827;
      margin: 0 0 0.25rem 0;
    }

    .asw-chart-subtitle {
      font-size: 0.875rem;
      color: #6b7280;
      margin: 0;
    }

    .asw-chart-container {
      position: relative;
      height: 300px;
      width: 100%;
    }

    .asw-chart-card-full .asw-chart-container {
      height: 350px;
    }

    /* Responsive */
    @media (max-width: 768px) {
      #asw-header {
        padding: 1.5rem 1rem 1rem;
      }

      #asw-title {
        font-size: 1.5rem;
      }

      #asw-stats {
        padding: 1rem;
      }

      #asw-stats-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }

      #asw-content {
        padding: 1rem;
      }

      #asw-filters {
        flex-direction: column;
        align-items: stretch;
      }

      #asw-search-wrapper {
        min-width: 100%;
      }

      #asw-table-container {
        overflow-x: auto;
      }

      #asw-table {
        min-width: 800px;
      }

      #asw-categories-grid {
        grid-template-columns: 1fr;
      }

      #asw-analytics-grid {
        grid-template-columns: 1fr;
      }
    }
  `;

  const renderOverview = () => (
    <div>
      <div id="asw-filters">
        <h3 style={{ margin: 0, fontSize: "1.125rem", fontWeight: 600, color: "#111827", flex: "1 0 100%" }}>
          Quick Overview
        </h3>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem", marginBottom: "1.5rem" }}>
        <div className="asw-analytics-card">
          <h4 className="asw-analytics-title">Recent Workers</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {workers.slice(0, 5).map(worker => (
              <div key={worker.id} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem", background: "#f9fafb", borderRadius: "8px" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: "#e5e7eb" }}></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: "0.875rem", color: "#111827", marginBottom: "0.125rem" }}>{worker.name}</div>
                  <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>{worker.category} • {worker.location}</div>
                </div>
                <span className={`asw-status-badge ${worker.status}`}>
                  {worker.verified && <CheckCircle2 className="asw-status-icon" />}
                  {worker.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="asw-analytics-card">
          <h4 className="asw-analytics-title">Top Categories</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {categories.slice(0, 5).map(category => {
              const IconComponent = category.icon;
              return (
                <div key={category.id} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem", background: "#f9fafb", borderRadius: "8px" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: category.bgColor, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <IconComponent size={20} style={{ color: category.color }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: "0.875rem", color: "#111827" }}>{category.name}</div>
                    <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>{category.count} workers</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="asw-analytics-card">
        <div className="asw-chart-header">
          <h4 className="asw-analytics-title">Worker Growth Trend</h4>
          <p className="asw-chart-subtitle">Monthly registration statistics</p>
        </div>
        <div className="asw-chart-container">
          <canvas ref={overviewChartRef}></canvas>
        </div>
      </div>
    </div>
  );

  const renderWorkers = () => (
    <div>
      <div id="asw-filters">
        <div id="asw-search-wrapper">
          <Search id="asw-search-icon" />
          <input
            id="asw-search-input"
            type="text"
            placeholder="Search workers by name, category, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <select
          className="asw-filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="inactive">Inactive</option>
        </select>

        <select
          className="asw-filter-select"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="all">All Categories</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.name}>{cat.name}</option>
          ))}
        </select>

        <button className="asw-btn asw-btn-secondary">
          <Filter className="asw-btn-icon" />
          More Filters
        </button>

        <button className="asw-btn asw-btn-primary" onClick={() => setShowAddWorker(true)}>
          <Plus className="asw-btn-icon" />
          Add Worker
        </button>
      </div>

      <div id="asw-table-container">
        <table id="asw-table">
          <thead>
            <tr>
              <th>Worker</th>
              <th>Location</th>
              <th>Rating</th>
              <th>Jobs</th>
              <th>Contact</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredWorkers.map(worker => (
              <tr key={worker.id}>
                <td>
                  <div className="asw-worker-cell">
                    {worker.profilePicture ? (
                      <img src={worker.profilePicture} alt={worker.name} className="asw-worker-avatar" />
                    ) : (
                      <div className="asw-worker-avatar">{getInitials(worker.name)}</div>
                    )}
                    <div className="asw-worker-info">
                      <p className="asw-worker-name">
                        {worker.name}
                        {worker.verified && <CheckCircle2 className="asw-verified-badge" />}
                      </p>
                      <p className="asw-worker-category">{worker.category}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "0.875rem", color: "#6b7280" }}>
                    <MapPin style={{ width: "14px", height: "14px" }} />
                    {worker.location}
                  </div>
                </td>
                <td>
                  <div className="asw-rating">
                    <Star className="asw-rating-star" />
                    <span className="asw-rating-text">{worker.rating}</span>
                    <span className="asw-rating-count">({worker.reviews})</span>
                  </div>
                </td>
                <td>
                  <span style={{ fontWeight: 600, color: "#3b82f6" }}>{worker.completedJobs}</span>
                </td>
                <td>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "0.75rem", color: "#6b7280" }}>
                      <Phone style={{ width: "12px", height: "12px" }} />
                      {worker.phone}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "0.75rem", color: "#6b7280" }}>
                      <Mail style={{ width: "12px", height: "12px" }} />
                      {worker.email}
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`asw-status-badge ${worker.status}`}>
                    {worker.status === "active" ? (
                      <CheckCircle2 className="asw-status-icon" />
                    ) : worker.status === "pending" ? (
                      <Clock className="asw-status-icon" />
                    ) : (
                      <XCircle className="asw-status-icon" />
                    )}
                    {worker.status}
                  </span>
                </td>
                <td>
                  <div className="asw-actions">
                    <button className="asw-action-btn view" title="View Details" onClick={() => handleViewWorker(worker)}>
                      <Eye className="asw-action-icon" />
                    </button>
                    <button className="asw-action-btn edit" title="Edit Worker" onClick={() => handleEditWorker(worker)}>
                      <Edit2 className="asw-action-icon" />
                    </button>
                    <button className="asw-action-btn delete" title="Delete Worker" onClick={() => handleDeleteWorker(worker)}>
                      <Trash2 className="asw-action-icon" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredWorkers.length === 0 && (
        <div style={{ textAlign: "center", padding: "3rem", color: "#9ca3af" }}>
          <Users style={{ width: "48px", height: "48px", margin: "0 auto 1rem" }} />
          <p style={{ margin: 0, fontSize: "1rem", fontWeight: 600 }}>No workers found</p>
          <p style={{ margin: "0.5rem 0 0", fontSize: "0.875rem" }}>Try adjusting your filters or search query</p>
        </div>
      )}
    </div>
  );

  const renderCategories = () => (
    <div>
      <div id="asw-filters">
        <h3 style={{ margin: 0, fontSize: "1.125rem", fontWeight: 600, color: "#111827", flex: 1 }}>
          All Categories ({categories.length})
        </h3>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <div className="asw-view-toggle">
            <button
              className={`asw-view-toggle-btn ${categoryViewMode === "grid" ? "active" : ""}`}
              onClick={() => setCategoryViewMode("grid")}
              title="Grid View"
            >
              <Grid3x3 size={18} />
            </button>
            <button
              className={`asw-view-toggle-btn ${categoryViewMode === "list" ? "active" : ""}`}
              onClick={() => setCategoryViewMode("list")}
              title="List View"
            >
              <List size={18} />
            </button>
          </div>
          <button className="asw-btn asw-btn-primary" onClick={() => setShowAddCategory(true)}>
            <Plus className="asw-btn-icon" />
            Add Category
          </button>
        </div>
      </div>

      {categoryViewMode === "grid" ? (
        <div id="asw-categories-grid">
          {categories.map(category => (
            <div key={category.id} className="asw-category-card">
              <div className="asw-category-header">
                <div className="asw-category-info">
                  <h4 className="asw-category-name">{category.name}</h4>
                  <p className="asw-category-count">{category.count} workers</p>
                </div>
              </div>
              <div className="asw-category-actions">
                <button className="asw-btn asw-btn-secondary" style={{ flex: 1 }}>
                  <Eye className="asw-btn-icon" />
                  View
                </button>
                <button className="asw-action-btn edit" title="Edit Category" onClick={() => handleEditCategory(category)}>
                  <Edit2 className="asw-action-icon" />
                </button>
                <button className="asw-action-btn delete" title="Delete Category" onClick={() => handleDeleteCategory(category)}>
                  <Trash2 className="asw-action-icon" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div id="asw-table-container">
          <table id="asw-table">
            <thead>
              <tr>
                <th>Category Name</th>
                <th>Workers</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(category => (
                <tr key={category.id}>
                  <td>
                    <div style={{ fontWeight: 600, color: "#111827" }}>{category.name}</div>
                  </td>
                  <td>
                    <span style={{ color: "#3b82f6", fontWeight: 600 }}>{category.count}</span>
                  </td>
                  <td>
                    <span className={`asw-status-badge ${category.status || "active"}`}>
                      {category.status || "Active"}
                    </span>
                  </td>
                  <td>
                    <div className="asw-actions">
                      <button className="asw-action-btn view" title="View Category">
                        <Eye className="asw-action-icon" />
                      </button>
                      <button className="asw-action-btn edit" title="Edit Category" onClick={() => handleEditCategory(category)}>
                        <Edit2 className="asw-action-icon" />
                      </button>
                      <button className="asw-action-btn delete" title="Delete Category" onClick={() => handleDeleteCategory(category)}>
                        <Trash2 className="asw-action-icon" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderApproval = () => {
    // Mock pending workers awaiting approval
    const pendingWorkers = [
      {
        id: 1,
        name: "John Doe",
        category: "Electrician",
        location: "Accra, Greater Accra",
        phone: "+233 24 123 4567",
        email: "john.doe@example.com",
        submittedDate: "2024-01-20",
        status: "pending",
        profilePicture: undefined as string | undefined
      },
      {
        id: 2,
        name: "Jane Smith",
        category: "Carpenter",
        location: "Kumasi, Ashanti",
        phone: "+233 24 234 5678",
        email: "jane.smith@example.com",
        submittedDate: "2024-01-19",
        status: "pending"
      },
      {
        id: 3,
        name: "Mike Johnson",
        category: "Plumber",
        location: "Cape Coast, Central",
        phone: "+233 24 345 6789",
        email: "mike.johnson@example.com",
        submittedDate: "2024-01-18",
        status: "pending"
      }
    ];

    return (
      <div>
        <div id="asw-filters">
          <h3 style={{ margin: 0, fontSize: "1.125rem", fontWeight: 600, color: "#111827", flex: 1 }}>
            Pending Approvals ({pendingWorkers.length})
          </h3>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button className="asw-btn asw-btn-secondary">
              <Download className="asw-btn-icon" />
              Export
            </button>
            <button className="asw-btn asw-btn-primary">
              <RefreshCw className="asw-btn-icon" />
              Refresh
            </button>
          </div>
        </div>

        <div id="asw-table-container">
          <table id="asw-table">
            <thead>
              <tr>
                <th>Worker</th>
                <th>Category</th>
                <th>Location</th>
                <th>Contact</th>
                <th>Submitted</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingWorkers.map(worker => (
                <tr key={worker.id}>
                  <td>
                    <div className="asw-worker-cell">
                      {worker.profilePicture ? (
                        <img src={worker.profilePicture} alt={worker.name} className="asw-worker-avatar" />
                      ) : (
                        <div className="asw-worker-avatar">{getInitials(worker.name)}</div>
                      )}
                      <div className="asw-worker-info">
                        <p className="asw-worker-name">{worker.name}</p>
                        <p className="asw-worker-category">Awaiting approval</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: "0.875rem", color: "#374151" }}>{worker.category}</span>
                  </td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "0.875rem", color: "#6b7280" }}>
                      <MapPin style={{ width: "14px", height: "14px" }} />
                      {worker.location}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "0.75rem", color: "#6b7280" }}>
                        <Phone style={{ width: "12px", height: "12px" }} />
                        {worker.phone}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "0.75rem", color: "#6b7280" }}>
                        <Mail style={{ width: "12px", height: "12px" }} />
                        {worker.email}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: "0.875rem", color: "#6b7280" }}>{worker.submittedDate}</span>
                  </td>
                  <td>
                    <div className="asw-actions">
                      <button className="asw-action-btn view" title="View Details" onClick={() => handleViewWorker(worker)}>
                        <Eye className="asw-action-icon" />
                      </button>
                      <button
                        className="asw-action-btn edit"
                        title="Approve Worker"
                        style={{ background: "#dcfce7", borderColor: "#10b981", color: "#10b981" }}
                        onClick={() => handleApproveClick(worker)}
                      >
                        <CheckCircle2 className="asw-action-icon" />
                      </button>
                      <button
                        type="button"
                        className="asw-action-btn delete"
                        title="Reject Worker"
                        onClick={() => handleRejectClick(worker)}
                      >
                        <XCircle className="asw-action-icon" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {pendingWorkers.length === 0 && (
          <div style={{ textAlign: "center", padding: "3rem", color: "#9ca3af" }}>
            <CheckCircle2 style={{ width: "48px", height: "48px", margin: "0 auto 1rem", color: "#10b981" }} />
            <p style={{ margin: 0, fontSize: "1rem", fontWeight: 600 }}>No pending approvals</p>
            <p style={{ margin: "0.5rem 0 0", fontSize: "0.875rem" }}>All workers have been reviewed</p>
          </div>
        )}
      </div>
    );
  };

  const renderAnalytics = () => (
    <div>
      <div id="asw-analytics-grid">
        <div className="asw-analytics-card">
          <div className="asw-chart-header">
            <h4 className="asw-analytics-title">Category Distribution</h4>
            <p className="asw-chart-subtitle">Workers by category</p>
          </div>
          <div className="asw-chart-container">
            <canvas ref={categoryChartRef}></canvas>
          </div>
        </div>

        <div className="asw-analytics-card">
          <div className="asw-chart-header">
            <h4 className="asw-analytics-title">Location Distribution</h4>
            <p className="asw-chart-subtitle">Workers by region</p>
          </div>
          <div className="asw-chart-container">
            <canvas ref={locationChartRef}></canvas>
          </div>
        </div>

        <div className="asw-analytics-card">
          <div className="asw-chart-header">
            <h4 className="asw-analytics-title">Rating Distribution</h4>
            <p className="asw-chart-subtitle">Workers by rating</p>
          </div>
          <div className="asw-chart-container">
            <canvas ref={ratingChartRef}></canvas>
          </div>
        </div>

        <div className="asw-analytics-card">
          <div className="asw-chart-header">
            <h4 className="asw-analytics-title">Status Overview</h4>
            <p className="asw-chart-subtitle">Worker status breakdown</p>
          </div>
          <div className="asw-chart-container">
            <canvas ref={statusChartRef}></canvas>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div id="asw-wrapper">
      <style>{isolatedStyles}</style>

      {/* Header */}
      <div id="asw-header">
        <div id="asw-header-content">
          <h1 id="asw-title">
            <Users id="asw-title-icon" size={32} />
            Skilled Workers & Artisans
          </h1>
          <p id="asw-subtitle">
            Manage skilled workers, categories, and monitor platform activity
          </p>
        </div>
      </div>

      {/* Statistics */}
      <div id="asw-stats">
        <div id="asw-stats-grid">
          {stats.map(stat => {
            const Icon = stat.icon;
            return (
              <div key={stat.id} className="asw-stat-card">
                <div className="asw-stat-icon" style={{ background: stat.bgColor }}>
                  <Icon size={24} style={{ color: stat.color }} />
                </div>
                <div className="asw-stat-content">
                  <p className="asw-stat-label">{stat.label}</p>
                  <p className="asw-stat-value">{stat.value}</p>
                  <span className={`asw-stat-change ${stat.trend}`}>
                    {stat.trend === "up" ? "↑" : "↓"} {stat.change}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tabs */}
      <div ref={spacerRef}></div>
      <div id="asw-tabs-container" ref={tabsContainerRef}>
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              className={`asw-tab ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon className="asw-tab-icon" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div id="asw-content">
        {activeTab === "overview" && renderOverview()}
        {activeTab === "workers" && renderWorkers()}
        {activeTab === "approval" && renderApproval()}
        {activeTab === "categories" && renderCategories()}
        {activeTab === "analytics" && renderAnalytics()}
      </div>

      {/* Modals */}
      <AddWorkerModal
        isOpen={showAddWorker}
        onClose={() => setShowAddWorker(false)}
        onSave={handleSaveWorker}
      />
      <EditWorkerModal
        isOpen={showEditWorker}
        onClose={() => setShowEditWorker(false)}
        onSave={handleSaveWorker}
        worker={selectedWorker}
      />
      <ViewWorkerModal
        isOpen={showViewWorker}
        onClose={() => setShowViewWorker(false)}
        worker={selectedWorker}
      />
      <ApprovalModal
        isOpen={showApproval}
        onClose={() => setShowApproval(false)}
        onApprove={handleApprove}
        onReject={handleReject}
        worker={selectedWorker}
        mode="approve"
      />
      <RejectConfirmModal
        isOpen={showRejectConfirm}
        onClose={() => {
          setShowRejectConfirm(false);
          setSelectedWorker(null);
        }}
        onConfirm={handleReject}
        worker={selectedWorker}
      />
      <AddCategoryModal
        isOpen={showAddCategory}
        onClose={() => setShowAddCategory(false)}
        onSave={handleSaveCategory}
      />
      <EditCategoryModal
        isOpen={showEditCategory}
        onClose={() => setShowEditCategory(false)}
        onSave={handleSaveCategory}
        category={selectedCategory}
      />
      <DeleteConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleConfirmDelete}
        title={`Delete ${deleteTarget?.type === 'worker' ? 'Worker' : 'Category'}`}
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        type={deleteTarget?.type}
      />
    </div>
  );
};

export default AdminSkilledWorkers;
