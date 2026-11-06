// @ts-check

export const PLAY_URL = 'https://play.google.com/store/apps/details?id=timer.engine'
export const LEGACY_PREFIX = 'sessiontimer://share/v1#'
export const HTTPS_PREFIX = 'https://gar2d2.github.io/customizable-timer-privacy/share/#v1='
export const MAX_PAYLOAD_LENGTH = 4096 - HTTPS_PREFIX.length

/** Read only the versioned fragment; session content never enters a server request. */
export function parseSessionFragment(fragment) {
	if (!fragment.startsWith('#v1=')) {
		return null
	}
	const payload = fragment.slice(4)
	if (!payload || payload.length > MAX_PAYLOAD_LENGTH || !/^[A-Za-z0-9_-]+$/.test(payload)) {
		return null
	}
	const remainder = payload.length % 4
	if (remainder === 1) {
		return null
	}
	// Unpadded Base64url must have zero unused bits in its final character.
	const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'
	const lastCharacter = payload.charAt(payload.length - 1)
	const lastValue = alphabet.indexOf(lastCharacter)
	if ((remainder === 2 && lastValue % 16 !== 0) || (remainder === 3 && lastValue % 4 !== 0)) {
		return null
	}
	return payload
}

/** Android separates intent metadata at the last #Intent;, preserving the data fragment. */
export function createAndroidIntent(fragment) {
	const payload = parseSessionFragment(fragment)
	if (payload === null) {
		return null
	}
	return `intent://share/v1#${payload}#Intent;scheme=sessiontimer;package=timer.engine;` +
		`S.browser_fallback_url=${encodeURIComponent(PLAY_URL)};end`
}
