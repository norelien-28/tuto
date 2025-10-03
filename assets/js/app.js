// app.js

// --------------------------
// Constantes et sélecteurs
// --------------------------

const SITE_NAME = "NorelWeb";
const HEADER_SELECTOR = "#header";
const FOOTER_SELECTOR = "#footer";
const CONTENT_SELECTOR = "#content";

init();

async function init() {
	await loadLayout();
	await loadPageContent();
}

/**
 * Charge le header et le footer du site web.
 * Une fois le header chargé, on génère le menu.
 * @throws {Error} Si le chargement d'un des éléments échoue.
 */
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

/**
 * Charge un élément HTML partiel dans un élément cible.
 * @param {string} url - URL de l'élément HTML partiel à charger.
 * @param {Element} targetElement - Élément cible dans lequel charger le contenu.
 * @throws {Error} Si le chargement d'un des éléments échoue.
 */
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

/**
 * Charge le contenu principal de la page.
 * La page est définie par les paramètres de l'URL :
 * - cat : catégorie
 * - subcat : sous-catégorie
 * - page : nom de la page
 * @throws {Error} Si le chargement de la page échoue.
 */
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

		await generateArticleNavigation({ cat, subcat, page: pageName });
	} catch {
		content.innerHTML = `<p>❌ Cette page n'existe pas.</p>`;
		document.title = `Page introuvable - ${SITE_NAME}`;
	}
}

/**
 * Construit le chemin d'accès à un fichier de contenu.
 * Le chemin est généré en fonction des paramètres de l'URL :
 * - basePath : base du chemin d'accès
 * - cat : catégorie
 * - subcat : sous-catégorie
 * - page : nom de la page
 * @param {string} basePath - Base du chemin d accès
 * @param {string} cat - Catégorie
 * @param {string|null} subcat - Sous-catégorie, peut être null
 * @param {string} page - Nom de la page
 * @returns {string} Chemin d accès au fichier de contenu
 */
function buildContentPath(basePath, cat, subcat, page) {
	if (cat && subcat) {
		return `${basePath}content/articles/${cat}/${subcat}/${page}.html`;
	} else if (cat) {
		return `${basePath}content/articles/${cat}/${page}.html`;
	} else {
		return `${basePath}content/${page}.html`;
	}
}

/**
 * Met à jour le titre de la page en fonction des paramètres de l'URL et du contenu HTML.
 * @param {{ cat: string, subcat: string|null, page: string, html: string }} - Paramètres de l'URL et contenu HTML
 * @returns {void}
 */
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
