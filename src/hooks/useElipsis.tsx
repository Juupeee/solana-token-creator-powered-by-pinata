import { useCallback } from "react";
import _ from "lodash";

const useElipsis = () => {
  const makeElipsis = useCallback(
    (str: string, startChars: number, endChars: number, maxLength: number) => {
      if (_.isEmpty(str)) return "";
      if (str.length <= maxLength) return str;

      const start = _.take(str, startChars).join("");
      const end = _.takeRight(str, endChars).join("");
      return `${start}..${end}`;
    },
    [],
  );

  return { makeElipsis };
};

export default useElipsis;
