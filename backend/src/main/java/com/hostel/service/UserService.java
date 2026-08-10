package com.hostel.service;

import com.hostel.dto.user.UserProfileDTO;
import com.hostel.entity.User;
import com.hostel.entity.HostelBlock;
import com.hostel.exception.ResourceNotFoundException;
import com.hostel.repository.HostelBlockRepository;
import com.hostel.repository.UserRepository;
import com.hostel.enums.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final HostelBlockRepository hostelBlockRepository;

    public UserProfileDTO getProfile(User user) {
        return mapToDTO(user);
    }

    public UserProfileDTO updateProfile(User user, UserProfileDTO dto) {
        if (dto.getName() != null) user.setName(dto.getName());
        if (dto.getPhone() != null) user.setPhone(dto.getPhone());
        if (dto.getRoomNumber() != null) user.setRoomNumber(dto.getRoomNumber());
        userRepository.save(user);
        return mapToDTO(user);
    }

    /** Admin: list all wardens. */
    public List<UserProfileDTO> getWardens() {
        return userRepository.findByRole(Role.WARDEN).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    /** Admin: assign a warden to a hostel block. */
    public Map<String, Object> assignWarden(Long wardenId, Long blockId) {
        User warden = userRepository.findById(wardenId)
                .orElseThrow(() -> new ResourceNotFoundException("User", wardenId));
        if (warden.getRole() != Role.WARDEN) {
            throw new IllegalArgumentException("User is not a warden");
        }

        HostelBlock block = hostelBlockRepository.findById(blockId)
                .orElseThrow(() -> new ResourceNotFoundException("HostelBlock", blockId));

        block.setWarden(warden);
        hostelBlockRepository.save(block);

        return Map.of(
                "message", warden.getName() + " assigned to " + block.getName(),
                "wardenId", wardenId,
                "blockId", blockId
        );
    }

    /** Get all hostel blocks. */
    public List<Map<String, Object>> getHostelBlocks() {
        return hostelBlockRepository.findAll().stream()
                .map(b -> {
                    Map<String, Object> map = new java.util.HashMap<>();
                    map.put("id", b.getId());
                    map.put("name", b.getName());
                    map.put("totalFloors", b.getTotalFloors());
                    map.put("wardenId", b.getWarden() != null ? b.getWarden().getId() : null);
                    map.put("wardenName", b.getWarden() != null ? b.getWarden().getName() : null);
                    return map;
                })
                .collect(Collectors.toList());
    }

    private UserProfileDTO mapToDTO(User u) {
        return UserProfileDTO.builder()
                .id(u.getId())
                .name(u.getName())
                .email(u.getEmail())
                .role(u.getRole().name())
                .phone(u.getPhone())
                .roomNumber(u.getRoomNumber())
                .hostelBlockId(u.getHostelBlock() != null ? u.getHostelBlock().getId() : null)
                .hostelBlockName(u.getHostelBlock() != null ? u.getHostelBlock().getName() : null)
                .build();
    }
}
