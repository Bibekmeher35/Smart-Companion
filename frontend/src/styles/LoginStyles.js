import styled from 'styled-components';

export const LoginRoot = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: radial-gradient(circle at top left, #dbeafe, #f9fafb);
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  gap: 40px;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

export const LoginHero = styled.div`
  max-width: 360px;
  color: #0f172a;

  h1 {
    font-size: 2.1rem;
    margin-bottom: 12px;
  }

  p {
    margin: 0;
    color: #4b5563;
    font-size: 0.98rem;
  }

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

export const LoginContainer = styled.div`
  background-color: #ffffff;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  width: 340px;
  text-align: center;

  h2 {
    margin-bottom: 30px;
    color: #333;
  }
`;

export const InputGroup = styled.div`
  margin-bottom: 20px;
  text-align: left;

  label {
    display: block;
    margin-bottom: 5px;
    color: #555;
    font-weight: 500;
  }

  input {
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
    border-radius: 6px;
    border: 1px solid #ccc;
    font-size: 16px;
    outline: none;
    transition: border 0.2s;

    &:focus {
      border-color: #4caf50;
    }
  }
`;

export const PasswordGroup = styled(InputGroup)`
  position: relative;
`;

export const PasswordField = styled.div`
  position: relative;

  input {
    padding-right: 70px;
  }
`;

export const PasswordToggle = styled.button`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 34px;
  height: 34px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: #4f46e5;
  cursor: pointer;
  user-select: none;
  background: transparent;
  border: none;
  padding: 0;

  &:hover {
    color: #4338ca;
  }
`;

export const LoginButton = styled.button`
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #4f46e5, #6366f1);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background: linear-gradient(135deg, #4338ca, #4f46e5);
  }

  &.loading {
    opacity: 0.8;
    cursor: default;
  }
`;

export const LoginToggle = styled.p`
  margin-top: 15px;
  color: #4b5563;
  cursor: pointer;
  text-decoration: underline;
  font-size: 0.9rem;
`;

export const LoginError = styled.div`
  margin: 8px 0 14px;
  padding: 8px 10px;
  background: #fef2f2;
  color: #b91c1c;
  border-radius: 6px;
  font-size: 0.85rem;
`;
