const VN_TIMEZONE = 'Asia/Ho_Chi_Minh';
const MS_PER_DAY = 24 * 60 * 60 * 1000;
const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

function getTodayVN(referenceDate = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: VN_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(referenceDate);

  const year = parts.find((part) => part.type === 'year').value;
  const month = parts.find((part) => part.type === 'month').value;
  const day = parts.find((part) => part.type === 'day').value;
  return `${year}-${month}-${day}`;
}

function parseIsoDateToUtcMs(isoDate) {
  if (typeof isoDate !== 'string' || !ISO_DATE_REGEX.test(isoDate)) {
    return null;
  }

  const [yearStr, monthStr, dayStr] = isoDate.split('-');
  const year = Number(yearStr);
  const month = Number(monthStr);
  const day = Number(dayStr);

  const utcMs = Date.UTC(year, month - 1, day);
  const check = new Date(utcMs);
  if (
    check.getUTCFullYear() !== year ||
    check.getUTCMonth() !== month - 1 ||
    check.getUTCDate() !== day
  ) {
    return null;
  }

  return utcMs;
}

function isValidIsoDate(value) {
  return parseIsoDateToUtcMs(value) !== null;
}

function diffDays(laterIsoDate, earlierIsoDate) {
  const laterMs = parseIsoDateToUtcMs(laterIsoDate);
  const earlierMs = parseIsoDateToUtcMs(earlierIsoDate);
  if (laterMs === null || earlierMs === null) {
    throw new Error('Ngày truyền vào diffDays không đúng định dạng YYYY-MM-DD.');
  }
  return Math.round((laterMs - earlierMs) / MS_PER_DAY);
}

module.exports = {
  VN_TIMEZONE,
  getTodayVN,
  isValidIsoDate,
  parseIsoDateToUtcMs,
  diffDays,
};
