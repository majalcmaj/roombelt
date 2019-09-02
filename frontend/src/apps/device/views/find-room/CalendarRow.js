import React from "react";
import i18next from "i18next";
import styled from "styled-components/macro";
import { connect } from "react-redux";
import {
  calendarNameSelector,
  currentActionSourceSelector,
  currentMeetingSelector,
  isActionErrorSelector,
  isActionSuccessSelector,
  isAmPmClockSelector,
  isReadOnlyDeviceSelector,
  isRetryingActionSelector,
  nextMeetingSelector,
  timestampSelector
} from "apps/device/selectors/selectors";
import { getMeetingSummary, prettyFormatMinutes, timeDifferenceInMinutes } from "services/formatting";
import { Time } from "theme";
import { deviceActions, meetingActions } from "apps/device/actions/actions";
import ActionError from "../../components/ActionError";
import Section, { partialMixin } from "dark/Section";
import LoaderButton from "dark/LoaderButton";
import colors from "dark/colors";
import PeopleIcon from "./PeopleIcon";
import Button from "./Button";

const CustomButton = styled(Button)`
  @media (orientation: portrait) {
    display: inline-block;
    width: auto;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const RowWrapper = styled(Section)`
  :first-child {
    ${partialMixin};
  }
`;

const RowCard = styled.div(props => ({
  margin: "0 0.85rem 1rem 0.85rem",
  background: "#424242",
  padding: "0.6rem 1rem",
  color: colors.foreground.white,
  borderLeft: `0.7rem solid ${props.statusColor}`
}));

const Content = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  margin-top: 0.5rem;
  line-height: 1.2rem;
  overflow: hidden;
  & > button:first-child::before {
    content: "Book for ";
  }
`;

const getStatusColor = (roomBooked, endsSoon, meetingStartingSoon) => {
  if (meetingStartingSoon) {
    return colors.info;
  } else if (roomBooked) {
    return colors.error;
  } else if (endsSoon) {
    return colors.warning;
  } else {
    return colors.success;
  }
};

const isMeetingInProgress = (isAllDayMeeting, timeToStart, minutesAvailable) => {
  return isAllDayMeeting || timeToStart >= 15 || minutesAvailable < 5;
};

const meetingEndsSoon = timeToStart => {
  return timeToStart >= 1;
};

const meetingStartingSoon = (currentMeeting, timestamp) => {
  if (!currentMeeting || !timestamp) {
    return 0;
  }
  const diff = timeDifferenceInMinutes(currentMeeting.startTimestamp, timestamp);
  if (diff > 0 && diff < 5) {
    return Math.round(diff);
  }
};

const meetingEndsIn = (currentMeeting, timestamp) => {
  if (!currentMeeting || !timestamp) {
    return 0;
  }
  const diff = timeDifferenceInMinutes(currentMeeting.endTimestamp, timestamp);
  if (diff > 0) {
    return Math.round(diff);
  }
};

const CalendarRow = ({
  calendarId,
  isReadOnlyDevice,
  calendarName,
  currentMeeting,
  nextMeeting,
  timestamp,
  currentActionSource,
  isCurrentActionSuccess,
  isCurrentActionError,
  isRetryingAction,
  createMeeting,
  acknowledgeMeetingCreated,
  isAmPmClock
}) => {
  const startTimestamp = currentMeeting ? currentMeeting.endTimestamp : timestamp;
  const endTimestamp = nextMeeting ? nextMeeting.startTimestamp : Number.POSITIVE_INFINITY;

  const timeToStart = timeDifferenceInMinutes(startTimestamp, timestamp);
  const minutesAvailable = timeDifferenceInMinutes(endTimestamp, startTimestamp);

  const isAvailable = timeToStart <= 0 && minutesAvailable > 5;

  const isCurrentActionFromThisCalendar = currentActionSource && currentActionSource.indexOf(calendarId) === 0;

  const showError = isCurrentActionFromThisCalendar && isCurrentActionError;
  const showSuccessInfo = isCurrentActionFromThisCalendar && isCurrentActionSuccess;
  const showMeetingDetails = !isAvailable && !showSuccessInfo && !showError;
  const showButtons = !isReadOnlyDevice && isAvailable && !showSuccessInfo && !showError;

  const meetingInProgress = isMeetingInProgress(
    currentMeeting && currentMeeting.isAllDayEvent,
    timeToStart,
    minutesAvailable
  );
  const startingSoon = meetingStartingSoon(currentMeeting, timestamp);

  let people = calendarName.match(/[0-9]+P/g);
  if (people && people[0]) {
    people = people[0].slice(0, -1);
  }

  const CreateButton = ({ value, name }) => (
    <LoaderButton
      as={CustomButton}
      color="black"
      disabled={currentActionSource !== null}
      isLoading={currentActionSource === name}
      onClick={() => createMeeting(calendarId, value, name)}
      children={prettyFormatMinutes(Math.ceil(value))}
    />
  );

  return (
    <RowWrapper>
      <RowCard statusColor={getStatusColor(meetingInProgress, timeToStart, startingSoon)}>
        <Header>
          <span style={{ fontSize: "1.2rem" }}>{calendarName}</span>
          <span>
            <PeopleIcon /> {people ? people : "?"}
          </span>
        </Header>
        <Content>
          <div>
            {showMeetingDetails && (
              <>
                {getMeetingSummary(currentMeeting)}
                <br />
                {currentMeeting &&
                  !currentMeeting.isAllDayEvent && (
                    <>
                      <Time timestamp={currentMeeting.startTimestamp} ampm={isAmPmClock} />
                      {" - "}
                      <Time timestamp={currentMeeting.endTimestamp} ampm={isAmPmClock} />
                      {startingSoon ? ` · Starts in ${startingSoon} min` : ""}
                      {!startingSoon && (meetingInProgress || meetingEndsSoon(timeToStart))
                        ? ` · Ends in ${meetingEndsIn(currentMeeting, timestamp)} min`
                        : ""}
                    </>
                  )}
              </>
            )}
            {showSuccessInfo && (
              <>
                <span style={{ marginRight: "1rem" }}>{i18next.t("meeting-created")}</span>
                <Button primary onClick={acknowledgeMeetingCreated}>
                  OK
                </Button>
              </>
            )}
            {showError && <ActionError />}
            {showButtons && (
              <>
                {minutesAvailable > 20 && <CreateButton value={15} name={`${calendarId}-create-15`} />}
                {minutesAvailable > 40 && <CreateButton value={30} name={`${calendarId}-create-30`} />}
                {minutesAvailable > 70 && <CreateButton value={60} name={`${calendarId}-create-60`} />}
                {minutesAvailable > 130 && <CreateButton value={120} name={`${calendarId}-create-120`} />}
                {minutesAvailable <= 130 && (
                  <CreateButton value={minutesAvailable} name={`${calendarId}-create-custom`} />
                )}
              </>
            )}
          </div>
        </Content>
      </RowCard>
    </RowWrapper>
  );
};

const mapStateToProps = (state, { calendarId }) => ({
  timestamp: timestampSelector(state),
  calendarName: calendarNameSelector(state, { calendarId }),
  currentMeeting: currentMeetingSelector(state, { calendarId }),
  nextMeeting: nextMeetingSelector(state, { calendarId }),
  isRetryingAction: isRetryingActionSelector(state),
  isCurrentActionError: isActionErrorSelector(state),
  isCurrentActionSuccess: isActionSuccessSelector(state),
  currentActionSource: currentActionSourceSelector(state),
  isAmPmClock: isAmPmClockSelector(state),
  isReadOnlyDevice: isReadOnlyDeviceSelector(state)
});

const mapDispatchToProps = dispatch => ({
  createMeeting: (calendarId, minutes, source) => {
    dispatch(deviceActions.$allCalendarsViewActivity());
    dispatch(meetingActions.createMeetingInAnotherRoom(calendarId, minutes));
    dispatch(meetingActions.$setActionSource(source));
  },
  acknowledgeMeetingCreated: () => {
    dispatch(deviceActions.$allCalendarsViewActivity());
    dispatch(meetingActions.endAction());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(CalendarRow);
