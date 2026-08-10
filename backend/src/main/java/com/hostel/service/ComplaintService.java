package com.hostel.service;

import com.hostel.dto.complaint.*;
import com.hostel.entity.*;
import com.hostel.enums.*;
import com.hostel.exception.ResourceNotFoundException;
import com.hostel.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final ComplaintCommentRepository commentRepository;
    private final ComplaintTimelineRepository timelineRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    /**
     * Student creates a new complaint — auto-routed to block warden.
     */
    @Transactional
    public ComplaintResponse createComplaint(ComplaintRequest request, User student) {
        ComplaintCategory category = ComplaintCategory.valueOf(request.getCategory().toUpperCase());
        ComplaintPriority priority = ComplaintPriority.valueOf(request.getPriority().toUpperCase());

        Complaint complaint = Complaint.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .category(category)
                .priority(priority)
                .status(ComplaintStatus.PENDING)
                .student(student)
                .hostelBlock(student.getHostelBlock())
                .roomNumber(request.getRoomNumber() != null ? request.getRoomNumber() : student.getRoomNumber())
                .floorNumber(request.getFloorNumber())
                .imageUrl(request.getImageUrl())
                .build();

        // Auto-assign warden from hostel block
        if (student.getHostelBlock() != null && student.getHostelBlock().getWarden() != null) {
            complaint.setAssignedWarden(student.getHostelBlock().getWarden());
        }

        complaint = complaintRepository.save(complaint);

        // Create initial timeline entry
        ComplaintTimeline timeline = ComplaintTimeline.builder()
                .complaint(complaint)
                .oldStatus(null)
                .newStatus(ComplaintStatus.PENDING)
                .note("Complaint created")
                .changedBy(student)
                .build();
        timelineRepository.save(timeline);

        // Notify assigned warden
        if (complaint.getAssignedWarden() != null) {
            notificationService.createNotification(
                    complaint.getAssignedWarden(),
                    "New Complaint: " + complaint.getTitle(),
                    student.getName() + " raised a " + category.name().toLowerCase() + " issue",
                    "NEW_COMPLAINT",
                    complaint.getId()
            );
        }

        return mapToResponse(complaint);
    }

    /** Get all complaints visible to the current user (role-scoped). */
    public List<ComplaintResponse> getComplaints(User user) {
        List<Complaint> complaints;

        switch (user.getRole()) {
            case STUDENT -> complaints = complaintRepository.findByStudentOrderByCreatedAtDesc(user);
            case WARDEN  -> complaints = complaintRepository.findByAssignedWardenOrderByCreatedAtDesc(user);
            case ADMIN   -> complaints = complaintRepository.findAll();
            default      -> complaints = List.of();
        }

        return complaints.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    /** Get a single complaint by id. */
    public ComplaintResponse getComplaint(Long id) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint", id));
        return mapToResponse(complaint);
    }

    /** Warden/Admin updates complaint status. */
    @Transactional
    public ComplaintResponse updateStatus(Long id, StatusUpdateRequest request, User changedBy) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint", id));

        ComplaintStatus oldStatus = complaint.getStatus();
        ComplaintStatus newStatus = ComplaintStatus.valueOf(request.getStatus().toUpperCase());

        complaint.setStatus(newStatus);
        complaintRepository.save(complaint);

        // Audit trail
        ComplaintTimeline timeline = ComplaintTimeline.builder()
                .complaint(complaint)
                .oldStatus(oldStatus)
                .newStatus(newStatus)
                .note(request.getNote())
                .changedBy(changedBy)
                .build();
        timelineRepository.save(timeline);

        // Notify student
        notificationService.createNotification(
                complaint.getStudent(),
                "Complaint Updated: " + complaint.getTitle(),
                "Status changed to " + newStatus.name().replace("_", " "),
                "COMPLAINT_UPDATE",
                complaint.getId()
        );

        return mapToResponse(complaint);
    }

    /** Add a comment to a complaint. */
    @Transactional
    public CommentDTO addComment(Long complaintId, String text, User author) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint", complaintId));

        ComplaintComment comment = ComplaintComment.builder()
                .complaint(complaint)
                .author(author)
                .text(text)
                .build();
        comment = commentRepository.save(comment);

        // Notify the other party
        User recipient = author.getRole() == Role.STUDENT
                ? complaint.getAssignedWarden()
                : complaint.getStudent();

        if (recipient != null) {
            notificationService.createNotification(
                    recipient,
                    "New Comment on: " + complaint.getTitle(),
                    author.getName() + ": " + text.substring(0, Math.min(text.length(), 80)),
                    "NEW_COMMENT",
                    complaint.getId()
            );
        }

        return CommentDTO.builder()
                .id(comment.getId())
                .text(comment.getText())
                .authorId(author.getId())
                .authorName(author.getName())
                .authorRole(author.getRole().name())
                .createdAt(comment.getCreatedAt())
                .build();
    }

    /** Escalate a complaint. */
    @Transactional
    public ComplaintResponse escalate(Long id, User escalatedBy) {
        StatusUpdateRequest request = StatusUpdateRequest.builder()
                .status("ESCALATED")
                .note("Escalated by " + escalatedBy.getName())
                .build();
        return updateStatus(id, request, escalatedBy);
    }

    /* ── Mapping helpers ── */

    private ComplaintResponse mapToResponse(Complaint c) {
        List<CommentDTO> comments = commentRepository.findByComplaintIdOrderByCreatedAtAsc(c.getId())
                .stream()
                .map(cm -> CommentDTO.builder()
                        .id(cm.getId())
                        .text(cm.getText())
                        .authorId(cm.getAuthor().getId())
                        .authorName(cm.getAuthor().getName())
                        .authorRole(cm.getAuthor().getRole().name())
                        .createdAt(cm.getCreatedAt())
                        .build())
                .collect(Collectors.toList());

        List<TimelineDTO> timeline = timelineRepository.findByComplaintIdOrderByCreatedAtAsc(c.getId())
                .stream()
                .map(t -> TimelineDTO.builder()
                        .id(t.getId())
                        .oldStatus(t.getOldStatus() != null ? t.getOldStatus().name() : null)
                        .newStatus(t.getNewStatus().name())
                        .note(t.getNote())
                        .changedByName(t.getChangedBy().getName())
                        .createdAt(t.getCreatedAt())
                        .build())
                .collect(Collectors.toList());

        return ComplaintResponse.builder()
                .id(c.getId())
                .title(c.getTitle())
                .description(c.getDescription())
                .category(c.getCategory().name())
                .priority(c.getPriority().name())
                .status(c.getStatus().name())
                .imageUrl(c.getImageUrl())
                .floorNumber(c.getFloorNumber())
                .roomNumber(c.getRoomNumber())
                .studentId(c.getStudent().getId())
                .studentName(c.getStudent().getName())
                .studentEmail(c.getStudent().getEmail())
                .hostelBlockId(c.getHostelBlock() != null ? c.getHostelBlock().getId() : null)
                .hostelBlockName(c.getHostelBlock() != null ? c.getHostelBlock().getName() : null)
                .assignedWardenId(c.getAssignedWarden() != null ? c.getAssignedWarden().getId() : null)
                .assignedWardenName(c.getAssignedWarden() != null ? c.getAssignedWarden().getName() : null)
                .comments(comments)
                .timeline(timeline)
                .createdAt(c.getCreatedAt())
                .updatedAt(c.getUpdatedAt())
                .build();
    }
}
