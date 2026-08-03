package application.controller;


import application.dto.request.LoginRequest;
import application.dto.request.RegisterRequest;
import application.dto.response.AuthResponse;
import application.model.User;
import application.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {


    private final AuthService authService;



    @PostMapping("/register")
    public AuthResponse register(
            @RequestBody RegisterRequest request
    ){

        return authService.register(request);

    }




    @PostMapping("/login")
    public AuthResponse login(
            @RequestBody LoginRequest request
    ){

        return authService.login(request);

    }


}