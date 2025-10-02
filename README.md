# Configuration Git locale pour un dépôt
### Initialiser un dépôt Git
```bash
git init
```

### Voir la configuration Git locale du dépôt

Lister toutes les configurations spécifiques à ce dépôt :

```bash
git config --local --list
```
Voir uniquement le nom d’utilisateur et l’email configurés pour ce dépôt :
```bash
git config user.name
git config user.email
```

### Modifier le nom d’utilisateur et l’email pour ce dépôt
Changer le nom d’utilisateur (sera affiché comme auteur des commits) :
```bash
git config user.name "norelien-28"
```
Changer l’email associé aux commits dans ce dépôt :
```bash
git config user.email "xxx@gmail.com"
```

### Vérifier l’URL distante (clé SSH utilisée pour push/pull)
```bash
git remote -v
```
Cela affiche l’URL du dépôt distant. Pour utiliser un alias SSH spécifique (clé SSH différente), il faut que cette URL contienne ton alias (ex : git@github.com-noreldev:...).

### Astuce
- Le nom et l’email définis localement dans un dépôt sont utilisés pour les commits.
- L’URL distante détermine la clé SSH utilisée pour l’authentification lors du push/pull.
- Pour associer tes commits à ton compte GitHub, l’email doit être enregistré dans ton profil GitHub.
 
---


# 🌐 Déployer un site avec GitHub Pages
GitHub Pages permet d’héberger gratuitement un site web statique directement depuis ton dépôt GitHub. Tu peux l’utiliser pour des fichiers HTML, CSS, JS, etc.

### ✅ Prérequis
- Avoir un fichier index.html à la racine du projet ou dans un dossier (comme /docs)
- Le projet doit être versionné sur Git et poussé sur GitHub

### Activer GitHub Page
1. Ouvre ton dépôt sur GitHub.
2. Va dans l’onglet "Settings" de ton dépôt.
3. Dans le menu à gauche, clique sur "Pages" (ou "Pages" dans "Code and automation").
4. Sous "Build and deployment" > "Source", choisis :
    - Branch : main (ou master)
    - Folder : choisis / (root) si tes fichiers sont à la racine du projet, ou /docs si tu les as mis dans un dossier docs/
5. Clique sur "Save"

### Accède à ton site
Après quelques secondes, GitHub va générer ton site à l’URL :
```php-template
https://<ton-utilisateur>.github.io/<nom-du-depot>/
```

Exemple :
```arduino
https://juliendupont.github.io/mon-site/
```


### 🔧 Astuce : URL propre sans /mon-depot/ à la fin

Si tu veux que ton site soit directement disponible à https://<ton-utilisateur>.github.io/, sans le nom du dépôt à la fin, tu dois :
- Créer un dépôt nommé <ton-utilisateur>.github.io
- Exemple : juliendupont.github.io

GitHub détecte automatiquement ce dépôt comme étant ton site personnel ou professionnel.