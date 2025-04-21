import { motion } from 'framer-motion';
import { FileText, Download, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function InvestorPage() {
  // Use direct link to PDF file
  const pdfUrl = "https://breathe.vayu-prana.com/storage/v1/object/public/business//pitchdeck.pdf";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="h-screen max-h-screen flex flex-col px-4 py-4">
        <motion.div
          className="flex-1 bg-white/50 backdrop-blur-sm rounded-lg shadow-sm flex flex-col"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center justify-between gap-3 p-4 border-b">
            <div className="flex items-center gap-3">
              <FileText className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-semibold">Vayu Investor Deck</h1>
            </div>
            <a
              href={pdfUrl}
              download
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm"
            >
              <Download className="h-4 w-4" />
              Download PDF
            </a>
          </div>
          
          <div className="flex-1 p-4 flex flex-col">
            <div className="w-full h-full flex flex-col items-center justify-center bg-white rounded-lg border p-8">
              <FileText className="h-16 w-16 text-primary/30 mb-4" />
              <h3 className="text-xl font-medium mb-2">Investor Deck</h3>
              <p className="text-gray-500 text-center mb-6 max-w-md">
                Our investor deck is available for download. Please click the button below to view or download the PDF.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  as="a"
                  href={pdfUrl}
                  download
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download PDF
                </Button>
                <Button
                  as="a"
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Open in New Tab
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}