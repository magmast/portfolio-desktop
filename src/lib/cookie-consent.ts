import * as CookieConsent from "vanilla-cookieconsent";

export function showPreferences() {
  CookieConsent.showPreferences();
}

export async function showDialog() {
  await CookieConsent.run({
    categories: {
      necessary: {
        enabled: true,
        readOnly: true,
      },
      preferences: {},
    },
    language: {
      default: "en",
      translations: {
        en: {
          consentModal: {},
          preferencesModal: {
            sections: [],
          },
        },
      },
    },
  });

  CookieConsent.show();
}
