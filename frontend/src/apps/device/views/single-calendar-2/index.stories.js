import React from "react";
import { storiesOf } from "@storybook/react";

import SingleCalendar from ".";
import { makeStore } from "apps/device/store";
import { Provider } from "react-redux";

storiesOf("device/single-calendar", module).add("basic", () => {
  const store = makeStore({
    device: {
      calendar: {
        events: []
      }
    }
  });

  return (
    <Provider store={store}>
      <SingleCalendar />
    </Provider>
  );
});
