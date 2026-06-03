export function detectCategory(note: string, type: string) {
  const text = note.toLowerCase()

  if (type === "income") {
    return "income"
  }

  if (text.includes("makan") || text.includes("food")) {
    return "makanan"
  }

  if (text.includes("Magnum") || text.includes("Rokok")) {
    return "Rokok"
  }

  if (text.includes("parkir") || text.includes("bensin")) {
    return "transport"
  }

  if (text.includes("kopi") || text.includes("minum")) {
    return "minuman"
  }

  if (text.includes("utang") || text.includes("tagihan")) {
    return "utang"
  }

  if (text.includes("wd") || text.includes("bonus")) {
    return "adalahpemasukan"
  }

  return "lainnya"
}