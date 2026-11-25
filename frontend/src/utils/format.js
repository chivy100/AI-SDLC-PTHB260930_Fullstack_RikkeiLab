export const VN_TIMEZONE = 'Asia/Ho_Chi_Minh';

export const CATEGORY_LABELS = {
  laptop: 'Laptop',
  man_hinh: 'Màn hình',
  mach_dien_tu: 'Bo mạch điện tử',
  phu_kien: 'Phụ kiện',
};

export const CATEGORY_OPTIONS = Object.entries(CATEGORY_LABELS).map(
  ([value, label]) => ({ value, label })
);

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
