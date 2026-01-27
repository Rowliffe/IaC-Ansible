# Projet Final Ansible : Déploiement 3-Tiers

## Description
Ce projet déploie une application web complète composée de :
- 2 serveurs Frontend Nginx (Haute disponibilité simulée)
- 1 serveur Backend hébergeant une API Node.js et une base de données PostgreSQL.

## Architecture
- **Webservers (web1, web2)** : Nginx en reverse proxy.
- **Appserver (db1)** : Node.js API + PostgreSQL.

## Prérequis
- Ansible installé
- Conteneurs Docker cibles en cours d'exécution (ports SSH 2221, 2222, 2223).
- `sshpass` installé pour l'authentification par mot de passe.

## Installation

1. **Cloner le projet**
   ```bash
   git clone <url_repo>
   cd projet-ansible-final
   ```

2. **Chiffrer les secrets (si nécessaire)**
   Le fichier `group_vars/all/vault.yml` contient les secrets.
   Le mot de passe du vault est `ansible123`.

3. **Lancer le déploiement**
   ```bash
   ansible-playbook playbooks/site.yml
   ```

## Utilisation

- Accès Web1 : `http://localhost:2221`
- Accès Web2 : `http://localhost:2222`
- Accès API (direct) : Le port 3000 du conteneur db1 (si exposé).
- Accès API (via Nginx) : `http://localhost:2221/api/`

## Tests

Exécuter les tests automatisés :
```bash
ansible-playbook playbooks/tests.yml
```

## Auteur
Généré par votre Assistant IA.

