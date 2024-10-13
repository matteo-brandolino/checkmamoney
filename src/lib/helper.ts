export function extractJSON(str: string) {
  let start = str.search(/[{[]/);
  if (start === -1) {
    return null;
  }

  let end =
    str.lastIndexOf("}") > str.lastIndexOf("]")
      ? str.lastIndexOf("}")
      : str.lastIndexOf("]");
  if (end === -1) {
    return null;
  }

  let jsonString = str.substring(start, end + 1);

  try {
    let jsonObject = JSON.parse(jsonString);
    return jsonObject;
  } catch (e) {
    console.error("Errore di parsing JSON:", e);
    return null;
  }
}

export function convertExcelDate(excelDate: number) {
  const startDate = new Date(1900, 0, 1);
  startDate.setDate(startDate.getDate() + excelDate - 2);

  return startDate;
}

export function convertToDateString(isoDate: string) {
  const date = new Date(isoDate);

  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function getMonthName(date: string) {
  const months = [
    "Gennaio",
    "Febbraio",
    "Marzo",
    "Aprile",
    "Maggio",
    "Giugno",
    "Luglio",
    "Agosto",
    "Settembre",
    "Ottobre",
    "Novembre",
    "Dicembre",
  ];
  const month = Number(date.split("-")[0]);
  const monthIndex = month - 1;
  if (monthIndex >= 0 && monthIndex < months.length) {
    return months[monthIndex];
  } else {
    return "Invalid month number";
  }
}

export function getWhereClause(dates: string[]): [string, string[]] {
  let whereClause = "";
  const datesValues: string[] = [];
  dates.forEach((d, i) => {
    if (i === 0) {
      whereClause += "WHERE TO_CHAR(DATE_TRUNC('month', date), 'MM-YYYY') = $1";
    } else {
      whereClause += ` OR TO_CHAR(DATE_TRUNC('month', date), 'MM-YYYY') = $${
        i + 1
      }`;
    }
    datesValues.push(d);
  });
  return [whereClause, datesValues];
}

export const month = "TO_CHAR(DATE_TRUNC('month', date), 'MM-YYYY') as month";
