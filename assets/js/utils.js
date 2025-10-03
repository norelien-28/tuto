// utils.js

// --------------------------
// Helpers
// --------------------------

/**
 * Récupère les paramètres d'URL (cat, subcat, page)
 * @returns {{ cat: string|null, subcat: string|null, page: string|null }}
 */
function getUrlParams() {
	const params = new URLSearchParams(window.location.search);
	return {
		cat: params.get("cat"),
		subcat: params.get("subcat"),
		page: params.get("page"),
	};
}

/**
 * Détermine le chemin de base de l'application
 * @returns {string}
 */
function getBasePath() {
	return window.location.pathname.replace(/\/[^\/]*$/, "/");
}

/**
 * Construit l'URL d'un article en fonction de ses paramètres
 * @param {string} cat - Catégorie
 * @param {string|null} subcat - Sous-catégorie (peut être null)
 * @param {string} page - Identifiant de la page
 * @returns {string}
 */
function buildArticleUrl(cat, subcat, page) {
	let url = `index.html?cat=${cat}`;
	if (subcat) url += `&subcat=${subcat}`;
	url += `&page=${page}`;
	return url;
}

/**
 * Crée un lien HTML stylisé pour le fil d’Ariane
 * @param {string} href - Lien vers la page
 * @param {string} textContent - Texte du lien
 * @returns {HTMLAnchorElement}
 */
function createBreadcrumbLink(href, textContent) {
	const link = document.createElement("a");
	link.href = href;
	link.textContent = textContent;
	link.className = "text-dark text-decoration-none";
	return link;
}
