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
			catSection.classList.add("col-12", "mb-4", "p-3", "border-start", "border-4", "border-success");

			let html = `<h2 class="text-success fw-bold fs-4 border-bottom pb-1 mb-3 border-1">${catTitle}</h2>`;

			if (category.subcategories) {
				for (const [subKey, sub] of Object.entries(category.subcategories)) {
					html += `<div class="card border-0 mb-3">`;
					html += `  <div class="card-body p-1">`;
					html += `    <h3 class="h6 mb-2 text-success">${sub.title || subKey}</h3>`;
					html += `    <ul class="list-unstyled ps-3 mb-0">`;
					sub.articles.forEach((article) => {
						const url = `index.html?cat=${catKey}&subcat=${subKey}&page=${article.page}`;
						html += `<li><a href="${url}" class="text-dark link-underline link-underline-opacity-0 position-relative ps-4 d-inline-block">${article.title}</a></li>`;
					});
					html += `    </ul>`;
					html += `  </div>`;
					html += `</div>`;
				}
			} else if (category.articles) {
				html += `<ul class="list-unstyled ps-3">`;
				category.articles.forEach((article) => {
					const url = `index.html?cat=${catKey}&page=${article.page}`;
					html += `<li><a href="${url}" class="text-dark link-underline link-underline-opacity-0 position-relative ps-4 d-inline-block">${article.title}</a></li>`;
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
