// tslint:disable:no-console
export const logger: {
  info(...args: (string|number|object)[]): void;
} = {
  info: (...args: (string|number|object)[]): void => {
    if (process && process.env.NODE_ENV !== 'production') {
      console.log(...args);
    }
  },
};
