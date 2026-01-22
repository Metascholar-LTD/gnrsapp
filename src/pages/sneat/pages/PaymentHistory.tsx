import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Receipt,
  Download,
  Search,
  Filter,
  Calendar,
  CreditCard,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronRight,
  FileText,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Eye,
  Loader2
} from 'lucide-react';

interface Payment {
  id: string;
  invoiceNumber: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed' | 'refunded';
  method: 'card' | 'momo' | 'bank';
  description: string;
  plan: string;
}

const PaymentHistory: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPayments(mockPayments);
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const mockPayments: Payment[] = [
    {
      id: '1',
      invoiceNumber: 'INV-2024-001',
      date: '2024-01-20',
      amount: 49.99,
      status: 'paid',
      method: 'card',
      description: 'Monthly Subscription - Professional Plan',
      plan: 'Professional'
    },
    {
      id: '2',
      invoiceNumber: 'INV-2023-012',
      date: '2023-12-20',
      amount: 49.99,
      status: 'paid',
      method: 'momo',
      description: 'Monthly Subscription - Professional Plan',
      plan: 'Professional'
    },
    {
      id: '3',
      invoiceNumber: 'INV-2023-011',
      date: '2023-11-20',
      amount: 49.99,
      status: 'paid',
      method: 'card',
      description: 'Monthly Subscription - Professional Plan',
      plan: 'Professional'
    },
    {
      id: '4',
      invoiceNumber: 'INV-2023-010',
      date: '2023-10-20',
      amount: 49.99,
      status: 'paid',
      method: 'card',
      description: 'Monthly Subscription - Professional Plan',
      plan: 'Professional'
    },
    {
      id: '5',
      invoiceNumber: 'INV-2023-009',
      date: '2023-09-20',
      amount: 29.99,
      status: 'paid',
      method: 'momo',
      description: 'Monthly Subscription - Starter Plan',
      plan: 'Starter'
    },
    {
      id: '6',
      invoiceNumber: 'INV-2023-008',
      date: '2023-08-20',
      amount: 29.99,
      status: 'refunded',
      method: 'card',
      description: 'Monthly Subscription - Starter Plan (Refunded)',
      plan: 'Starter'
    },
    {
      id: '7',
      invoiceNumber: 'INV-2023-007',
      date: '2023-07-20',
      amount: 29.99,
      status: 'failed',
      method: 'card',
      description: 'Monthly Subscription - Starter Plan (Payment Failed)',
      plan: 'Starter'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return { bg: '#e8faef', text: '#71dd37' };
      case 'pending': return { bg: '#fff4e5', text: '#ffab00' };
      case 'failed': return { bg: '#ffe5e5', text: '#ff3e1d' };
      case 'refunded': return { bg: '#e7f6ff', text: '#03c3ec' };
      default: return { bg: '#f1f1f4', text: '#8592a3' };
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle2 size={14} />;
      case 'pending': return <Clock size={14} />;
      case 'failed': return <XCircle size={14} />;
      case 'refunded': return <AlertCircle size={14} />;
      default: return null;
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'card': return '💳';
      case 'momo': return '📱';
      case 'bank': return '🏦';
      default: return '💰';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch =
      payment.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    totalPaid: payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0),
    thisMonth: payments.filter(p => {
      const paymentDate = new Date(p.date);
      const now = new Date();
      return paymentDate.getMonth() === now.getMonth() && paymentDate.getFullYear() === now.getFullYear() && p.status === 'paid';
    }).reduce((sum, p) => sum + p.amount, 0),
    invoiceCount: payments.length,
    pendingAmount: payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0)
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
          <p style={{ color: '#8592a3' }}>Loading payment history...</p>
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
            Payment History
          </h1>
          <p style={{ color: '#8592a3' }} className="mt-1">
            View and download your invoices
          </p>
        </div>
        <button
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-colors border"
          style={{ borderColor: '#e7e7e8', color: '#566a7f' }}
        >
          <Download size={18} />
          Export All
        </button>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {[
          { label: 'Total Paid', value: `GHS ${stats.totalPaid.toFixed(2)}`, icon: DollarSign, color: '#71dd37' },
          { label: 'This Month', value: `GHS ${stats.thisMonth.toFixed(2)}`, icon: Calendar, color: '#696cff' },
          { label: 'Total Invoices', value: stats.invoiceCount.toString(), icon: FileText, color: '#03c3ec' },
          { label: 'Pending', value: `GHS ${stats.pendingAmount.toFixed(2)}`, icon: Clock, color: '#ffab00' }
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl p-5"
            style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div
                className="p-2 rounded-lg"
                style={{ backgroundColor: `${stat.color}15` }}
              >
                <stat.icon size={18} style={{ color: stat.color }} />
              </div>
            </div>
            <p className="text-2xl font-bold" style={{ color: '#566a7f' }}>
              {stat.value}
            </p>
            <p className="text-sm" style={{ color: '#8592a3' }}>{stat.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <div className="flex-1 relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: '#8592a3' }}
          />
          <input
            type="text"
            placeholder="Search invoices..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 transition-all"
            style={{ borderColor: '#e7e7e8', fontSize: '14px' }}
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2.5 rounded-lg border focus:outline-none focus:ring-2 transition-all"
          style={{ borderColor: '#e7e7e8', fontSize: '14px', color: '#566a7f' }}
        >
          <option value="all">All Status</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </select>
      </motion.div>

      {/* Payment List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl overflow-hidden"
        style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}
      >
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b" style={{ borderColor: '#e7e7e8', backgroundColor: '#f5f5f9' }}>
                <th className="text-left py-4 px-6 text-sm font-medium" style={{ color: '#8592a3' }}>
                  Invoice
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium" style={{ color: '#8592a3' }}>
                  Date
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium" style={{ color: '#8592a3' }}>
                  Description
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium" style={{ color: '#8592a3' }}>
                  Method
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium" style={{ color: '#8592a3' }}>
                  Amount
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium" style={{ color: '#8592a3' }}>
                  Status
                </th>
                <th className="text-right py-4 px-6 text-sm font-medium" style={{ color: '#8592a3' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center">
                    <Receipt size={48} className="mx-auto mb-4" style={{ color: '#e7e7e8' }} />
                    <p style={{ color: '#8592a3' }}>No payments found</p>
                  </td>
                </tr>
              ) : (
                filteredPayments.map((payment) => (
                  <tr
                    key={payment.id}
                    className="border-b hover:bg-gray-50 transition-colors"
                    style={{ borderColor: '#e7e7e8' }}
                  >
                    <td className="py-4 px-6">
                      <span className="font-medium" style={{ color: '#696cff' }}>
                        {payment.invoiceNumber}
                      </span>
                    </td>
                    <td className="py-4 px-6" style={{ color: '#566a7f' }}>
                      {formatDate(payment.date)}
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium" style={{ color: '#566a7f' }}>
                          {payment.plan} Plan
                        </p>
                        <p className="text-sm" style={{ color: '#8592a3' }}>
                          {payment.description}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-2">
                        <span>{getMethodIcon(payment.method)}</span>
                        <span className="capitalize" style={{ color: '#566a7f' }}>
                          {payment.method === 'momo' ? 'Mobile Money' : payment.method}
                        </span>
                      </span>
                    </td>
                    <td className="py-4 px-6 font-medium" style={{ color: '#566a7f' }}>
                      GHS {payment.amount.toFixed(2)}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium capitalize"
                        style={{
                          backgroundColor: getStatusColor(payment.status).bg,
                          color: getStatusColor(payment.status).text
                        }}
                      >
                        {getStatusIcon(payment.status)}
                        {payment.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedPayment(payment)}
                          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                          title="View Details"
                        >
                          <Eye size={18} style={{ color: '#8592a3' }} />
                        </button>
                        <button
                          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                          title="Download Invoice"
                        >
                          <Download size={18} style={{ color: '#8592a3' }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y" style={{ borderColor: '#e7e7e8' }}>
          {filteredPayments.length === 0 ? (
            <div className="py-12 text-center">
              <Receipt size={48} className="mx-auto mb-4" style={{ color: '#e7e7e8' }} />
              <p style={{ color: '#8592a3' }}>No payments found</p>
            </div>
          ) : (
            filteredPayments.map((payment) => (
              <div
                key={payment.id}
                className="p-4"
                onClick={() => setSelectedPayment(payment)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="font-medium" style={{ color: '#696cff' }}>
                      {payment.invoiceNumber}
                    </span>
                    <p className="text-sm" style={{ color: '#8592a3' }}>
                      {formatDate(payment.date)}
                    </p>
                  </div>
                  <span
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium capitalize"
                    style={{
                      backgroundColor: getStatusColor(payment.status).bg,
                      color: getStatusColor(payment.status).text
                    }}
                  >
                    {getStatusIcon(payment.status)}
                    {payment.status}
                  </span>
                </div>
                <p className="text-sm mb-2" style={{ color: '#566a7f' }}>
                  {payment.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold" style={{ color: '#566a7f' }}>
                    GHS {payment.amount.toFixed(2)}
                  </span>
                  <ChevronRight size={18} style={{ color: '#8592a3' }} />
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>

      {/* Invoice Detail Modal */}
      {selectedPayment && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedPayment(null)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl w-full max-w-md overflow-hidden"
          >
            <div
              className="p-6 border-b"
              style={{ borderColor: '#e7e7e8', backgroundColor: '#f5f5f9' }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg" style={{ color: '#566a7f' }}>
                    Invoice Details
                  </h3>
                  <p className="text-sm" style={{ color: '#696cff' }}>
                    {selectedPayment.invoiceNumber}
                  </p>
                </div>
                <span
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium capitalize"
                  style={{
                    backgroundColor: getStatusColor(selectedPayment.status).bg,
                    color: getStatusColor(selectedPayment.status).text
                  }}
                >
                  {getStatusIcon(selectedPayment.status)}
                  {selectedPayment.status}
                </span>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center py-3 border-b" style={{ borderColor: '#e7e7e8' }}>
                <span style={{ color: '#8592a3' }}>Date</span>
                <span style={{ color: '#566a7f' }}>{formatDate(selectedPayment.date)}</span>
              </div>

              <div className="flex justify-between items-center py-3 border-b" style={{ borderColor: '#e7e7e8' }}>
                <span style={{ color: '#8592a3' }}>Plan</span>
                <span style={{ color: '#566a7f' }}>{selectedPayment.plan} Plan</span>
              </div>

              <div className="flex justify-between items-center py-3 border-b" style={{ borderColor: '#e7e7e8' }}>
                <span style={{ color: '#8592a3' }}>Payment Method</span>
                <span className="inline-flex items-center gap-2" style={{ color: '#566a7f' }}>
                  {getMethodIcon(selectedPayment.method)}
                  {selectedPayment.method === 'momo' ? 'Mobile Money' : selectedPayment.method}
                </span>
              </div>

              <div className="flex justify-between items-center py-3">
                <span style={{ color: '#8592a3' }}>Amount</span>
                <span className="text-xl font-bold" style={{ color: '#566a7f' }}>
                  GHS {selectedPayment.amount.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="p-6 border-t flex gap-3" style={{ borderColor: '#e7e7e8' }}>
              <button
                onClick={() => setSelectedPayment(null)}
                className="flex-1 py-2.5 rounded-lg font-medium transition-colors border"
                style={{ borderColor: '#e7e7e8', color: '#566a7f' }}
              >
                Close
              </button>
              <button
                className="flex-1 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                style={{ backgroundColor: '#696cff', color: 'white' }}
              >
                <Download size={18} />
                Download PDF
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Payment Methods */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl p-6"
        style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}
      >
        <h3 className="font-semibold mb-4" style={{ color: '#566a7f' }}>
          Payment Methods
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            className="flex items-center gap-4 p-4 rounded-lg border"
            style={{ borderColor: '#696cff' }}
          >
            <div
              className="p-3 rounded-lg"
              style={{ backgroundColor: '#696cff15' }}
            >
              <CreditCard size={24} style={{ color: '#696cff' }} />
            </div>
            <div className="flex-1">
              <p className="font-medium" style={{ color: '#566a7f' }}>
                Visa ending in 4242
              </p>
              <p className="text-sm" style={{ color: '#8592a3' }}>
                Expires 12/2025
              </p>
            </div>
            <span
              className="px-2 py-0.5 rounded text-xs font-medium"
              style={{ backgroundColor: '#696cff', color: 'white' }}
            >
              Default
            </span>
          </div>

          <button
            className="flex items-center justify-center gap-2 p-4 rounded-lg border border-dashed transition-colors hover:bg-gray-50"
            style={{ borderColor: '#e7e7e8', color: '#8592a3' }}
          >
            <CreditCard size={20} />
            Add Payment Method
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentHistory;