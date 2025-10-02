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
			updatePageTitle({ cat, page: pageName, html });
		})
		.catch(() => {
			content.innerHTML = `<p>❌ Cette page n'existe pas.</p>`;
			document.title = "Page introuvable - NorelWeb";
		});
}

// Mise à jour du titre de la page selon contenu
function updatePageTitle({ cat, page, html }) {
	const siteName = "NorelWeb";

	// Page d'accueil
	if (page === "home" && !cat) {
		document.title = `Accueil - ${siteName}`;
		return;
	}

	// Extraire un titre depuis le <h1> du contenu
	const h1Match = html.match(/<h1[^>]*>(.*?)<\/h1>/i);
	const h1Text = h1Match ? h1Match[1].trim() : null;

	if (h1Text) {
		document.title = `${h1Text} - ${siteName}`;
	} else if (cat) {
		document.title = `${cat} / ${page} - ${siteName}`;
	} else {
		document.title = `${page} - ${siteName}`;
	}
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
