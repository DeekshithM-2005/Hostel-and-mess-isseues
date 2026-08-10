package com.hostel.repository;

import com.hostel.entity.Complaint;
import com.hostel.entity.User;
import com.hostel.enums.ComplaintCategory;
import com.hostel.enums.ComplaintStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Long> {

    /** Student's own complaints. */
    List<Complaint> findByStudentOrderByCreatedAtDesc(User student);

    /** Warden's assigned complaints. */
    List<Complaint> findByAssignedWardenOrderByCreatedAtDesc(User warden);

    /** Filter by status (admin / warden views). */
    List<Complaint> findByStatusOrderByCreatedAtDesc(ComplaintStatus status);

    /** Filter by category. */
    List<Complaint> findByCategoryOrderByCreatedAtDesc(ComplaintCategory category);

    /** Count by status — for analytics. */
    long countByStatus(ComplaintStatus status);

    /** Count by category — for analytics. */
    long countByCategory(ComplaintCategory category);

    /** Warden's complaints filtered by status. */
    List<Complaint> findByAssignedWardenAndStatusOrderByCreatedAtDesc(User warden, ComplaintStatus status);

    /** Average resolution time (resolved complaints only). */
    @Query("SELECT AVG(TIMESTAMPDIFF(HOUR, c.createdAt, c.updatedAt)) FROM Complaint c WHERE c.status = 'RESOLVED'")
    Double findAverageResolutionTimeHours();
}
