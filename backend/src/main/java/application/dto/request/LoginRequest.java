package application.dto.request;


import lombok.Data;


@Data
public class LoginRequest {


    private String identifier;

    private String password;


}