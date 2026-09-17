import React, { useEffect, useRef, useState } from 'react';
import { ZoomIn, ZoomOut, Maximize2, Download, AlertCircle, Loader2, Layers, FileText, RefreshCw } from 'lucide-react';

export const PdfCanvasViewer = ({ dataUrl, fileName }) => {
  const containerRef = useRef(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [viewMode, setViewMode] = useState('ALL'); // 'ALL' = tất cả các trang, 'SINGLE' = từng trang

  // Auto-calculate optimal scale based on device / container width
  const updateResponsiveScale = () => {
    if (!containerRef.current) return;
    const containerWidth = containerRef.current.clientWidth;
    const padding = window.innerWidth < 640 ? 24 : 64;
    const availableWidth = Math.max(containerWidth - padding, 260);
    // Standard A4 width in PDF.js is ~595px
    const autoScale = Math.min(Math.max(availableWidth / 595, 0.35), 1.35);
    setScale(parseFloat(autoScale.toFixed(2)));
  };

  useEffect(() => {
    if (pdfDoc) {
      updateResponsiveScale();
    }

    const handleResize = () => {
      updateResponsiveScale();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [pdfDoc]);

  // Dynamically load PDF.js from CDN if not already loaded
  useEffect(() => {
    let isMounted = true;

    const loadPdfJs = async () => {
      if (!window.pdfjsLib) {
        setLoading(true);
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
        script.onload = () => {
          if (window.pdfjsLib) {
            window.pdfjsLib.GlobalWorkerOptions.workerSrc = 
              'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
            if (isMounted) loadDocument();
          }
        };
        script.onerror = () => {
          if (isMounted) {
            setError('Không thể tải bộ đọc PDF. Vui lòng kiểm tra kết nối mạng.');
            setLoading(false);
          }
        };
        document.head.appendChild(script);
      } else {
        if (isMounted) loadDocument();
      }
    };

    const loadDocument = async () => {
      try {
        setLoading(true);
        setError('');
        const loadingTask = window.pdfjsLib.getDocument(dataUrl);
        const pdf = await loadingTask.promise;
        if (!isMounted) return;
        setPdfDoc(pdf);
        setNumPages(pdf.numPages);
        setLoading(false);
      } catch (err) {
        if (isMounted) {
          console.error("Lỗi đọc file PDF:", err);
          setError('Không thể đọc dữ liệu file PDF.');
          setLoading(false);
        }
      }
    };

    loadPdfJs();

    return () => {
      isMounted = false;
    };
  }, [dataUrl]);

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.15, 3.0));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.15, 0.3));

  const handleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div ref={containerRef} className="flex flex-col items-center bg-slate-100 dark:bg-slate-900 rounded-2xl overflow-hidden shadow-inner border border-slate-200 dark:border-slate-700 w-full min-h-[600px] transition-colors">
      
      {/* Clean Custom Toolbar */}
      <div className="w-full flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm z-10">
        
        {/* Pagination & Mode Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('ALL')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'ALL'
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Layers size={14} />
              <span>Tất cả trang ({numPages})</span>
            </button>
            <button
              onClick={() => setViewMode('SINGLE')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'SINGLE'
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <FileText size={14} />
              <span>Từng trang</span>
            </button>
          </div>

          {/* Single Page Navigator */}
          {viewMode === 'SINGLE' && numPages > 1 && (
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage(p => p - 1)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-xs font-bold disabled:opacity-40 hover:bg-slate-200"
              >
                Trước
              </button>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {currentPage} / {numPages}
              </span>
              <button
                disabled={currentPage >= numPages}
                onClick={() => setCurrentPage(p => p + 1)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-xs font-bold disabled:opacity-40 hover:bg-slate-200"
              >
                Sau
              </button>
            </div>
          )}
        </div>

        {/* Custom Zoom Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleZoomOut}
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 transition-colors"
            title="Thu nhỏ"
          >
            <ZoomOut size={16} />
          </button>
          <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-300 w-12 text-center">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 transition-colors"
            title="Phóng to"
          >
            <ZoomIn size={16} />
          </button>

          <button
            onClick={updateResponsiveScale}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 text-xs font-semibold transition-colors"
            title="Tự động thu vừa kích thước màn hình"
          >
            <RefreshCw size={12} />
            <span>Vừa màn hình</span>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleFullscreen}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-semibold text-xs hover:bg-blue-100 transition-colors"
          >
            <Maximize2 size={14} />
            <span>Toàn màn hình</span>
          </button>

          <a
            href={dataUrl}
            download={fileName || "CV.pdf"}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-sm transition-colors"
          >
            <Download size={14} />
            <span>Tải về</span>
          </a>
        </div>
      </div>

      {/* Pages Container */}
      <div className="w-full flex-1 overflow-auto p-4 md:p-8 bg-slate-200/60 dark:bg-slate-950/80 min-h-[650px]">
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-500">
            <Loader2 size={32} className="animate-spin text-blue-600" />
            <span className="text-sm font-semibold">Đang xử lý & hiển thị các trang CV...</span>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 p-4 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-sm font-semibold my-12 mx-auto max-w-md">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {!loading && !error && pdfDoc && (
          <div className="flex flex-col items-center gap-8">
            {viewMode === 'ALL' ? (
              Array.from({ length: numPages }, (_, index) => (
                <PdfPageCanvas
                  key={`page-${index + 1}`}
                  pdfDoc={pdfDoc}
                  pageNum={index + 1}
                  scale={scale}
                  totalPages={numPages}
                />
              ))
            ) : (
              <PdfPageCanvas
                pdfDoc={pdfDoc}
                pageNum={currentPage}
                scale={scale}
                totalPages={numPages}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Sub-component to render individual PDF page onto a sharp Retina canvas
const PdfPageCanvas = ({ pdfDoc, pageNum, scale, totalPages }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!pdfDoc || !canvasRef.current) return;

    let isCancelled = false;
    let renderTask = null;

    const renderPage = async () => {
      try {
        const page = await pdfDoc.getPage(pageNum);
        if (isCancelled || !canvasRef.current) return;

        const canvas = canvasRef.current;

        // High-DPI Retina Scaling (2x resolution for ultra sharpness)
        const dpr = Math.max(window.devicePixelRatio || 1, 2);
        const viewport = page.getViewport({ scale: scale * dpr });

        const context = canvas.getContext('2d', { alpha: false });
        
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);

        canvas.style.width = `${Math.floor(viewport.width / dpr)}px`;
        canvas.style.height = `${Math.floor(viewport.height / dpr)}px`;

        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = 'high';

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        if (isCancelled) return;

        renderTask = page.render(renderContext);
        await renderTask.promise;
      } catch (err) {
        if (
          err?.name !== 'RenderingCancelledException' && 
          err?.message !== 'Rendering cancelled' &&
          !isCancelled
        ) {
          console.error(`Lỗi render trang ${pageNum}:`, err);
        }
      }
    };

    renderPage();

    return () => {
      isCancelled = true;
      if (renderTask) {
        try {
          renderTask.cancel();
        } catch (e) {
          // Ignore cancellation errors during cleanup
        }
      }
    };
  }, [pdfDoc, pageNum, scale]);

  return (
    <div className="relative shadow-2xl rounded-sm overflow-hidden bg-white border border-slate-300">
      <div className="bg-slate-50 border-b border-slate-200 px-3 py-1 flex items-center justify-between text-[11px] font-bold text-slate-400">
        <span>Trang {pageNum} / {totalPages}</span>
        <span>A4 Document</span>
      </div>
      <canvas ref={canvasRef} className="block bg-white" />
    </div>
  );
};
