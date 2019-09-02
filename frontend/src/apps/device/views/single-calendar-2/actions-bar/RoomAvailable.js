import React from "react";
import { connect } from "react-redux";
import LoaderButton from "dark/LoaderButton";

import { prettyFormatMinutes } from "services/formatting";
import { currentActionSourceSelector, minutesAvailableTillNextMeetingSelector } from "apps/device/selectors/selectors";
import { meetingActions } from "apps/device/actions/actions";

import Button, { Button2 } from "./Button";

const RoomAvailable = props => {
  const CreateButton = ({ value, name, color, label = "", as = Button }) => (
    <>
      <LoaderButton
        as={as}
        color={color}
        disabled={props.currentActionSource !== null}
        isLoading={props.currentActionSource === name}
        onClick={() => props.createMeeting(value, name)}
      >
        {label}
        {prettyFormatMinutes(value)}
      </LoaderButton>{" "}
    </>
  );

  return (
    <div>
      {props.minutesToNextMeeting > 20 && <CreateButton color="black" value={15} name="create-15" label="Book for " />}
      {props.minutesToNextMeeting > 40 && <CreateButton as={Button2} value={30} name="create-30" />}
      {props.minutesToNextMeeting > 70 && <CreateButton as={Button2} value={60} name="create-60" />}
      {props.minutesToNextMeeting > 130 && <CreateButton as={Button2} value={120} name="create-120" />}
      {props.minutesToNextMeeting <= 130 && (
        <CreateButton
          as={Button2}
          value={props.minutesToNextMeeting}
          name="create-custom"
          label={props.minutesToNextMeeting <= 20 && "Book for "}
        />
      )}
    </div>
  );
};

const mapStateToProps = state => ({
  minutesToNextMeeting: minutesAvailableTillNextMeetingSelector(state),
  currentActionSource: currentActionSourceSelector(state)
});

const mapDispatchToProps = dispatch => ({
  createMeeting: (minutes, source) => {
    dispatch(meetingActions.createMeeting(minutes));
    dispatch(meetingActions.$setActionSource(source));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(RoomAvailable);
