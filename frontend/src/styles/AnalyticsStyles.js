import styled from 'styled-components';

// Calendar Styles
export const CalendarContainer = styled.div`
  margin-top: 16px;
  width: 100%;
`;

export const CalendarWeekdays = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
  margin-bottom: 8px;
  text-align: center;
  font-weight: 700;
  font-size: 0.8rem;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const CalendarWeeks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const CalendarWeek = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
`;

export const CalendarDay = styled.div`
  padding: 8px 0;
  border-radius: 8px;
  text-align: center;
  background: ${({ $background }) => $background};
  color: ${({ $textColor }) => $textColor};
  font-size: 0.85rem;
  font-weight: ${({ $isToday, $count }) => ($isToday || $count > 0 ? '700' : '500')};
  opacity: ${({ $isSameMonth }) => ($isSameMonth ? 1 : 0.3)};
  transition: all 0.2s ease;
  border: ${({ $isToday }) => ($isToday ? '2px solid #4f46e5' : '1px solid rgba(15, 23, 42, 0.04)')};
`;

// TasksChart Styles (minimal wrapper if needed)
export const ChartWrapper = styled.div`
  width: 100%;
  height: 200px;
`;

// TodoList Styles
export const TodoListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const TodoListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  h4 {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 700;
    color: #1e293b;
  }
`;

export const TodoAddBtn = styled.button`
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  color: white;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 20px;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 16px rgba(99, 102, 241, 0.4);
  }

  &:active {
    transform: scale(0.95);
  }
`;

export const TodoInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 12px;
  border: 2px solid #e2e8f0;
`;

export const TodoInput = styled.input`
  padding: 10px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 0.95rem;
  outline: none;
  transition: border 0.2s;

  &:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }
`;

export const TodoInputActions = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
`;

export const TodoInputBtn = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &.todo-input-btn-add {
    background: linear-gradient(135deg, #6366f1, #4f46e5);
    color: white;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
    }
  }

  &.todo-input-btn-cancel {
    background: #f1f5f9;
    color: #64748b;

    &:hover {
      background: #e2e8f0;
    }
  }
`;

export const TodoEmpty = styled.div`
  text-align: center;
  padding: 32px 16px;
  color: #64748b;

  p {
    margin: 8px 0;
  }

  .todo-empty-hint {
    font-size: 0.85rem;
    color: #94a3b8;
  }
`;

export const TodoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const TodoSectionTitle = styled.h5`
  margin: 0 0 8px 0;
  font-size: 0.85rem;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const TodoList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const TodoItem = styled.li`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: ${({ className }) => (className?.includes('completed') ? '#f8fafc' : '#ffffff')};
  border: 1px solid ${({ className }) => (className?.includes('completed') ? '#e2e8f0' : '#cbd5e1')};
  border-radius: 10px;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    transform: translateX(2px);
  }
`;

export const TodoCheckbox = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 22px;
  color: ${({ className }) => (className?.includes('completed') ? '#22c55e' : '#cbd5e1')};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.15);
    color: ${({ className }) => (className?.includes('completed') ? '#16a34a' : '#6366f1')};
  }
`;

export const TodoText = styled.span`
  flex: 1;
  font-size: 0.95rem;
  color: ${({ className }) => (className?.includes('completed') ? '#94a3b8' : '#1e293b')};
  text-decoration: ${({ className }) => (className?.includes('completed') ? 'line-through' : 'none')};
  font-weight: ${({ className }) => (className?.includes('completed') ? '400' : '500')};
`;

export const TodoDelete = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 20px;
  color: #cbd5e1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  transition: all 0.2s ease;

  &:hover {
    color: #ef4444;
    transform: scale(1.15);
  }
`;

// Analytics Page Styles
export const AnalyticsPage = styled.section`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const AnalyticsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 12px;
`;

export const AnalyticsTitle = styled.h2`
  margin: 0;
  font-size: 1.8rem;
  font-weight: 800;
  color: #1e293b;
`;

export const AnalyticsSubtitle = styled.p`
  margin: 4px 0 0;
  font-size: 0.95rem;
  color: #64748b;
`;

export const AnalyticsMetrics = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const AnalyticsMetric = styled.div`
  background: ${({ className }) => 
    className?.includes('primary') 
      ? 'linear-gradient(135deg, #6366f1, #4f46e5)' 
      : '#ffffff'
  };
  color: ${({ className }) => className?.includes('primary') ? '#ffffff' : '#1e293b'};
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  transition: all 0.2s ease;
  border: ${({ className }) => className?.includes('primary') ? 'none' : '1px solid #e2e8f0'};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  }
`;

export const AnalyticsMetricLabel = styled.div`
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  opacity: 0.85;
  margin-bottom: 8px;
`;

export const AnalyticsMetricValue = styled.div`
  font-size: ${({ className }) => className?.includes('small') ? '0.9rem' : '2rem'};
  font-weight: 800;
  word-break: break-word;
`;

export const AnalyticsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const AnalyticsCard = styled.div`
  background: #ffffff;
  padding: 24px;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(15, 23, 42, 0.06);
`;

export const AnalyticsCardTitle = styled.h4`
  margin: 0 0 8px;
  font-size: 1.1rem;
  font-weight: 700;
  color: #1e293b;
`;

export const AnalyticsCardSubtitle = styled.p`
  margin: 0 0 16px;
  font-size: 0.9rem;
  color: #64748b;
`;

export const AnalyticsTips = styled.ul`
  list-style: none;
  padding: 0;
  margin: 12px 0 0;
  display: flex;
  flex-direction: column;
  gap: 10px;

  li {
    padding: 10px 12px;
    background: #f8fafc;
    border-radius: 8px;
    font-size: 0.9rem;
    color: #475569;
    border-left: 3px solid #6366f1;

    strong {
      color: #1e293b;
      font-weight: 700;
    }
  }
`;

// Charts Page Styles
export const ChartsPage = styled.section`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const ChartsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 12px;
`;

export const ChartsTitle = styled.h2`
  margin: 0;
  font-size: 1.8rem;
  font-weight: 800;
  color: #1e293b;
`;

export const ChartsSubtitle = styled.p`
  margin: 4px 0 0;
  font-size: 0.95rem;
  color: #64748b;
`;

export const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;

  .wide {
    grid-column: 1 / -1;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;

    .wide {
      grid-column: 1;
    }
  }
`;

export const ChartsCard = styled.div`
  background: #ffffff;
  padding: 24px;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(15, 23, 42, 0.06);
`;

export const ChartsCardTitle = styled.h4`
  margin: 0 0 8px;
  font-size: 1.1rem;
  font-weight: 700;
  color: #1e293b;
`;

export const ChartsCardSubtitle = styled.p`
  margin: 0 0 16px;
  font-size: 0.9rem;
  color: #64748b;
`;

export const HistoryList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 16px 0 0;
  display: flex;
  flex-direction: column;
  gap: 8px;

  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 12px;
    background: #f8fafc;
    border-radius: 8px;
    font-size: 0.9rem;
    border: 1px solid #e2e8f0;
  }
`;

export const HistoryTitle = styled.span`
  font-weight: 600;
  color: #1e293b;
  flex: 1;
`;

export const HistoryDate = styled.span`
  font-size: 0.85rem;
  color: #94a3b8;
`;
