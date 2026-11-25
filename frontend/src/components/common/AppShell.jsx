import AppNavbar from './AppNavbar';

function AppShell({ activeTab, onSelectTab, statusSlot, children }) {
  return (
    <div className="min-vh-100 d-flex flex-column bg-light">
      <AppNavbar activeTab={activeTab} onSelectTab={onSelectTab} />
      <main className="container py-4 flex-grow-1">
        {statusSlot}
        {children}
      </main>
    </div>
  );
}

export default AppShell;
