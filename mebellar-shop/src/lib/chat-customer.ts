export function splitFullName(full: string): { firstName: string; lastName: string } {
  const parts = full.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return { firstName: "", lastName: "" };
  return {
    firstName: parts[0] ?? "",
    lastName: parts.slice(1).join(" "),
  };
}

export function formatCustomerDisplayName(
  firstName?: string,
  lastName?: string,
  fallback = "Mijoz"
): string {
  const name = [firstName, lastName].filter((s) => s?.trim()).join(" ").trim();
  return name || fallback;
}

export type CustomerMetaInput = {
  customerUserId?: string;
  customerName?: string;
  customerFirstName?: string;
  customerLastName?: string;
  customerPhone?: string;
  customerAvatar?: string;
  customerTelegramUsername?: string;
};

export function normalizeCustomerMeta(meta?: CustomerMetaInput) {
  let firstName = meta?.customerFirstName?.trim() ?? "";
  let lastName = meta?.customerLastName?.trim() ?? "";

  if (!firstName && meta?.customerName?.trim()) {
    const split = splitFullName(meta.customerName);
    firstName = split.firstName;
    lastName = split.lastName;
  }

  return {
    customerUserId: meta?.customerUserId?.trim() ?? "",
    customerFirstName: firstName,
    customerLastName: lastName,
    customerName: formatCustomerDisplayName(firstName, lastName),
    customerPhone: meta?.customerPhone?.trim() ?? "",
    customerAvatar: meta?.customerAvatar?.trim() ?? "",
    customerTelegramUsername: meta?.customerTelegramUsername?.trim() ?? "",
  };
}
