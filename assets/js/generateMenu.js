async function generateMenu() {
	const navUl = document.querySelector(".navbar-nav");
	if (!navUl) {
		console.warn("⚠️ Menu introuvable");
		return;
	}

	try {
		const res = await fetch("../../data/articles.json");
		const data = await res.json();

		navUl.innerHTML = ""; // reset menu

		for (const [catKey, catValue] of Object.entries(data)) {
			const li = document.createElement("li");
			li.className = "nav-item dropdown";

			const a = document.createElement("a");
			a.className = "nav-link dropdown-toggle";
			a.href = "#";
			a.id = `dropdown-${catKey}`;
			a.setAttribute("role", "button");
			a.setAttribute("data-bs-toggle", "dropdown");
			a.setAttribute("aria-expanded", "false");
			a.textContent = catValue.title || catKey;

			const ul = document.createElement("ul");
			ul.className = "dropdown-menu";
			ul.setAttribute("aria-labelledby", a.id);

			// 2 cas : sous-catégories ou articles directs
			if (catValue.subcategories) {
				for (const [subcatKey, subcatValue] of Object.entries(catValue.subcategories)) {
					// Header sous-catégorie
					const headerLi = document.createElement("li");
					const header = document.createElement("h6");
					header.className = "dropdown-header text-dark fw-bold";
					header.textContent = subcatValue.title || subcatKey;
					headerLi.appendChild(header);
					ul.appendChild(headerLi);

					// Articles sous sous-catégorie
					subcatValue.articles.forEach((article) => {
						const articleLi = document.createElement("li");
						const articleA = document.createElement("a");
						articleA.className = "dropdown-item";
						articleA.href = `index.html?cat=${catKey}&subcat=${subcatKey}&page=${article.page}`;
						articleA.textContent = `${article.page} - ${article.title}`;
						articleLi.appendChild(articleA);
						ul.appendChild(articleLi);
					});

					// Séparateur entre sous-catégories
					ul.appendChild(document.createElement("li")).innerHTML = '<hr class="dropdown-divider" />';
				}
				// Retirer le dernier séparateur
				ul.removeChild(ul.lastChild);
			} else if (catValue.articles) {
				catValue.articles.forEach((article) => {
					const articleLi = document.createElement("li");
					const articleA = document.createElement("a");
					articleA.className = "dropdown-item";
					articleA.href = `index.html?cat=${catKey}&page=${article.page}`;
					articleA.textContent = `${article.page} - ${article.title}`;
					articleLi.appendChild(articleA);
					ul.appendChild(articleLi);
				});
			}

			li.appendChild(a);
			li.appendChild(ul);
			navUl.appendChild(li);
		}
	} catch (e) {
		console.error("Erreur chargement menu:", e);
	}
}
