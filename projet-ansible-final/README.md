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
git clone <url_repo>
cd projet-ansible-final
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

Le mot de passe du vault est : `ansible123`

### 5. Vérifier l'idempotence (aucun changement à la 2ème exécution)
```bash
ansible-playbook playbooks/site.yml
```

## Utilisation

### Accès au frontend
- Web1 : `http://localhost` depuis le conteneur web1
- Web2 : `http://localhost` depuis le conteneur web2

### Accès à l'API
- Via Nginx (recommandé) : `http://localhost/api/` depuis web1 ou web2
- Direct depuis db1 : `http://localhost:3000/`

### Endpoints API disponibles
- `GET /` : Message de bienvenue
- `GET /users` : Liste des utilisateurs depuis PostgreSQL

## Tests

### Tests automatisés
```bash
ansible-playbook playbooks/tests.yml
```

### Tests manuels

**Test 1 : Vérifier que les pages web sont accessibles**
```bash
ansible webservers -m uri -a "url=http://localhost status_code=200"
```

**Test 2 : Vérifier que l'API répond**
```bash
ansible appservers -m uri -a "url=http://localhost:3000/ status_code=200"
ansible appservers -m uri -a "url=http://localhost:3000/users status_code=200"
```

**Test 3 : Vérifier que les processus sont actifs**
```bash
ansible webservers -m shell -a "pgrep -x nginx >/dev/null"
ansible appservers -m shell -a "pgrep -fa postgres >/dev/null"
ansible appservers -m shell -a "pgrep -f 'node.*app.js'"
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

**Mot de passe du vault** : `ansible123`

Pour modifier les secrets :
```bash
ansible-vault edit group_vars/all/vault.yml
```

## Auteur

[Votre Nom]

## Ressources

- [Documentation Ansible](https://docs.ansible.com/)
- [Ansible Galaxy](https://galaxy.ansible.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Express.js Documentation](https://expressjs.com/)
- [Nginx Documentation](https://nginx.org/en/docs/)
