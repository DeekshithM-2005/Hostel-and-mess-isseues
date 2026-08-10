package com.hostel.enums;

/**
 * User roles for role-based access control.
 *
 * STUDENT  — raise complaints, rate meals, view menu
 * WARDEN   — manage complaints for assigned hostel block
 * ADMIN    — full system access, analytics, warden assignment
 */
public enum Role {
    STUDENT,
    WARDEN,
    ADMIN
}
