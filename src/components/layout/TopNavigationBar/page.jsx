import LogoBox from '@/components/LogoBox';
import ThemeCustomizeToggle from '@/components/ThemeCustomizeToggle';
import HorizontalToggle from './components/HorizontalToggle';
import LeftSideBarToggle from './components/LeftSideBarToggle';
import ProfileDropdown from './components/ProfileDropdown';
import ThemeModeToggle from './components/ThemeModeToggle';

const TopNavigationBar = () => {
  return (
    <header className="app-topbar">
      <div className="page-container topbar-menu">
        <div className="d-flex align-items-center gap-2">
          <LogoBox />
          <LeftSideBarToggle />
          <HorizontalToggle />
        </div>
        <div className="d-flex align-items-center gap-2">
          <ThemeCustomizeToggle />
          <ThemeModeToggle />
          <ProfileDropdown />
        </div>
      </div>
    </header>
  );
};

export default TopNavigationBar;
