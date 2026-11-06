import { createAndroidIntent } from './share-link.js'
import { translations } from './translations.js'

const languageButtons = document.querySelectorAll('[data-language]')
const openButton = document.getElementById('open-session')
const validContent = document.getElementById('valid-content')
const invalidContent = document.getElementById('invalid-content')

function setLanguage(language) {
	const selected = language === 'pl' ? 'pl' : 'en'
	const strings = translations[selected]
	document.documentElement.lang = selected
	document.title = strings.pageTitle
	for (const element of document.querySelectorAll('[data-text]')) {
		const key = element.getAttribute('data-text')
		if (key && Object.hasOwn(strings, key)) {
			element.textContent = strings[key]
		}
	}
	for (const button of languageButtons) {
		button.setAttribute('aria-pressed', String(button.getAttribute('data-language') === selected))
	}
}

function updateSessionLink() {
	const intent = createAndroidIntent(window.location.hash)
	const valid = intent !== null
	if (openButton instanceof HTMLAnchorElement) {
		if (intent !== null) {
			openButton.href = intent
		} else {
			openButton.removeAttribute('href')
		}
	}
	if (validContent && invalidContent) {
		validContent.hidden = !valid
		invalidContent.hidden = valid
	}
}

for (const button of languageButtons) {
	button.addEventListener('click', () => setLanguage(button.getAttribute('data-language')))
}
window.addEventListener('hashchange', updateSessionLink)
setLanguage(navigator.language.toLowerCase().startsWith('pl') ? 'pl' : 'en')
updateSessionLink()
