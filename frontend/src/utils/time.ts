export const wait = (timeout: number) => new Promise(resolve => setTimeout(resolve, timeout));

export const waitUntilTrue = (callback: Function, interval = 5000) => new Promise(resolve => {
  const intervalId = setInterval(() => {
    if (callback()) {
      clearInterval(intervalId);
      resolve();
    }
  }, interval);
});