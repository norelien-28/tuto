// article-navigation.js

/**
 * Génère les liens de navigation (précédent / suivant) dans un article,
 * en tenant compte de toutes les catégories et sous-catégories.
 *
 * @param {Object} options - Options de navigation
 * @param {string} options.cat - Catégorie de l'article (ex: "03_Backend")
 * @param {string|null} options.subcat - Sous-catégorie (ex: "3.1_Node.js"), peut être null
 * @param {string} options.page - Identifiant de la page actuelle (ex: "3.1.1")
 */
async function generateArticleNavigation({ cat, subcat, page }) {
	if (!cat || !page) return;

	const navContainer = document.createElement("div");
	navContainer.className = "d-flex justify-content-between mt-4";

	try {
		const basePath = getBasePath();
		const res = await fetch(`${basePath}data/articles.json`);
		const data = await res.json();

		// Construire une liste linéaire de tous les articles
		const flatArticles = [];

		for (const [catKey, category] of Object.entries(data)) {
			if (category.subcategories) {
				for (const [subKey, sub] of Object.entries(category.subcategories)) {
					for (const article of sub.articles) {
						flatArticles.push({
							cat: catKey,
							subcat: subKey,
							page: article.page,
							title: article.title,
						});
					}
				}
			}
			if (category.articles) {
				for (const article of category.articles) {
					flatArticles.push({
						cat: catKey,
						subcat: null,
						page: article.page,
						title: article.title,
					});
				}
			}
		}

		// Trouver l'index de l'article actuel
		const currentIndex = flatArticles.findIndex((a) => a.page === page);
		if (currentIndex === -1) return;

		// Lien précédent
		if (currentIndex > 0) {
			const prev = flatArticles[currentIndex - 1];
			const prevLink = createNavButton(prev, "prev", false, data);
			navContainer.appendChild(prevLink);
		} else {
			navContainer.appendChild(document.createElement("div"));
		}

		// Lien suivant
		if (currentIndex < flatArticles.length - 1) {
			const next = flatArticles[currentIndex + 1];
			const nextLink = createNavButton(next, "next", true, data);
			navContainer.appendChild(nextLink);
		}

		// injection des liens
		const content = document.querySelector("#content");
		content.appendChild(navContainer);
		// dupplication des boutons pour le haut de page
		const navClone = navContainer.cloneNode(true); // true = clone profond
		// ajout classes pour les boutons en haut de page
		navClone.classList.remove("mt-4");
		navClone.classList.add("my-4", "border-bottom", "border-secondaire", "pb-3");

		content.prepend(navClone);
	} catch (e) {
		console.warn("❌ Erreur navigation articles :", e);
	}
}

/**
 * Génère le fil d’Ariane Bootstrap.
 */
async function generateBreadcrumb({ cat, subcat, page }) {
	const content = document.querySelector("#content");
	if (!content) return;

	const breadcrumbContainer = document.createElement("nav");
	breadcrumbContainer.setAttribute("aria-label", "breadcrumb");
	breadcrumbContainer.setAttribute("class", "mb-3 border-bottom border-secondaire");

	const ol = document.createElement("ol");
	ol.className = "breadcrumb small text-secondary";

	const liHome = document.createElement("li");
	liHome.className = "breadcrumb-item";
	const homeLink = createBreadcrumbLink("index.html?page=home", "Accueil");
	liHome.appendChild(homeLink);
	ol.appendChild(liHome);

	try {
		const basePath = getBasePath();
		const res = await fetch(`${basePath}data/articles.json`);
		const data = await res.json();

		let catTitle = cat;
		if (cat && data[cat]?.title) catTitle = data[cat].title;

		let subcatTitle = subcat;
		if (cat && subcat && data[cat]?.subcategories?.[subcat]?.title) {
			subcatTitle = data[cat].subcategories[subcat].title;
		}

		let pageTitle = page;
		let articlesList = [];

		if (subcat && data[cat]?.subcategories?.[subcat]) {
			articlesList = data[cat].subcategories[subcat].articles;
		} else if (!subcat && data[cat]?.articles) {
			articlesList = data[cat].articles;
		}

		const currentArticle = articlesList.find((a) => a.page === page);
		if (currentArticle?.title) {
			pageTitle = currentArticle.title;
		}

		if (cat) {
			const liCat = document.createElement("li");
			liCat.className = "breadcrumb-item";
			const catLink = createBreadcrumbLink(`index.html?page=categorie&cat=${cat}`, catTitle);
			liCat.appendChild(catLink);
			ol.appendChild(liCat);
		}

		if (subcat) {
			const liSubcat = document.createElement("li");
			liSubcat.className = "breadcrumb-item";
			const subcatLink = createBreadcrumbLink(`index.html?page=categorie&cat=${cat}&subcat=${subcat}`, subcatTitle);
			liSubcat.appendChild(subcatLink);
			ol.appendChild(liSubcat);
		}

		if (page) {
			const liPage = document.createElement("li");
			liPage.className = "breadcrumb-item active";
			liPage.setAttribute("aria-current", "page");
			liPage.textContent = pageTitle;
			ol.appendChild(liPage);
		}
	} catch (e) {
		console.warn("Erreur breadcrumb:", e);
		// Fil de secours
		if (cat) {
			const liCat = document.createElement("li");
			liCat.className = "breadcrumb-item";
			liCat.textContent = cat;
			ol.appendChild(liCat);
		}
		if (subcat) {
			const liSubcat = document.createElement("li");
			liSubcat.className = "breadcrumb-item";
			liSubcat.textContent = subcat;
			ol.appendChild(liSubcat);
		}
		if (page) {
			const liPage = document.createElement("li");
			liPage.className = "breadcrumb-item active";
			liPage.setAttribute("aria-current", "page");
			liPage.textContent = page;
			ol.appendChild(liPage);
		}
	}

	breadcrumbContainer.appendChild(ol);
	content.prepend(breadcrumbContainer);
}

/**
 * Crée un lien du fil d'Ariane.
 * @param {string} href - URL du lien
 * @param {string} textContent - Texte affiché du lien
 * @returns {HTMLAnchorElement}
 */
function createBreadcrumbLink(href, textContent) {
	const link = document.createElement("a");
	link.href = href;
	link.textContent = textContent;
	link.className = "text-dark";
	return link;
}

/**
 * Crée un élément de liste pour un article
 * @param {string} url - URL de l'article
 * @param {string} page - Identifiant de la page
 * @param {string} title - Titre de l'article
 * @param {boolean} [useBtnClass=true] - Utiliser une classe de bouton pour le lien
 * @returns {string} HTML de l'élément de liste
 */
function createArticleItem(url, page, title, useBtnClass = true) {
	// const classes = useBtnClass ? "btn btn-dark text-white" : "";
	const classes = useBtnClass ? "btn btn-dark ms-auto" : "";
	return `<li class="list-group-item"><a class="${classes}" href="${url}">${page} - ${title}</a></li>`;
}

/**
 * Retourne un label de type "Catégorie > Sous-catégorie" ou juste "Catégorie".
 * @param {Object} data - Données complètes de articles.json
 * @param {string} cat - Clé de la catégorie
 * @param {string|null} subcat - Clé de la sous-catégorie (peut être null)
 * @returns {string}
 */
function getCategoryLabel(data, cat, subcat) {
	if (!data[cat]) return cat;
	const catTitle = data[cat].title || cat;
	if (subcat && data[cat].subcategories?.[subcat]) {
		const subTitle = data[cat].subcategories[subcat].title || subcat;
		return `${catTitle} > ${subTitle}`;
	}
	return catTitle;
}

function createNavButton(article, direction, isDark, data) {
	const link = document.createElement("a");
	link.href = buildArticleUrl(article.cat, article.subcat, article.page);
	link.className = `btn ${isDark ? "btn-dark ms-auto text-end" : "btn-outline-dark text-start"}`;

	const labelClass = isDark ? "text-white-50" : "text-muted"; // meilleur contraste

	link.innerHTML = `
		<small class="d-block ${labelClass}">${getCategoryLabel(data, article.cat, article.subcat)}</small>
		<strong>${direction === "prev" ? `← ${article.title}` : `${article.title} →`}</strong>
	`;

	return link;
}
