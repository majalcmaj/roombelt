import React from "react";
import Button from "./Button";
import Loader from "./Loader";

const size = "calc(1em - 2px)";

export default ({ as: InjectedButton = Button, isLoading, disabled, children, white = true, ...props }) => (
  <InjectedButton {...props} disabled={disabled || isLoading}>
    {isLoading ? <Loader white={white} style={{ height: size, width: size, verticalAlign: '-0.1em' }}/> : children}
  </InjectedButton>
);
