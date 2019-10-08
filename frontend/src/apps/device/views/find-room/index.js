import React from "react";
import styled from "styled-components/macro";
import { connect } from "react-redux";
import i18next from "i18next";
import { deviceActions } from "apps/device/actions/actions";
import {
  allCalendarsSelector,
  areAllCalendarsLoadedSelector,
  fontSizeSelector,
  isAmPmClockSelector,
  timestampSelector
} from "apps/device/selectors/selectors";

import CalendarRow from "./CalendarRow";
import { Loader } from "theme";

import colors from "dark/colors";
import Button from "dark/Button";
import Layout from "dark/Layout";
import Section from "dark/Section";

const Header = styled(Section).attrs({ header: true })`
  padding: 0.85rem;
  font-size: 1.5rem;
  color: ${colors.foreground.white};
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  width: 100%;
  z-index: 2;
`;

const BackButton = styled(Button)`
  font-size: 0.9rem;
  width: 6rem;
  z-index: 1;
`;

const PageTitle = styled.span`
  vertical-align: middle;
  margin-left: 1rem;
  position: absolute;
  left: 0;
  right: 0;
  text-align: center;
`;

const Content = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  padding-top: 3.54rem;
`;

const LoaderWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%);
`;

const AllCalendarsView = ({
  closeAllCalendarsView,
  calendars,
  areAllCalendarsLoaded,
  markUserActivity,
  timestamp,
  isAmPmClock,
  fontSize
}) => {
  return (
    <Layout style={{ minHeight: "100%", height: "auto" }} flexbox fontSize={fontSize}>
      <Header>
        <BackButton onClick={closeAllCalendarsView}>{i18next.t("actions.back")}</BackButton>
        <PageTitle>{i18next.t("actions.find-room")}</PageTitle>
      </Header>

      <Content onScroll={markUserActivity}>
        {!areAllCalendarsLoaded && (
          <LoaderWrapper>
            <Loader white />
          </LoaderWrapper>
        )}
        {calendars
          .slice()
          .sort(sortCalendars)
          .map(calendar => <CalendarRow key={calendar.id} calendarId={calendar.id} />)}
      </Content>
    </Layout>
  );
};

const sortCalendars = (calendar1, calendar2) => {
  const now = Date.now();

  const event1 = calendar1.events[0];
  const event2 = calendar2.events[0];

  if (!event1) {
    return -1;
  } else if (!event2) {
    return 1;
  }

  if (event1.startTimestamp < now) {
    if (event2.startTimestamp < now) {
      return event1.endTimestamp - event2.endTimestamp;
    } else {
      return 1;
    }
  } else return event2.startTimestamp - event1.startTimestamp;
};

const mapStateToProps = state => ({
  areAllCalendarsLoaded: areAllCalendarsLoadedSelector(state),
  calendars: allCalendarsSelector(state),
  timestamp: timestampSelector(state),
  isAmPmClock: isAmPmClockSelector(state),
  fontSize: fontSizeSelector(state)
});

const mapDispatchToProps = dispatch => ({
  closeAllCalendarsView: () => dispatch(deviceActions.closeAllCalendarsView()),
  markUserActivity: () => dispatch(deviceActions.$allCalendarsViewActivity())
});

export default connect(mapStateToProps, mapDispatchToProps)(AllCalendarsView);
