import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import QRCode from 'qrcode';
import { Download, Share2, Copy, ArrowLeft, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTheme } from '../context/ThemeContext';

const QrCodePage = () => {
  const { shortCode } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [copied, setCopied] = useState(false);
  
  const fullUrl = `${import.meta.env.VITE_REDIRECT_API || 'http://localhost:8000/goto'}/${shortCode}`;

  useEffect(() => {
    generateQR();
  }, [shortCode]);

  const generateQR = async () => {
    try {
      const url = await QRCode.toDataURL(fullUrl, {
        width: 400,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      });
      setQrDataUrl(url);
    } catch (err) {
      console.error('Error generating QR', err);
      toast.error('Failed to generate QR Code');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Short Link via Goto',
          text: 'Check out this link!',
          url: fullUrl,
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          handleCopy();
        }
      }
    } else {
      handleCopy();
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    toast.success('Link copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-6 ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
      <div className="absolute top-6 left-6">
        <button 
          onClick={() => navigate('/dashboard')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${isDark ? 'text-slate-400 hover:bg-slate-900 hover:text-white' : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900'}`}
        >
          <ArrowLeft size={18} /> Back to Dashboard
        </button>
      </div>

      <div className={`max-w-md w-full p-8 rounded-3xl shadow-xl border text-center ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <h1 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>QR Code</h1>
        <p className={`text-sm mb-8 font-mono break-all ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>
          {fullUrl}
        </p>

        {qrDataUrl ? (
          <div className="bg-white p-4 rounded-2xl inline-block shadow-sm border border-slate-100 mb-8">
            <img src={qrDataUrl} alt="QR Code" className="w-64 h-64 mx-auto" />
          </div>
        ) : (
          <div className="w-64 h-64 mx-auto bg-slate-200 dark:bg-slate-800 animate-pulse rounded-2xl mb-8"></div>
        )}

        <div className="flex flex-col gap-3">
          <a 
            href={qrDataUrl} 
            download={`goto-${shortCode}.png`}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors"
          >
            <Download size={18} /> Download PNG
          </a>
          
          <div className="flex gap-3">
            <button 
              onClick={handleShare}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium border transition-colors ${isDark ? 'border-slate-700 hover:bg-slate-800 text-slate-200' : 'border-slate-300 hover:bg-slate-50 text-slate-700'}`}
            >
              <Share2 size={18} /> Share
            </button>
            <button 
              onClick={handleCopy}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium border transition-colors ${copied ? 'bg-green-500 text-white border-green-500 hover:bg-green-600' : isDark ? 'border-slate-700 hover:bg-slate-800 text-slate-200' : 'border-slate-300 hover:bg-slate-50 text-slate-700'}`}
            >
              {copied ? <CheckCircle size={18} /> : <Copy size={18} />} 
              {copied ? 'Copied' : 'Copy Link'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QrCodePage;