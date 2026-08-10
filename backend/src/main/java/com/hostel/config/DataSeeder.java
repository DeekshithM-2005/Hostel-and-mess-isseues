package com.hostel.config;

import com.hostel.entity.*;
import com.hostel.enums.*;
import com.hostel.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Seeds the database with demo data on startup.
 * Creates hostel blocks, users (admin/wardens/students), mess menu,
 * sample complaints, ratings, and notifications.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final HostelBlockRepository hostelBlockRepository;
    private final ComplaintRepository complaintRepository;
    private final ComplaintTimelineRepository timelineRepository;
    private final ComplaintCommentRepository commentRepository;
    private final MessMenuRepository menuRepository;
    private final MealRatingRepository ratingRepository;
    private final NotificationRepository notificationRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Database already seeded — skipping.");
            return;
        }

        log.info("Seeding demo data...");

        // ── 1. Hostel Blocks ──
        HostelBlock kaveri = hostelBlockRepository.save(
                HostelBlock.builder().name("Kaveri").totalFloors(4).build());
        HostelBlock godavari = hostelBlockRepository.save(
                HostelBlock.builder().name("Godavari").totalFloors(3).build());
        HostelBlock narmada = hostelBlockRepository.save(
                HostelBlock.builder().name("Narmada").totalFloors(5).build());

        // ── 2. Admin ──
        User admin = userRepository.save(User.builder()
                .name("Dr. Raghav Sharma")
                .email("admin@college.edu")
                .password(passwordEncoder.encode("admin123"))
                .role(Role.ADMIN)
                .phone("9876543210")
                .build());

        // ── 3. Wardens ──
        User warden1 = userRepository.save(User.builder()
                .name("Prof. Anita Desai")
                .email("anita.warden@college.edu")
                .password(passwordEncoder.encode("warden123"))
                .role(Role.WARDEN)
                .phone("9876543211")
                .build());
        kaveri.setWarden(warden1);
        hostelBlockRepository.save(kaveri);

        User warden2 = userRepository.save(User.builder()
                .name("Prof. Vikram Iyer")
                .email("vikram.warden@college.edu")
                .password(passwordEncoder.encode("warden123"))
                .role(Role.WARDEN)
                .phone("9876543212")
                .build());
        godavari.setWarden(warden2);
        hostelBlockRepository.save(godavari);

        User warden3 = userRepository.save(User.builder()
                .name("Prof. Meera Nair")
                .email("meera.warden@college.edu")
                .password(passwordEncoder.encode("warden123"))
                .role(Role.WARDEN)
                .phone("9876543213")
                .build());
        narmada.setWarden(warden3);
        hostelBlockRepository.save(narmada);

        // ── 4. Students ──
        User s1 = userRepository.save(User.builder()
                .name("Aarav Patel").email("aarav@student.edu")
                .password(passwordEncoder.encode("student123"))
                .role(Role.STUDENT).hostelBlock(kaveri).roomNumber("K-201").phone("9000000001").build());
        User s2 = userRepository.save(User.builder()
                .name("Diya Gupta").email("diya@student.edu")
                .password(passwordEncoder.encode("student123"))
                .role(Role.STUDENT).hostelBlock(kaveri).roomNumber("K-305").phone("9000000002").build());
        User s3 = userRepository.save(User.builder()
                .name("Rohan Mehta").email("rohan@student.edu")
                .password(passwordEncoder.encode("student123"))
                .role(Role.STUDENT).hostelBlock(godavari).roomNumber("G-102").phone("9000000003").build());
        User s4 = userRepository.save(User.builder()
                .name("Priya Reddy").email("priya@student.edu")
                .password(passwordEncoder.encode("student123"))
                .role(Role.STUDENT).hostelBlock(godavari).roomNumber("G-210").phone("9000000004").build());
        User s5 = userRepository.save(User.builder()
                .name("Kabir Singh").email("kabir@student.edu")
                .password(passwordEncoder.encode("student123"))
                .role(Role.STUDENT).hostelBlock(narmada).roomNumber("N-401").phone("9000000005").build());
        User s6 = userRepository.save(User.builder()
                .name("Ananya Joshi").email("ananya@student.edu")
                .password(passwordEncoder.encode("student123"))
                .role(Role.STUDENT).hostelBlock(narmada).roomNumber("N-503").phone("9000000006").build());

        // ── 5. Mess Menu (7 days) ──
        seedMenu("MONDAY",    "Idli, Sambar, Coffee",              "Rice, Dal, Paneer Butter Masala, Roti, Salad",  "Chapati, Mixed Veg, Kheer");
        seedMenu("TUESDAY",   "Poha, Boiled Eggs, Tea",            "Rice, Rajma, Aloo Gobi, Roti, Curd",           "Paratha, Chole, Gulab Jamun");
        seedMenu("WEDNESDAY", "Upma, Vada, Chutney, Coffee",       "Rice, Sambar, Bhindi Fry, Roti, Pickle",       "Fried Rice, Manchurian, Ice Cream");
        seedMenu("THURSDAY",  "Dosa, Coconut Chutney, Milk",       "Biryani, Raita, Papad, Salad",                 "Roti, Dal Makhani, Rasmalai");
        seedMenu("FRIDAY",    "Paratha, Butter, Curd, Juice",      "Rice, Kadhi, Aloo Matar, Roti, Buttermilk",    "Puri, Chana Masala, Halwa");
        seedMenu("SATURDAY",  "Chole Bhature, Lassi",              "Rice, Lemon Dal, Baingan Bharta, Roti, Salad", "Chapati, Palak Paneer, Fruit Custard");
        seedMenu("SUNDAY",    "Bread, Omelette, Butter, Cornflakes","Special Thali: Rice, 2 Sabzi, Dal, Sweet, Roti","Noodles, Spring Rolls, Brownie");

        // ── 6. Sample Complaints ──
        Complaint c1 = createComplaint("Broken ceiling fan", "The fan in my room has stopped working completely. Makes a grinding noise when turned on.",
                ComplaintCategory.ELECTRICAL, ComplaintPriority.HIGH, ComplaintStatus.IN_PROGRESS,
                s1, kaveri, warden1, "K-201", 2);
        Complaint c2 = createComplaint("Leaking tap in bathroom", "The tap in the shared bathroom on 3rd floor has been leaking for 2 days.",
                ComplaintCategory.PLUMBING, ComplaintPriority.MEDIUM, ComplaintStatus.PENDING,
                s2, kaveri, warden1, "K-305", 3);
        Complaint c3 = createComplaint("WiFi not working", "WiFi signal is very weak on 1st floor. Cannot attend online classes.",
                ComplaintCategory.WIFI, ComplaintPriority.URGENT, ComplaintStatus.ESCALATED,
                s3, godavari, warden2, "G-102", 1);
        Complaint c4 = createComplaint("Broken chair", "One of the study chairs in my room is broken. Leg is cracked.",
                ComplaintCategory.FURNITURE, ComplaintPriority.LOW, ComplaintStatus.RESOLVED,
                s4, godavari, warden2, "G-210", 2);
        Complaint c5 = createComplaint("Dirty common area", "The common room on 4th floor hasn't been cleaned in a week.",
                ComplaintCategory.CLEANLINESS, ComplaintPriority.MEDIUM, ComplaintStatus.IN_REVIEW,
                s5, narmada, warden3, "N-401", 4);

        // Add a comment to c1
        commentRepository.save(ComplaintComment.builder()
                .complaint(c1).author(warden1)
                .text("We have sent a technician to check. Should be fixed by tomorrow.")
                .build());
        commentRepository.save(ComplaintComment.builder()
                .complaint(c1).author(s1)
                .text("Thank you! Please let me know once it's scheduled.")
                .build());

        // ── 7. Sample Ratings ──
        LocalDate today = LocalDate.now();
        ratingRepository.save(MealRating.builder().student(s1).mealType(MealType.BREAKFAST).rating(4).comment("Good idli today").date(today).build());
        ratingRepository.save(MealRating.builder().student(s1).mealType(MealType.LUNCH).rating(3).comment("Dal was too salty").date(today).build());
        ratingRepository.save(MealRating.builder().student(s2).mealType(MealType.DINNER).rating(5).comment("Excellent kheer!").date(today).build());
        ratingRepository.save(MealRating.builder().student(s3).mealType(MealType.LUNCH).rating(2).comment("Rice was undercooked").date(today).build());
        ratingRepository.save(MealRating.builder().student(s4).mealType(MealType.BREAKFAST).rating(4).date(today).build());
        ratingRepository.save(MealRating.builder().student(s5).mealType(MealType.DINNER).rating(3).date(today).build());

        // ── 8. Sample Notifications ──
        notificationRepository.save(Notification.builder()
                .user(s1).title("Complaint Updated").message("Your complaint 'Broken ceiling fan' is now In Progress")
                .type("COMPLAINT_UPDATE").referenceId(c1.getId()).read(false).build());
        notificationRepository.save(Notification.builder()
                .user(warden1).title("New Complaint").message("Diya Gupta raised a plumbing issue")
                .type("NEW_COMPLAINT").referenceId(c2.getId()).read(false).build());
        notificationRepository.save(Notification.builder()
                .user(s3).title("Complaint Escalated").message("Your WiFi complaint has been escalated to admin")
                .type("ESCALATION").referenceId(c3.getId()).read(true).build());

        log.info("Demo data seeded successfully — {} users, {} complaints, {} menu items",
                userRepository.count(), complaintRepository.count(), menuRepository.count());
    }

    /* ── Helpers ── */

    private void seedMenu(String day, String breakfast, String lunch, String dinner) {
        menuRepository.save(MessMenu.builder().dayOfWeek(day).mealType(MealType.BREAKFAST).items(breakfast).active(true).build());
        menuRepository.save(MessMenu.builder().dayOfWeek(day).mealType(MealType.LUNCH).items(lunch).active(true).build());
        menuRepository.save(MessMenu.builder().dayOfWeek(day).mealType(MealType.DINNER).items(dinner).active(true).build());
    }

    private Complaint createComplaint(String title, String desc, ComplaintCategory cat,
                                       ComplaintPriority priority, ComplaintStatus status,
                                       User student, HostelBlock block, User warden,
                                       String room, int floor) {
        Complaint c = complaintRepository.save(Complaint.builder()
                .title(title).description(desc).category(cat).priority(priority).status(status)
                .student(student).hostelBlock(block).assignedWarden(warden)
                .roomNumber(room).floorNumber(floor).build());

        // Initial timeline
        timelineRepository.save(ComplaintTimeline.builder()
                .complaint(c).oldStatus(null).newStatus(ComplaintStatus.PENDING)
                .note("Complaint created").changedBy(student).build());

        // Status change timeline if not PENDING
        if (status != ComplaintStatus.PENDING) {
            timelineRepository.save(ComplaintTimeline.builder()
                    .complaint(c).oldStatus(ComplaintStatus.PENDING).newStatus(status)
                    .note("Status updated by warden").changedBy(warden).build());
        }

        return c;
    }
}
