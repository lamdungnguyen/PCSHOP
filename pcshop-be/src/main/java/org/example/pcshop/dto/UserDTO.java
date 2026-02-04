package org.example.pcshop.dto;

import lombok.Data;
import org.example.pcshop.entity.Role;

@Data
public class UserDTO {
    private Long id;
    private String username;
    private String email;
    private String name;
    private String avatar;
    private Role role;
    private String provider;
}
