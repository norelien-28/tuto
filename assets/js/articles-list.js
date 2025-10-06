// assets/js/articles-list.js

/**
 * Charge la liste des articles depuis le fichier JSON et génère le sommaire complet.
 */
async function loadArticleList() {
	const container = document.querySelector("#article-list");
	if (!container) return;

	try {
		const basePath = getBasePath();
		const res = await fetch(`${basePath}data/articles.json`);
		const data = await res.json();

		container.innerHTML = "";

		for (const [catKey, category] of Object.entries(data)) {
			const catSection = createCategorySection(catKey, category);
			container.appendChild(catSection);
		}
	} catch (err) {
		container.innerHTML = `<p class="text-danger">Erreur de chargement des articles.</p>`;
		console.error("❌ Erreur JSON :", err);
	}
}

/**
 * Crée un élément HTML représentant une catégorie et ses sous-catégories ou articles.
 *
 * @param {string} catKey - Clé de la catégorie (ex. "02_Frontend").
 * @param {Object} category - Objet contenant les données de la catégorie.
 * @returns {HTMLElement} Élément HTML contenant la structure de la catégorie.
 */
function createCategorySection(catKey, category) {
	const catTitle = category.title || catKey;

	const section = document.createElement("div");
	section.classList.add("col-12", "mb-4", "p-3", "border-start", "border-4", "border-success");

	let html = `<h2 class="text-success fw-bold fs-4 border-bottom pb-1 mb-3 border-1">${catTitle}</h2>`;

	if (category.subcategories) {
		for (const [subKey, sub] of Object.entries(category.subcategories)) {
			html += createSubcategoryHTML(catKey, subKey, sub);
		}
	} else if (category.articles) {
		html += createArticlesListHTML(catKey, null, category.articles);
	}

	section.innerHTML = html;
	return section;
}

/**
 * Génère le HTML pour une sous-catégorie et sa liste d'articles.
 *
 * @param {string} catKey - Clé de la catégorie parente.
 * @param {string} subKey - Clé de la sous-catégorie (ex. "01_HTML").
 * @param {Object} sub - Objet contenant les données de la sous-catégorie.
 * @returns {string} HTML représentant la sous-catégorie.
 */
function createSubcategoryHTML(catKey, subKey, sub) {
	let html = `<div class="card border-0 mb-3">`;
	html += `  <div class="card-body p-1">`;
	html += `    <h3 class="h6 mb-2 text-success">${sub.title || subKey}</h3>`;
	html += createArticlesListHTML(catKey, subKey, sub.articles);
	html += `  </div>`;
	html += `</div>`;
	return html;
}

/**
 * Génère une liste HTML d'articles pour une catégorie ou sous-catégorie.
 *
 * @param {string} catKey - Clé de la catégorie.
 * @param {string|null} subKey - Clé de la sous-catégorie (ou null si non applicable).
 * @param {Array} articles - Tableau d'objets article avec les propriétés `page` et `title`.
 * @returns {string} HTML de la liste des articles.
 */
function createArticlesListHTML(catKey, subKey, articles) {
	let html = `<ul class="list-unstyled ps-3 mb-0">`;

	for (const article of articles) {
		const url = `index.html?cat=${catKey}${subKey ? `&subcat=${subKey}` : ""}&page=${article.page}`;
		html += `<li><a href="${url}" class="text-dark link-underline link-underline-opacity-0 position-relative ps-4 d-inline-block">${article.title}</a></li>`;
	}

	html += `</ul>`;
	return html;
}
