import styled from 'styled-components';

export const Card = styled.div`
  background: ${({ theme }) => theme.colors.cardBg};
  border-radius: ${({ theme }) => theme.isDyslexia ? '28px' : '20px'};
  padding: ${({ theme }) => theme.isDyslexia ? '28px' : 'clamp(12px, 2vw, 24px)'};
  min-width: 0;
  box-shadow: ${({ theme }) => 
    theme.isDyslexia 
      ? '0 16px 35px rgba(99, 102, 241, 0.08)' 
      : '0 4px 20px rgba(0, 0, 0, 0.04)'
  };
  transition: ${({ theme }) => 
    theme.isDyslexia 
      ? 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)' 
      : 'transform 0.15s ease, box-shadow 0.15s ease'
  };
  border: ${({ theme }) => 
    theme.isDyslexia 
      ? '4px solid #c7d2fe' 
      : '1px solid rgba(15, 23, 42, 0.06)'
  };
  animation: ${({ theme }) => theme.isDyslexia ? 'float 4s ease-in-out infinite' : 'none'};

  &:nth-child(2) {
    animation-delay: ${({ theme }) => theme.isDyslexia ? '1.5s' : '0s'};
  }

  &:hover {
    transform: ${({ theme }) => 
      theme.isDyslexia ? 'scale(1.04) translateY(-10px)' : 'none'
    };
    box-shadow: ${({ theme }) => 
      theme.isDyslexia ? '0 25px 40px rgba(139, 128, 88, 0.15)' : '0 4px 20px rgba(0, 0, 0, 0.04)'
    };
  }

  h4 {
    font-size: ${({ theme }) => theme.fontSize.h4};
    margin: 0 0 clamp(8px, 1.5vh, 12px);
    font-weight: 700;
    color: ${({ theme }) => theme.colors.text};
  }
`;

export const Stats = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(180px, 100%), 1fr));
  gap: clamp(12px, 2vw, 20px);
  margin: clamp(16px, 3vh, 24px) 0 clamp(16px, 3vh, 32px) 0;

  @media (min-width: 992px) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const StatCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: clamp(12px, 2vw, 22px) clamp(12px, 2vw, 24px);
  border-radius: 20px;
  color: #ffffff;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: ${({ $variant }) => {
    const gradients = {
      points: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      target: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
      streak: 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)',
      total: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
    };
    return gradients[$variant] || gradients.points;
  }};

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.12);
  }

  @media (max-width: 768px) {
    text-align: center;
    flex-direction: column;
    gap: 12px;
  }
`;

export const StatCardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const StatCardLabel = styled.span`
  font-size: clamp(0.75rem, 1.3vw, 0.85rem);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  opacity: 0.85;
`;

export const StatCardValue = styled.span`
  font-size: clamp(1.1rem, 2.5vw, 1.8rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  word-break: break-word;
`;

export const StatCardIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 14px;
  font-size: 24px;
  color: #ffffff;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.15);
`;

export const Grid = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(300px, 100%), 1fr));
  gap: clamp(16px, 2.5vw, 24px);
  width: 100%;
  align-items: start;

  @media (min-width: 992px) {
    grid-template-columns: 2fr 1fr;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const GridLeft = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(280px, 100%), 1fr));
  gap: clamp(16px, 2.5vw, 24px);

  .wide {
    grid-column: 1 / -1;
  }

  @media (min-width: 992px) {
    grid-template-columns: 1fr 1fr;

    .wide {
      grid-column: span 2;
    }
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;

    .wide {
      grid-column: 1;
    }
  }
`;

export const SettingsSection = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(320px, 100%), 1fr));
  gap: clamp(16px, 2.5vw, 24px);
  margin-top: clamp(16px, 3vh, 24px);
  width: 100%;

  @media (min-width: 992px) {
    grid-template-columns: 1.2fr 1fr;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const SettingsCard = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const SettingsSubtitle = styled.p`
  margin-top: 4px;
  margin-bottom: 16px;
  font-size: 0.9rem;
  color: #4b5563;
`;

export const ProfileRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: clamp(12px, 2vw, 16px);
  margin-bottom: ${({ $noMargin }) => ($noMargin ? '0' : '32px')};

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const ProfileLabel = styled.label`
  font-size: clamp(0.85rem, 1.5vw, 0.9rem);
  flex: 1 1 auto;
  min-width: 120px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 700;
  margin-bottom: ${({ $standalone }) => ($standalone ? '12px' : '0')};
`;

export const ProfileSelect = styled.select`
  min-width: min(200px, 100%);
  max-width: 100%;
  padding: clamp(6px, 1vw, 8px) clamp(8px, 1.5vw, 10px);
  font-size: clamp(0.85rem, 1.5vw, 0.95rem);
  flex: 0 1 auto;
  border-radius: 8px;
  border: ${({ theme }) => theme.isDyslexia ? '3px solid #c7d2fe' : '1px solid #d1d5db'};
  background: ${({ theme }) => theme.isDyslexia ? '#ffffff' : '#f9fafb'};
  color: ${({ theme }) => theme.colors.text};
  font-weight: ${({ theme }) => theme.isDyslexia ? '600' : 'normal'};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.isDyslexia ? '#6366f1' : '#9B7EBD'};
    box-shadow: ${({ theme }) => 
      theme.isDyslexia 
        ? '0 0 0 4px rgba(99, 102, 241, 0.2)' 
        : '0 0 0 1px rgba(155, 126, 189, 0.15)'
    };
    background: #ffffff;
  }

  @media (max-width: 768px) {
    width: 100%;
    min-width: 100%;
  }
`;

export const ProfileToggle = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: #374151;

  input[type="checkbox"] {
    width: ${({ theme }) => theme.isDyslexia ? '28px' : '18px'};
    height: ${({ theme }) => theme.isDyslexia ? '28px' : '18px'};
    margin-right: ${({ theme }) => theme.isDyslexia ? '12px' : '0'};
    cursor: pointer;
    accent-color: #6366f1;
  }
`;

export const ProfileDropdown = styled.div`
  position: absolute;
  top: clamp(52px, 10vh, 56px);
  right: 0;
  width: min(320px, calc(100vw - 32px));
  max-width: calc(100vw - 32px);
  background: #ffffff;
  border-radius: 18px;
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.22);
  padding: clamp(14px, 2vw, 16px) clamp(14px, 2vw, 18px) clamp(14px, 2vw, 18px);
  z-index: 20;
  max-height: calc(100vh - 100px);
  overflow-y: auto;

  @media (max-width: 480px) {
    left: 16px;
    right: 16px;
    width: auto;
  }
`;

export const ProfileDropdownHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 8px;
`;

export const ProfileDropdownClose = styled.button`
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #6b7280;
  cursor: pointer;
  padding: 4px;
  line-height: 1;

  &:hover {
    color: #111827;
  }
`;

export const ProfileSummary = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 12px;
`;

export const ProfileSummaryName = styled.div`
  font-weight: 700;
  font-size: 1rem;
  color: #111827;
`;

export const ProfileSummaryMeta = styled.div`
  font-size: 0.85rem;
  color: #6b7280;

  span {
    font-weight: 600;
    color: #5FB3B3;
  }
`;

export const ChangePassword = styled.div`
  border-top: 1px solid rgba(229, 231, 235, 0.9);
  padding-top: 12px;
  margin-top: 8px;
`;

export const ChangePasswordTitle = styled.h5`
  margin: 0 0 4px;
  font-size: 0.95rem;
  font-weight: 600;
  color: #111827;
`;

export const ChangePasswordSubtitle = styled.p`
  margin: 0 0 10px;
  font-size: 0.8rem;
  color: #6b7280;
`;

export const ChangePasswordForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const ChangePasswordLabel = styled.label`
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 0.8rem;
  color: #374151;
`;

export const ChangePasswordInput = styled.input`
  padding: ${({ theme }) => theme.isDyslexia ? '16px 20px' : '6px 10px'};
  border-radius: ${({ theme }) => theme.isDyslexia ? '16px' : '8px'};
  border: ${({ theme }) => theme.isDyslexia ? '3px solid #c7d2fe' : '1px solid #d1d5db'};
  font-size: ${({ theme }) => theme.isDyslexia ? '1.1rem' : '0.85rem'};
  background: ${({ theme }) => theme.isDyslexia ? '#ffffff' : '#f9fafb'};
  color: ${({ theme }) => theme.colors.text};
  font-weight: ${({ theme }) => theme.isDyslexia ? '600' : 'normal'};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.isDyslexia ? '#6366f1' : '#9B7EBD'};
    box-shadow: ${({ theme }) => 
      theme.isDyslexia 
        ? '0 0 0 4px rgba(99, 102, 241, 0.2)' 
        : '0 0 0 1px rgba(155, 126, 189, 0.15)'
    };
    background: #ffffff;
  }

  &::placeholder {
    color: ${({ theme }) => theme.isDyslexia ? '#818cf8' : 'inherit'};
    opacity: ${({ theme }) => theme.isDyslexia ? '0.7' : '1'};
  }
`;

export const ChangePasswordStatus = styled.div`
  padding: 6px 10px;
  border-radius: 8px;
  font-size: 0.78rem;
  background: ${({ $type }) => ($type === 'success' ? '#ecfdf3' : '#fef2f2')};
  color: ${({ $type }) => ($type === 'success' ? '#166534' : '#b91c1c')};
  border: 1px solid ${({ $type }) => ($type === 'success' ? '#bbf7d0' : '#fecaca')};
`;

export const ChangePasswordButton = styled.button`
  margin-top: 4px;
  align-self: flex-start;
  padding: ${({ theme }) => theme.isDyslexia ? '16px 32px' : '6px 14px'};
  border-radius: ${({ theme }) => theme.isDyslexia ? '20px' : '999px'};
  border: none;
  background: linear-gradient(135deg, #9B7EBD, #B89DD1);
  color: #ffffff;
  font-size: ${({ theme }) => theme.isDyslexia ? '1.15rem' : '0.85rem'};
  font-weight: ${({ theme }) => theme.isDyslexia ? '800' : '500'};
  cursor: pointer;
  box-shadow: ${({ theme }) => 
    theme.isDyslexia 
      ? '0 8px 20px rgba(99, 102, 241, 0.1)' 
      : '0 6px 16px rgba(155, 126, 189, 0.35)'
  };
  transition: ${({ theme }) => 
    theme.isDyslexia 
      ? 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)' 
      : 'transform 0.12s ease, box-shadow 0.12s ease, background 0.12s ease'
  };

  &:hover:not(:disabled) {
    transform: ${({ theme }) => theme.isDyslexia ? 'scale(1.08)' : 'translateY(-1px)'};
    box-shadow: ${({ theme }) => 
      theme.isDyslexia 
        ? '0 12px 28px rgba(79, 70, 229, 0.25)' 
        : '0 10px 22px rgba(155, 126, 189, 0.5)'
    };
  }

  &:active:not(:disabled) {
    transform: ${({ theme }) => theme.isDyslexia ? 'scale(0.95)' : 'translateY(-1px)'};
  }

  &:disabled {
    opacity: 0.7;
    cursor: default;
    box-shadow: none;
  }
`;

export const GranularityCards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 16px;
  margin-top: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const GranularityButton = styled.button`
  background: ${({ $active, $color }) => ($active ? $color : '#ffffff')};
  color: ${({ $active }) => ($active ? '#ffffff' : '#1e1b4b')};
  border: 4px solid ${({ $active, $borderColor }) => ($active ? $borderColor : '#c7d2fe')};
  border-radius: 24px;
  padding: 24px 16px;
  cursor: pointer;
  font-weight: 900;
  font-size: 1.15rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: ${({ $active }) => 
    $active 
      ? '0 12px 28px rgba(0, 0, 0, 0.15)' 
      : '0 4px 12px rgba(0, 0, 0, 0.05)'
  };
  position: relative;
  overflow: hidden;

  &:hover {
    transform: ${({ $active }) => ($active ? 'scale(1.08) translateY(-4px)' : 'scale(1.05) translateY(-2px)')};
    box-shadow: ${({ $active }) => 
      $active 
        ? '0 16px 36px rgba(0, 0, 0, 0.2)' 
        : '0 8px 20px rgba(0, 0, 0, 0.1)'
    };
  }

  &:active {
    transform: scale(0.98);
  }

  ${({ $active }) => $active && `
    animation: selectedPulse 2s ease-in-out infinite;

    @keyframes selectedPulse {
      0%, 100% {
        box-shadow: 0 12px 28px rgba(0, 0, 0, 0.15);
      }
      50% {
        box-shadow: 0 16px 36px rgba(0, 0, 0, 0.25);
      }
    }

    &::after {
      content: "✓";
      position: absolute;
      top: 8px;
      right: 8px;
      width: 28px;
      height: 28px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
      font-weight: 900;
    }
  `}
`;

export const DyslexiaToggle = styled.div`
  background: ${({ $active }) => ($active ? '#6366f1' : '#f3f4f6')};
  color: ${({ $active }) => ($active ? '#ffffff' : '#374151')};
  border: ${({ $active }) => ($active ? '4px solid #4f46e5' : '2px solid #d1d5db')};
  border-radius: 24px;
  padding: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  box-shadow: ${({ $active }) => ($active ? '0 8px 24px rgba(99, 102, 241, 0.25)' : 'none')};
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  animation: ${({ $active }) => ($active ? 'activePulse 2s infinite' : 'none')};

  &:hover {
    transform: scale(1.03);
    box-shadow: ${({ $active }) => 
      $active 
        ? '0 12px 32px rgba(99, 102, 241, 0.35)' 
        : '0 4px 12px rgba(0, 0, 0, 0.08)'
    };
  }

  @keyframes activePulse {
    0%, 100% {
      box-shadow: 0 8px 24px rgba(99, 102, 241, 0.25);
    }
    50% {
      box-shadow: 0 12px 32px rgba(99, 102, 241, 0.4);
    }
  }
`;

export const SettingsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ $dyslexia }) => ($dyslexia ? '32px' : '24px')};
`;

export const SettingsTitle = styled.h3`
  margin: 0 0 ${({ $dyslexia }) => ($dyslexia ? '20px' : '8px')};
  font-size: ${({ $dyslexia }) => ($dyslexia ? '1.6rem' : '1.2rem')};
  font-weight: ${({ $dyslexia }) => ($dyslexia ? '900' : '700')};
  color: ${({ $dyslexia }) => ($dyslexia ? '#1e1b4b' : '#1e293b')};
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const SettingsDescription = styled.p`
  margin: 0 0 16px;
  font-size: 0.9rem;
  color: #64748b;
  line-height: 1.5;
`;
