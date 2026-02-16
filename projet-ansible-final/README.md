# Projet Final Ansible : Déploiement Application Web 3-Tiers

## Description

Ce projet déploie une application web complète en architecture 3-tiers avec Ansible :
- **Frontend** : 2 serveurs Nginx (haute disponibilité simulée)
- **Backend** : API Node.js/Express
- **Base de données** : PostgreSQL

## Architecture

L'application est déployée sur 3 conteneurs Docker :
- **web1** (port SSH 2221) : Serveur Nginx frontend
- **web2** (port SSH 2222) : Serveur Nginx frontend (HA)
- **db1** (port SSH 2223) : API Node.js + PostgreSQL

Les serveurs web Nginx font office de reverse proxy vers l'API backend (`/api/` → `http://db1:3000/`).

## Prérequis

- Ansible installé sur la machine de contrôle
- Docker et Docker Compose installés
- `sshpass` installé pour l'authentification SSH par mot de passe :
  - macOS : `brew install sshpass`
  - Debian/Ubuntu : `sudo apt-get install -y sshpass`
- Les conteneurs doivent être démarrés via `docker-compose up -d`

## Installation

### 1. Cloner le projet
```bash
git clone https://github.com/Rowliffe/IaC-Ansible
cd IaC-Ansible/projet-ansible-final
```

### 2. Démarrer les conteneurs
```bash
docker-compose up -d
```

### 3. Vérifier la syntaxe du playbook
```bash
ansible-playbook playbooks/site.yml --syntax-check
```

### 4. Déployer l'application
```bash
ansible-playbook playbooks/site.yml
```
### 4. Déployer l'application avec un mot de passe

```bash
ansible-playbook playbooks/site.yml --ask-vault-pass
```

Le mot de passe du vault est : `ansible123`

### 5. Vérifier l'idempotence (aucun changement à la 2ème exécution)
```bash
ansible-playbook playbooks/site.yml
```

## Utilisation

### Accès au frontend
- Web1 : `http://localhost:8081/` depuis le conteneur web1
- Web2 : `http://localhost:8082/` depuis le conteneur web2

### Accès à l'API
- Via Nginx (recommandé) : `http://localhost:8082/GET/api` depuis web2

## Tests

### Playbook de Tests Automatisés

Le projet inclut un playbook de tests complet (`playbooks/tests.yml`) qui valide le déploiement :

**Contenu du playbook de tests :**
- ✅ Vérification de l'accessibilité des pages web Nginx
- ✅ Test des endpoints API (/ et /users)
- ✅ Vérification que les processus sont actifs (Nginx, PostgreSQL, Node.js)
- ✅ Rapport détaillé des résultats pour chaque serveur


**Exécution des tests :**

```bash
# Vérifier la syntaxe du playbook de tests
ansible-playbook playbooks/tests.yml --syntax-check

# Lancer tous les tests
ansible-playbook playbooks/tests.yml
```

Le playbook affiche un rapport visuel avec ✅ (succès) ou ❌ (échec) pour chaque test.


## Validation et Qualité du Code

### Ansible Lint

Ansible Lint permet de vérifier la qualité et les bonnes pratiques de vos playbooks et rôles.

**Commandes de vérification :**

```bash
# Linter tous les playbooks
ansible-lint playbooks/site.yml
ansible-lint playbooks/tests.yml
```

### Vérification de la Syntaxe

**Vérifier la syntaxe des playbooks :**
```bash
# Playbook principal
ansible-playbook playbooks/site.yml --syntax-check

# Playbook de tests
ansible-playbook playbooks/tests.yml --syntax-check
```

**Mode dry-run (simulation sans modification) :**
```bash
ansible-playbook playbooks/site.yml --check
```

si vous avez des problèmes avec des fichier Zone.Identifier faite cette commande : 

```bash
Get-ChildItem -Path . -Recurse -Filter "*Zone.Identifier" | Remove-Item -Force
```

## Structure du Projet

```
projet-ansible-final/
├── README.md
├── ansible.cfg
├── inventory/
│   └── hosts
├── group_vars/
│   └── all/
│       ├── vars.yml          # Variables non sensibles
│       └── vault.yml         # Secrets chiffrés
├── playbooks/
│   ├── site.yml              # Playbook principal
│   └── tests.yml             # Tests automatisés
└── roles/
    ├── common/               # Configuration de base
    ├── nginx/                # Frontend web
    ├── postgresql/           # Base de données
    └── nodejs/               # Backend API
```

## Gestion des Secrets

Les informations sensibles (mots de passe PostgreSQL) sont stockées dans `group_vars/all/vault.yml` et chiffrées avec Ansible Vault.

**Mot de passe du vault** : (NE pas oublier de créer un fichier .vault_pass ) `ansible123`

Pour encrypter le contenu :
```bash
cd IaC-Ansible/projet-ansible-final
ansible-vault encrypt group_vars/all/vault.yml
```
Pour décrypter le contenu :
```bash
cd IaC-Ansible/projet-ansible-final/group_vars/all
ansible-vault decrypt vault.yml
```
Pour regarder le contenu dans le modifier (il faut que le contenu sois d'abord crypter) :
```bash
cd IaC-Ansible/projet-ansible-final/group_vars/all
ansible-vault view vault.yml
```

Pour modifier les secrets :
```bash
ansible-vault edit group_vars/all/vault.yml
```

