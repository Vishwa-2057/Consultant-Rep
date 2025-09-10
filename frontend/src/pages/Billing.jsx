import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { invoiceAPI } from "@/services/api";
import InvoiceModal from "@/components/InvoiceModal";
import InvoiceViewModal from "@/components/InvoiceViewModal";
import { 
  CreditCard, 
  FileText, 
  Search, 
  Plus, 
  DollarSign,
  Calendar,
  User,
  Download,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye
} from "lucide-react";

const Billing = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const { toast } = useToast();

  // Invoices state (fetched from API)
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalInvoices, setTotalInvoices] = useState(0);

  // Revenue statistics state
  const [revenueStats, setRevenueStats] = useState({
    totalRevenue: 0,
    pendingApprovalCount: 0,
    outstandingAmount: 0,
    paidThisMonth: 0
  });
  const [statsLoading, setStatsLoading] = useState(true);

  // Financial reports state
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [reportsLoading, setReportsLoading] = useState(true);

  // Fetch revenue statistics
  const fetchRevenueStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      // Fetch all invoices to calculate statistics
      const allInvoicesResponse = await invoiceAPI.getAll(1, 1000, {});
      const allInvoices = allInvoicesResponse.invoices || [];
      
      // Calculate total revenue (all paid invoices)
      const totalRevenue = allInvoices
        .filter(inv => inv.status === 'Paid')
        .reduce((sum, inv) => sum + (Number(inv.total) || 0), 0);
      
      // Count pending approvals (Sent status)
      const pendingApprovalCount = allInvoices
        .filter(inv => inv.status === 'Sent').length;
      
      // Calculate outstanding amount (Overdue invoices)
      const outstandingAmount = allInvoices
        .filter(inv => inv.status === 'Overdue')
        .reduce((sum, inv) => sum + (Number(inv.total) || 0), 0);
      
      // Calculate paid this month
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const paidThisMonth = allInvoices
        .filter(inv => {
          if (inv.status !== 'Paid') return false;
          const invoiceDate = new Date(inv.invoiceDate);
          return invoiceDate.getMonth() === currentMonth && invoiceDate.getFullYear() === currentYear;
        })
        .reduce((sum, inv) => sum + (Number(inv.total) || 0), 0);
      
      setRevenueStats({
        totalRevenue,
        pendingApprovalCount,
        outstandingAmount,
        paidThisMonth
      });

      // Calculate monthly revenue for the last 6 months
      const monthlyData = [];
      const currentDate = new Date();
      
      for (let i = 5; i >= 0; i--) {
        const monthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
        const nextMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i + 1, 1);
        
        const monthRevenue = allInvoices
          .filter(inv => {
            if (inv.status !== 'Paid') return false;
            const invoiceDate = new Date(inv.invoiceDate);
            return invoiceDate >= monthDate && invoiceDate < nextMonthDate;
          })
          .reduce((sum, inv) => sum + (Number(inv.total) || 0), 0);
        
        monthlyData.push({
          month: monthDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
          revenue: monthRevenue
        });
      }
      setMonthlyRevenue(monthlyData);

      // Calculate payment methods breakdown
      const paidInvoices = allInvoices.filter(inv => inv.status === 'Paid');
      const totalPaidRevenue = paidInvoices.reduce((sum, inv) => sum + (Number(inv.total) || 0), 0);
      
      const paymentMethodsData = {};
      paidInvoices.forEach(inv => {
        const method = inv.paymentMethod || 'Direct Payment';
        if (!paymentMethodsData[method]) {
          paymentMethodsData[method] = 0;
        }
        paymentMethodsData[method] += Number(inv.total) || 0;
      });
      
      const paymentMethodsArray = Object.entries(paymentMethodsData).map(([method, amount]) => ({
        method,
        amount,
        percentage: totalPaidRevenue > 0 ? Math.round((amount / totalPaidRevenue) * 100) : 0
      })).sort((a, b) => b.amount - a.amount);
      
      setPaymentMethods(paymentMethodsArray);
      setReportsLoading(false);
    } catch (err) {
      console.error('Failed to load revenue statistics:', err);
      setReportsLoading(false);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // Fetch invoices from API
  const fetchInvoices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const filters = {};
      // Map status filter to backend expected values
      if (statusFilter !== "all") {
        // Supported statuses in backend: Draft, Sent, Paid, Overdue, Cancelled
        const map = {
          draft: "Draft",
          sent: "Sent",
          paid: "Paid",
          overdue: "Overdue",
          cancelled: "Cancelled",
        };
        const mapped = map[statusFilter] || statusFilter;
        filters.status = mapped;
      }
      // The backend supports date and patientId filters; search by text is not supported.
      // We'll keep simple client-side search on the rendered list for now.

      const response = await invoiceAPI.getAll(currentPage, 10, filters);
      const list = response.invoices || [];

      // Normalize for rendering convenience
      const transformed = list.map(inv => ({
        _id: inv._id,
        invoiceNumber: inv.invoiceNumber,
        patientName: inv.patientId?.fullName || inv.patientName,
        invoiceDate: inv.invoiceDate,
        dueDate: inv.dueDate,
        total: inv.total,
        status: inv.status,
        service: inv.items?.[0]?.description || "",
      }));

      setInvoices(transformed);
      if (response.pagination) {
        setTotalPages(response.pagination.totalPages);
        setTotalInvoices(response.pagination.totalInvoices);
      } else {
        setTotalPages(1);
        setTotalInvoices(transformed.length);
      }
    } catch (err) {
      console.error('Failed to load invoices:', err);
      setError('Failed to load invoices. Please try again.');
      setInvoices([]);
      setTotalPages(1);
      setTotalInvoices(0);
    } finally {
      setLoading(false);
    }
  }, [currentPage, statusFilter]);

  useEffect(() => {
    fetchInvoices();
    fetchRevenueStats();
  }, [fetchInvoices, fetchRevenueStats]);

  // Pending approvals (fetch invoices that are effectively pending review)
  const [approvals, setApprovals] = useState([]);
  const [approvalsLoading, setApprovalsLoading] = useState(true);
  const [approvalsError, setApprovalsError] = useState(null);

  const fetchApprovals = useCallback(async () => {
    setApprovalsLoading(true);
    setApprovalsError(null);
    try {
      // Map "pending approvals" to backend status 'Sent' (awaiting processing)
      const response = await invoiceAPI.getAll(1, 10, { status: 'Sent' });
      const list = response.invoices || [];
      const transformed = list.map(inv => ({
        _id: inv._id,
        patient: inv.patientId?.fullName || inv.patientName,
        service: inv.items?.[0]?.description || '',
        amount: Number(inv.total || 0).toFixed(2),
        submittedDate: inv.invoiceDate,
        status: inv.status,
        invoiceNumber: inv.invoiceNumber,
      }));
      setApprovals(transformed);
    } catch (err) {
      console.error('Failed to load pending approvals:', err);
      setApprovalsError('Failed to load pending approvals. Please try again.');
      setApprovals([]);
    } finally {
      setApprovalsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApprovals();
  }, [fetchApprovals]);

  // Approve / Reject handlers
  const handleApproveInvoice = async (approval) => {
    try {
      await invoiceAPI.updateStatus(approval._id, 'Paid');
      toast({ title: 'Invoice Approved', description: `Invoice ${approval.invoiceNumber} marked as Paid.` });
      // Refresh both lists and statistics
      fetchApprovals();
      fetchInvoices();
      fetchRevenueStats();
    } catch (err) {
      console.error('Failed to approve invoice:', err);
      toast({ title: 'Error', description: 'Failed to approve invoice.', variant: 'destructive' });
    }
  };

  const handleRejectInvoice = async (approval) => {
    try {
      await invoiceAPI.updateStatus(approval._id, 'Cancelled');
      toast({ title: 'Invoice Rejected', description: `Invoice ${approval.invoiceNumber} marked as Cancelled.` });
      // Refresh both lists and statistics
      fetchApprovals();
      fetchInvoices();
      fetchRevenueStats();
    } catch (err) {
      console.error('Failed to reject invoice:', err);
      toast({ title: 'Error', description: 'Failed to reject invoice.', variant: 'destructive' });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Paid": return "success";
      case "Sent": return "primary";
      case "Draft": return "muted";
      case "Overdue": return "destructive";
      case "Cancelled": return "destructive";
      default: return "muted";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High": return "destructive";
      case "Medium": return "warning";
      case "Low": return "success";
      default: return "muted";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Paid": return CheckCircle;
      case "Sent": return CheckCircle;
      case "Draft": return Clock;
      case "Overdue": return AlertCircle;
      default: return Clock;
    }
  };

  // Client-side search on fetched data (by patient or invoice number)
  const filteredInvoices = invoices.filter(invoice => {
    const patient = (invoice.patientName || "").toLowerCase();
    const invNum = (invoice.invoiceNumber || "").toLowerCase();
    const matchesSearch = patient.includes(searchTerm.toLowerCase()) || invNum.includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Modal handlers
  const handleNewInvoice = () => setIsInvoiceModalOpen(true);
  const handleInvoiceModalClose = () => setIsInvoiceModalOpen(false);

  const handleInvoiceSubmit = (invoiceData) => {
    // Add the new invoice to the list (in a real app, this would be handled by state management)
    const patientName = invoiceData.patientId?.fullName || invoiceData.patientName || 'patient';
    const totalAmount = invoiceData.total || invoiceData.amount || 0;
    
    toast({
      title: "Invoice Generated!",
      description: `Successfully created invoice ${invoiceData.invoiceNumber} for ${patientName} - $${totalAmount}`,
      variant: "default",
    });
    
    // Refresh the invoices list and statistics
    fetchInvoices();
    fetchRevenueStats();
  };

  // View modal handlers
  const handleViewInvoice = async (invoice) => {
    try {
      // Fetch full invoice details from API
      const fullInvoice = await invoiceAPI.getById(invoice._id);
      setSelectedInvoice(fullInvoice);
      setIsViewModalOpen(true);
    } catch (error) {
      console.error('Failed to fetch invoice details:', error);
      toast({
        title: "Error",
        description: "Failed to load invoice details",
        variant: "destructive",
      });
    }
  };

  const handleViewModalClose = () => {
    setIsViewModalOpen(false);
    setSelectedInvoice(null);
  };

  // Download handler
  const handleDownloadInvoice = async (invoice) => {
    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();

      // Fetch full invoice details to ensure completeness
      const fullInvoice = await invoiceAPI.getById(invoice._id);

      let y = 15;
      const pageHeight = doc.internal.pageSize.getHeight();
      const lineHeight = 8;
      const money = (val) => `$${Number(val || 0).toFixed(2)}`;
      const ensureSpace = (needed = lineHeight) => {
        if (y + needed > pageHeight - 15) { doc.addPage(); y = 15; }
      };
      const line = (text, inc = lineHeight) => { ensureSpace(inc); doc.text(String(text), 14, y); y += inc; };
      const lineAt = (x, text, inc = lineHeight) => { ensureSpace(inc); doc.text(String(text), x, y); y += inc; };

      // Header
      doc.setFontSize(18);
      line('INVOICE', 10);
      doc.setFontSize(12);
      line(`Invoice Number: ${fullInvoice.invoiceNumber}`);
      line(`Date: ${new Date(fullInvoice.invoiceDate).toLocaleDateString()}`);
      line(`Due Date: ${new Date(fullInvoice.dueDate).toLocaleDateString()}`, 12);

      // Bill To
      doc.setFont(undefined, 'bold');
      line('Bill To:', 8);
      doc.setFont(undefined, 'normal');
      const patientName = fullInvoice.patientName || fullInvoice.patientId?.fullName || '';
      const patientPhone = fullInvoice.patientId?.phone || '';
      const patientEmail = fullInvoice.patientId?.email || '';
      const addr = fullInvoice.patientId?.address;
      const addressText = addr && typeof addr === 'object'
        ? [addr.street, addr.city, addr.state, addr.zipCode].filter(Boolean).join(', ')
        : (typeof addr === 'string' ? addr : '');
      line(patientName);
      if (patientPhone) line(patientPhone);
      if (patientEmail) line(patientEmail);
      if (addressText) line(addressText, 12);

      // Items table header
      doc.setFont(undefined, 'bold');
      line('Services & Items:', 8);
      doc.text('Description', 14, y);
      doc.text('Qty', 130, y);
      doc.text('Rate', 150, y);
      doc.text('Amount', 175, y);
      y += 6;
      doc.setFont(undefined, 'normal');

      const items = fullInvoice.items || [];
      if (items.length === 0) {
        line('No items listed');
      } else {
        items.forEach((item) => {
          const descLines = doc.splitTextToSize(item.description || '', 110);
          descLines.forEach((t, idx) => {
            ensureSpace();
            doc.text(t, 14, y);
            if (idx === 0) {
              doc.text(String(item.quantity || 0), 130, y);
              doc.text(money(item.rate), 150, y);
              doc.text(money(item.amount), 175, y);
            }
            y += lineHeight - 2;
          });
          y += 2;
        });
      }

      y += 4;
      line(`Subtotal: ${money(fullInvoice.subtotal)}`);
      line(`Tax (${fullInvoice.taxRate || 0}%): ${money(fullInvoice.taxAmount)}`);
      doc.setFont(undefined, 'bold');
      line(`Total: ${money(fullInvoice.total)}`, 12);
      doc.setFont(undefined, 'normal');

      y += 4;
      line(`Status: ${fullInvoice.status}`);
      line(`Payment Method: ${fullInvoice.paymentMethod || 'N/A'}`, 12);

      if (fullInvoice.notes) {
        doc.setFont(undefined, 'bold');
        line('Notes:', 8);
        doc.setFont(undefined, 'normal');
        const splitNotes = doc.splitTextToSize(fullInvoice.notes, 180);
        splitNotes.forEach((t) => line(t));
      }

      doc.save(`invoice-${fullInvoice.invoiceNumber}.pdf`);

      toast({
        title: 'Download Started',
        description: `Invoice ${invoice.invoiceNumber} downloaded as PDF`,
      });
    } catch (err) {
      console.error('PDF generation failed:', err);
      toast({ title: 'Error', description: 'Failed to generate PDF.', variant: 'destructive' });
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Billing Management</h1>
          <p className="text-muted-foreground">Generate invoices, track payments, and manage billing workflow</p>
        </div>
        <Button 
          className="bg-gradient-primary shadow-soft"
          onClick={handleNewInvoice}
        >
          <Plus className="w-4 h-4 mr-2" />
          Generate Invoice
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold text-foreground">
                  {statsLoading ? 'Loading...' : `$${revenueStats.totalRevenue.toLocaleString()}`}
                </p>
                <p className="text-sm text-success">All paid invoices</p>
              </div>
              <div className="p-2 rounded-lg bg-gradient-primary/10">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Approval</p>
                <p className="text-2xl font-bold text-foreground">
                  {statsLoading ? 'Loading...' : revenueStats.pendingApprovalCount}
                </p>
                <p className="text-sm text-warning">Awaiting admin review</p>
              </div>
              <div className="p-2 rounded-lg bg-warning/10">
                <Clock className="w-6 h-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Outstanding</p>
                <p className="text-2xl font-bold text-foreground">
                  {statsLoading ? 'Loading...' : `$${revenueStats.outstandingAmount.toLocaleString()}`}
                </p>
                <p className="text-sm text-destructive">Overdue invoices</p>
              </div>
              <div className="p-2 rounded-lg bg-destructive/10">
                <AlertCircle className="w-6 h-6 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Paid This Month</p>
                <p className="text-2xl font-bold text-foreground">
                  {statsLoading ? 'Loading...' : `$${revenueStats.paidThisMonth.toLocaleString()}`}
                </p>
                <p className="text-sm text-success">Current month payments</p>
              </div>
              <div className="p-2 rounded-lg bg-success/10">
                <CheckCircle className="w-6 h-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="border-0 shadow-soft">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search invoices by patient name or invoice ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="invoices" className="space-y-4">
        <TabsList>
          <TabsTrigger value="invoices">All Invoices</TabsTrigger>
          <TabsTrigger value="approvals">Pending Approvals</TabsTrigger>
          <TabsTrigger value="reports">Financial Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="invoices">
          <Card className="border-0 shadow-soft">
            <CardHeader>
              <CardTitle>Invoice Management</CardTitle>
              <CardDescription>Track and manage all billing invoices</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-center text-muted-foreground">Loading invoices...</p>
              ) : error ? (
                <p className="text-center text-red-600">{error}</p>
              ) : filteredInvoices.length > 0 ? (
                <div className="space-y-4">
                  {filteredInvoices.map((invoice) => {
                    const StatusIcon = getStatusIcon(invoice.status);
                    return (
                      <div key={invoice._id} className="p-4 rounded-lg border border-border hover:bg-muted/30 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                              <FileText className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-foreground">{invoice.patientName}</h3>
                              <p className="text-sm text-muted-foreground">
                                {invoice.invoiceNumber} • {invoice.service}
                              </p>
                              <div className="flex items-center space-x-4 mt-1 text-sm text-muted-foreground">
                                <span className="flex items-center">
                                  <Calendar className="w-4 h-4 mr-1" />
                                  {new Date(invoice.invoiceDate).toLocaleDateString()}
                                </span>
                                <span>Due: {new Date(invoice.dueDate).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <p className="text-lg font-bold text-foreground">${invoice.total?.toFixed ? invoice.total.toFixed(2) : Number(invoice.total || 0).toFixed(2)}</p>
                              <Badge variant={getStatusColor(invoice.status)} className="mt-1">
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {invoice.status}
                              </Badge>
                            </div>
                            <div className="flex space-x-2">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleDownloadInvoice(invoice)}
                                title="Download Invoice"
                              >
                                <Download className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-center text-muted-foreground">No invoices found.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approvals">
          <Card className="border-0 shadow-soft">
            <CardHeader>
              <CardTitle>Pending Admin Approvals</CardTitle>
              <CardDescription>Invoices awaiting administrative approval</CardDescription>
            </CardHeader>
            <CardContent>
              {approvalsLoading ? (
                <p className="text-center text-muted-foreground">Loading pending invoices...</p>
              ) : approvalsError ? (
                <p className="text-center text-red-600">{approvalsError}</p>
              ) : approvals.length > 0 ? (
                <div className="space-y-4">
                  {approvals.map((approval) => (
                    <div key={approval._id} className="p-4 rounded-lg border border-border hover:bg-muted/30 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-warning rounded-full flex items-center justify-center">
                            <Clock className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">{approval.patient}</h3>
                            <p className="text-sm text-muted-foreground">
                              {approval.invoiceNumber} • {approval.service}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Submitted: {new Date(approval.submittedDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="text-lg font-bold text-foreground">${approval.amount}</p>
                            <Badge variant="warning">Sent</Badge>
                          </div>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-success border-success"
                              onClick={() => handleApproveInvoice(approval)}
                            >
                              Approve
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-destructive border-destructive"
                              onClick={() => handleRejectInvoice(approval)}
                            >
                              Reject
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground">No pending invoices found.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle>Monthly Revenue</CardTitle>
                <CardDescription>Revenue breakdown by month (Last 6 months)</CardDescription>
              </CardHeader>
              <CardContent>
                {reportsLoading ? (
                  <p className="text-center text-muted-foreground">Loading reports...</p>
                ) : (
                  <div className="space-y-4">
                    {monthlyRevenue.length > 0 ? (
                      monthlyRevenue.map((data, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span>{data.month}</span>
                          <span className="font-semibold">${data.revenue.toLocaleString()}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-muted-foreground">No revenue data available</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>Revenue by payment method</CardDescription>
              </CardHeader>
              <CardContent>
                {reportsLoading ? (
                  <p className="text-center text-muted-foreground">Loading reports...</p>
                ) : (
                  <div className="space-y-4">
                    {paymentMethods.length > 0 ? (
                      paymentMethods.map((data, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span>{data.method}</span>
                          <span className="font-semibold">${data.amount.toLocaleString()} ({data.percentage}%)</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-muted-foreground">No payment data available</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <Button
            variant="outline"
            onClick={() => currentPage > 1 && setCurrentPage(prev => prev - 1)}
            disabled={currentPage === 1 || loading}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages} • {totalInvoices} total
          </span>
          <Button
            variant="outline"
            onClick={() => currentPage < totalPages && setCurrentPage(prev => prev + 1)}
            disabled={currentPage === totalPages || loading}
          >
            Next
          </Button>
        </div>
      )}

      {/* Invoice Modal */}
      <InvoiceModal
        isOpen={isInvoiceModalOpen}
        onClose={handleInvoiceModalClose}
        onSubmit={handleInvoiceSubmit}
      />

      
    </div>
  );
};

export default Billing;
