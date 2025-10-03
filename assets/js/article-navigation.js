/**
 * Génère les liens de navigation (précédent / suivant) dans un article.
 *
 * @param {Object} options - Options de navigation
 * @param {string} options.cat - Catégorie de l'article (ex: "03_Backend")
 * @param {string|null} options.subcat - Sous-catégorie (ex: "3.1_Node.js"), peut être null
 * @param {string} options.page - Identifiant de la page actuelle (ex: "3.1.1")
 */
async function generateArticleNavigation({ cat, subcat, page }) {
	if (!cat || !page) return; // Catégorie ou page manquante → pas de navigation

	// Création du conteneur des boutons de navigation
	const navContainer = document.createElement("div");
	navContainer.className = "d-flex justify-content-between mt-4";

	try {
		// Chargement du fichier JSON des articles
		const basePath = getBasePath();
		const res = await fetch(`${basePath}data/articles.json`);
		const data = await res.json();

		let articlesList = [];

		// Récupération de la liste d'articles selon la catégorie et sous-catégorie
		if (subcat && data[cat]?.subcategories?.[subcat]) {
			articlesList = data[cat].subcategories[subcat].articles;
		} else if (!subcat && data[cat]?.articles) {
			articlesList = data[cat].articles;
		}

		// Trouve l'index de l'article actuel dans la liste
		const currentIndex = articlesList.findIndex((a) => a.page === page);
		if (currentIndex === -1) return; // Article non trouvé

		// -----------------------------
		// Lien vers l'article précédent
		// -----------------------------
		if (currentIndex > 0) {
			const prev = articlesList[currentIndex - 1];
			const prevLink = document.createElement("a");
			prevLink.href = buildArticleUrl(cat, subcat, prev.page);
			prevLink.className = "btn btn-outline-dark";
			prevLink.innerHTML = `← ${prev.title}`;
			navContainer.appendChild(prevLink);
		} else {
			// Si aucun précédent, on garde l'espace pour l'alignement
			navContainer.appendChild(document.createElement("div"));
		}

		// -----------------------------
		// Lien vers l'article suivant
		// -----------------------------
		if (currentIndex < articlesList.length - 1) {
			const next = articlesList[currentIndex + 1];
			const nextLink = document.createElement("a");
			nextLink.href = buildArticleUrl(cat, subcat, next.page);
			nextLink.className = "btn btn-dark ms-auto";
			nextLink.innerHTML = `${next.title} →`;
			navContainer.appendChild(nextLink);
		}

		// Ajoute les liens de navigation en bas du contenu principal
		document.querySelector(CONTENT_SELECTOR).appendChild(navContainer);
	} catch (e) {
		console.warn("❌ Erreur navigation articles :", e);
	}
}

/**
 * Génère le fil d'Ariane stylé Bootstrap au-dessus du contenu principal
 * en utilisant les titres du fichier articles.json.
 *
 * @param {Object} options
 * @param {string} options.cat - La catégorie
 * @param {string|null} options.subcat - La sous-catégorie (optionnel)
 * @param {string} options.page - La page
 */
async function generateBreadcrumb({ cat, subcat, page }) {
	const content = document.querySelector("#content");
	if (!content) return;

	// Conteneur breadcrumb
	const breadcrumbContainer = document.createElement("nav");
	breadcrumbContainer.setAttribute("aria-label", "breadcrumb");
	breadcrumbContainer.setAttribute("class", "mb-3 border-bottom border-secondaire");

	const ol = document.createElement("ol");
	ol.className = "breadcrumb small text-secondary";

	// Accueil (lien)
	const liHome = document.createElement("li");
	liHome.className = "breadcrumb-item";
	const homeLink = createBreadcrumbLink("index.html?page=home", "Accueil");
	liHome.appendChild(homeLink);
	ol.appendChild(liHome);

	try {
		// Récupérer données articles.json
		const basePath = getBasePath();
		const res = await fetch(`${basePath}data/articles.json`);
		const data = await res.json();

		// Titre catégorie lisible
		let catTitle = cat;
		if (cat && data[cat]?.title) {
			catTitle = data[cat].title;
		}

		// Titre sous-catégorie lisible
		let subcatTitle = subcat;
		if (cat && subcat && data[cat]?.subcategories?.[subcat]?.title) {
			subcatTitle = data[cat].subcategories[subcat].title;
		}

		// Titre page lisible
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

		// Catégorie (lien)
		if (cat) {
			const liCat = document.createElement("li");
			liCat.className = "breadcrumb-item";
			const catLink = createBreadcrumbLink(`index.html?cat=${cat}`, catTitle);
			liCat.appendChild(catLink);
			ol.appendChild(liCat);
		}

		// Sous-catégorie (lien)
		if (subcat) {
			const liSubcat = document.createElement("li");
			liSubcat.className = "breadcrumb-item";
			const subcatLink = createBreadcrumbLink(`index.html?cat=${cat}&subcat=${subcat}`, subcatTitle);
			liSubcat.appendChild(subcatLink);
			ol.appendChild(liSubcat);
		}

		// Page courante (non cliquable)
		const liPage = document.createElement("li");
		liPage.className = "breadcrumb-item active";
		liPage.setAttribute("aria-current", "page");
		liPage.textContent = pageTitle;
		ol.appendChild(liPage);
	} catch (e) {
		console.warn("Erreur chargement articles.json pour breadcrumb", e);
		// En cas d'erreur, on génère quand même le fil basique sans titres lisibles
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
		const liPage = document.createElement("li");
		liPage.className = "breadcrumb-item active";
		liPage.setAttribute("aria-current", "page");
		liPage.textContent = page;
		ol.appendChild(liPage);
	}

	breadcrumbContainer.appendChild(ol);

	// Insertion en haut du contenu
	content.prepend(breadcrumbContainer);
}

function createBreadcrumbLink(href, textContent) {
	const link = document.createElement("a");
	link.href = href;
	link.textContent = textContent;
	link.className = "text-dark";
	return link;
}
