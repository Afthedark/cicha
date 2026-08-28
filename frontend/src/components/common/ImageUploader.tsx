import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Link as LinkIcon, Check, Loader2 } from 'lucide-react';
import { adminApi } from '../../services/api';

interface ImageUploaderProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  helperText?: string;
  previewHeight?: string;
  aspectRatio?: 'video' | 'square' | 'wide';
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  label,
  value,
  onChange,
  helperText = 'Formatos permitidos: JPG, PNG, WEBP, GIF, SVG (Máx. 10MB)',
  previewHeight = 'h-40',
  aspectRatio = 'video',
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [mode, setMode] = useState<'upload' | 'url'>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    // Basic validation
    if (!file.type.startsWith('image/')) {
      setError('El archivo seleccionado debe ser una imagen válida.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('La imagen supera el tamaño máximo permitido de 10MB.');
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      const res = await adminApi.uploadFile(file);
      if (res && res.url) {
        onChange(res.url);
      } else {
        setError('No se pudo obtener la URL de la imagen subida.');
      }
    } catch (err: any) {
      console.error('Error al subir imagen:', err);
      setError(err.response?.data?.message || 'Error al procesar la subida de imagen.');
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
    onChange('');
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      {/* Label & Mode switcher */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-700">{label}</label>
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
            <Upload className="w-3 h-3" /> Subir
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
            <LinkIcon className="w-3 h-3" /> URL
          </button>
        </div>
      </div>

      {/* Main Container */}
      {value ? (
        /* Image Preview Box */
        <div className="relative rounded-2xl overflow-hidden border-2 border-slate-200 group bg-slate-900/5">
          <div className={`w-full ${previewHeight} flex items-center justify-center overflow-hidden bg-slate-100`}>
            <img
              src={value}
              alt="Vista previa"
              className={`w-full h-full object-cover transition-transform group-hover:scale-105 ${
                aspectRatio === 'square' ? 'max-w-xs mx-auto object-contain' : ''
              }`}
            />
          </div>

          {/* Action Overlay */}
          <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-xl bg-white text-slate-900 text-xs font-bold shadow-lg hover:bg-slate-100 transition-all flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5 text-blue-600" />
              Cambiar
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="px-3 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-bold shadow-lg hover:bg-rose-700 transition-all flex items-center gap-1.5"
            >
              <X className="w-3.5 h-3.5" />
              Eliminar
            </button>
          </div>

          {/* Success badge */}
          <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-slate-900/70 text-white text-[10px] backdrop-blur-sm flex items-center gap-1">
            <Check className="w-3 h-3 text-emerald-400" />
            Imagen asignada
          </div>
        </div>
      ) : mode === 'upload' ? (
        /* Dropzone Box */
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${previewHeight} flex flex-col items-center justify-center ${
            isDragging
              ? 'border-blue-600 bg-blue-50/50 scale-[1.01]'
              : 'border-slate-300 hover:border-blue-500 hover:bg-slate-50'
          }`}
        >
          {isUploading ? (
            <div className="space-y-2 flex flex-col items-center">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              <p className="text-xs font-bold text-blue-700">Subiendo imagen al servidor...</p>
              <p className="text-[10px] text-slate-400">Guardando en /backend/public/uploads/</p>
            </div>
          ) : (
            <div className="space-y-2 flex flex-col items-center">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">
                  Haz clic para subir o arrastra la imagen aquí
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
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://ejemplo.com/imagen.jpg"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
          <p className="text-[10px] text-slate-400">Pegue un enlace directo a la imagen externa.</p>
        </div>
      )}

      {/* Hidden native file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
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
