export const isCurrentlyFlowering = (
  startDate: string,
  endDate: string
): boolean => {
  const today = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  return today >= start && today <= end;
};

export const formatFloweringWindow = (
  startDate: string,
  endDate: string
): string => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
  };
  const startFormatted = start.toLocaleDateString("en-US", options);
  const endFormatted = end.toLocaleDateString("en-US", options);

  return `${startFormatted} - ${endFormatted}`;
};
