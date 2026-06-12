# M-Motors – Plateforme de demande d’achat / location de véhicules

## 📌 Présentation du projet

M-Motors est une application web complète permettant aux clients de consulter un catalogue de véhicules, de déposer une demande (achat ou location) et de soumettre les documents nécessaires. Les administrateurs et commerciaux peuvent gérer les dossiers, valider ou refuser les demandes avec un commentaire obligatoire en cas de refus.

Ce projet a été réalisé dans le cadre d’un bachelor en développement d'applications python. Il illustre la maîtrise d’une architecture full‑stack moderne.

## 🧱 Stack technique

| Composant         | Technologie                                    |
| ----------------- | ---------------------------------------------- |
| Frontend          | Next.js (App Router, TypeScript, Tailwind CSS) |
| Backend           | Django + Django REST Framework                 |
| Base de données   | PostgreSQL                                     |
| Authentification  | JWT (Simple JWT) + cookies httpOnly            |
| Stockage fichiers | Local (media/) ou S3 (préparé)                 |
| UI Components     | Shadcn/ui, Lucide icons, Embla Carousel        |

## ✨ Fonctionnalités principales

### Côté client (utilisateur non connecté / connecté)

- Catalogue de véhicules avec filtres (type, marque, modèle, prix) et pagination infinie.
- Fiche détaillée d’un véhicule (carrousel d’images).
- Création automatique d’un dossier lors du clic sur « Réserver ».
- Finalisation du dossier : saisie des informations personnelles (nom, téléphone, adresse) et upload des documents requis (identité, justificatif de domicile, etc.).
- Suivi de ses dossiers avec statut (en attente / validé / refusé) et affichage du motif de refus.
- Notifications visuelles (badges) en cas de changement de statut.

### Côté backoffice (admin / commercial)

- Gestion de tous les dossiers clients avec filtres (statut).
- Consultation détaillée d’un dossier (informations client, véhicule, documents).
- Validation ou refus d’un dossier (commentaire obligatoire pour le refus).
- CRUD complet des véhicules (ajout, modification, suppression, upload multiple d’images).

### Sécurité & persistance

- Middleware Next.js protégeant les routes privées (`/dashboard`, `/admin`, `/dossier`).
- Stockage des tokens JWT dans des cookies httpOnly (backend) + localStorage (frontend).
- Refresh token automatique (frontend + backend).
- Vérification des rôles (admin / commercial / user) via groupes Django.

## 🚀 Installation et lancement

### Prérequis

- Node.js 20+
- Python 3.13+
- PostgreSQL (ou SQLite pour développement)

### Backend (Django)

```bash
cd m-motors-backend
python -m venv venv
source venv/bin/activate   # ou venv\Scripts\activate sur Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```
