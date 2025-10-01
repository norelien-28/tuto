# Configuration Git locale pour un dépôt
## Initialiser un dépôt Git
```bash
git init
```

## Voir la configuration Git locale du dépôt

Lister toutes les configurations spécifiques à ce dépôt :

```bash
git config --local --list
```
Voir uniquement le nom d’utilisateur et l’email configurés pour ce dépôt :
```bash
git config user.name
git config user.email
```

## Modifier le nom d’utilisateur et l’email pour ce dépôt
Changer le nom d’utilisateur (sera affiché comme auteur des commits) :
```bash
git config user.name "norelien-28"
```
Changer l’email associé aux commits dans ce dépôt :
```bash
git config user.email "xxx@gmail.com"
```

## Vérifier l’URL distante (clé SSH utilisée pour push/pull)
```bash
git remote -v
```
Cela affiche l’URL du dépôt distant. Pour utiliser un alias SSH spécifique (clé SSH différente), il faut que cette URL contienne ton alias (ex : git@github.com-noreldev:...).

## Astuce
- Le nom et l’email définis localement dans un dépôt sont utilisés pour les commits.
- L’URL distante détermine la clé SSH utilisée pour l’authentification lors du push/pull.
- Pour associer tes commits à ton compte GitHub, l’email doit être enregistré dans ton profil GitHub.