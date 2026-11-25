import { useState } from 'react';

const NAV_ITEMS = [
  { key: 'equipments', label: 'Thiết bị' },
  { key: 'borrowings', label: 'Phiếu mượn' },
  { key: 'fines', label: 'Quá hạn & tiền phạt' },
];

function AppNavbar({ activeTab, onSelectTab }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSelect = (event, tabKey) => {
    event.preventDefault();
    onSelectTab(tabKey);
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <a
          className="navbar-brand fw-bold"
          href="#equipments"
          onClick={(e) => handleSelect(e, 'equipments')}
        >
          Rikkei Lab
        </a>

        <button
          className="navbar-toggler"
          type="button"
          aria-controls="mainMenu"
          aria-expanded={isMenuOpen}
          aria-label="Mở hoặc đóng thanh điều hướng"
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div
          id="mainMenu"
          className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`}
        >
          <ul className="navbar-nav me-auto">
            {NAV_ITEMS.map((item) => {
              const isActive = activeTab === item.key;
              return (
                <li className="nav-item" key={item.key}>
                  <a
                    className={`nav-link ${isActive ? 'active fw-semibold' : ''}`}
                    href={`#${item.key}`}
                    aria-current={isActive ? 'page' : undefined}
                    onClick={(e) => handleSelect(e, item.key)}
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default AppNavbar;
