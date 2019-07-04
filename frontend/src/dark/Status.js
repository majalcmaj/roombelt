import styled from "styled-components/macro";
import colors from "dark/colors";

const Common = styled.div`
  ${props => props.available && `background: ${colors.success}`};
  ${props => props.occupied && `background: ${colors.error}`};
  ${props => props.warning && `background: ${colors.warning}`};
  ${props => props.info && `background: ${colors.info}`};
`

const OldStatus = styled(Common)`
  color: #FAFAFA;
  padding: 0.2em;
  min-width: 8em;
  box-sizing: border-box;
  border-radius: 0.1em;
  font-size: 0.8rem;
  text-align: center;
`

export const NewStatus = styled(Common)`
  width: 10px;
  height: 100%;
`;

export default OldStatus
