// Only provider-issued public links belong here. Never add API secrets.
export interface AffiliateConfig {
  enabled: boolean;
  channelRegistered: boolean;
  hostingApproved: boolean;
  url: string;
}
export const coupang: AffiliateConfig = {
  enabled: true,
  channelRegistered: true,
  // Internal suitability review: incidental plain link on a free game site; not host endorsement.
  hostingApproved: true,
  url: "https://link.coupang.com/a/hLh0ZMTttc",
};
export function affiliateReady(config = coupang): boolean {
  if (!config.enabled || !config.channelRegistered || !config.hostingApproved)
    return false;
  try {
    const url = new URL(config.url);
    return (
      url.protocol === "https:" &&
      url.hostname === "link.coupang.com" &&
      url.pathname.startsWith("/a/") &&
      url.pathname.length > 3 &&
      !url.username &&
      !url.password
    );
  } catch {
    return false;
  }
}
