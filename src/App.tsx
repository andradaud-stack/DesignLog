import React from 'react';
import { WorksProvider, useWorks } from './context/WorksContext';
import { Sidebar } from './components/layout/Sidebar';
import { MobileHeader } from './components/layout/MobileHeader';
import { MobileNav } from './components/layout/MobileNav';
import { Dashboard } from './components/dashboard/Dashboard';
import { MyWorks } from './components/works/MyWorks';
import { TaskBoard } from './components/tasks/TaskBoard';
import { Statistics } from './components/statistics/Statistics';
import { CalendarView } from './components/calendar/CalendarView';
import { InternshipPeriodsView } from './components/periods/InternshipPeriodsView';
import { HotelsView } from './components/hotels/HotelsView';
import { SettingsView } from './components/settings/SettingsView';
import { AddWorkModal } from './components/modals/AddWorkModal';
import { WorkDetailModal } from './components/modals/WorkDetailModal';
import { TaskDetailModal } from './components/tasks/TaskDetailModal';
import { AddTaskModal } from './components/tasks/AddTaskModal';
import { PdfPreviewModal } from './components/pdf/PdfPreviewModal';
import { PresentationModal } from './components/showcase/PresentationModal';
import { ToastContainer } from './components/common/ToastContainer';
import { AuthModal } from './components/modals/AuthModal';

const MainContent: React.FC = () => {
  const { activeTab, isPresentationOpen, setIsPresentationOpen, presentationIndex } = useWorks();

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#070c1b] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Mobile Top Header */}
      <MobileHeader />

      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="lg:pl-72 flex flex-col min-h-screen transition-all">
        <main className="w-full pt-16 lg:pt-0 flex-1 pb-20 lg:pb-12">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'my-works' && <MyWorks />}
          {activeTab === 'tasks' && <TaskBoard />}
          {activeTab === 'calendar' && <CalendarView />}
          {activeTab === 'statistics' && <Statistics />}
          {activeTab === 'internship-periods' && <InternshipPeriodsView />}
          {activeTab === 'hotels' && <HotelsView />}
          {activeTab === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />

      {/* Modals & Overlays */}
      <AddWorkModal />
      <WorkDetailModal />
      <AddTaskModal />
      <TaskDetailModal />
      <PdfPreviewModal />
      <PresentationModal
        isOpen={isPresentationOpen}
        onClose={() => setIsPresentationOpen(false)}
        initialIndex={presentationIndex}
      />
      <AuthModal />
      <ToastContainer />
    </div>
  );
};

export function App() {
  return (
    <WorksProvider>
      <MainContent />
    </WorksProvider>
  );
}

export default App;
