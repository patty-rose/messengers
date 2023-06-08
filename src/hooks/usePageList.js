import { useState, useEffect } from "react";

export function usePageList() {
  const [pageList, setPageList] = useState([]);

  useEffect(() => {
    const storedPages = localStorage.getItem("pageList");
    if (storedPages) {
      setPageList(JSON.parse(storedPages));
    }
  }, []);

  return [pageList, setPageList];
}
