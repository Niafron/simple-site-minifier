'use strict';

const getDateAsString = (date = new Date(), separator = '-') => {
  let dateAsString = `${date.getFullYear()}${separator}`;
  dateAsString += `${date.getMonth() + 1}${separator}`;
  dateAsString += `${date.getDate().toString().padStart(2, '0')}${separator}`;
  dateAsString += `${date.getHours().toString().padStart(2, '0')}${separator}`;
  dateAsString += `${date.getMinutes().toString().padStart(2, '0')}${separator}`;
  dateAsString += `${date.getSeconds().toString().padStart(2, '0')}`;

  return dateAsString;
};

const getDynamicFileName = (fileName) => {
  return (fileName.includes('[ssm::currentDate]'))
      ? fileName.replace('[ssm::currentDate]', getDateAsString())
      : fileName;
};

module.exports = {
  getDateAsString: getDateAsString,
  getDynamicFileName: getDynamicFileName
};
