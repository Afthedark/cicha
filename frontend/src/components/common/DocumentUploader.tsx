import React, { useState, useRef } from 'react';
import { Upload, Link as LinkIcon, FileText, Loader2, X, ExternalLink } from 'lucide-react';
import { adminApi, resolveImageUrl } from '../../services/api';

interface DocumentUploaderProps {
  label?: string;
  fileUrl: string;
  fileType?: string;
  fileSize?: string;
  onChange: (data: { fileUrl: string; fileType?: string; fileSize?: string }) => void;
  helperText?: string;
}

export const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  label = 'Documento o Archivo *',
  fileUrl,
  fileType,
  fileSize,
  onChange,
  helperText = 'Formatos admitidos: PDF, Word (DOC/DOCX), Excel (XLS/XLSX), PowerPoint (PPTX), ZIP (Máx. 30MB)',
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [mode, setMode] = useState<'upload' | 'url'>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (file.size > 30 * 1024 * 1024) {
      setError('El archivo supera el tamaño máximo permitido de 30MB.');
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      const res = await adminApi.uploadFile(file);
      if (res && res.url) {
        // Derive type and size
        const ext = file.name.split('.').pop()?.toUpperCase() || res.file_type || 'PDF';
        const formattedSize =
          res.file_size ||
          (file.size > 1048576
            ? `${(file.size / 1048576).toFixed(1)} MB`
            : `${(file.size / 1024).toFixed(1)} KB`);

        onChange({
          fileUrl: res.url,
          fileType: ext,
          fileSize: formattedSize,
        });
      } else {
        setError('No se pudo obtener la URL del archivo subido.');
      }
    } catch (err: any) {
      console.error('Error al subir documento:', err);
      setError(err.response?.data?.message || 'Error al procesar la subida del documento.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleRemove = () => {
    onChange({
      fileUrl: '',
      fileType: fileType || 'PDF',
      fileSize: fileSize || '',
    });
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      {/* Label & Mode switcher */}
      <div className="flex items-center justify-between">
        <label className="font-bold text-slate-700">{label}</label>
        <div className="flex items-center gap-1 text-[11px] bg-slate-100 p-0.5 rounded-lg border border-slate-200">
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`px-2 py-0.5 rounded-md font-semibold transition-all flex items-center gap-1 ${
              mode === 'upload'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Upload className="w-3 h-3" /> Subir PDF / Archivo
          </button>
          <button
            type="button"
            onClick={() => setMode('url')}
            className={`px-2 py-0.5 rounded-md font-semibold transition-all flex items-center gap-1 ${
              mode === 'url'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <LinkIcon className="w-3 h-3" /> Enlace URL
          </button>
        </div>
      </div>

      {/* Main Container */}
      {fileUrl ? (
        /* File Card Preview */
        <div className="p-3.5 rounded-2xl border border-blue-200 bg-blue-50/40 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold text-[10px] uppercase">
                  {fileType || 'PDF'}
                </span>
                {fileSize && (
                  <span className="text-[11px] text-slate-500 font-medium">{fileSize}</span>
                )}
              </div>
              <p className="text-xs font-semibold text-slate-900 truncate mt-0.5" title={fileUrl}>
                {fileUrl.split('/').pop() || fileUrl}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href={resolveImageUrl(fileUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-white text-slate-700 hover:bg-slate-100 hover:text-blue-600 border border-slate-200 transition-colors shadow-xs"
              title="Abrir / Ver archivo"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              type="button"
              onClick={handleRemove}
              className="p-2 rounded-xl bg-white text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors shadow-xs"
              title="Quitar archivo"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : mode === 'upload' ? (
        /* Dropzone Box */
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center ${
            isDragging
              ? 'border-blue-600 bg-blue-50/50 scale-[1.01]'
              : 'border-slate-300 hover:border-blue-500 hover:bg-slate-50 bg-white'
          }`}
        >
          {isUploading ? (
            <div className="space-y-2 flex flex-col items-center">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              <p className="text-xs font-bold text-blue-700">Subiendo documento al servidor...</p>
              <p className="text-[10px] text-slate-400">Guardando en /backend/public/uploads/</p>
            </div>
          ) : (
            <div className="space-y-2 flex flex-col items-center">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">
                  Haz clic para seleccionar PDF o arrastra el documento aquí
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">{helperText}</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Direct URL Input */
        <div className="space-y-2">
          <input
            type="url"
            value={fileUrl}
            onChange={(e) => {
              const val = e.target.value;
              let detectedType = fileType || 'PDF';
              if (val.toLowerCase().endsWith('.pdf')) detectedType = 'PDF';
              else if (val.toLowerCase().endsWith('.docx') || val.toLowerCase().endsWith('.doc')) detectedType = 'DOCX';
              else if (val.toLowerCase().endsWith('.xlsx') || val.toLowerCase().endsWith('.xls')) detectedType = 'XLSX';
              else if (val.toLowerCase().endsWith('.zip')) detectedType = 'ZIP';
              else if (val.includes('drive.google.com') || val.includes('dropbox.com')) detectedType = 'URL';

              onChange({
                fileUrl: val,
                fileType: detectedType,
                fileSize: fileSize || 'Enlace web',
              });
            }}
            placeholder="https://ejemplo.com/documento.pdf o enlace a Google Drive"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
          <p className="text-[10px] text-slate-400">Pegue un enlace directo o enlace público al documento externo.</p>
        </div>
      )}

      {/* Hidden native file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.csv,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Error message */}
      {error && (
        <p className="text-[11px] text-rose-600 font-semibold bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
          {error}
        </p>
      )}
    </div>
  );
};
