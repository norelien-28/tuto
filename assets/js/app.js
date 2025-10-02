// --------------------------
// Constantes et sélecteurs
// --------------------------

const SITE_NAME = "NorelWeb";
const HEADER_SELECTOR = "#header";
const FOOTER_SELECTOR = "#footer";
const CONTENT_SELECTOR = "#content";

// --------------------------
// Rendu principal
// --------------------------

document.addEventListener("DOMContentLoaded", () => {
	init();
});

async function init() {
	await loadLayout();
	await loadPageContent();
}

// --------------------------
// Chargement header/footer
// --------------------------

async function loadLayout() {
	await loadPartial("includes/header.html", document.querySelector(HEADER_SELECTOR));
	await loadPartial("includes/footer.html", document.querySelector(FOOTER_SELECTOR));

	// Une fois le header chargé, on génère le menu
	if (typeof generateMenu === "function") {
		generateMenu();
	} else {
		console.warn("⚠️ generateMenu() n'est pas défini");
	}
}

async function loadPartial(url, targetElement) {
	if (!targetElement) {
		console.warn(`⚠️ Élément cible non trouvé pour ${url}`);
		return;
	}
	try {
		const res = await fetch(url);
		const html = await res.text();
		targetElement.innerHTML = html;
	} catch (e) {
		console.warn(`❌ Échec du chargement de : ${url}`, e);
	}
}

// --------------------------
// Chargement du contenu principal
// --------------------------

async function loadPageContent() {
	const { cat, subcat, page } = getUrlParams();
	const content = document.querySelector(CONTENT_SELECTOR);
	if (!content) {
		console.warn("⚠️ Élément content introuvable");
		return;
	}
	const basePath = getBasePath();
	const pageName = page || "home";

	const path = buildContentPath(basePath, cat, subcat, pageName);

	try {
		const res = await fetch(path);
		if (!res.ok) throw new Error("Page introuvable");
		const html = await res.text();
		content.innerHTML = html;
		updatePageTitle({ cat, subcat, page: pageName, html });
	} catch {
		content.innerHTML = `<p>❌ Cette page n'existe pas.</p>`;
		document.title = `Page introuvable - ${SITE_NAME}`;
	}
}

function buildContentPath(basePath, cat, subcat, page) {
	if (cat && subcat) {
		return `${basePath}content/articles/${cat}/${subcat}/${page}.html`;
	} else if (cat) {
		return `${basePath}content/articles/${cat}/${page}.html`;
	} else {
		return `${basePath}content/${page}.html`;
	}
}

// Mise à jour du titre de la page selon contenu
function updatePageTitle({ cat, subcat, page, html }) {
	// Page d'accueil
	if (page === "home" && !cat) {
		document.title = `Accueil - ${SITE_NAME}`;
		return;
	}

	// Extraire un titre depuis le <h1> du contenu
	const h1Match = html.match(/<h1[^>]*>(.*?)<\/h1>/i);
	const h1Text = h1Match ? h1Match[1].trim() : null;

	if (h1Text) {
		document.title = `${h1Text} - ${SITE_NAME}`;
	} else if (cat && subcat) {
		document.title = `${cat} / ${subcat} / ${page} - ${SITE_NAME}`;
	} else if (cat) {
		document.title = `${cat} / ${page} - ${SITE_NAME}`;
	} else {
		document.title = `${page} - ${SITE_NAME}`;
	}
}

// --------------------------
// Helpers
// --------------------------

function getUrlParams() {
	const params = new URLSearchParams(window.location.search);
	return {
		cat: params.get("cat"),
		subcat: params.get("subcat"),
		page: params.get("page"),
	};
}

function getBasePath() {
	return window.location.pathname.replace(/\/[^\/]*$/, "/");
}
