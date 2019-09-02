import styled from "styled-components";

const Button = styled.button`
  background: white;
  font-weight: 600;
  border: none;
  display: inline-block;
  border-radius: 0.3rem;
  font-family: Lato, sans-serif;
  font-size: 1.2rem;
  padding: 0.7rem 2rem;
  margin-right: 0.3rem;
  min-height: 2.65em;

  @media (orientation: portrait) {
    display: block;
    margin-top: 0.3rem;
    width: 100%;
  }
`;

export const Button2 = styled(Button)`
  border: 2px solid white;
  background: transparent;
  color: white;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  min-height: 2.65em;
`;

export default Button;
