/**
 * The ☰ button in the top bar, plus the rules that fit the sidebar to the screen size.
 *
 *   Mobile  (≤ 768px):  sidebar is hidden and slides in over the page ("full")
 *   Tablet  (≤ 1140px): icons only ("condensed")
 *   Desktop (> 1140px): whatever the admin chose (full width or icons only)
 *
 * When the screen gets wide again, the admin's own desktop choice is restored.
 */
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { useLayoutContext } from '@/context/useLayoutContext';
import useViewPort from '@/hooks/useViewPort';

const MOBILE_MAX_WIDTH = 768;
const TABLET_MAX_WIDTH = 1140;

const getScreen = (width) => (width <= MOBILE_MAX_WIDTH ? 'mobile' : width <= TABLET_MAX_WIDTH ? 'tablet' : 'desktop');

/** Is the mobile slide-in menu open right now? */
const isSlideInOpen = () => document.documentElement.classList.contains('sidebar-enable');

const LeftSideBarToggle = () => {
  const {
    menu: { size },
    changeMenu: { size: changeMenuSize },
    toggleBackdrop,
  } = useLayoutContext();
  const { pathname } = useLocation();
  const { width } = useViewPort();
  const screen = getScreen(width);

  // The size the admin chose on a wide screen. ("full" is the mobile mode, never a desktop choice;
  // this also un-sticks anyone whose saved setting got stuck on it.)
  const desktopSize = useRef(size === 'full' ? 'default' : size);

  const closeSlideIn = () => {
    if (isSlideInOpen()) toggleBackdrop();
  };

  // ☰ button
  const handleMenuSize = () => {
    if (size === 'full') toggleBackdrop(); // mobile: open/close the slide-in menu
    else if (size === 'condensed') changeMenuSize('default');
    else if (size === 'fullscreen') changeMenuSize('default');
    else changeMenuSize('condensed'); // 'default' or 'compact'
  };

  // Fit the sidebar whenever the screen moves between mobile, tablet and desktop.
  useEffect(() => {
    if (screen === 'mobile') {
      if (size !== 'full') changeMenuSize('full');
    } else {
      closeSlideIn(); // leaving mobile with the slide-in menu open: close it
      if (screen === 'tablet' && size !== 'condensed') changeMenuSize('condensed');
      if (screen === 'desktop' && size !== desktopSize.current) changeMenuSize(desktopSize.current);
    }
  }, [screen]); // eslint-disable-line react-hooks/exhaustive-deps

  // Remember changes the admin makes on desktop (☰ button or theme settings).
  useEffect(() => {
    if (screen === 'desktop' && size !== 'full') desktopSize.current = size;
  }, [size]); // eslint-disable-line react-hooks/exhaustive-deps

  // After moving to another page, close the mobile slide-in menu (only if it's open).
  useEffect(() => {
    closeSlideIn();
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <button onClick={handleMenuSize} className="sidenav-toggle-button px-2" aria-label="Toggle menu">
      <IconifyIcon icon="tabler:menu-deep" className="fs-24" />
    </button>
  );
};

export default LeftSideBarToggle;