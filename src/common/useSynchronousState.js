import { useState } from "react";

const useSynchronousState = (initialState) => {
  const [state, updateState] = useState(initialState);

  let latestState = state;

  const getter = () => {
    return latestState;
  };

  const setter = (newState) => {
    if (Array.isArray(newState)) {
      let tmp = [];
      newState.forEach((item) => {
        tmp.push(item);
      });
      latestState = tmp;
    } else {
      latestState = newState;
    }
    updateState(newState);
    return latestState;
  };

  return [getter, setter];
};

export default useSynchronousState;