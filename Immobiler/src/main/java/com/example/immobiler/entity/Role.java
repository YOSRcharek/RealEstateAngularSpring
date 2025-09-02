
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
                Permission.VIEW_STATS,
                Permission.UPDATE_AGENCE,
                Permission.READ_ZONE
        )),

        SUBSCRIBER(Set.of(
                Permission.CREATE_VISITE,
                Permission.READ_ANNONCE,
                Permission.READ_IMAGE,
                Permission.READ_ZONE,
                Permission.EVALUATE_ANNONCE,
                Permission.CREATE_RATING,
                Permission. MAKE_PAYEMENT,
                Permission.VIEW_STATS,
                Permission.UPDATE_USER
        )),

        USER(Set.of(
                Permission.READ_ANNONCE,
                Permission.READ_IMAGE,
                Permission.READ_ZONE,
                Permission.EVALUATE_ANNONCE,
                Permission.READ_RATING,
                Permission.CREATE_RATING,
                Permission.DELETE_RATING,
                Permission.CREATE_VISITE,
                Permission. MAKE_PAYEMENT,
                Permission.UPDATE_USER
        ));

        private final Set<Permission> permissions;

        Role(Set<Permission> permissions) {
            this.permissions = permissions;
        }

        public Set<Permission> getPermissions() {
            return permissions;
        }
    }
