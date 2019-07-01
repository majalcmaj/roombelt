import styled from "styled-components/macro";
import colors from "dark/colors";

export default styled.div`
  width: 10px;
  height: 100%;
  

  ${props => props.available && `background: ${colors.success}`};
  ${props => props.occupied && `background: ${colors.error}`};
  ${props => props.warning && `background: ${colors.warning}`};
  ${props => props.info && `background: ${colors.info}`};
`;
