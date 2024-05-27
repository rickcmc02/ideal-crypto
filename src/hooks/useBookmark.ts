import { useMemo } from "react";

export function useBookmark() {
  const lsBookmarkIds = localStorage.getItem("bookmarkIds");

  return {
    get() {
      const idData: { [key in string]: boolean } = {};
      if (lsBookmarkIds) {
        lsBookmarkIds.split(",").forEach((id: string) => (idData[id] = true));
      }
      return idData;
    },
    set(codeId: string, bmIdData: { [key: string]: boolean }) {
      const tmpData = { ...bmIdData };
      if (tmpData[codeId]) delete tmpData[codeId];
      else tmpData[codeId] = true;
      const strBookmarkIds = Object.keys(tmpData).join(",");
      localStorage.setItem("bookmarkIds", strBookmarkIds);
      return tmpData;
    },
  };
}
