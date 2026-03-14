'use client';

import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Printer, Download } from 'lucide-react';

export default function PrintWrapper({ children, documentTitle = 'Nexora_Document' }) {
    const componentRef = useRef();

    const handleDownloadPdf = async () => {
        const element = componentRef.current;
        if (!element) return;

        // Temporarily adjust styles for better PDF rendering
        const originalStyle = element.style.cssText;
        element.style.padding = '20px'; // Add padding so it doesn't hug the edge in the PDF
        element.style.backgroundColor = '#ffffff';

        try {
            const canvas = await html2canvas(element, {
                scale: 2, // Higher scale = better resolution
                useCORS: true,
                logging: false,
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4',
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`${documentTitle}.pdf`);
        } finally {
            // Restore original styles
            element.style.cssText = originalStyle;
        }
    };

    const handlePrint = useReactToPrint({
        contentRef: componentRef,
        documentTitle: documentTitle,
    });

    return (
        <div className="flex flex-col gap-4">
            {/* Action Bar */}
            <div className="flex items-center justify-end gap-3 bg-gray-50 p-4 rounded-lg border border-gray-200 print:hidden">
                <button
                    onClick={handleDownloadPdf}
                    className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors shadow-sm"
                >
                    <Download className="w-4 h-4" />
                    Download PDF
                </button>

                <button 
                    onClick={() => handlePrint()}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-sm font-medium"
                >
                    <Printer className="w-4 h-4" />
                    Print Document
                </button>
            </div>

            {/* The Document Area */}
            <div className="overflow-x-auto bg-gray-100 p-2 sm:p-8 rounded-lg">
                <div
                    ref={componentRef}
                    className="bg-white shadow-lg mx-auto print:shadow-none print:m-0 print:p-0"
                    style={{ minHeight: '297mm', maxWidth: '210mm' }} // A4 Size proportions for web preview
                >
                    {children}
                </div>
            </div>
        </div>
    );
}
