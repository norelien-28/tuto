// assets/js/articles-list.js

async function loadArticleList() {
	const container = document.querySelector("#article-list");
	if (!container) return;
	try {
		const basePath = getBasePath();
		const res = await fetch(`${basePath}data/articles.json`);
		const data = await res.json();

		container.innerHTML = "";

		for (const [catKey, category] of Object.entries(data)) {
			const catTitle = category.title || catKey;
			const catSection = document.createElement("div");
			catSection.classList.add("col-12");

			let html = `<h2 class="h4">${catTitle}</h2>`;

			if (category.subcategories) {
				for (const [subKey, sub] of Object.entries(category.subcategories)) {
					html += `<h3 class="h6 mt-2">${sub.title || subKey}</h3><ul>`;
					sub.articles.forEach((article) => {
						const url = `index.html?cat=${catKey}&subcat=${subKey}&page=${article.page}`;
						html += `<li><a href="${url}">${article.title}</a></li>`;
					});
					html += `</ul>`;
				}
			} else if (category.articles) {
				html += `<ul>`;
				category.articles.forEach((article) => {
					const url = `index.html?cat=${catKey}&page=${article.page}`;
					html += `<li><a href="${url}">${article.title}</a></li>`;
				});
				html += `</ul>`;
			}

			catSection.innerHTML = html;
			container.appendChild(catSection);
		}
	} catch (err) {
		container.innerHTML = `<p class="text-danger">Erreur de chargement des articles.</p>`;
		console.error("❌ Erreur JSON :", err);
	}
}
