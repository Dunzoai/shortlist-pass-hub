import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

// Use anon key for public sitemap data - no auth needed
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];
  const today = new Date().toISOString().split('T')[0];

  try {
    // 1. Fetch all active businesses with their profiles
    const { data: businesses, error: bizError } = await supabase
      .from('businesses')
      .select(`
        id,
        smartpage_subdomain,
        updated_at,
        smartpage_profiles!inner(
          page_type,
          business_category,
          updated_at
        )
      `)
      .eq('smartpage_enabled', true)
      .in('smartpage_status', ['live', 'trial'])
      .eq('is_public', true)
      .not('smartpage_subdomain', 'is', null);

    if (bizError) {
      console.error('[Sitemap] Error fetching businesses:', bizError);
    }

    if (businesses && businesses.length > 0) {
      for (const biz of businesses) {
        const subdomain = biz.smartpage_subdomain;
        if (!subdomain || subdomain.trim() === '') continue;

        const profile = Array.isArray(biz.smartpage_profiles)
          ? biz.smartpage_profiles[0]
          : biz.smartpage_profiles;

        if (!profile) continue;

        // Skip city_hub category from regular listings
        if (profile.business_category === 'city_hub') continue;

        // Use most recent updated_at between business and profile
        const bizUpdated = biz.updated_at ? new Date(biz.updated_at) : new Date();
        const profileUpdated = profile.updated_at ? new Date(profile.updated_at) : new Date();
        const lastModified = bizUpdated > profileUpdated ? bizUpdated : profileUpdated;

        // City pages get priority 1.0
        if (profile.page_type === 'city') {
          entries.push({
            url: `https://${subdomain}.shortlistpass.com`,
            lastModified,
            changeFrequency: 'daily',
            priority: 1.0,
          });
        }
        // Community pages excluded from main sitemap (gated content)
        else if (profile.business_category === 'community') {
          // Skip community pages - they're gated
          continue;
        }
        // Regular business pages
        else {
          entries.push({
            url: `https://${subdomain}.shortlistpass.com`,
            lastModified,
            changeFrequency: 'daily',
            priority: 0.9,
          });
        }
      }
    }

    // 2. Static city page entry (ensure myrtlebeach is included)
    const hasMBEntry = entries.some(e => e.url === 'https://myrtlebeach.shortlistpass.com');
    if (!hasMBEntry) {
      entries.push({
        url: 'https://myrtlebeach.shortlistpass.com',
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1.0,
      });
    }

    // 3. Fetch public events with slugs
    const { data: events, error: evError } = await supabase
      .from('smartpage_events')
      .select(`
        id,
        slug,
        updated_at,
        event_date,
        businesses!inner(
          smartpage_subdomain,
          smartpage_enabled,
          smartpage_status,
          is_public
        )
      `)
      .eq('is_public', true)
      .neq('is_private', true)
      .gte('event_date', today)
      .not('slug', 'is', null);

    if (evError) {
      console.error('[Sitemap] Error fetching events:', evError);
    }

    if (events && events.length > 0) {
      for (const event of events) {
        if (!event.slug) continue;

        const biz = Array.isArray(event.businesses)
          ? event.businesses[0]
          : event.businesses;

        if (!biz) continue;

        const subdomain = biz.smartpage_subdomain;
        if (!subdomain || subdomain.trim() === '') continue;

        // Only include events from active businesses
        if (!biz.smartpage_enabled) continue;
        if (!['live', 'trial'].includes(biz.smartpage_status)) continue;
        if (!biz.is_public) continue;

        entries.push({
          url: `https://${subdomain}.shortlistpass.com/events/${event.slug}`,
          lastModified: event.updated_at ? new Date(event.updated_at) : new Date(),
          changeFrequency: 'weekly',
          priority: 0.7,
        });
      }
    }

  } catch (error) {
    console.error('[Sitemap] Unexpected error:', error);
    // Return empty array on catastrophic failure - don't crash
    return [];
  }

  return entries;
}
