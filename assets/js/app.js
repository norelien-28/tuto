// Charger le header et footer
fetch("includes/header.html")
	.then((r) => r.text())
	.then((html) => (header.innerHTML = html));
fetch("includes/footer.html")
	.then((r) => r.text())
	.then((html) => (footer.innerHTML = html));

// gestion des pages à partir des paramètres categorie et page
const params = new URLSearchParams(window.location.search);
const cat = params.get("cat");
const page = params.get("page");

let path = "";

// Récupérer la racine du repo (ex: "/tuto/")
const basePath = window.location.pathname.replace(/\/[^\/]*$/, "/");

if (!page) {
	document.getElementById("content").innerHTML = `
					<h1>Bienvenue !</h1>
					<p>Choisissez une catégorie d'astuces ci-dessus.</p>
				`;
} else {
	if (cat) {
		path = `${basePath}content/articles/${cat}/${page}.html`;
	} else {
		path = `${basePath}content/${page}.html`;
	}

	fetch(path)
		.then((r) => {
			if (!r.ok) throw new Error("Page introuvable");
			return r.text();
		})
		.then((html) => (content.innerHTML = html))
		.catch(() => (content.innerHTML = `<p>❌ Cette page n'existe pas.</p>`));
}
