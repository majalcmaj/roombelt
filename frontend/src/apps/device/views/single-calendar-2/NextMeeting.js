import React from "react";
import { connect } from "react-redux";
import styled from "styled-components/macro";

import { Time } from "theme/index";
import { nextMeetingSelector } from "../../selectors/selectors";
import { isAmPmClockSelector } from "apps/device/selectors/selectors";
import colors from "dark/colors";
import { getMeetingSummary } from "services/formatting";

const Wrapper = styled.div`
  padding: 0.6em 1.2em;

  align-items: baseline;
  color: ${colors.foreground.white};
`;

const NextLabel = styled.div`
  font-size: 0.7em;
`;

const NextMeetingSummary = styled.span`
  font-size: 1.2em;
  margin-right: 1em;
  margin-left: 1em;
  flex-shrink: 1;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const NextMeetingTime = styled.span`
  margin-right: 0.5em;
  white-space: nowrap;
`;

const NextMeeting = ({ nextMeeting, isAmPmClock }) => (
  <Wrapper>
    <NextLabel>Upcoming: </NextLabel>{" "}
    <NextMeetingTime>
      {!nextMeeting.isAllDayEvent && (
        <>
          <Time timestamp={nextMeeting.startTimestamp} ampm={isAmPmClock} />
          {" - "}
          <Time timestamp={nextMeeting.endTimestamp} ampm={isAmPmClock} />
        </>
      )}
    </NextMeetingTime>
    <NextMeetingSummary>{getMeetingSummary(nextMeeting)}</NextMeetingSummary>{" "}
  </Wrapper>
);

const mapStateToProps = state => ({
  nextMeeting: nextMeetingSelector(state),
  isAmPmClock: isAmPmClockSelector(state)
});

export default connect(mapStateToProps)(NextMeeting);
