# Test du Vault Ansible 🔐

## Configuration effectuée

### 1. Variable ajoutée dans le vault
Dans `group_vars/all/vault.yml`, j'ai ajouté :
```yaml
vault_test_message: "🔐 Message secret du Vault : Si vous voyez ce texte, le vault fonctionne correctement !"
```

### 2. Affichage sur index.html
La page `index.html` sur **Web1** affiche maintenant cette variable secrète du vault.

## Comment tester

### Étape 1 : Chiffrer le vault (optionnel mais recommandé)
```bash
cd projet-ansible-final
ansible-vault encrypt group_vars/all/vault.yml
# Mot de passe suggéré : ansible123
```

### Étape 2 : Déployer avec le playbook
Si le vault est chiffré :
```bash
ansible-playbook -i inventory/hosts playbooks/site.yml --ask-vault-pass
```

Si le vault n'est pas chiffré :
```bash
ansible-playbook -i inventory/hosts playbooks/site.yml
```

### Étape 3 : Vérifier le résultat
Ouvrez votre navigateur sur :
- **Web1** : http://localhost:8081
- Vous devriez voir le message du vault affiché dans un encadré vert

### Étape 4 : Vérifier que Web2 est différent
- **Web2** : http://localhost:8082
- Cette page affiche le Backend Dashboard (backend.html) et ne contient PAS le message du vault

## Commandes utiles pour le vault

### Chiffrer le vault
```bash
ansible-vault encrypt group_vars/all/vault.yml
```

### Déchiffrer le vault
```bash
ansible-vault decrypt group_vars/all/vault.yml
```

### Éditer le vault chiffré
```bash
ansible-vault edit group_vars/all/vault.yml
```

### Voir le contenu du vault chiffré
```bash
ansible-vault view group_vars/all/vault.yml
```

### Créer un fichier de mot de passe (pour automatisation)
```bash
echo "ansible123" > .vault_pass
chmod 600 .vault_pass
```

Puis utiliser :
```bash
ansible-playbook -i inventory/hosts playbooks/site.yml --vault-password-file .vault_pass
```

⚠️ **Important** : N'oubliez pas d'ajouter `.vault_pass` dans votre `.gitignore` !

## Résultat attendu

Sur **localhost:8081** vous devriez voir une page web1 moderne avec :
- Un titre "🎉 Bienvenue sur Web1"
- Un badge "Frontend Server"
- Un encadré vert contenant le message secret du vault

Cela prouve que :
1. ✅ Le vault est correctement chargé
2. ✅ Les variables sont interpolées dans les templates
3. ✅ La séparation web1/web2 fonctionne

