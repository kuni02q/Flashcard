package application.controller;

import application.dto.response.UserResponse;
import application.model.User;
import application.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;


    @GetMapping("/{id}")
    public UserResponse getUser(
            @PathVariable Long id
    ){

        return userService.getById(id);

    }


    @GetMapping("/me")
    public UserResponse currentUser(
            Authentication authentication
    ){

        return userService.getByUsername(
                authentication.getName()
        );

    }

}