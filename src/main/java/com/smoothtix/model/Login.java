package com.smoothtix.model;

public class Login {
    private final String nic;
    private final String password;

    public Login(String nic, String password){
        this.nic = nic;
        this.password = password;
    }

    public String get_nic(){
        return nic;
    }
    public String get_password(){
        return password;
    }


}
