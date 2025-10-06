//  app.js

// --------------------------
// Constantes et sélecteurs
// --------------------------

const SITE_NAME = "NorelWeb";
const HEADER_SELECTOR = "#header";
const FOOTER_SELECTOR = "#footer";
const CONTENT_SELECTOR = "#content";

// --------------------------
// Initialisation principale
// --------------------------

init();

async function init() {
	await loadLayout();
	await handleRouting();
}

// --------------------------
// Chargement layout (header/footer)
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
// Routing basé sur URL
// --------------------------

async function handleRouting() {
	const { cat, subcat, page } = getUrlParams();
	const content = document.querySelector(CONTENT_SELECTOR);
	if (!content) {
		console.warn("⚠️ Élément content introuvable");
		return;
	}

	const basePath = getBasePath();
	const pageName = page || "home";

	// Si une page est précisée → on charge le contenu HTML
	if (page) {
		const path = buildContentPath(basePath, cat, subcat, pageName);

		try {
			const res = await fetch(path);
			if (!res.ok) throw new Error("Page introuvable");

			const html = await res.text();
			content.innerHTML = html;
			updatePageTitle({ cat, subcat, page: pageName, html });

			await generateArticleNavigation({ cat, subcat, page: pageName });
			await generateBreadcrumb({ cat, subcat, page: pageName });
		} catch (e) {
			content.innerHTML = `<p>❌ Cette page n'existe pas.</p>`;
			document.title = `Page introuvable - ${SITE_NAME}`;
		}

		loadArticleList();
	}

	// Si catégorie présente sans page → on affiche les articles ou sous-catégories
	else if (cat) {
		await generateBreadcrumb({ cat, subcat, page: null });
		await renderCategoryContent({ cat, subcat });
	}

	// Si ni page ni cat → on est sur la home
	else {
		await loadHomepage(); // optionnel si tu veux un comportement personnalisé
	}
}

// --------------------------
// Génération du chemin d'accès contenu
// --------------------------

function buildContentPath(basePath, cat, subcat, page) {
	if (cat && subcat) {
		return `${basePath}content/articles/${cat}/${subcat}/${page}.html`;
	} else if (cat) {
		return `${basePath}content/articles/${cat}/${page}.html`;
	} else {
		return `${basePath}content/${page}.html`;
	}
}

// --------------------------
// Mise à jour du titre HTML
// --------------------------

function updatePageTitle({ cat, subcat, page, html }) {
	if (page === "home" && !cat) {
		document.title = `Accueil - ${SITE_NAME}`;
		return;
	}

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
// Paramètres URL
// --------------------------

function getUrlParams() {
	const params = new URLSearchParams(window.location.search);
	return {
		cat: params.get("cat"),
		subcat: params.get("subcat"),
		page: params.get("page"),
	};
}

// --------------------------
// Accueil par défaut (optionnel)
// --------------------------

async function loadHomepage() {
	const content = document.querySelector(CONTENT_SELECTOR);
	const basePath = getBasePath();
	try {
		const res = await fetch(`${basePath}content/home.html`);
		if (!res.ok) throw new Error();
		const html = await res.text();
		content.innerHTML = html;
		updatePageTitle({ cat: null, subcat: null, page: "home", html });
	} catch (e) {
		content.innerHTML = `<p>❌ Page d'accueil non trouvée.</p>`;
		document.title = `Accueil introuvable - ${SITE_NAME}`;
	}
}
