import styled from 'styled-components';

export const DashboardRoot = styled.div`
  display: flex;
  min-height: 100vh;
  width: 100%;
  overflow-x: hidden;
`;

export const Sidebar = styled.aside`
  width: ${({ $open }) => ($open ? '250px' : '80px')};
  background: ${({ theme }) => theme.colors.sidebarBg};
  color: ${({ theme }) => theme.isDyslexia ? '#1e1b4b' : 'white'};
  padding: ${({ $open }) => ($open ? '24px 16px' : '24px 12px')};
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  z-index: 1000;
  box-shadow: ${({ theme }) => theme.isDyslexia ? '8px 0 30px rgba(99, 102, 241, 0.06)' : '4px 0 25px rgba(0, 0, 0, 0.15)'};
  border-right: ${({ theme }) => theme.isDyslexia ? '4px solid #c7d2fe' : 'none'};
  transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1), transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);

  @media (max-width: 768px) {
    width: 260px;
    transform: ${({ $open }) => ($open ? 'translateX(0)' : 'translateX(-100%)')};
  }
`;

export const SidebarHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 30px;
  flex-direction: ${({ $closed }) => ($closed ? 'column' : 'row')};
  gap: ${({ $closed }) => ($closed ? '16px' : '8px')};
  min-width: 0;
  padding-bottom: ${({ $closed }) => ($closed ? '0' : '8px')};
`;

export const Brand = styled.div`
  display: flex;
  align-items: ${({ $closed }) => ($closed ? 'center' : 'flex-start')};
  gap: 10px;
  justify-content: ${({ $closed }) => ($closed ? 'center' : 'flex-start')};
  width: ${({ $closed }) => ($closed ? '100%' : 'auto')};
  min-width: 0;
  flex: 1;
  overflow: hidden;
`;

export const BrandLogo = styled.span`
  display: inline-flex;
  width: 42px;
  height: 42px;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: linear-gradient(135deg, #F9D56E, #FDE08D);
  color: ${({ theme }) => theme.isDyslexia ? '#4f46e5' : '#ffffff'};
  font-size: ${({ theme }) => theme.isDyslexia ? '2.2rem' : '22px'};
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  flex-shrink: 0;
`;

export const BrandText = styled.span`
  white-space: normal;
  overflow: hidden;
  color: ${({ theme }) => theme.isDyslexia ? '#1e1b4b' : 'inherit'};
  font-size: ${({ theme }) => theme.isDyslexia ? '1.1rem' : '0.95rem'};
  font-weight: ${({ theme }) => theme.isDyslexia ? '800' : '700'};
  max-width: 100%;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  word-break: break-word;
`;

export const SidebarToggle = styled.button`
  background: ${({ theme }) => theme.isDyslexia ? '#ffffff' : 'rgba(255, 255, 255, 0.08)'};
  color: ${({ theme }) => theme.isDyslexia ? '#1e1b4b' : '#94a3b8'};
  border: ${({ theme }) => theme.isDyslexia ? '2px solid #c7d2fe' : '1px solid rgba(255, 255, 255, 0.1)'};
  border-radius: 50%;
  width: ${({ theme }) => theme.isDyslexia ? '36px' : '28px'};
  height: ${({ theme }) => theme.isDyslexia ? '36px' : '28px'};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.isDyslexia ? '1.4rem' : '18px'};
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
  margin-top: 4px;

  &:hover {
    background: ${({ theme }) => theme.isDyslexia ? '#ffffff' : 'rgba(255, 255, 255, 0.2)'};
    color: ${({ theme }) => theme.isDyslexia ? '#1e1b4b' : '#ffffff'};
    transform: scale(1.1);
  }
`;

export const SideList = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 10px;
  width: ${({ $closed }) => ($closed ? '100%' : 'auto')};
  align-items: ${({ $closed }) => ($closed ? 'center' : 'stretch')};
`;

const navIconColors = ['#3b82f6', '#f59e0b', '#10b981', '#8b5cf6', '#ec4899'];

export const NavItem = styled.button`
  background: ${({ $active, theme }) => 
    $active 
      ? (theme.isDyslexia ? '#ffffff' : 'rgba(255, 255, 255, 0.1)') 
      : 'transparent'
  };
  border: ${({ $active, theme }) => 
    $active && theme.isDyslexia ? '4px solid #6366f1' : 'none'
  };
  color: ${({ theme }) => theme.isDyslexia ? '#475569' : '#94a3b8'};
  padding: ${({ $closed, theme }) => 
    $closed ? '12px 0' : (theme.isDyslexia ? '16px 20px' : '12px 16px')
  };
  text-align: left;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: ${({ $closed }) => ($closed ? 'center' : 'flex-start')};
  border-radius: ${({ theme }) => theme.isDyslexia ? '18px' : '12px'};
  font-size: ${({ theme }) => theme.isDyslexia ? '1.15rem' : '0.95rem'};
  font-weight: ${({ theme }) => theme.isDyslexia ? '700' : '600'};
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  width: 100%;
  position: relative;
  margin-bottom: ${({ theme }) => theme.isDyslexia ? '8px' : '0'};

  &:hover {
    background: ${({ theme }) => theme.isDyslexia ? '#ffffff' : 'rgba(255, 255, 255, 0.05)'};
    color: ${({ theme }) => theme.isDyslexia ? '#1e1b4b' : '#ffffff'};
    transform: ${({ $closed }) => ($closed ? 'scale(1.05)' : 'translateX(4px)')};
  }

  ${({ $active }) => $active && `
    &::before {
      content: "";
      position: absolute;
      left: 0;
      top: 15%;
      height: 70%;
      width: 4px;
      background: #5FB3B3;
      border-radius: 0 4px 4px 0;
    }
  `}

  ${({ $active, theme }) => $active && theme.isDyslexia && `
    box-shadow: 0 8px 20px rgba(99, 102, 241, 0.15);
  `}
`;

export const NavIcon = styled.span`
  display: inline-flex;
  width: ${({ $closed, theme }) => 
    $closed && theme.isDyslexia ? '48px' : '32px'
  };
  height: ${({ $closed, theme }) => 
    $closed && theme.isDyslexia ? '48px' : '32px'
  };
  justify-content: center;
  align-items: center;
  border-radius: ${({ $closed, theme }) => 
    $closed && theme.isDyslexia ? '12px' : '8px'
  };
  background: ${({ $closed, theme, $index, $active }) => {
    if ($closed && theme.isDyslexia) {
      return $active ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.8)';
    }
    return 'rgba(255, 255, 255, 0.08)';
  }};
  font-size: ${({ $closed, theme }) => 
    $closed && theme.isDyslexia ? '2.2rem' : (theme.isDyslexia ? '1.8rem' : '18px')
  };
  color: ${({ theme, $index }) => 
    theme.isDyslexia ? navIconColors[$index % navIconColors.length] : 'inherit'
  };
  transition: transform 0.2s ease, background 0.2s ease;
  flex-shrink: 0;
  box-shadow: ${({ $active, theme }) => 
    $active && theme.isDyslexia ? '0 4px 12px rgba(0, 0, 0, 0.1)' : 'none'
  };

  ${({ $active, theme }) => $active && theme.isDyslexia && `
    animation: wiggle 1.2s ease-in-out infinite;
  `}

  svg {
    ${({ $closed, theme }) => $closed && theme.isDyslexia && `
      display: block;
      visibility: visible;
      width: 32px;
      height: 32px;
      min-width: 32px;
      min-height: 32px;
    `}
  }
`;

export const NavLabel = styled.span`
  white-space: nowrap;
  display: ${({ $closed }) => ($closed ? 'none' : 'inline')};
`;

export const SideFull = styled.div`
  margin-top: auto;
  width: 100%;
  display: ${({ $closed }) => ($closed ? 'flex' : 'block')};
  justify-content: ${({ $closed }) => ($closed ? 'center' : 'flex-start')};
  align-items: ${({ $closed }) => ($closed ? 'center' : 'stretch')};
  padding: ${({ $closed }) => ($closed ? '12px 0' : '0')};
`;

export const LogoutButton = styled.button`
  margin-bottom: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: ${({ $closed }) => ($closed ? '0' : '10px')};
  width: ${({ $closed, theme }) => 
    $closed ? (theme.isDyslexia ? '52px' : '48px') : '100%'
  };
  height: ${({ $closed, theme }) => 
    $closed ? (theme.isDyslexia ? '52px' : '48px') : 'auto'
  };
  padding: ${({ $closed }) => ($closed ? '0' : '12px 20px')};
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  border-radius: ${({ $closed, theme }) => 
    $closed ? (theme.isDyslexia ? '16px' : '14px') : '12px'
  };
  color: #ffffff;
  border: none;
  cursor: pointer;
  font-weight: ${({ theme }) => theme.isDyslexia ? '800' : '600'};
  font-size: ${({ theme }) => theme.isDyslexia ? '1.15rem' : '0.95rem'};
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
  transition: all 0.2s ease;

  &:hover {
    background: linear-gradient(135deg, #f87171 0%, #ef4444 100%);
    box-shadow: 0 6px 18px rgba(239, 68, 68, 0.35);
    transform: translateY(-2px);
  }
`;

export const LogoutIcon = styled.span`
  display: inline-flex;
  width: ${({ $closed, theme }) => 
    $closed && theme.isDyslexia ? '48px' : '24px'
  };
  height: ${({ $closed, theme }) => 
    $closed && theme.isDyslexia ? '48px' : '24px'
  };
  align-items: center;
  justify-content: center;
  border-radius: ${({ $closed, theme }) => 
    $closed && theme.isDyslexia ? '12px' : '50%'
  };
  background: ${({ $closed, theme }) => 
    $closed && theme.isDyslexia ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.16)'
  };
  color: #ffffff;
  font-size: ${({ $closed, theme }) => 
    $closed && theme.isDyslexia ? '2.2rem' : '16px'
  };

  svg {
    ${({ $closed, theme }) => $closed && theme.isDyslexia && `
      width: 32px;
      height: 32px;
    `}
  }
`;

export const LogoutLabel = styled.span`
  white-space: nowrap;
  display: ${({ $closed }) => ($closed ? 'none' : 'inline')};
`;

export const SidebarBackdrop = styled.button`
  display: ${({ $show }) => ($show ? 'block' : 'none')};
  position: fixed;
  inset: 0;
  z-index: 900;
  background: rgba(0, 0, 0, 0.45);
  border: none;
  padding: 0;
  cursor: pointer;

  @media (min-width: 769px) {
    display: none;
  }
`;

export const DashboardMain = styled.main`
  flex: 1;
  padding: 0 clamp(16px, 3vw, 40px) clamp(16px, 3vw, 40px) clamp(16px, 3vw, 40px);
  overflow-y: auto;
  overflow-x: hidden;
  min-width: 0;
  width: 100%;
  margin-left: ${({ $sidebarOpen }) => ($sidebarOpen ? '250px' : '80px')};
  width: ${({ $sidebarOpen }) => ($sidebarOpen ? 'calc(100% - 250px)' : 'calc(100% - 80px)')};
  transition: margin-left 0.4s cubic-bezier(0.4, 0, 0.2, 1), width 0.4s cubic-bezier(0.4, 0, 0.2, 1);

  @media (max-width: 768px) {
    margin-left: 0 !important;
    width: 100% !important;
    padding: clamp(12px, 3vw, 16px);
  }
`;

export const Topbar = styled.header`
  position: sticky;
  top: 0;
  z-index: 100;
  background: ${({ theme }) => theme.colors.topbarBg};
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: clamp(8px, 2vw, 20px);
  padding: clamp(16px, 3vh, 24px) clamp(16px, 3vw, 40px) clamp(12px, 2vh, 20px) clamp(16px, 3vw, 40px);
  margin-left: calc(-1 * clamp(16px, 3vw, 40px));
  margin-right: calc(-1 * clamp(16px, 3vw, 40px));
  margin-bottom: clamp(12px, 2vh, 20px);
  border-bottom: ${({ theme }) => 
    theme.isDyslexia 
      ? '4px solid #c7d2fe' 
      : '1px solid rgba(15, 23, 42, 0.08)'
  };
  box-shadow: ${({ theme }) => 
    theme.isDyslexia ? '0 8px 30px rgba(99, 102, 241, 0.05)' : 'none'
  };

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
`;

export const MobileMenuBtn = styled.button`
  display: none;
  border: none;
  background: #ffffff;
  color: #111827;
  width: clamp(36px, 8vw, 40px);
  height: clamp(36px, 8vw, 40px);
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  font-size: clamp(18px, 4vw, 22px);

  &:hover {
    background: #f3f4f6;
  }

  @media (max-width: 991px) {
    display: inline-flex;
  }
`;

export const TopbarTitle = styled.div`
  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const TopbarGreeting = styled.h1`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSize.h1};
  font-weight: ${({ theme }) => theme.isDyslexia ? '800' : '800'};
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.colors.text};
`;

export const TopbarUsername = styled.span`
  color: #5FB3B3;
`;

export const TopbarSubtitle = styled.p`
  font-size: clamp(0.8rem, 1.5vw, 0.95rem);
  margin: 4px 0 0;
  color: #6b7280;
`;

export const TopActions = styled.div`
  display: flex;
  align-items: center;
  gap: clamp(8px, 1.5vw, 16px);
  position: relative;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-between;
    flex-wrap: wrap;
  }
`;

export const SearchBarWrapper = styled.div`
  position: relative;
  flex: 0 1 auto;
  min-width: min(240px, 100%);
  max-width: 400px;
  cursor: pointer;

  @media (max-width: 768px) {
    flex: 1;
    min-width: 0;
    max-width: none;
  }
`;

export const SearchBarInput = styled.input`
  width: 100%;
  padding: clamp(8px, 1.5vw, 10px) clamp(12px, 2vw, 16px);
  padding-right: clamp(50px, 10vw, 60px);
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  background: white;
  font-size: clamp(0.8rem, 1.5vw, 0.875rem);
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s ease;
  height: clamp(36px, 8vw, 40px);

  &:hover {
    border-color: #d1d5db;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }

  &:focus {
    outline: none;
    border-color: #9B7EBD;
    box-shadow: 0 0 0 4px rgba(155, 126, 189, 0.12), 0 4px 12px rgba(0, 0, 0, 0.05);
    background: #ffffff;
  }
`;

export const SearchBarKbd = styled.kbd`
  position: absolute;
  right: clamp(8px, 1.5vw, 12px);
  top: 50%;
  transform: translateY(-50%);
  padding: clamp(3px, 0.5vw, 4px) clamp(6px, 1vw, 8px);
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-family: monospace;
  font-size: clamp(0.7rem, 1.2vw, 0.75rem);
  color: #9ca3af;
  pointer-events: none;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const TopIcon = styled.button`
  width: clamp(36px, 8vw, 40px);
  height: clamp(36px, 8vw, 40px);
  border-radius: 999px;
  border: none;
  background: #ffffff;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: clamp(16px, 3.5vw, 18px);
  transition: transform 0.12s ease, box-shadow 0.12s ease, background 0.12s ease;
  flex-shrink: 0;

  &:hover {
    background: #f8fafc;
    transform: translateY(-1px);
    box-shadow: 0 6px 18px rgba(15, 23, 42, 0.12);
  }

  &.notification {
    color: #F9D56E;
  }

  &.profile {
    color: #5FB3B3;
  }
`;
