// --------------------------
// Rendu principal
// --------------------------

document.addEventListener("DOMContentLoaded", () => {
	loadLayout();
	loadPageContent();
});

// --------------------------
// Chargement header/footer
// --------------------------

function loadLayout() {
	loadPartial("includes/header.html", document.getElementById("header"));
	loadPartial("includes/footer.html", document.getElementById("footer"));
}

function loadPartial(url, targetElement) {
	fetch(url)
		.then((r) => r.text())
		.then((html) => (targetElement.innerHTML = html))
		.catch(() => {
			console.warn(`❌ Échec du chargement de : ${url}`);
		});
}

// --------------------------
// Chargement du contenu principal
// --------------------------

function loadPageContent() {
	const { cat, page } = getUrlParams();
	const content = document.getElementById("content");
	const basePath = getBasePath();
	const pageName = page || "home";

	const path = cat ? `${basePath}content/articles/${cat}/${pageName}.html` : `${basePath}content/${pageName}.html`;

	fetch(path)
		.then((r) => {
			if (!r.ok) throw new Error("Page introuvable");
			return r.text();
		})
		.then((html) => {
			content.innerHTML = html;
		})
		.catch(() => {
			content.innerHTML = `<p>❌ Cette page n'existe pas.</p>`;
		});
}

// --------------------------
// Helpers
// --------------------------

function getUrlParams() {
	const params = new URLSearchParams(window.location.search);
	return {
		cat: params.get("cat"),
		page: params.get("page"),
	};
}

function getBasePath() {
	return window.location.pathname.replace(/\/[^\/]*$/, "/");
}
