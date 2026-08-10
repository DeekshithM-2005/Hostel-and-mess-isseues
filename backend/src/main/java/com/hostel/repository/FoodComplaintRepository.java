package com.hostel.repository;

import com.hostel.entity.FoodComplaint;
import com.hostel.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FoodComplaintRepository extends JpaRepository<FoodComplaint, Long> {

    List<FoodComplaint> findByStudentOrderByCreatedAtDesc(User student);

    List<FoodComplaint> findAllByOrderByCreatedAtDesc();
}
