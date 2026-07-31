export async function trackEvent(event: string, properties?: any) {
  console.log(`[Analytics] Track event: ${event}`, properties);
}

export function invalidateAnalyticsCache() {
  // stub
}
