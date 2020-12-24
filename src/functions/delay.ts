import { SetupContext, EmitsOptions, nextTick } from "vue";

interface BusyState {
  busy: boolean;
}

export function useDelay<T extends EmitsOptions>(state: BusyState, context: SetupContext<T>) {
  return function delay<TCallback extends Function>(callback: TCallback) {
    state.busy = true;
    context.emit("busy", true);
    nextTick(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          callback();
          state.busy = false;
          context.emit("busy", false);
        });
      });
    });
  };
}
