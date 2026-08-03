package application.service;


import application.dto.response.UserResponse;
import application.mapper.UserMapper;
import application.model.User;
import application.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class UserService {


    private final UserRepository userRepository;

    private final UserMapper mapper;


    public UserResponse getById(Long id){

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));


        return mapper.toResponse(user);

    }



    public UserResponse getByUsername(String username){

        User user = userRepository.findByUsername(username)
                        .orElseThrow(() -> new RuntimeException("User not found"));

        return mapper.toResponse(user);

    }

}