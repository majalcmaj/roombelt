import React from "react";
import i18next from "i18next";
import { connect } from "react-redux";
import { Time } from "theme/index";
import styled from "styled-components/macro";
import colors from "dark/colors";
import MeetingsProgressBar from "./MeetingProgressBar"
import {
  currentMeetingSelector,
  isAmPmClockSelector,
  minutesAvailableTillNextMeetingSelector,
  nextMeetingSelector
} from "apps/device/selectors/selectors";
import { getMeetingSummary, prettyFormatMinutes } from "services/formatting";

const Wrapper = styled.div`
  color: ${colors.foreground.gray};
  padding: 0.4rem 1rem;
`;

const Title = styled.h1`
  color: white;
`;

const Meta = styled.p`
  color: white;
  display: flex;

  @media (orientation: portrait) {
    flex-direction: column;
  }
`;

const CurrentMeeting = ({ currentMeeting, nextMeeting, minutesToNextMeeting, isAmPmClock }) => {
  const getTitle = () => {
    if (!currentMeeting && !nextMeeting) {
      return i18next.t("availability.available-all-day");
    }

    if (!currentMeeting && nextMeeting) {
      return i18next.t("availability.available-for", { time: prettyFormatMinutes(minutesToNextMeeting) });
    }

    return <>{getMeetingSummary(currentMeeting)} </>;
  };

  const getTime = () => {
    if (!currentMeeting) {
      return <span style={{ opacity: 0}}>...</span>;
    }

    return (
      <>
        {!currentMeeting.isAllDayEvent && (
          <span style={{ whitespace: "nowrap", display: "inline-block", textIndent: 0, paddingRight: 20}}>
            {<Time timestamp={currentMeeting.startTimestamp} ampm={isAmPmClock} />}
            {" – "}
            {<Time timestamp={currentMeeting.endTimestamp} ampm={isAmPmClock} />}
          </span>
        )}
      </>
    );
  };

  const showHost = currentMeeting && !currentMeeting.isCreatedFromDevice;
  const showGuests = currentMeeting && !currentMeeting.isPrivate && !currentMeeting.isCreatedFromDevice;

  const guests =
    currentMeeting && currentMeeting.attendees.filter(u => u.displayName !== currentMeeting.organizer.displayName);

  return (
    <Wrapper>
      <Title>{getTitle()}</Title>
      <Meta>{getTime()}
      {showHost && (
          <span style={{ verticalAlign: "middle" }}>
            {currentMeeting.organizer.displayName}
            {showGuests &&
              guests.length > 0 &&
              " " + i18next.t("meeting.guests", { count: guests.length })}
          </span>
      )}
      </Meta>
        {currentMeeting && <MeetingsProgressBar timeStarted={currentMeeting.startTimestamp} timeEnding={currentMeeting.endTimestamp} currentTime={Date.now()}/>}
    </Wrapper>
  );
};

const mapStateToProps = state => ({
  currentMeeting: currentMeetingSelector(state),
  nextMeeting: nextMeetingSelector(state),
  minutesToNextMeeting: minutesAvailableTillNextMeetingSelector(state),
  isAmPmClock: isAmPmClockSelector(state)
});

export default connect(mapStateToProps)(CurrentMeeting);
