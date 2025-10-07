// menu.js

/**
 * Génère dynamiquement le menu Bootstrap à partir des données JSON.
 * Gère les catégories, sous-catégories, et articles.
 */
async function generateMenu() {
	const navUl = document.querySelector(".navbar-nav");
	if (!navUl) {
		console.warn("⚠️ Menu introuvable");
		return;
	}

	try {
		const basePath = getBasePath();
		const res = await fetch(`${basePath}data/articles.json`);
		const data = await res.json();

		navUl.innerHTML = ""; // Nettoyage du menu

		for (const [catKey, catValue] of Object.entries(data)) {
			const li = document.createElement("li");
			li.className = "nav-item dropdown";

			const toggle = document.createElement("a");
			toggle.className = "nav-link dropdown-toggle text-white";
			toggle.href = "#";
			toggle.id = `dropdown-${catKey}`;
			toggle.setAttribute("role", "button");
			toggle.setAttribute("data-bs-toggle", "dropdown");
			toggle.setAttribute("aria-expanded", "false");
			toggle.textContent = catValue.title || catKey;

			const dropdownMenu = document.createElement("ul");
			dropdownMenu.className = "dropdown-menu";
			dropdownMenu.setAttribute("aria-labelledby", toggle.id);

			if (catValue.subcategories) {
				// Sous-catégories
				for (const [subcatKey, subcatValue] of Object.entries(catValue.subcategories)) {
					// Titre de sous-catégorie
					const headerLi = document.createElement("li");
					const header = document.createElement("h6");
					header.className = "dropdown-header text-dark fw-bold pt-0 pb-1";
					header.textContent = subcatValue.title || subcatKey;
					headerLi.appendChild(header);
					dropdownMenu.appendChild(headerLi);

					// Articles de la sous-catégorie
					subcatValue.articles.forEach((article) => {
						const articleLi = document.createElement("li");
						const articleA = document.createElement("a");
						articleA.className = "dropdown-item small-text lh-1";
						articleA.href = buildArticleUrl(catKey, subcatKey, article.page);
						articleA.textContent = `${article.page} - ${article.title}`;
						articleLi.appendChild(articleA);
						dropdownMenu.appendChild(articleLi);
					});

					// Séparateur
					dropdownMenu.appendChild(document.createElement("li")).innerHTML = '<hr class="dropdown-divider" />';
				}

				// Supprimer le dernier séparateur
				dropdownMenu.removeChild(dropdownMenu.lastChild);
			} else if (catValue.articles) {
				// Catégorie directe sans sous-catégories
				catValue.articles.forEach((article) => {
					const articleLi = document.createElement("li");
					const articleA = document.createElement("a");
					articleA.className = "dropdown-item";
					articleA.href = buildArticleUrl(catKey, null, article.page);
					articleA.textContent = `${article.page} - ${article.title}`;
					articleLi.appendChild(articleA);
					dropdownMenu.appendChild(articleLi);
				});
			}

			li.appendChild(toggle);
			li.appendChild(dropdownMenu);
			navUl.appendChild(li);
		}
	} catch (e) {
		console.error("❌ Erreur chargement menu:", e);
	}
}
