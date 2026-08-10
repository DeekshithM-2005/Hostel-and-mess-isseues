package com.hostel.repository;

import com.hostel.entity.ComplaintTimeline;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComplaintTimelineRepository extends JpaRepository<ComplaintTimeline, Long> {

    List<ComplaintTimeline> findByComplaintIdOrderByCreatedAtAsc(Long complaintId);
}
