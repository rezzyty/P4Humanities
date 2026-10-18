import React from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Cyber Earth App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
          <div className="max-w-md w-full p-6 rounded-2xl border border-rose-500/50 bg-slate-900 shadow-2xl text-center">
            <div className="text-3xl mb-3">⚠️</div>
            <h1 className="text-lg font-bold text-rose-400 mb-2 font-mono">
              // 系統啟動異常 (SYSTEM BOOT ERROR)
            </h1>
            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              偵測到載入異常。點擊下方按鈕可清除快取並重新載入常識特訓系統：
            </p>
            <div className="text-[11px] font-mono text-slate-400 bg-slate-950 p-2.5 rounded border border-slate-800 text-left mb-4 overflow-auto max-h-24">
              {this.state.error?.message || '未知錯誤'}
            </div>
            <button
              onClick={() => {
                localStorage.removeItem('cyber_earth_defender_p4_data_v1');
                window.location.reload();
              }}
              className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold font-mono text-xs transition-colors"
            >
              重設快取並重新連線 (RESET & RELOAD)
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);

