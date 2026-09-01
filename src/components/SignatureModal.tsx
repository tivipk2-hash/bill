import React, { useRef, useState, useEffect } from 'react';
import { PenTool, Type, Eraser, Check, X } from 'lucide-react';

interface SignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (signatureData: string, type: 'draw' | 'type') => void;
  initialSignature?: string;
  initialType?: 'draw' | 'type';
  title?: string;
}

export const SignatureModal: React.FC<SignatureModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialSignature = '',
  initialType = 'type',
  title = 'Authorized Signature',
}) => {
  const [activeTab, setActiveTab] = useState<'type' | 'draw'>(initialType);
  const [typedName, setTypedName] = useState(initialType === 'type' ? initialSignature : '');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialType);
      if (initialType === 'type') {
        setTypedName(initialSignature);
      } else if (initialSignature && initialSignature.startsWith('data:image')) {
        setTimeout(() => {
          const canvas = canvasRef.current;
          if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
              const img = new Image();
              img.onload = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                setHasDrawn(true);
              };
              img.src = initialSignature;
            }
          }
        }, 100);
      }
    }
  }, [isOpen, initialSignature, initialType]);

  if (!isOpen) return null;

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    setHasDrawn(true);

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const handleSave = () => {
    if (activeTab === 'draw') {
      const canvas = canvasRef.current;
      if (canvas && hasDrawn) {
        const dataUrl = canvas.toDataURL('image/png');
        onSave(dataUrl, 'draw');
      } else {
        onSave(typedName.trim(), 'type');
      }
    } else {
      onSave(typedName.trim(), 'type');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <PenTool className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              {title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Tabs */}
        <div className="mt-4 flex rounded-lg bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => setActiveTab('type')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-md transition cursor-pointer ${
              activeTab === 'type'
                ? 'bg-white text-blue-700 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            Type Signature
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('draw')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-md transition cursor-pointer ${
              activeTab === 'draw'
                ? 'bg-white text-blue-700 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <PenTool className="w-3.5 h-3.5" />
            Draw Signature
          </button>
        </div>

        {activeTab === 'type' ? (
          <div className="mt-5 space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Signer Name / Text
              </label>
              <input
                type="text"
                value={typedName}
                onChange={(e) => setTypedName(e.target.value)}
                placeholder="e.g. David Tran or Customer Authorized"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-slate-800 focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-hidden text-sm font-medium transition"
              />
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap gap-1.5">
              {['Customer Authorized', 'T&D Inspector', 'David Tran', 'Authorized Rep', 'Certified Inspector'].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setTypedName(preset)}
                  className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-2.5 py-1 rounded-md transition cursor-pointer"
                >
                  {preset}
                </button>
              ))}
            </div>

            {/* Signature Preview */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 text-center">
              <div className="text-[11px] text-slate-400 mb-1">Signature preview on document:</div>
              <div
                className="text-2xl text-blue-900 min-h-[44px] flex items-center justify-center font-serif italic"
                style={{ fontFamily: "'Caveat', 'Dancing Script', cursive" }}
              >
                {typedName || 'No signature entered'}
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-5 space-y-3">
            <div className="flex justify-between items-center text-xs text-slate-500">
              <span>Use mouse or finger/stylus to draw signature:</span>
              <button
                type="button"
                onClick={clearCanvas}
                className="flex items-center gap-1 text-rose-600 hover:text-rose-700 font-medium cursor-pointer"
              >
                <Eraser className="w-3.5 h-3.5" />
                Clear
              </button>
            </div>
            <div className="rounded-xl border border-slate-300 bg-white overflow-hidden shadow-2xs">
              <canvas
                ref={canvasRef}
                width={450}
                height={150}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="w-full h-[150px] cursor-crosshair touch-none bg-white"
              />
            </div>
          </div>
        )}

        <div className="mt-6 flex flex-wrap items-center justify-between gap-2.5 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => {
              onSave('', 'type');
              onClose();
            }}
            className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-1.5 rounded-lg font-medium transition cursor-pointer"
          >
            <Eraser className="w-3.5 h-3.5" />
            Leave Blank (Hand-sign)
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-2xs hover:bg-blue-700 transition cursor-pointer"
            >
              <Check className="w-4 h-4" />
              Apply Signature
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
