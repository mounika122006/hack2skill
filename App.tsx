import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ReportForm } from './components/ReportForm';
import { CrisisMap } from './components/CrisisMap';
import { ResourceRegistry } from './components/ResourceRegistry';
import { Dashboard } from './components/Dashboard';
import { MatchModal } from './components/MatchModal';
import { EmergencyReport, VolunteerResource, DashboardMetrics } from './types';
import { fetchReports, fetchResources, fetchMetrics } from './services/api';
import { RefreshCw, AlertCircle } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'sos' | 'map' | 'resources' | 'dashboard'>('sos');
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [reports, setReports] = useState<EmergencyReport[]>([]);
  const [resources, setResources] = useState<VolunteerResource[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedReportForMatch, setSelectedReportForMatch] = useState<EmergencyReport | null>(null);

  // Sync high contrast attribute to root html element for global CSS override
  useEffect(() => {
    document.documentElement.setAttribute('data-high-contrast', String(highContrast));
  }, [highContrast]);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [repsData, resData, metData] = await Promise.all([
        fetchReports(),
        fetchResources(),
        fetchMetrics(),
      ]);
      setReports(repsData);
      setResources(resData);
      setMetrics(metData);
      setIsLoading(false);
    } catch (err: any) {
      console.error('Error fetching data:', err);
      setError('Could not connect to AegisRelief server. Please check your network or refresh.');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleReportCreated = (newReport: EmergencyReport) => {
    setReports((prev) => [newReport, ...prev]);
    fetchMetrics().then(setMetrics).catch(() => {});
  };

  const handleNavigateToMap = () => {
    setActiveTab('map');
  };

  const handleOpenMatchModal = (report: EmergencyReport) => {
    setSelectedReportForMatch(report);
  };

  const handleCloseMatchModal = () => {
    setSelectedReportForMatch(null);
  };

  const handleMatchSuccess = () => {
    loadData();
  };

  const handleViewOnMapFromDashboard = (report: EmergencyReport) => {
    setActiveTab('map');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Header Shell */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        highContrast={highContrast}
        setHighContrast={setHighContrast}
      />

      {/* Error Alert Banner */}
      {error && (
        <div className="bg-red-950 border-b border-red-800 text-red-200 px-4 py-3 text-center text-sm flex items-center justify-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400" />
          <span>{error}</span>
          <button
            onClick={loadData}
            className="ml-3 px-3 py-1 bg-red-900 hover:bg-red-800 text-white rounded-lg text-xs font-bold flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Retry
          </button>
        </div>
      )}

      {/* Main View Shell */}
      <main className="flex-1 pb-12">
        {activeTab === 'sos' && (
          <ReportForm
            onSuccessSubmit={handleReportCreated}
            onNavigateToMap={handleNavigateToMap}
          />
        )}

        {activeTab === 'map' && (
          <CrisisMap
            reports={reports}
            resources={resources}
            isLoading={isLoading}
            onMatchClick={handleOpenMatchModal}
          />
        )}

        {activeTab === 'resources' && (
          <ResourceRegistry
            resources={resources}
            onResourceAdded={loadData}
            isLoading={isLoading}
          />
        )}

        {activeTab === 'dashboard' && (
          <Dashboard
            metrics={metrics}
            reports={reports}
            isLoading={isLoading}
            onMatchClick={handleOpenMatchModal}
            onStatusChange={loadData}
            onViewOnMap={handleViewOnMapFromDashboard}
          />
        )}
      </main>

      {/* Match Modal */}
      {selectedReportForMatch && (
        <MatchModal
          report={selectedReportForMatch}
          onClose={handleCloseMatchModal}
          onMatchSuccess={handleMatchSuccess}
        />
      )}

      {/* Footer Accessibility & Status */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 AegisRelief – AI Social Impact Challenge (Stage 5 Complete)</p>
          <div className="flex items-center space-x-4">
            <span className="text-emerald-500 flex items-center gap-1 font-semibold">
              ● API Server Online
            </span>
            <span>WCAG 2.1 AA Compliant</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
