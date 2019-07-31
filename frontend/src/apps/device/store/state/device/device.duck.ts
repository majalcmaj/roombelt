import { makeReduxDuck } from "teedux";
import Moment from "moment";

interface ITime {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
  isTimeZoneFixedToUTC: boolean;
}
interface IEvent {
  start: ITime;
  end: ITime;
}
interface ICalendar {
  events: IEvent[];
}
interface IDevice {
  calendar: ICalendar;
  allCalendars: ICalendar[];
}
interface ICalendarEvent {
  startTimestamp: number;
  endTimestamp: number;
}
interface IDeviceCalendar {
  events: ICalendarEvent[];
}
interface IDeviceData {
  calendar: IDeviceCalendar;
  allCalendars: IDeviceCalendar[];
}

interface IState {
  data?: IDeviceData;
}
const initialState = {
  data: undefined
};

const duck = makeReduxDuck<IState>("device", initialState);

const updateDeviceData = duck.defineAction<{ device: IDevice }>("UPDATE_DATA", (_, { device }) => {
  const getTimestamp = (time: ITime) =>
    time.isTimeZoneFixedToUTC ? Moment.utc(time).valueOf() : Moment(time).valueOf();

  const setEventsTimestamps = (calendar: ICalendar) => ({
    ...calendar,
    events: calendar.events.map(event => ({
      ...event,
      startTimestamp: getTimestamp(event.start),
      endTimestamp: getTimestamp(event.end)
    }))
  });

  return {
    data: {
      ...device,
      calendar: device.calendar && setEventsTimestamps(device.calendar),
      allCalendars: device.allCalendars && device.allCalendars.map(setEventsTimestamps)
    }
  };
});

export const $updateDeviceData = (device: IDevice) => updateDeviceData({ device })

export default duck.getReducer();
