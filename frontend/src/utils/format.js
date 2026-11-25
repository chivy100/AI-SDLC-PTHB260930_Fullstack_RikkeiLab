export const VN_TIMEZONE = 'Asia/Ho_Chi_Minh';
export const DAILY_FINE_RATE = 5000;
export const MAX_BORROW_DAYS = 14;

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export const CATEGORY_LABELS = {
  laptop: 'Laptop',
  man_hinh: 'Màn hình',
  mach_dien_tu: 'Bo mạch điện tử',
  phu_kien: 'Phụ kiện',
};

export const CATEGORY_OPTIONS = Object.entries(CATEGORY_LABELS).map(
  ([value, label]) => ({ value, label })
);

export const BORROWING_FILTER_OPTIONS = [
  { value: 'all', label: 'Tất cả' },
  { value: 'borrowed', label: 'Đang mượn' },
  { value: 'overdue', label: 'Quá hạn' },
  { value: 'returned', label: 'Đã trả' },
];

export const BORROWING_STATUS_META = {
  borrowed: { label: 'Đang mượn', badgeClass: 'text-bg-primary' },
  overdue: { label: 'Quá hạn', badgeClass: 'text-bg-danger' },
  returned: { label: 'Đã trả', badgeClass: 'text-bg-success' },
};

export function parseIsoDateToUtcMs(isoDate) {
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

export function isValidIsoDate(value) {
  return parseIsoDateToUtcMs(value) !== null;
}

export function diffDaysIso(laterIsoDate, earlierIsoDate) {
  const laterMs = parseIsoDateToUtcMs(laterIsoDate);
  const earlierMs = parseIsoDateToUtcMs(earlierIsoDate);
  if (laterMs === null || earlierMs === null) {
    return null;
  }
  return Math.round((laterMs - earlierMs) / MS_PER_DAY);
}

export function formatCategoryLabel(category) {
  return CATEGORY_LABELS[category] || category || '—';
}

export function formatDateVN(isoDate) {
  if (!isoDate || typeof isoDate !== 'string') {
    return '—';
  }
  const match = isoDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) {
    return isoDate;
  }
  return `${match[3]}/${match[2]}/${match[1]}`;
}

export function formatCurrencyVND(amount) {
  const num = Number(amount || 0);
  return `${num.toLocaleString('vi-VN')} đ`;
}

export function getTodayVN(referenceDate = new Date()) {
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

export function addDaysIso(isoDate, days) {
  const [year, month, day] = isoDate.split('-').map(Number);
  const dt = new Date(Date.UTC(year, month - 1, day + days));
  const y = dt.getUTCFullYear();
  const m = String(dt.getUTCMonth() + 1).padStart(2, '0');
  const d = String(dt.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
