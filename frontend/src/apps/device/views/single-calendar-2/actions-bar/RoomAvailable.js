import React from "react";
import { connect } from "react-redux";
import LoaderButton from "dark/LoaderButton";


import { prettyFormatMinutes } from "services/formatting";
import { currentActionSourceSelector, minutesAvailableTillNextMeetingSelector } from "apps/device/store/selectors";
import { meetingActions } from "apps/device/store/actions";

import Button from './Button'

const RoomAvailable = props => {
  const CreateButton = ({ value, name, label = "" }) => (
    <>
      <LoaderButton
        as={Button}
        white={false}
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
      {props.minutesToNextMeeting > 20 && <CreateButton value={15} name="create-15" label="Book for " />}
      {props.minutesToNextMeeting > 40 && <CreateButton value={30} name="create-30" />}
      {props.minutesToNextMeeting > 70 && <CreateButton value={60} name="create-60" />}
      {props.minutesToNextMeeting > 130 && <CreateButton value={120} name="create-120" />}
      {
        props.minutesToNextMeeting <= 130 && 
        <CreateButton value={props.minutesToNextMeeting} name="create-custom" label={props.minutesToNextMeeting <= 20 && "Book for "}/>
        }
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
