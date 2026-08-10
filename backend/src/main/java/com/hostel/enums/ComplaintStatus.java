package com.hostel.enums;

/**
 * Complaint lifecycle status pipeline:
 * PENDING → IN_REVIEW → IN_PROGRESS → RESOLVED
 *                     ↘ ESCALATED
 */
public enum ComplaintStatus {
    PENDING,
    IN_REVIEW,
    IN_PROGRESS,
    RESOLVED,
    ESCALATED
}
