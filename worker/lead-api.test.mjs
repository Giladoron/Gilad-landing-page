import test from 'node:test';
import assert from 'node:assert/strict';

import worker, { buildMondayColumnValues, normalizeIsraeliMobile } from './lead-api.js';

test('normalizes common Israeli mobile formats', () => {
  assert.equal(normalizeIsraeliMobile('052-876-5992'), '+972528765992');
  assert.equal(normalizeIsraeliMobile('+972 52 876 5992'), '+972528765992');
  assert.equal(normalizeIsraeliMobile('03-1234567'), null);
});

test('maps a website lead to the configured CRM columns', () => {
  const values = buildMondayColumnValues({
    normalizedPhone: '+972501234567',
    email: 'lead@example.com',
    contactPref: 'phone',
    marketingConsent: true,
    landingPage: 'https://giladoron.com/',
    referrer: '',
    utmSource: 'instagram',
    utmMedium: 'paid_social',
    utmCampaign: 'summer',
    utmContent: '',
    utmTerm: '',
  });

  assert.deepEqual(values.lead_status, { label: 'ליד חדש' });
  assert.deepEqual(values.lead_phone, {
    phone: '+972501234567',
    countryShortName: 'IL',
  });
  assert.deepEqual(values.dropdown_mm691as, { labels: ['שיחת טלפון'] });
  assert.deepEqual(values.lead_email, {
    email: 'lead@example.com',
    text: 'lead@example.com',
  });
  assert.equal(values.text, 'source=instagram | medium=paid_social | campaign=summer');
});

test('omits the email value when the visitor leaves it blank', () => {
  const values = buildMondayColumnValues({
    normalizedPhone: '+972501234567',
    email: '',
    contactPref: 'whatsapp',
    marketingConsent: false,
    landingPage: 'https://giladoron.com/',
    referrer: '',
    utmSource: '',
    utmMedium: '',
    utmCampaign: '',
    utmContent: '',
    utmTerm: '',
  });

  assert.equal('lead_email' in values, false);
  assert.deepEqual(values.dropdown_mm691as, { labels: ['WhatsApp'] });
});

test('accepts an allowed website request and creates the monday item', async context => {
  const originalFetch = globalThis.fetch;
  context.after(() => {
    globalThis.fetch = originalFetch;
  });

  let mondayRequest;
  globalThis.fetch = async (url, options) => {
    mondayRequest = { url, options };
    return new Response(JSON.stringify({ data: { create_item: { id: '123456' } } }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  };

  const submissionId = '55a46310-b9aa-4635-9076-9768b526af99';
  const response = await worker.fetch(
    new Request('https://gilad-lead-intake.example.workers.dev', {
      method: 'POST',
      headers: {
        Origin: 'https://giladoron.com',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        submissionId,
        fullName: 'ליד בדיקה',
        phone: '050-123-4567',
        email: 'lead@example.com',
        contactPref: 'whatsapp',
        contactConsent: true,
        marketingConsent: false,
        landingPage: 'https://giladoron.com/',
        referrer: '',
        utmSource: 'instagram',
        utmMedium: 'organic',
        utmCampaign: '',
        utmContent: '',
        utmTerm: '',
        submittedAt: '2026-08-16T20:00:00.000Z',
        website: '',
      }),
    }),
    {
      MONDAY_API_TOKEN: 'test-token',
      MONDAY_BOARD_ID: '5102324737',
      MONDAY_GROUP_ID: 'topics',
      MONDAY_API_VERSION: '2026-07',
      ALLOWED_ORIGINS: 'https://giladoron.com',
    }
  );

  assert.equal(response.status, 201);
  assert.deepEqual(await response.json(), { ok: true, itemId: '123456' });
  assert.equal(mondayRequest.url, 'https://api.monday.com/v2');
  assert.equal(mondayRequest.options.headers['Idempotency-Key'], submissionId);

  const mondayBody = JSON.parse(mondayRequest.options.body);
  assert.equal(mondayBody.variables.boardId, '5102324737');
  assert.equal(mondayBody.variables.groupId, 'topics');
  assert.equal(mondayBody.variables.itemName, 'ליד בדיקה');
});
