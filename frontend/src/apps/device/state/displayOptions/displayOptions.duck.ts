import { makeReduxDuck } from "teedux";
import { getFontSize, setFontSize } from "services/persistent-store";

interface IState {
  isFullScreen: null | boolean;
  isSupported: null | boolean;
  fontSize: number;
}

const initialState: IState = {
  isFullScreen: null,
  isSupported: null,
  fontSize: getFontSize()
};

const duck = makeReduxDuck<IState>("displayOptions", initialState);

const updateFullScreenState = duck.defineAction<{ isFullScreen: boolean; isSupported: boolean }>(
  "UPDATE_FULL_SCREEN_STATE",
  (_, { isFullScreen, isSupported }) => ({
    isFullScreen,
    isSupported
  })
);
export const $updateFullScreenState = (isSupported: boolean, isFullScreen: boolean) =>
  updateFullScreenState({ isFullScreen, isSupported });

const changeFontSize = duck.defineAction<{ fontSizeDelta: number }>(
  "CHANGE_FONT_SIZE",
  ({ fontSize }, { fontSizeDelta }) => {
    const newFontSize = Math.max(fontSize + fontSizeDelta, 0.1);
    // FIXME this side effect should be moved out of the action handler
    setFontSize(newFontSize);
    return {
      fontSize: newFontSize
    };
  }
);
export const $changeFontSize = (fontSizeDelta: number) => changeFontSize({ fontSizeDelta })

export default duck.getReducer();
