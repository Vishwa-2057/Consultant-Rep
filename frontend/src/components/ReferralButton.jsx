import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Share2, 
  Copy, 
  Mail, 
  Phone, 
  MessageSquare, 
  QrCode,
  ExternalLink,
  Download,
  CheckCircle
} from "lucide-react";

const ReferralButton = ({ 
  referralData = null, 
  variant = "default", 
  size = "default",
  className = "",
  showDropdown = true 
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLink, setGeneratedLink] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const { toast } = useToast();

  // Generate a unique referral link and code
  const generateReferralLink = async () => {
    setIsGenerating(true);
    try {
      if (referralData && referralData.id) {
        // Generate link for specific referral
        const response = await fetch(`/api/referrals/${referralData.id}/generate-link`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to generate referral link');
        }
        
        const data = await response.json();
        setReferralCode(data.referralCode);
        setGeneratedLink(data.shareableLink);
      } else {
        // Generate generic referral link
        const code = `REF-${Date.now().toString(36).toUpperCase()}`;
        const link = `${window.location.origin}/shared-referral/${code}`;
        
        setReferralCode(code);
        setGeneratedLink(link);
      }
      
      toast({
        title: "Success",
        description: "Referral link generated successfully!",
      });
    } catch (error) {
      console.error('Error generating referral link:', error);
      toast({
        title: "Error",
        description: "Failed to generate referral link",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Copy link to clipboard
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Success",
        description: "Copied to clipboard!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  // Share via email
  const shareViaEmail = () => {
    const subject = encodeURIComponent("Medical Referral Link");
    const body = encodeURIComponent(
      `Please find the referral link below:\n\n${generatedLink}\n\nReferral Code: ${referralCode}\n\nBest regards`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  // Share via SMS
  const shareViaSMS = () => {
    const message = encodeURIComponent(
      `Referral Link: ${generatedLink}\nCode: ${referralCode}`
    );
    window.open(`sms:?body=${message}`);
  };

  // Generate QR Code (placeholder - would use a QR code library in production)
  const generateQRCode = () => {
    // In production, you would use a library like qrcode.js
    toast({
      title: "Info",
      description: "QR Code generation would be implemented with a QR library",
    });
  };

  // Download referral details as PDF
  const downloadReferralPDF = () => {
    // In production, you would generate a PDF with referral details
    toast({
      title: "Info", 
      description: "PDF download would be implemented with a PDF library",
    });
  };

  const ReferralDialog = () => (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Share Referral
          </DialogTitle>
          <DialogDescription>
            Generate and share a referral link with colleagues or patients.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {!generatedLink ? (
            <div className="text-center py-6">
              <Button 
                onClick={generateReferralLink} 
                disabled={isGenerating}
                className="bg-gradient-primary"
              >
                {isGenerating ? "Generating..." : "Generate Referral Link"}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Referral Code */}
              <div>
                <Label htmlFor="referral-code">Referral Code</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input 
                    id="referral-code"
                    value={referralCode} 
                    readOnly 
                    className="font-mono"
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => copyToClipboard(referralCode)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Generated Link */}
              <div>
                <Label htmlFor="referral-link">Referral Link</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input 
                    id="referral-link"
                    value={generatedLink} 
                    readOnly 
                    className="text-sm"
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => copyToClipboard(generatedLink)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Share Options */}
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline" 
                  onClick={shareViaEmail}
                  className="flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Email
                </Button>
                <Button 
                  variant="outline" 
                  onClick={shareViaSMS}
                  className="flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  SMS
                </Button>
                <Button 
                  variant="outline" 
                  onClick={generateQRCode}
                  className="flex items-center gap-2"
                >
                  <QrCode className="w-4 h-4" />
                  QR Code
                </Button>
                <Button 
                  variant="outline" 
                  onClick={downloadReferralPDF}
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  PDF
                </Button>
              </div>

              {/* Status Badge */}
              <div className="flex items-center justify-center pt-2">
                <Badge variant="success" className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Link Active
                </Badge>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );

  if (showDropdown) {
    return (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={variant} size={size} className={className}>
              <Share2 className="w-4 h-4 mr-2" />
              Refer Patient
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={() => setIsDialogOpen(true)}>
              <Share2 className="w-4 h-4 mr-2" />
              Generate Referral Link
            </DropdownMenuItem>
            <DropdownMenuItem onClick={shareViaEmail}>
              <Mail className="w-4 h-4 mr-2" />
              Share via Email
            </DropdownMenuItem>
            <DropdownMenuItem onClick={shareViaSMS}>
              <MessageSquare className="w-4 h-4 mr-2" />
              Share via SMS
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={generateQRCode}>
              <QrCode className="w-4 h-4 mr-2" />
              Generate QR Code
            </DropdownMenuItem>
            <DropdownMenuItem onClick={downloadReferralPDF}>
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <ReferralDialog />
      </>
    );
  }

  return (
    <>
      <Button 
        variant={variant} 
        size={size} 
        className={className}
        onClick={() => setIsDialogOpen(true)}
      >
        <Share2 className="w-4 h-4 mr-2" />
        Refer Patient
      </Button>
      <ReferralDialog />
    </>
  );
};

export default ReferralButton;
