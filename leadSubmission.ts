export type ContactPreference = 'phone' | 'whatsapp';

export interface LeadSubmissionPayload {
  submissionId: string;
  fullName: string;
  phone: string;
  email: string;
  contactPref: ContactPreference;
  contactConsent: boolean;
  marketingConsent: boolean;
  landingPage: string;
  referrer: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent: string;
  utmTerm: string;
  submittedAt: string;
  website: string;
}

interface LeadFormValues {
  fullName: string;
  phone: string;
  email: string;
  contactPref: ContactPreference;
  consent: boolean;
  marketingConsent: boolean;
  website: string;
}

const LEAD_API_URL = import.meta.env.VITE_LEAD_API_URL?.trim();

export const isLeadApiConfigured = Boolean(LEAD_API_URL);

const createSubmissionId = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

export const createLeadSubmission = (formData: LeadFormValues): LeadSubmissionPayload => {
  const url = new URL(window.location.href);

  return {
    submissionId: createSubmissionId(),
    fullName: formData.fullName.trim(),
    phone: formData.phone.trim(),
    email: formData.email.trim(),
    contactPref: formData.contactPref,
    contactConsent: formData.consent,
    marketingConsent: formData.marketingConsent,
    landingPage: `${url.origin}${url.pathname}`,
    referrer: document.referrer,
    utmSource: url.searchParams.get('utm_source') || '',
    utmMedium: url.searchParams.get('utm_medium') || '',
    utmCampaign: url.searchParams.get('utm_campaign') || '',
    utmContent: url.searchParams.get('utm_content') || '',
    utmTerm: url.searchParams.get('utm_term') || '',
    submittedAt: new Date().toISOString(),
    website: formData.website,
  };
};

export const submitLeadToCrm = async (
  payload: LeadSubmissionPayload
): Promise<{ itemId: string }> => {
  if (!LEAD_API_URL) {
    throw new Error('Lead API is not configured');
  }

  const response = await fetch(LEAD_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Submission-Id': payload.submissionId,
    },
    body: JSON.stringify(payload),
    keepalive: true,
  });

  if (!response.ok) {
    throw new Error(`Lead API request failed with status ${response.status}`);
  }

  return response.json();
};
