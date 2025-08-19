
    package com.example.immobiler.entity;

import java.util.Set;

    public enum Role {
        ADMIN(Set.of(Permission.values())), // ADMIN peut tout
        AGENCY(Set.of(
                Permission.CREATE_ANNONCE,
                Permission.READ_ANNONCE,
                Permission.UPDATE_ANNONCE,
                Permission.DELETE_ANNONCE,
                Permission.READ_VISITE,
                Permission.CREATE_VISITE,
                Permission.READ_RATING,
                Permission.CREATE_RATING,
                Permission.DELETE_RATING,
                Permission.READ_IMAGE,
                Permission.CREATE_IMAGE,
                Permission.DELETE_IMAGE,
                Permission.VIEW_STATS
        )),

        SUBSCRIBER(Set.of(
                Permission.READ_ANNONCE,
                Permission.EVALUATE_ANNONCE,
                Permission.VIEW_STATS // accès à statistiques avancées
        )),

        USER(Set.of(
                Permission.READ_ANNONCE,
                Permission.EVALUATE_ANNONCE // une seule évaluation par annonce (on gère ça côté service)
        ));

        private final Set<Permission> permissions;

        Role(Set<Permission> permissions) {
            this.permissions = permissions;
        }

        public Set<Permission> getPermissions() {
            return permissions;
        }
    }
