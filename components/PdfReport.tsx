import React from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
interface Applicant {
    id: string;
    username: string;
    email: string;
    password: string;
    verificationToken: string;
    isVerified: boolean;
    verificationTokenExpiry: string | null;
    resetToken: string | null;
    resetTokenExpiry: string | null;
    profile_pic: string;
    createdAt: string;
    updatedAt: string;
  }
  
  interface Tender {
    id: string;
    name: string;
    postBy: string;
    postDate: string;
    expiryDate: string;
    description: string;
    adminId: string;
    createdAt: string;
    updatedAt: string;
  }
  
  interface Proposal {
    id: string;
    status: string;
    date: string;
    applicantId: string;
    tenderId: string;
    createdAt: string;
    updatedAt: string;
    proposal: string;
    NID: string;
    amount: string;
    duration: string;
    completionDate: string;
    kraPin: string;
    location: string;
    applicant: Applicant;
    tender: Tender;
    phoneNumber: string;
  }
  
  interface Application {
    id: string;
    status: string;
    date: string;
    applicantId: string;
    tenderId: string;
    createdAt: string;
    updatedAt: string;
    proposal: string;
    NID: string;
    amount: string;
    duration: string;
    completionDate: string;
    kraPin: string;
    location: string;
    applicant: Applicant;
    tender: Tender;
    phoneNumber: string;
  }
interface PDFReportProps {
  data: Application[];
}

const PDFReport: React.FC<PDFReportProps> = ({ data }) => {
    const generatePDFReport = () => {
      const pdf = new jsPDF();
      pdf.text('Business Class Report', 20, 20);
  
      // Add table header
      const headers = ['ID', 'Status', 'Applicant ID', 'Tender ID', 'Location'];
      const rows = data.map(application => [
        application.id,
        application.status,
        application.applicantId,
        application.tenderId,
        `${application.location} (${application.tender.name})`,
      ]);
  
      // Use the autoTable method from jspdf-autotable
      pdf.autoTable({
        head: [headers],
        body: rows,
        startY: 30,
        theme: 'striped',
        styles: { overflow: 'linebreak' },
      });
  
      // Save the PDF or open in a new tab
      pdf.save('BusinessReport.pdf');
    };
  
    return (
      <button
        className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-900"
        onClick={generatePDFReport}
      >
        Generate Business Report (PDF)
      </button>
    );
  };
  
  export default PDFReport;