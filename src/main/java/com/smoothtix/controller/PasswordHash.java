package com.smoothtix.controller;
import org.mindrot.jbcrypt.BCrypt;

public class PasswordHash {
    public static String hashPassword(String plainPassword) {
        // hash password when got plain password
        try {
            return BCrypt.hashpw(plainPassword, BCrypt.gensalt());
        } catch (Exception e) {
            throw new RuntimeException("Password hashing failed", e);
        }
    }

    public static boolean checkPassword(String plainPassword, String hashedPassword) {
        // compare passwords and check
        try {
            return BCrypt.checkpw(plainPassword, hashedPassword);
        } catch (Exception e) {
            throw new RuntimeException("Password verification failed", e);
        }
    }
}
