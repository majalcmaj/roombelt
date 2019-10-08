import React from "react";
import { connect } from "react-redux";
import styled from "styled-components/macro";

import {
  calendarNameSelector,
  fontSizeSelector,
  isAmPmClockSelector,
  nextMeetingSelector,
  getRoomStatus,
  timestampSelector
} from "../../selectors/selectors";

import NextMeeting from "./NextMeeting";
import { deviceActions } from "apps/device/actions/actions";
import colors from "dark/colors";
import Time from "theme/components/Time";
import CurrentMeeting from "./CurrentMeeting";
import ActionsBar from "./actions-bar";
import Layout from "dark/Layout";
import i18next from "i18next";
import { usePageLoaded } from "./hooks";

const Header = styled.div`
  font-size: 1rem;
  padding: 1rem;
  color: ${colors.foreground.white};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const CalendarDetails = styled.div``;

const Button = styled.button`
  background: white;
  font-size: 0.8rem;
  padding: 0.3rem 1rem;
  margin: 0;
  font-weight: 500;
  border-radius: 0.3rem;
  border: none;
`;

const ActionsWrapper = styled.div`
  padding: 0.6rem 1rem;
`;

const Spacer = styled.div`
  flex-grow: 1;
`;

const statusBg = {
  available: "linear-gradient(135deg, rgba(0,136,51,1) 0%, rgba(0,204,51,1) 100%);",
  occupied: "linear-gradient(135deg, rgba(192,0,0,1) 0%, rgba(224,0,0,1) 100%)",
  warning: "linear-gradient(135deg, rgba(0,85,153,1) 0%, rgba(0,119,187,1) 100%);",
  checkin: "linear-gradient(135deg, #fe6800 0%, #fb3b00 100%);"
};

const CalendarView = ({
  calendarName,
  nextMeeting,
  showAllCalendarsView,
  currentTimestamp,
  isAmPmClock,
  fontSize,
  roomStatus
}) => {
  usePageLoaded();
  const background = roomStatus && statusBg[roomStatus.status];
  return (
    <Layout flexbox fontSize={fontSize} fontFamily={"Lato, sans-serif"} background={background}>
      <Header>
        <CalendarDetails>
          <Time timestamp={currentTimestamp} ampm={isAmPmClock} blinking smallSuffix /> {calendarName}
        </CalendarDetails>

        <Button onClick={showAllCalendarsView}>{i18next.t("actions.find-room")}</Button>
      </Header>

      <CurrentMeeting />

      <ActionsWrapper>
        <ActionsBar />
      </ActionsWrapper>

      <Spacer />

      {nextMeeting && <NextMeeting />}
      <div
        style={{ color: "white", fontSize: "50%", position: "absolute", bottom: "0.6rem", right: "1rem", opacity: 0.5 }}
      >
        v{process.env.REACT_APP_VERSION}
      </div>
    </Layout>
  );
};

const mapStateToProps = state => ({
  calendarName: calendarNameSelector(state),
  nextMeeting: nextMeetingSelector(state),
  currentTimestamp: timestampSelector(state),
  isAmPmClock: isAmPmClockSelector(state),
  fontSize: fontSizeSelector(state),
  roomStatus: getRoomStatus(state)
});

const mapDispatchToProps = dispatch => ({
  showAllCalendarsView: () => dispatch(deviceActions.showAllCalendarsView())
});

export default connect(mapStateToProps, mapDispatchToProps)(CalendarView);
