const MONDAY_API_URL = 'https://api.monday.com/v2';
const DEFAULT_API_VERSION = '2026-07';
const DEFAULT_BOARD_ID = '5102324737';
const DEFAULT_GROUP_ID = 'topics';

const COLUMN_IDS = Object.freeze({
  status: 'lead_status',
  landingPage: 'lead_company',
  campaign: 'text',
  email: 'lead_email',
  phone: 'lead_phone',
  source: 'color_mkyb8krc',
  contactPreference: 'dropdown_mm691as',
  marketingConsent: 'boolean_mm699ttx',
  contactConsent: 'boolean_mm69hanb',
  contactAttempt: 'numeric_mm69geaa',
});

const MAX_BODY_BYTES = 16_384;

const parseAllowedOrigins = env =>
  (env.ALLOWED_ORIGINS || 'https://giladoron.com,https://www.giladoron.com')
    .split(',')
    .map(origin => origin.trim())
    .filter(Boolean);

const corsHeaders = origin => ({
  'Access-Control-Allow-Origin': origin,
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-Submission-Id',
  'Access-Control-Max-Age': '86400',
  Vary: 'Origin',
});

const jsonResponse = (body, status, origin) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      ...corsHeaders(origin),
    },
  });

const trimString = (value, maxLength) =>
  typeof value === 'string' ? value.trim().slice(0, maxLength) : '';

export const normalizeIsraeliMobile = value => {
  const digits = String(value || '').replace(/\D/g, '');

  if (/^05\d{8}$/.test(digits)) {
    return `+972${digits.slice(1)}`;
  }

  if (/^9725\d{8}$/.test(digits)) {
    return `+${digits}`;
  }

  return null;
};

const isValidEmail = value => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const buildCampaignSummary = payload => {
  const parts = [
    ['source', payload.utmSource],
    ['medium', payload.utmMedium],
    ['campaign', payload.utmCampaign],
    ['content', payload.utmContent],
    ['term', payload.utmTerm],
  ]
    .filter(([, value]) => value)
    .map(([key, value]) => `${key}=${value}`);

  if (parts.length > 0) {
    return parts.join(' | ').slice(0, 2_000);
  }

  return payload.referrer ? `referrer=${payload.referrer}`.slice(0, 2_000) : 'ללא UTM';
};

export const buildMondayColumnValues = payload => {
  const values = {
    [COLUMN_IDS.status]: { label: 'ליד חדש' },
    [COLUMN_IDS.landingPage]: payload.landingPage,
    [COLUMN_IDS.campaign]: buildCampaignSummary(payload),
    [COLUMN_IDS.phone]: {
      phone: payload.normalizedPhone,
      countryShortName: 'IL',
    },
    [COLUMN_IDS.source]: { label: 'אתר' },
    [COLUMN_IDS.contactPreference]: {
      labels: [payload.contactPref === 'phone' ? 'שיחת טלפון' : 'WhatsApp'],
    },
    [COLUMN_IDS.marketingConsent]: { checked: payload.marketingConsent },
    [COLUMN_IDS.contactConsent]: { checked: true },
    [COLUMN_IDS.contactAttempt]: '0',
  };

  if (payload.email) {
    values[COLUMN_IDS.email] = {
      email: payload.email,
      text: payload.email,
    };
  }

  return values;
};

const validatePayload = rawPayload => {
  const fullName = trimString(rawPayload.fullName, 120);
  const phone = trimString(rawPayload.phone, 40);
  const normalizedPhone = normalizeIsraeliMobile(phone);
  const email = trimString(rawPayload.email, 254).toLowerCase();
  const contactPref = rawPayload.contactPref;
  const contactConsent = rawPayload.contactConsent === true;
  const submissionId = trimString(rawPayload.submissionId, 100);

  if (fullName.length < 2) {
    return { error: 'invalid_name' };
  }

  if (!normalizedPhone) {
    return { error: 'invalid_phone' };
  }

  if (!isValidEmail(email)) {
    return { error: 'invalid_email' };
  }

  if (!['phone', 'whatsapp'].includes(contactPref)) {
    return { error: 'invalid_contact_preference' };
  }

  if (!contactConsent) {
    return { error: 'contact_consent_required' };
  }

  if (!submissionId) {
    return { error: 'submission_id_required' };
  }

  return {
    payload: {
      submissionId,
      fullName,
      phone,
      normalizedPhone,
      email,
      contactPref,
      contactConsent,
      marketingConsent: rawPayload.marketingConsent === true && Boolean(email),
      landingPage: trimString(rawPayload.landingPage, 2_000) || 'https://giladoron.com/',
      referrer: trimString(rawPayload.referrer, 2_000),
      utmSource: trimString(rawPayload.utmSource, 300),
      utmMedium: trimString(rawPayload.utmMedium, 300),
      utmCampaign: trimString(rawPayload.utmCampaign, 500),
      utmContent: trimString(rawPayload.utmContent, 500),
      utmTerm: trimString(rawPayload.utmTerm, 500),
      submittedAt: trimString(rawPayload.submittedAt, 50),
    },
  };
};

const createMondayLead = async (payload, env) => {
  const query = `
    mutation CreateLead(
      $boardId: ID!
      $groupId: String!
      $itemName: String!
      $columnValues: JSON!
    ) {
      create_item(
        board_id: $boardId
        group_id: $groupId
        item_name: $itemName
        column_values: $columnValues
      ) {
        id
      }
    }
  `;

  const response = await fetch(MONDAY_API_URL, {
    method: 'POST',
    headers: {
      Authorization: env.MONDAY_API_TOKEN,
      'API-Version': env.MONDAY_API_VERSION || DEFAULT_API_VERSION,
      'Content-Type': 'application/json',
      'Idempotency-Key': payload.submissionId,
    },
    body: JSON.stringify({
      query,
      variables: {
        boardId: env.MONDAY_BOARD_ID || DEFAULT_BOARD_ID,
        groupId: env.MONDAY_GROUP_ID || DEFAULT_GROUP_ID,
        itemName: payload.fullName,
        columnValues: JSON.stringify(buildMondayColumnValues(payload)),
      },
    }),
  });

  const result = await response.json();

  if (!response.ok || result.errors?.length || !result.data?.create_item?.id) {
    console.error('Monday lead creation failed', {
      status: response.status,
      errors: result.errors?.map(error => error.message) || [],
    });
    throw new Error('monday_create_item_failed');
  }

  return result.data.create_item.id;
};

export default {
  async fetch(request, env) {
    const requestOrigin = request.headers.get('Origin') || '';
    const allowedOrigins = parseAllowedOrigins(env);
    const origin = allowedOrigins.includes(requestOrigin) ? requestOrigin : allowedOrigins[0];

    if (request.method === 'OPTIONS') {
      if (!allowedOrigins.includes(requestOrigin)) {
        return jsonResponse({ ok: false }, 403, origin);
      }
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    if (request.method !== 'POST') {
      return jsonResponse({ ok: false }, 405, origin);
    }

    if (!allowedOrigins.includes(requestOrigin)) {
      return jsonResponse({ ok: false }, 403, origin);
    }

    if (!env.MONDAY_API_TOKEN) {
      console.error('MONDAY_API_TOKEN is not configured');
      return jsonResponse({ ok: false }, 503, origin);
    }

    const contentLength = Number(request.headers.get('Content-Length') || 0);
    if (contentLength > MAX_BODY_BYTES) {
      return jsonResponse({ ok: false }, 413, origin);
    }

    let rawPayload;
    try {
      const rawBody = await request.text();
      if (new TextEncoder().encode(rawBody).byteLength > MAX_BODY_BYTES) {
        return jsonResponse({ ok: false }, 413, origin);
      }
      rawPayload = JSON.parse(rawBody);
    } catch {
      return jsonResponse({ ok: false, error: 'invalid_json' }, 400, origin);
    }

    if (!rawPayload || typeof rawPayload !== 'object' || Array.isArray(rawPayload)) {
      return jsonResponse({ ok: false, error: 'invalid_payload' }, 400, origin);
    }

    if (trimString(rawPayload.website, 200)) {
      return jsonResponse({ ok: true, itemId: 'accepted' }, 202, origin);
    }

    const validation = validatePayload(rawPayload);
    if (validation.error) {
      return jsonResponse({ ok: false, error: validation.error }, 422, origin);
    }

    try {
      const itemId = await createMondayLead(validation.payload, env);
      return jsonResponse({ ok: true, itemId }, 201, origin);
    } catch (error) {
      console.error('Lead intake failed', error);
      return jsonResponse({ ok: false }, 502, origin);
    }
  },
};
