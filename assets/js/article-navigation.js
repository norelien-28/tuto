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
			const prevLink = document.createElement("a");
			prevLink.href = buildArticleUrl(prev.cat, prev.subcat, prev.page);
			prevLink.className = "btn btn-outline-dark";
			prevLink.innerHTML = `← ${prev.title}`;
			navContainer.appendChild(prevLink);
		} else {
			navContainer.appendChild(document.createElement("div"));
		}

		// Lien suivant
		if (currentIndex < flatArticles.length - 1) {
			const next = flatArticles[currentIndex + 1];
			const nextLink = document.createElement("a");
			nextLink.href = buildArticleUrl(next.cat, next.subcat, next.page);
			nextLink.className = "btn btn-dark ms-auto";
			nextLink.innerHTML = `${next.title} →`;
			navContainer.appendChild(nextLink);
		}

		document.querySelector("#content").appendChild(navContainer);
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
			const catLink = createBreadcrumbLink(`index.html?cat=${cat}`, catTitle);
			liCat.appendChild(catLink);
			ol.appendChild(liCat);
		}

		if (subcat) {
			const liSubcat = document.createElement("li");
			liSubcat.className = "breadcrumb-item";
			const subcatLink = createBreadcrumbLink(`index.html?cat=${cat}&subcat=${subcat}`, subcatTitle);
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
 * Affiche dynamiquement le contenu d'une catégorie ou sous-catégorie.
 * Liste les sous-catégories et/ou articles.
 *
 * @param {Object} options
 * @param {string} options.cat - Clé de la catégorie
 * @param {string|null} options.subcat - Clé de la sous-catégorie (facultatif)
 */
async function renderCategoryContent({ cat, subcat = null }) {
	const content = document.querySelector("#content");
	if (!content) return;

	try {
		const basePath = getBasePath();
		const res = await fetch(`${basePath}data/articles.json`);
		const data = await res.json();

		let html = "";

		if (!data[cat]) {
			content.innerHTML = `<p>❌ Catégorie introuvable</p>`;
			return;
		}

		if (subcat) {
			// Sous-catégorie
			const sub = data[cat].subcategories?.[subcat];
			if (!sub) {
				content.innerHTML = `<p>❌ Sous-catégorie introuvable</p>`;
				return;
			}

			html += `<h1>${sub.title || subcat}</h1><ul class="list-group mb-4">`;
			sub.articles.forEach((article) => {
				const url = buildArticleUrl(cat, subcat, article.page);
				html += createArticleItem(url, article.page, article.title, true);
			});
			html += "</ul>";
		} else {
			// Catégorie
			const category = data[cat];
			html += `<h1>${category.title || cat}</h1>`;

			if (category.subcategories) {
				for (const [subKey, subValue] of Object.entries(category.subcategories)) {
					html += `<h2 class="h5 mt-4">${subValue.title || subKey}</h2><ul class="list-group mb-3">`;
					subValue.articles.forEach((article) => {
						const url = buildArticleUrl(cat, subKey, article.page);
						html += createArticleItem(url, article.page, article.title, true);
					});
					html += "</ul>";
				}
			} else if (category.articles) {
				html += `<ul class="list-group mt-3">`;
				category.articles.forEach((article) => {
					const url = buildArticleUrl(cat, null, article.page);
					html += createArticleItem(url, article.page, article.title, true);
				});
				html += "</ul>";
			}
		}

		content.innerHTML = html;
		await generateBreadcrumb({ cat, subcat, page: null });
	} catch (e) {
		console.error("❌ Erreur affichage catégorie :", e);
		content.innerHTML = `<p>❌ Erreur lors du chargement de la catégorie</p>`;
	}
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
