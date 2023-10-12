export const currentDate = () => {
  const date = new Date();

  const year = date.getUTCFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getUTCDate().toString().padStart(2, '0');
  const formattedDate = `${day}.${month}.${year}`;

  return formattedDate;
};
