// utils.js

// --------------------------
// Helpers
// --------------------------

/**
 * Récupère les paramètres d'URL (cat, subcat, page)
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
 */
function getBasePath() {
	return window.location.pathname.replace(/\/[^\/]*$/, "/");
}

/**
 * Construit l'URL d'un article
 */
function buildArticleUrl(cat, subcat, page) {
	let url = `index.html?cat=${cat}`;
	if (subcat) url += `&subcat=${subcat}`;
	url += `&page=${page}`;
	return url;
}
