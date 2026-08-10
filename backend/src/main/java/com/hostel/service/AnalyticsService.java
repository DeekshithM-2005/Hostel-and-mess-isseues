package com.hostel.service;

import com.hostel.enums.ComplaintCategory;
import com.hostel.enums.ComplaintStatus;
import com.hostel.repository.ComplaintRepository;
import com.hostel.repository.MealRatingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final ComplaintRepository complaintRepository;
    private final MealRatingRepository ratingRepository;

    /** Complaint count by status. */
    public Map<String, Long> getComplaintsByStatus() {
        Map<String, Long> result = new LinkedHashMap<>();
        for (ComplaintStatus status : ComplaintStatus.values()) {
            result.put(status.name(), complaintRepository.countByStatus(status));
        }
        return result;
    }

    /** Complaint count by category. */
    public Map<String, Long> getComplaintsByCategory() {
        Map<String, Long> result = new LinkedHashMap<>();
        for (ComplaintCategory cat : ComplaintCategory.values()) {
            result.put(cat.name(), complaintRepository.countByCategory(cat));
        }
        return result;
    }

    /** Dashboard summary KPIs. */
    public Map<String, Object> getDashboardSummary() {
        Map<String, Object> summary = new LinkedHashMap<>();
        summary.put("totalComplaints", complaintRepository.count());
        summary.put("pendingComplaints", complaintRepository.countByStatus(ComplaintStatus.PENDING));
        summary.put("resolvedComplaints", complaintRepository.countByStatus(ComplaintStatus.RESOLVED));
        summary.put("escalatedComplaints", complaintRepository.countByStatus(ComplaintStatus.ESCALATED));

        // Average resolution time
        Double avgHours = complaintRepository.findAverageResolutionTimeHours();
        summary.put("avgResolutionHours", avgHours != null ? Math.round(avgHours * 10.0) / 10.0 : 0);

        // Mess satisfaction
        List<Object[]> ratings = ratingRepository.findAverageRatingByMealType();
        double overallAvg = ratings.stream()
                .mapToDouble(r -> (Double) r[1])
                .average().orElse(0);
        summary.put("overallMessRating", Math.round(overallAvg * 10.0) / 10.0);

        return summary;
    }

    /** Daily mess rating trend (last 30 days). */
    public List<Map<String, Object>> getMessTrend() {
        LocalDate from = LocalDate.now().minusDays(30);
        return ratingRepository.findDailyAverageRatings(from).stream()
                .map(row -> Map.<String, Object>of(
                        "date", row[0].toString(),
                        "rating", Math.round((Double) row[1] * 10.0) / 10.0
                ))
                .collect(java.util.stream.Collectors.toList());
    }
}
