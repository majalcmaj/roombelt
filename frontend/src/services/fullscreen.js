import screenfull from "screenfull";

export const toggleFullScreen = () => {
  if (screenfull.enabled) {
    screenfull.toggle();
  }
};
