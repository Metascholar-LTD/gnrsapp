import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Eye,
  MessageSquare,
  Star,
  DollarSign,
  Calendar,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Zap,
  Clock,
  Award,
  Briefcase,
  Activity,
  PieChart,
  Loader2
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

const PerformanceAnalytics: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Mock data
  const overviewStats = [
    {
      label: 'Total Views',
      value: '12,458',
      change: '+12.5%',
      isPositive: true,
      icon: Eye,
      color: '#696cff'
    },
    {
      label: 'Inquiries',
      value: '248',
      change: '+8.2%',
      isPositive: true,
      icon: MessageSquare,
      color: '#03c3ec'
    },
    {
      label: 'Conversion Rate',
      value: '18.5%',
      change: '+2.1%',
      isPositive: true,
      icon: Target,
      color: '#71dd37'
    },
    {
      label: 'Avg. Rating',
      value: '4.8',
      change: '+0.2',
      isPositive: true,
      icon: Star,
      color: '#ffab00'
    }
  ];

  const viewsData = [
    { name: 'Week 1', views: 1200, inquiries: 45 },
    { name: 'Week 2', views: 1800, inquiries: 62 },
    { name: 'Week 3', views: 1400, inquiries: 48 },
    { name: 'Week 4', views: 2200, inquiries: 78 },
    { name: 'Week 5', views: 2800, inquiries: 95 },
    { name: 'Week 6', views: 2400, inquiries: 82 }
  ];

  const revenueData = [
    { name: 'Jan', revenue: 4500 },
    { name: 'Feb', revenue: 5200 },
    { name: 'Mar', revenue: 4800 },
    { name: 'Apr', revenue: 6100 },
    { name: 'May', revenue: 7200 },
    { name: 'Jun', revenue: 6800 }
  ];

  const serviceDistribution = [
    { name: 'Plumbing', value: 35, color: '#696cff' },
    { name: 'Electrical', value: 28, color: '#03c3ec' },
    { name: 'Carpentry', value: 22, color: '#71dd37' },
    { name: 'Painting', value: 15, color: '#ffab00' }
  ];

  const weeklyPerformance = [
    { day: 'Mon', hours: 8, jobs: 3 },
    { day: 'Tue', hours: 6, jobs: 2 },
    { day: 'Wed', hours: 9, jobs: 4 },
    { day: 'Thu', hours: 7, jobs: 3 },
    { day: 'Fri', hours: 10, jobs: 5 },
    { day: 'Sat', hours: 5, jobs: 2 },
    { day: 'Sun', hours: 0, jobs: 0 }
  ];

  const topServices = [
    { name: 'Emergency Plumbing', bookings: 45, revenue: 'GHS 8,500', growth: '+15%' },
    { name: 'Electrical Installation', bookings: 38, revenue: 'GHS 12,200', growth: '+22%' },
    { name: 'Custom Furniture', bookings: 28, revenue: 'GHS 9,800', growth: '+8%' },
    { name: 'AC Installation', bookings: 24, revenue: 'GHS 7,200', growth: '+12%' },
    { name: 'House Painting', bookings: 18, revenue: 'GHS 5,400', growth: '-3%' }
  ];

  const customerMetrics = {
    newCustomers: 45,
    returningCustomers: 23,
    avgResponseTime: '2.5 hrs',
    completionRate: '96%'
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-3"
        >
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#696cff' }} />
          <p style={{ color: '#8592a3' }}>Loading analytics...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1
            className="text-2xl font-bold"
            style={{ color: '#566a7f', fontFamily: 'Crimson Text, serif' }}
          >
            Performance Analytics
          </h1>
          <p style={{ color: '#8592a3' }} className="mt-1">
            Track your business performance and growth
          </p>
        </div>

        <div className="flex items-center gap-2">
          {(['week', 'month', 'quarter', 'year'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize"
              style={{
                backgroundColor: timeRange === range ? '#696cff' : 'transparent',
                color: timeRange === range ? 'white' : '#8592a3',
                border: timeRange === range ? 'none' : '1px solid #e7e7e8'
              }}
            >
              {range}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Overview Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {overviewStats.map((stat, index) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl p-5"
            style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className="p-2.5 rounded-lg"
                style={{ backgroundColor: `${stat.color}15` }}
              >
                <stat.icon size={20} style={{ color: stat.color }} />
              </div>
              <span
                className={`flex items-center gap-1 text-sm font-medium`}
                style={{ color: stat.isPositive ? '#71dd37' : '#ff3e1d' }}
              >
                {stat.isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold mb-1" style={{ color: '#566a7f' }}>
              {stat.value}
            </p>
            <p className="text-sm" style={{ color: '#8592a3' }}>{stat.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Views & Inquiries Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6"
          style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold" style={{ color: '#566a7f' }}>
                Views & Inquiries
              </h3>
              <p className="text-sm" style={{ color: '#8592a3' }}>
                Profile engagement over time
              </p>
            </div>
          </div>
          <div style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={viewsData}>
                <defs>
                  <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#696cff" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#696cff" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="inquiriesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#03c3ec" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#03c3ec" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e7e7e8" />
                <XAxis dataKey="name" tick={{ fill: '#8592a3', fontSize: 12 }} axisLine={{ stroke: '#e7e7e8' }} />
                <YAxis tick={{ fill: '#8592a3', fontSize: 12 }} axisLine={{ stroke: '#e7e7e8' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="views"
                  stroke="#696cff"
                  strokeWidth={2}
                  fill="url(#viewsGradient)"
                />
                <Area
                  type="monotone"
                  dataKey="inquiries"
                  stroke="#03c3ec"
                  strokeWidth={2}
                  fill="url(#inquiriesGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#696cff' }} />
              <span className="text-sm" style={{ color: '#8592a3' }}>Views</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#03c3ec' }} />
              <span className="text-sm" style={{ color: '#8592a3' }}>Inquiries</span>
            </div>
          </div>
        </motion.div>

        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6"
          style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold" style={{ color: '#566a7f' }}>
                Revenue Trend
              </h3>
              <p className="text-sm" style={{ color: '#8592a3' }}>
                Monthly earnings overview
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold" style={{ color: '#71dd37' }}>
                GHS 34,600
              </p>
              <p className="text-sm" style={{ color: '#8592a3' }}>Total this period</p>
            </div>
          </div>
          <div style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e7e7e8" />
                <XAxis dataKey="name" tick={{ fill: '#8592a3', fontSize: 12 }} axisLine={{ stroke: '#e7e7e8' }} />
                <YAxis tick={{ fill: '#8592a3', fontSize: 12 }} axisLine={{ stroke: '#e7e7e8' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                  formatter={(value: number) => [`GHS ${value.toLocaleString()}`, 'Revenue']}
                />
                <Bar
                  dataKey="revenue"
                  fill="#71dd37"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Service Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-6"
          style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}
        >
          <h3 className="font-semibold mb-4" style={{ color: '#566a7f' }}>
            Service Distribution
          </h3>
          <div style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={serviceDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {serviceDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                  formatter={(value: number) => [`${value}%`, 'Share']}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {serviceDistribution.map((service) => (
              <div key={service.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: service.color }}
                />
                <span className="text-sm" style={{ color: '#8592a3' }}>
                  {service.name} ({service.value}%)
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top Services */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 bg-white rounded-xl p-6"
          style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}
        >
          <h3 className="font-semibold mb-4" style={{ color: '#566a7f' }}>
            Top Performing Services
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b" style={{ borderColor: '#e7e7e8' }}>
                  <th className="text-left py-3 text-sm font-medium" style={{ color: '#8592a3' }}>
                    Service
                  </th>
                  <th className="text-center py-3 text-sm font-medium" style={{ color: '#8592a3' }}>
                    Bookings
                  </th>
                  <th className="text-center py-3 text-sm font-medium" style={{ color: '#8592a3' }}>
                    Revenue
                  </th>
                  <th className="text-right py-3 text-sm font-medium" style={{ color: '#8592a3' }}>
                    Growth
                  </th>
                </tr>
              </thead>
              <tbody>
                {topServices.map((service, index) => (
                  <tr
                    key={service.name}
                    className="border-b last:border-0"
                    style={{ borderColor: '#e7e7e8' }}
                  >
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium"
                          style={{
                            backgroundColor: `${['#696cff', '#03c3ec', '#71dd37', '#ffab00', '#ff3e1d'][index]}15`,
                            color: ['#696cff', '#03c3ec', '#71dd37', '#ffab00', '#ff3e1d'][index]
                          }}
                        >
                          {index + 1}
                        </div>
                        <span className="font-medium" style={{ color: '#566a7f' }}>
                          {service.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 text-center" style={{ color: '#697a8d' }}>
                      {service.bookings}
                    </td>
                    <td className="py-3 text-center font-medium" style={{ color: '#566a7f' }}>
                      {service.revenue}
                    </td>
                    <td className="py-3 text-right">
                      <span
                        className="inline-flex items-center gap-1 text-sm font-medium"
                        style={{
                          color: service.growth.startsWith('+') ? '#71dd37' : '#ff3e1d'
                        }}
                      >
                        {service.growth.startsWith('+') ? (
                          <TrendingUp size={14} />
                        ) : (
                          <TrendingDown size={14} />
                        )}
                        {service.growth}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {/* Customer Metrics & Weekly Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl p-6"
          style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}
        >
          <h3 className="font-semibold mb-6" style={{ color: '#566a7f' }}>
            Customer Metrics
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div
              className="p-4 rounded-xl"
              style={{ backgroundColor: '#f5f5f9' }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: '#696cff15' }}
                >
                  <Users size={18} style={{ color: '#696cff' }} />
                </div>
                <span className="text-sm" style={{ color: '#8592a3' }}>New Customers</span>
              </div>
              <p className="text-2xl font-bold" style={{ color: '#566a7f' }}>
                {customerMetrics.newCustomers}
              </p>
              <p className="text-xs mt-1" style={{ color: '#71dd37' }}>
                +12% from last month
              </p>
            </div>

            <div
              className="p-4 rounded-xl"
              style={{ backgroundColor: '#f5f5f9' }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: '#03c3ec15' }}
                >
                  <Users size={18} style={{ color: '#03c3ec' }} />
                </div>
                <span className="text-sm" style={{ color: '#8592a3' }}>Returning</span>
              </div>
              <p className="text-2xl font-bold" style={{ color: '#566a7f' }}>
                {customerMetrics.returningCustomers}
              </p>
              <p className="text-xs mt-1" style={{ color: '#71dd37' }}>
                +8% from last month
              </p>
            </div>

            <div
              className="p-4 rounded-xl"
              style={{ backgroundColor: '#f5f5f9' }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: '#ffab0015' }}
                >
                  <Clock size={18} style={{ color: '#ffab00' }} />
                </div>
                <span className="text-sm" style={{ color: '#8592a3' }}>Avg Response</span>
              </div>
              <p className="text-2xl font-bold" style={{ color: '#566a7f' }}>
                {customerMetrics.avgResponseTime}
              </p>
              <p className="text-xs mt-1" style={{ color: '#71dd37' }}>
                -15min from last month
              </p>
            </div>

            <div
              className="p-4 rounded-xl"
              style={{ backgroundColor: '#f5f5f9' }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: '#71dd3715' }}
                >
                  <Target size={18} style={{ color: '#71dd37' }} />
                </div>
                <span className="text-sm" style={{ color: '#8592a3' }}>Completion</span>
              </div>
              <p className="text-2xl font-bold" style={{ color: '#566a7f' }}>
                {customerMetrics.completionRate}
              </p>
              <p className="text-xs mt-1" style={{ color: '#71dd37' }}>
                +2% from last month
              </p>
            </div>
          </div>
        </motion.div>

        {/* Weekly Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-xl p-6"
          style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}
        >
          <h3 className="font-semibold mb-6" style={{ color: '#566a7f' }}>
            Weekly Work Hours
          </h3>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e7e7e8" />
                <XAxis dataKey="day" tick={{ fill: '#8592a3', fontSize: 12 }} axisLine={{ stroke: '#e7e7e8' }} />
                <YAxis tick={{ fill: '#8592a3', fontSize: 12 }} axisLine={{ stroke: '#e7e7e8' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                />
                <Bar dataKey="hours" fill="#696cff" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-between mt-4 pt-4 border-t" style={{ borderColor: '#e7e7e8' }}>
            <div>
              <p className="text-sm" style={{ color: '#8592a3' }}>Total Hours</p>
              <p className="text-xl font-bold" style={{ color: '#566a7f' }}>45 hrs</p>
            </div>
            <div>
              <p className="text-sm" style={{ color: '#8592a3' }}>Total Jobs</p>
              <p className="text-xl font-bold" style={{ color: '#566a7f' }}>19 jobs</p>
            </div>
            <div>
              <p className="text-sm" style={{ color: '#8592a3' }}>Avg/Day</p>
              <p className="text-xl font-bold" style={{ color: '#566a7f' }}>7.5 hrs</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Goals & Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-white rounded-xl p-6"
        style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}
      >
        <h3 className="font-semibold mb-6" style={{ color: '#566a7f' }}>
          Monthly Goals Progress
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Revenue Goal', current: 28500, target: 35000, unit: 'GHS' },
            { label: 'Jobs Completed', current: 42, target: 50, unit: 'jobs' },
            { label: 'New Customers', current: 45, target: 60, unit: 'customers' }
          ].map((goal) => {
            const percentage = Math.round((goal.current / goal.target) * 100);
            return (
              <div key={goal.label}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium" style={{ color: '#566a7f' }}>
                    {goal.label}
                  </span>
                  <span className="text-sm" style={{ color: '#8592a3' }}>
                    {percentage}%
                  </span>
                </div>
                <div
                  className="h-3 rounded-full overflow-hidden mb-2"
                  style={{ backgroundColor: '#e7e7e8' }}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.8, delay: 0.9 }}
                    className="h-full rounded-full"
                    style={{
                      backgroundColor: percentage >= 80 ? '#71dd37' : percentage >= 50 ? '#ffab00' : '#ff3e1d'
                    }}
                  />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span style={{ color: '#696cff' }}>
                    {goal.unit === 'GHS' ? `GHS ${goal.current.toLocaleString()}` : goal.current}
                  </span>
                  <span style={{ color: '#8592a3' }}>
                    Target: {goal.unit === 'GHS' ? `GHS ${goal.target.toLocaleString()}` : `${goal.target} ${goal.unit}`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="bg-white rounded-xl p-6"
        style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}
      >
        <h3 className="font-semibold mb-4" style={{ color: '#566a7f' }}>
          Recent Achievements
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Award, label: 'Top Rated', desc: '4.8+ rating for 3 months', color: '#ffab00' },
            { icon: Zap, label: 'Fast Responder', desc: 'Under 2hr avg response', color: '#696cff' },
            { icon: Users, label: 'Community Favorite', desc: '50+ positive reviews', color: '#71dd37' },
            { icon: Briefcase, label: 'Pro Service', desc: '100+ jobs completed', color: '#03c3ec' }
          ].map((achievement) => (
            <div
              key={achievement.label}
              className="p-4 rounded-xl text-center"
              style={{ backgroundColor: `${achievement.color}10` }}
            >
              <div
                className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center"
                style={{ backgroundColor: `${achievement.color}20` }}
              >
                <achievement.icon size={24} style={{ color: achievement.color }} />
              </div>
              <p className="font-medium text-sm mb-1" style={{ color: '#566a7f' }}>
                {achievement.label}
              </p>
              <p className="text-xs" style={{ color: '#8592a3' }}>
                {achievement.desc}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default PerformanceAnalytics;