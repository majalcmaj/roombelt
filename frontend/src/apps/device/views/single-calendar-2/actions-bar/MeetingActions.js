import React from "react";
import i18next from "i18next";
import { connect } from "react-redux";
import LoaderButton from "dark/LoaderButton";

import colors from "dark/colors";
import { prettyFormatMinutes } from "services/formatting";
import {
  currentActionSourceSelector,
  currentMeetingSelector,
  isAfterCurrentMeetingStartTimeSelector,
  minutesAvailableTillNextMeetingSelector,
  minutesLeftForCheckInSelector,
  requireCheckInSelector
} from "apps/device/selectors/selectors";
import { meetingActions } from "apps/device/actions/actions";

import Button, { Button2 } from "./Button";

import warningIcon from "../../../../../theme/images/warning-icon.svg";

class MeetingStarted extends React.PureComponent {
  state = { idOfMeetingToCancel: null };

  render() {
    const { currentMeeting, requireCheckIn, isAfterCurrentMeetingStartTime } = this.props;
    const { idOfMeetingToCancel } = this.state;

    if (idOfMeetingToCancel === currentMeeting.id) {
      return this.renderEndMeetingConfirmation();
    }

    if (currentMeeting.isCheckedIn) {
      return this.renderExtendMeeting();
    }

    if (!isAfterCurrentMeetingStartTime) {
      return this.renderStartMeetingEarly();
    }

    if (requireCheckIn && !currentMeeting.isCheckedIn) {
      return this.renderCheckInToMeeting();
    }

    return this.renderExtendMeeting();
  }

  renderStartMeetingEarly() {
    const { currentMeeting, currentActionSource, startMeetingEarly } = this.props;

    return (
      <>
        <LoaderButton
          success
          as={Button}
          key={"start-early"}
          onClick={() => startMeetingEarly("start-early")}
          isLoading={currentActionSource === "start-early"}
          children={i18next.t("actions.start-early")}
        />

        <Button2 key={"cancel"} error onClick={() => this.setState({ idOfMeetingToCancel: currentMeeting.id })}>
          {i18next.t("actions.cancel-meeting")}
        </Button2>
      </>
    );
  }

  renderCheckInToMeeting() {
    const { currentMeeting, currentActionSource, checkInToMeeting, minutesLeftForCheckIn } = this.props;

    return (
      <>
        <LoaderButton
          as={Button}
          success
          key={"check-in"}
          onClick={() => checkInToMeeting("check-in")}
          isLoading={currentActionSource === "check-in"}
          children={i18next.t("actions.check-in")}
        />

        <Button2 key={"cancel"} error onClick={() => this.setState({ idOfMeetingToCancel: currentMeeting.id })}>
          {i18next.t("actions.cancel-meeting")}
        </Button2>

        {minutesLeftForCheckIn > 0 && (
          <div style={{ color: colors.foreground.white, marginTop: ".5rem", fontSize: "0.8rem" }}>
            <img src={warningIcon} style={{height: ".8rem", "padding-right": ".5rem", position: "relative", top: ".1rem"}} alt="warning"/>
            {i18next.t("actions.check-in-warning", { count: Math.ceil(minutesLeftForCheckIn) })}
          </div>
        )}
      </>
    );
  }

  renderExtendMeeting() {
    const {
      minutesToNextMeeting,
      currentActionSource,
      extendMeeting,
      isAfterCurrentMeetingStartTime,
      cancelMeeting,
      endMeeting
    } = this.props;

    const ExtendButton = ({ value, name, label = "" }) => (
      <>
        <LoaderButton
          key={name}
          as={Button2}
          white
          disabled={currentActionSource !== null}
          isLoading={currentActionSource === name}
          onClick={() => extendMeeting(value, name)}
        >
          {label}
          {prettyFormatMinutes(value)}
        </LoaderButton>{" "}
      </>
    );

    const showCustomExtensionTime = minutesToNextMeeting > 0 && minutesToNextMeeting <= 70;

    const onEnd = () => (isAfterCurrentMeetingStartTime ? endMeeting("end-meeting") : cancelMeeting("end-meeting"));

    return (
      <>
        <LoaderButton
          error
          as={Button}
          key="end-now"
          color="black"
          disabled={currentActionSource !== null}
          isLoading={currentActionSource === "end-meeting"}
          onClick={onEnd}
        >
          End meeting
        </LoaderButton>{" "}
        {minutesToNextMeeting > 0 && (
          <>
            {minutesToNextMeeting > 20 && <ExtendButton value={15} name="extend-15" label="+ " />}
            {showCustomExtensionTime && <ExtendButton value={minutesToNextMeeting} name="extend-custom" />}
          </>
        )}
      </>
    );
  }

  renderEndMeetingConfirmation() {
    const { currentActionSource, isAfterCurrentMeetingStartTime, cancelMeeting, endMeeting } = this.props;

    const isInProgress = currentActionSource === "end-meeting";
    const onConfirm = () => (isAfterCurrentMeetingStartTime ? endMeeting("end-meeting") : cancelMeeting("end-meeting"));

    return (
      <>
        <Button key={"back"} disabled={isInProgress} onClick={() => this.setState({ idOfMeetingToCancel: null })}>
          {i18next.t("actions.back")}
        </Button>
        <LoaderButton as={Button2} key={"confirm"} isLoading={isInProgress} onClick={onConfirm} error>
          {i18next.t("actions.confirm")}
        </LoaderButton>
      </>
    );
  }
}

const mapStateToProps = state => ({
  requireCheckIn: requireCheckInSelector(state),
  minutesLeftForCheckIn: minutesLeftForCheckInSelector(state),
  currentMeeting: currentMeetingSelector(state),
  currentActionSource: currentActionSourceSelector(state),
  minutesToNextMeeting: minutesAvailableTillNextMeetingSelector(state),
  isAfterCurrentMeetingStartTime: isAfterCurrentMeetingStartTimeSelector(state)
});

const mapDispatchToProps = dispatch => ({
  startMeetingEarly: source => {
    dispatch(meetingActions.startMeetingEarly());
    dispatch(meetingActions.$setActionSource(source));
  },
  cancelMeeting: source => {
    dispatch(meetingActions.cancelMeeting());
    dispatch(meetingActions.$setActionSource(source));
  },
  checkInToMeeting: source => {
    dispatch(meetingActions.checkInToMeeting());
    dispatch(meetingActions.$setActionSource(source));
  },
  extendMeeting: (minutes, source) => {
    dispatch(meetingActions.extendMeeting(minutes));
    dispatch(meetingActions.$setActionSource(source));
  },
  endMeeting: source => {
    dispatch(meetingActions.endMeeting());
    dispatch(meetingActions.$setActionSource(source));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(MeetingStarted);
