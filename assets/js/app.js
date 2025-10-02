// Charger le header et footer
fetch("includes/header.html")
	.then((r) => r.text())
	.then((html) => (header.innerHTML = html));
fetch("includes/footer.html")
	.then((r) => r.text())
	.then((html) => (footer.innerHTML = html));

// gestion des pages à partir des paramètres categorie et page
const params = new URLSearchParams(window.location.search);
let cat = params.get("cat");
let page = params.get("page");

let path = "";

// Récupérer la racine du repo (ex: "/tuto/")
const basePath = window.location.pathname.replace(/\/[^\/]*$/, "/");

// Si aucune page spécifiée, on charge "home.html" par défaut
if (!page) {
	page = "home";
}

// Construction du chemin selon cat/page
if (cat) {
	path = `${basePath}content/articles/${cat}/${page}.html`;
} else {
	path = `${basePath}content/${page}.html`;
}

// Chargement de la page
fetch(path)
	.then((r) => {
		if (!r.ok) throw new Error("Page introuvable");
		return r.text();
	})
	.then((html) => (content.innerHTML = html))
	.catch(() => {
		content.innerHTML = `<p>❌ Cette page n'existe pas.</p>`;
	});
