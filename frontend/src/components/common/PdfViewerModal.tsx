import React from 'react';
import { X, Download, ExternalLink, FileText, Printer } from 'lucide-react';

interface PdfViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  url?: string | null;
  fileUrl?: string | null;
  title: string;
  fileName?: string;
  fileSize?: string;
}

export const PdfViewerModal: React.FC<PdfViewerModalProps> = ({
  isOpen,
  onClose,
  url,
  fileUrl,
  title,
  fileName,
  fileSize,
}) => {
  const targetUrl = url || fileUrl;
  if (!isOpen || !targetUrl) return null;

  const handlePrint = () => {
    const printWindow = window.open(targetUrl, '_blank');
    if (printWindow) {
      printWindow.focus();
      // On desktop browsers this allows direct print prompt
      setTimeout(() => {
        try {
          printWindow.print();
        } catch {
          // fallback silently
        }
      }, 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-5xl h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Modal Header */}
        <div className="px-4 py-3 bg-gradient-to-r from-cicha-navy to-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-3 overflow-hidden pr-2">
            <div className="p-2 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-sm sm:text-base text-slate-100 truncate">{title}</h3>
              <div className="flex items-center space-x-2 text-xs text-slate-400 truncate">
                {fileName && <span className="truncate">{fileName}</span>}
                {fileSize && (
                  <>
                    <span>•</span>
                    <span className="text-slate-300 font-mono">{fileSize}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-1 sm:space-x-2 shrink-0">
            <button
              onClick={handlePrint}
              title="Imprimir documento"
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center text-xs font-medium space-x-1"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden md:inline">Imprimir</span>
            </button>

            <a
              href={targetUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Abrir en pestaña nueva"
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center text-xs font-medium space-x-1"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="hidden md:inline">Abrir pestaña</span>
            </a>

            <a
              href={targetUrl}
              download={fileName || 'documento.pdf'}
              target="_blank"
              rel="noopener noreferrer"
              title="Descargar archivo"
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors flex items-center text-xs font-medium space-x-1.5 shadow-sm shadow-blue-900/50"
            >
              <Download className="w-4 h-4" />
              <span>Descargar</span>
            </a>

            <button
              onClick={onClose}
              title="Cerrar visor"
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body / PDF Viewer Frame */}
        <div className="flex-1 bg-slate-950 relative w-full h-full overflow-hidden">
          <iframe
            src={`${targetUrl}#toolbar=1&navpanes=1`}
            title={title}
            className="w-full h-full border-0"
          />

          {/* Fallback overlay in case iframe fails or is blocked on some browsers */}
          <noscript>
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-slate-300">
              <FileText className="w-12 h-12 text-slate-500 mb-3" />
              <p className="mb-4">El visor de PDF no pudo cargarse directamente.</p>
              <a
                href={targetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
              >
                Abrir o Descargar PDF
              </a>
            </div>
          </noscript>
        </div>
      </div>
    </div>
  );
};
export default PdfViewerModal;
