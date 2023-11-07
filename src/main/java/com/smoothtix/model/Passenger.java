package com.smoothtix.model;

public class Passenger {
    private String p_id;
    private String first_name;
    private String last_name;
    private String nic;
    private String email;
    private String password;
    private Boolean flag;
    private int privilege_level;

    public Passenger(String p_id, String first_name, String last_name, String nic, String email, String password, Boolean flag, int privilege_level){
        this.p_id = p_id;
        this.first_name = first_name;
        this.last_name = last_name;
        this.nic = nic;
        this.email = email;
        this.password = password;
        this.flag = flag;
        this.privilege_level = privilege_level;
    }

    public String get_p_id(){
        return p_id;
    }
    public String get_first_name(){
        return first_name;
    }
    public String get_last_name(){
        return last_name;
    }
    public String get_nic(){
        return nic;
    }
    public String get_email(){
        return email;
    }
    public String get_password(){
        return password;
    }
    public Boolean get_flag(){
        return flag;
    }
    public int get_privilege_level(){
        return privilege_level;
    }

    public void set_p_id(String p_id){
        this.p_id = p_id;
    }
    public void set_first_name(String first_name){
        this.first_name = first_name;
    }
    public void set_last_name(String last_name){
        this.last_name = last_name;
    }
    public void set_nic(String nic){
        this.nic = nic;
    }
    public void set_email(String email){
        this.email = email;
    }
    public void set_password(String password){
        this.password = password;
    }
    public void set_flag(Boolean flag){
        this.flag = flag;
    }
    public void set_privilege_level(int privilege_level){
        this.privilege_level = privilege_level;
    }

}
