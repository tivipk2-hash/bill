/**
 * Address suggestion service providing fast autocomplete for US & California addresses
 * Supports prefix matching, street number retention, live geocoding, and history from invoices.
 */

export interface AddressSuggestion {
  fullAddress: string;
  street: string;
  city: string;
  state: string;
  zip: string;
}

// Common California cities and zip codes
export const CALIFORNIA_CITIES: Record<string, { state: string; defaultZip: string; streets: string[] }> = {
  'Los Angeles': {
    state: 'CA',
    defaultZip: '90043',
    streets: [
      'Long Street',
      'London Street',
      'Locust Street',
      'Linden Street',
      'Logan Street',
      'Lorena Street',
      'Lowell Avenue',
      'Los Feliz Boulevard',
      'La Brea Avenue',
      'La Cienega Boulevard',
      'Lincoln Boulevard',
      'Main Street',
      'Broadway',
      'Spring Street',
      'Grand Avenue',
      'Olive Street',
      'Hope Street',
      'Flower Street',
      'Figueroa Street',
      'Olympic Boulevard',
      'Pico Boulevard',
      'Venice Boulevard',
      'Washington Boulevard',
      'Adams Boulevard',
      'Jefferson Boulevard',
      'Exposition Boulevard',
      'Martin Luther King Jr Boulevard',
      'Vernon Avenue',
      'Slauson Avenue',
      'Florence Avenue',
      'Manchester Avenue',
      'Century Boulevard',
      'Imperial Highway',
      'Wilshire Boulevard',
      'Sunset Boulevard',
      'Hollywood Boulevard',
      'Santa Monica Boulevard',
      'Melrose Avenue',
      'Beverly Boulevard',
      '3rd Street',
      '6th Street',
      '7th Street',
      '8th Street',
      'Western Avenue',
      'Vermont Avenue',
      'Normandie Avenue',
      'Hoover Street',
      'Avalon Boulevard',
      'Central Avenue',
      'Compton Avenue',
      'San Pedro Street',
      'Alameda Street',
      'Crenshaw Boulevard',
      'Sepulveda Boulevard',
      'Van Nuys Boulevard',
      'Reseda Boulevard',
      'Balboa Boulevard',
      'Woodman Avenue',
      'Coldwater Canyon Avenue',
      'Laurel Canyon Boulevard',
      'Ventura Boulevard',
      'Victory Boulevard',
      'Sherman Way',
      'Roscoe Boulevard',
      'Saticoy Street',
      'Chandler Boulevard',
      'Burbank Boulevard',
      'Magnolia Boulevard',
      'Riverside Drive',
    ],
  },
  'Torrance': {
    state: 'CA',
    defaultZip: '90505',
    streets: [
      'Lomita Boulevard',
      'Torrance Boulevard',
      'Hawthorne Boulevard',
      'Sepulveda Boulevard',
      'Del Amo Boulevard',
      'Crenshaw Boulevard',
      'Western Avenue',
      'Carson Street',
      '190th Street',
      'Artesia Boulevard',
      'Anza Avenue',
      'Prairie Avenue',
      'Madrona Avenue',
      'Maple Avenue',
      'Cabrillo Avenue',
      'Marcelina Avenue',
      'El Prado Avenue',
      'Gramercy Place',
      'Van Ness Avenue',
      'Arlington Avenue',
      'Pacific Coast Highway',
      'Skypark Drive',
    ],
  },
  'Long Beach': {
    state: 'CA',
    defaultZip: '90807',
    streets: [
      'Locust Avenue',
      'Linden Avenue',
      'Long Beach Boulevard',
      'Lime Avenue',
      'Lemon Avenue',
      'Lewis Avenue',
      'Atlantic Avenue',
      'Pacific Avenue',
      'Pine Avenue',
      'American Avenue',
      'Ocean Boulevard',
      'Broadway',
      '4th Street',
      '7th Street',
      '10th Street',
      'Anaheim Street',
      'Pacific Coast Highway',
      'Willow Street',
      'Spring Street',
      'Wardlow Road',
      'Carson Street',
      'Del Amo Boulevard',
      'Market Street',
      'South Street',
      'Artesia Boulevard',
      'Cherry Avenue',
      'Orange Avenue',
      'California Avenue',
      'Lakewood Boulevard',
      'Bellflower Boulevard',
      'Palo Verde Avenue',
      'Studebaker Road',
    ],
  },
  'Hawthorne': {
    state: 'CA',
    defaultZip: '90250',
    streets: [
      'Prairie Avenue',
      'Hawthorne Boulevard',
      'Inglewood Avenue',
      'Crenshaw Boulevard',
      'El Segundo Boulevard',
      'Rosecrans Avenue',
      'Imperial Highway',
      '118th Street',
      '120th Street',
      '126th Street',
      '132nd Street',
      '135th Street',
      '139th Street',
      'Doty Avenue',
      'Yukon Avenue',
      'Kornblum Avenue',
      'Birch Avenue',
      'Grevillea Avenue',
      'Ramona Avenue',
      'Cerise Avenue',
    ],
  },
  'Gardena': {
    state: 'CA',
    defaultZip: '90247',
    streets: [
      'Gardena Boulevard',
      'Redondo Beach Boulevard',
      'Rosecrans Avenue',
      'El Segundo Boulevard',
      '135th Street',
      '149th Street',
      '154th Street',
      '166th Street',
      '182nd Street',
      'Western Avenue',
      'Normandie Avenue',
      'Vermont Avenue',
      'Van Ness Avenue',
      'Crenshaw Boulevard',
    ],
  },
  'Inglewood': {
    state: 'CA',
    defaultZip: '90301',
    streets: [
      'Manchester Boulevard',
      'Century Boulevard',
      'Imperial Highway',
      'Florence Avenue',
      'La Brea Avenue',
      'Prairie Avenue',
      'Crenshaw Boulevard',
      'Van Ness Avenue',
      'Arbor Vitae Street',
    ],
  },
  'Compton': {
    state: 'CA',
    defaultZip: '90220',
    streets: [
      'Compton Boulevard',
      'Rosecrans Avenue',
      'Alondra Boulevard',
      'Greenleaf Boulevard',
      'Artesia Boulevard',
      'Long Beach Boulevard',
      'Alameda Street',
      'Central Avenue',
      'Wilmington Avenue',
      'Santa Fe Avenue',
    ],
  },
  'Carson': {
    state: 'CA',
    defaultZip: '90745',
    streets: [
      'Carson Street',
      'Sepulveda Boulevard',
      'Del Amo Boulevard',
      'Main Street',
      'Avalon Boulevard',
      'Figueroa Street',
      'Wilmington Avenue',
      'Central Avenue',
      'University Drive',
    ],
  },
  'Anaheim': {
    state: 'CA',
    defaultZip: '92801',
    streets: [
      'Lincoln Avenue',
      'Ball Road',
      'Katella Avenue',
      'Orangewood Avenue',
      'Chapman Avenue',
      'Euclid Street',
      'Brookhurst Street',
      'Magnolia Avenue',
      'Beach Boulevard',
      'Harbor Boulevard',
      'Anaheim Boulevard',
      'State College Boulevard',
      'Kraemer Boulevard',
    ],
  },
  'Garden Grove': {
    state: 'CA',
    defaultZip: '92840',
    streets: [
      'Garden Grove Boulevard',
      'Westminster Avenue',
      'Hazard Avenue',
      'Chapman Avenue',
      'Lampson Avenue',
      'Brookhurst Street',
      'Euclid Street',
      'Nutwood Street',
      'Magnolia Street',
      'Dale Street',
      'Valley View Street',
    ],
  },
  'Westminster': {
    state: 'CA',
    defaultZip: '92683',
    streets: [
      'Bolsa Avenue',
      'Westminster Boulevard',
      'Hazard Avenue',
      'Trask Avenue',
      'Brookhurst Street',
      'Magnolia Street',
      'Bushard Street',
      'Ward Street',
      'Goldenwest Street',
      'Springdale Street',
      'Edwards Street',
    ],
  },
  'Santa Ana': {
    state: 'CA',
    defaultZip: '92701',
    streets: [
      '1st Street',
      '4th Street',
      '17th Street',
      'Bristol Street',
      'Main Street',
      'Grand Avenue',
      'Flower Street',
      'Fairview Street',
      'Warner Avenue',
      'Edinger Avenue',
      'McFadden Avenue',
      'Dyer Road',
    ],
  },
  'Irvine': {
    state: 'CA',
    defaultZip: '92618',
    streets: [
      'Alton Parkway',
      'Barranca Parkway',
      'Irvine Center Drive',
      'Culver Drive',
      'Jamboree Road',
      'Jeffrey Road',
      'Sand Canyon Avenue',
      'MacArthur Boulevard',
      'Main Street',
      'Michelson Drive',
      'Von Karman Avenue',
    ],
  },
  'San Diego': {
    state: 'CA',
    defaultZip: '92101',
    streets: [
      'Broadway',
      'Market Street',
      'University Avenue',
      'El Cajon Boulevard',
      'Balboa Avenue',
      'Clairemont Mesa Boulevard',
      'Mira Mesa Boulevard',
      'Pacific Highway',
      'Harbor Drive',
      'Rosecrans Street',
      'Sports Arena Boulevard',
    ],
  },
  'San Jose': {
    state: 'CA',
    defaultZip: '95112',
    streets: [
      'First Street',
      'Santa Clara Street',
      'San Carlos Street',
      'The Alameda',
      'Story Road',
      'Tully Road',
      'Capitol Expressway',
      'Alum Rock Avenue',
      'Bascom Avenue',
      'Meridian Avenue',
      'Saratoga Avenue',
    ],
  },
};

// Known ZIP codes for specific neighborhoods in CA
const ZIP_LOOKUP: Record<string, string> = {
  'Long Street, Los Angeles': '90043',
  'London Street, Los Angeles': '90026',
  'Lomita Boulevard, Torrance': '90505',
  'Locust Avenue, Long Beach': '90807',
  'Linden Avenue, Long Beach': '90807',
  'Long Beach Boulevard, Long Beach': '90807',
  'Prairie Avenue, Hawthorne': '90250',
  'Hawthorne Boulevard, Hawthorne': '90250',
  'Imperial Highway, Hawthorne': '90250',
  'Western Avenue, Gardena': '90247',
  'Carson Street, Carson': '90745',
  'Bolsa Avenue, Westminster': '92683',
  'Garden Grove Boulevard, Garden Grove': '92840',
  'Brookhurst Street, Garden Grove': '92840',
  'Euclid Street, Anaheim': '92801',
  'Lincoln Avenue, Anaheim': '92801',
  'Bristol Street, Santa Ana': '92701',
};

/**
 * Searches local address dataset with high relevance matching (like in user screenshot)
 */
export const searchLocalAddresses = (queryText: string, limit = 8): AddressSuggestion[] => {
  const clean = queryText.trim().replace(/\s+/g, ' ');
  if (clean.length < 2) return [];

  // Match house number if present at the start (e.g. "3417 lo" -> num="3417", rest="lo")
  const numMatch = clean.match(/^(\d+[\w-]*)\s*(.*)$/i);
  const houseNumber = numMatch ? numMatch[1] : '';
  const searchRest = (numMatch ? numMatch[2] : clean).toLowerCase().trim();

  const results: AddressSuggestion[] = [];
  const seen = new Set<string>();

  // If query is specifically matching our core dataset
  for (const [cityName, cityData] of Object.entries(CALIFORNIA_CITIES)) {
    for (const street of cityData.streets) {
      const streetLower = street.toLowerCase();
      const cityLower = cityName.toLowerCase();
      const fullSearchTarget = `${streetLower} ${cityLower}`;

      let matches = false;
      if (!searchRest) {
        // Only house number entered, return popular streets
        matches = true;
      } else if (streetLower.startsWith(searchRest)) {
        matches = true;
      } else if (streetLower.includes(searchRest)) {
        matches = true;
      } else if (fullSearchTarget.includes(searchRest)) {
        matches = true;
      }

      if (matches) {
        const fullStreet = houseNumber ? `${houseNumber} ${street}` : street;
        const lookupKey = `${street}, ${cityName}`;
        const zip = ZIP_LOOKUP[lookupKey] || cityData.defaultZip;
        const fullAddress = `${fullStreet}, ${cityName}, California ${zip}`;

        if (!seen.has(fullAddress)) {
          seen.add(fullAddress);
          results.push({
            fullAddress,
            street: fullStreet,
            city: cityName,
            state: 'CA',
            zip,
          });
        }
      }

      if (results.length >= limit) break;
    }
    if (results.length >= limit) break;
  }

  return results;
};

/**
 * Live geocoding query fallback using OpenStreetMap Nominatim for any arbitrary US address
 */
export const searchOnlineAddresses = async (
  queryText: string,
  limit = 5
): Promise<AddressSuggestion[]> => {
  const clean = queryText.trim();
  if (clean.length < 3) return [];

  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      clean + ' USA'
    )}&format=json&addressdetails=1&countrycodes=us&limit=${limit}`;

    const res = await fetch(url, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!res.ok) return [];
    const data = await res.json();

    const suggestions: AddressSuggestion[] = [];
    if (Array.isArray(data)) {
      for (const item of data) {
        const addr = item.address || {};
        const houseNum = addr.house_number || '';
        const road = addr.road || addr.street || item.name || '';
        const city = addr.city || addr.town || addr.village || addr.suburb || addr.county || '';
        const state = addr['ISO3166-2-lvl4']?.replace('US-', '') || addr.state || 'CA';
        const zip = addr.postcode || '';

        if (road || city) {
          const street = houseNum ? `${houseNum} ${road}` : road;
          const fullAddress = `${street}${city ? `, ${city}` : ''}${
            state ? `, ${state}` : ''
          }${zip ? ` ${zip}` : ''}`.replace(/^,\s*/, '');

          suggestions.push({
            fullAddress,
            street: street || clean,
            city,
            state: state.length > 2 ? 'CA' : state,
            zip,
          });
        }
      }
    }

    return suggestions;
  } catch (err) {
    console.warn('Online address search failed:', err);
    return [];
  }
};

/**
 * Combined Autocomplete Service
 */
export const getAddressSuggestions = async (
  queryText: string,
  pastInvoicesAddresses: AddressSuggestion[] = []
): Promise<AddressSuggestion[]> => {
  const clean = queryText.trim().toLowerCase();
  if (clean.length < 2) return [];

  const combined: AddressSuggestion[] = [];
  const seen = new Set<string>();

  // 1. Check past saved invoices addresses first
  for (const past of pastInvoicesAddresses) {
    if (
      past.fullAddress.toLowerCase().includes(clean) ||
      past.street.toLowerCase().includes(clean)
    ) {
      if (!seen.has(past.fullAddress)) {
        seen.add(past.fullAddress);
        combined.push(past);
      }
    }
  }

  // 2. Search local California & US dataset (immediate response)
  const localMatches = searchLocalAddresses(queryText, 8);
  for (const item of localMatches) {
    if (!seen.has(item.fullAddress)) {
      seen.add(item.fullAddress);
      combined.push(item);
    }
  }

  // If local suggestions found >= 4, return immediately for best response time
  if (combined.length >= 4) {
    return combined.slice(0, 7);
  }

  // 3. Fallback to online geocoding if query is more specific
  try {
    const onlineMatches = await searchOnlineAddresses(queryText, 4);
    for (const item of onlineMatches) {
      if (!seen.has(item.fullAddress)) {
        seen.add(item.fullAddress);
        combined.push(item);
      }
    }
  } catch {
    // Ignore online errors
  }

  return combined.slice(0, 7);
};
