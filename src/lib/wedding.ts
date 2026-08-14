export const WEDDING = {
  groomAr: "مروان",
  brideAr: "آية",
  groomEn: "Marwan",
  brideEn: "Aya",
  monogram: "M & A",
  dateAr: "٤ سبتمبر ٢٠٢٦",
  dateEn: "04 • 09 • 2026",
  dateDotted: "04.09.2026",
  venueAr: "صالة الزهور",
  cityAr: "الخليل – بيت كاحل",
  receptionAr: "٥:٠٠ مساءً",
  celebrationAr: "٦:٠٠ مساءً",
  conceptAr: "حين بدأت حكايتنا… بدأ العمر",
  conceptEn: "WHEN OUR STORY BEGAN, FOREVER FOLLOWED",
  /** 4 Sep 2026, 18:00 Palestine time (UTC+3 during DST) */
  startsAtUtc: Date.UTC(2026, 8, 4, 15, 0, 0),
  endsAtUtc: Date.UTC(2026, 8, 4, 21, 0, 0),
  mapsQuery: "صالة الزهور، بيت كاحل، الخليل، فلسطين",
} as const;

export const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  WEDDING.mapsQuery,
)}`;

const AR_DIGITS = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];

export function toArabicDigits(value: number | string): string {
  return String(value).replace(/\d/g, (d) => AR_DIGITS[Number(d)]!);
}

export function pad2(value: number): string {
  return value < 10 ? `0${value}` : String(value);
}

function icsStamp(ms: number): string {
  return new Date(ms).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

const EVENT_TITLE = "زفاف مروان & آية";
const EVENT_LOCATION = `${WEDDING.venueAr}، ${WEDDING.cityAr}`;
const EVENT_DETAILS = "يسعدنا حضوركم لمشاركتنا أجمل ليلة في العمر ❤️";

export const GOOGLE_CALENDAR_URL =
  "https://calendar.google.com/calendar/render?action=TEMPLATE" +
  `&text=${encodeURIComponent(EVENT_TITLE)}` +
  `&dates=${icsStamp(WEDDING.startsAtUtc)}/${icsStamp(WEDDING.endsAtUtc)}` +
  `&details=${encodeURIComponent(EVENT_DETAILS)}` +
  `&location=${encodeURIComponent(EVENT_LOCATION)}`;

export function buildIcs(): string {
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Marwan and Aya//Wedding//AR",
    "BEGIN:VEVENT",
    `UID:marwan-aya-2026@wedding`,
    `DTSTAMP:${icsStamp(Date.now())}`,
    `DTSTART:${icsStamp(WEDDING.startsAtUtc)}`,
    `DTEND:${icsStamp(WEDDING.endsAtUtc)}`,
    `SUMMARY:${EVENT_TITLE}`,
    `DESCRIPTION:${EVENT_DETAILS}`,
    `LOCATION:${EVENT_LOCATION}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export function downloadIcs() {
  const blob = new Blob([buildIcs()], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "marwan-aya-wedding.ics";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
