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
