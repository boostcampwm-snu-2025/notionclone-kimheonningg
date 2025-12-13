export const dateStr = (date: string) => {
  return date
    ? new Date(date).toLocaleString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";
};

export const formatDate = (isoString: string) => {
  const date = new Date(isoString);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}월 ${day}일`;
};
