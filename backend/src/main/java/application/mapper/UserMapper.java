package application.mapper;


import application.dto.response.UserResponse;
import application.model.User;
import org.springframework.stereotype.Component;


@Component
public class UserMapper {


    public UserResponse toResponse(User user){

        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail()
        );

    }


}