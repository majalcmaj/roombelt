import React from "react";
import styled from "styled-components/macro";
import { prettyFormatMinutes, timeDifferenceInMinutes } from "services/formatting";

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
`;

const Bar = styled.div`
  width: 80%;
  height: 0.5rem;
  background: #333;
`;

const Progress = styled.div(props => ({
    width: `${props.percentDone}%`,
    height: '0.5rem',
    background: '#fff'
}));

const TimeLeft = styled.div`
  color: white;
  font-size: 0.7rem;
  padding-left: 1rem;
`;

export default ({timeStarted, timeEnding, currentTime}) => {
    const percentDone = 100 * (currentTime - timeStarted) / (timeEnding - timeStarted);
    const timeLeft = prettyFormatMinutes(Math.round(timeDifferenceInMinutes(timeEnding, currentTime)));
    return (
        <Wrapper>
            <Bar>
                <Progress percentDone={percentDone}/>
            </Bar>
            <TimeLeft>{timeLeft} left</TimeLeft>
        </Wrapper>
    )
};
