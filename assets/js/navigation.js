console.log("navigation.js");

async function generateArticleNavigation({ cat, subcat, page }) {
	if (!cat || !page) return;

	const navContainer = document.createElement("div");
	navContainer.className = "d-flex justify-content-between mt-4";

	try {
		const basePath = getBasePath();
		const res = await fetch(`${basePath}data/articles.json`);
		const data = await res.json();

		let articlesList = [];

		if (subcat && data[cat]?.subcategories?.[subcat]) {
			articlesList = data[cat].subcategories[subcat].articles;
		} else if (!subcat && data[cat]?.articles) {
			articlesList = data[cat].articles;
		}

		const currentIndex = articlesList.findIndex((a) => a.page === page);
		if (currentIndex === -1) return;

		// Lien précédent
		if (currentIndex > 0) {
			const prev = articlesList[currentIndex - 1];
			const prevLink = document.createElement("a");
			prevLink.href = buildArticleUrl(cat, subcat, prev.page);
			prevLink.className = "btn btn-outline-dark";
			prevLink.innerHTML = `← ${prev.title}`;
			navContainer.appendChild(prevLink);
		} else {
			navContainer.appendChild(document.createElement("div"));
		}

		// Lien suivant
		if (currentIndex < articlesList.length - 1) {
			const next = articlesList[currentIndex + 1];
			const nextLink = document.createElement("a");
			nextLink.href = buildArticleUrl(cat, subcat, next.page);
			nextLink.className = "btn btn-dark ms-auto";
			nextLink.innerHTML = `${next.title} →`;
			navContainer.appendChild(nextLink);
		}

		document.querySelector(CONTENT_SELECTOR).appendChild(navContainer);
	} catch (e) {
		console.warn("❌ Erreur navigation articles :", e);
	}
}

/**
 * Build the URL for an article from its category, subcategory, and page
 *
 * @param {string} cat - The category of the article
 * @param {string|null} subcat - The subcategory of the article (optional)
 * @param {string} page - The page of the article
 * @returns {string} The built URL
 */
function buildArticleUrl(cat, subcat, page) {
	let url = `index.html?cat=${cat}`;
	if (subcat) url += `&subcat=${subcat}`;
	url += `&page=${page}`;
	return url;
}
