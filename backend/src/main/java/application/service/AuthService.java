package application.service;


import application.dto.request.LoginRequest;
import application.dto.request.RegisterRequest;
import application.dto.response.AuthResponse;
import application.model.User;
import application.repository.UserRepository;
import application.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class AuthService {


    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final JwtService jwtService;



    public AuthResponse register(RegisterRequest request){


        if(userRepository.existsByUsername(request.getUsername())){

            throw new RuntimeException("Username already exists");

        }


        if(userRepository.existsByEmail(request.getEmail())){

            throw new RuntimeException("Email already exists");

        }



        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(
                        passwordEncoder.encode(
                                request.getPassword()
                        )
                )
                .role("USER")
                .build();



        userRepository.save(user);

        String token =
                jwtService.generateToken(
                        user.getId(),
                        user.getUsername()
                );


        return new AuthResponse(
                token,
                user.getId(),
                user.getUsername()
        );


    }





    public AuthResponse login(LoginRequest request){


        User user = userRepository.findByUsername(request.getIdentifier())
                .or(() -> userRepository.findByEmail(request.getIdentifier()))
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));



        if(!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword()
        )){

            throw new RuntimeException("Invalid credentials");

        }




        String token =
                jwtService.generateToken(
                        user.getId(),
                        user.getUsername()
                );



        return new AuthResponse(
                token,
                user.getId(),
                user.getUsername()
        );

    }


}