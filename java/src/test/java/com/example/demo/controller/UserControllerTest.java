package com.example.demo.controller;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;

@SpringBootTest
@AutoConfigureMockMvc
public class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    public void setUp() {
        userRepository.deleteAll();

        List<User> users = Arrays.asList(
                new User(null, "John", "Doe", "123 Main St", "Anytown", "NY", "12345", "1234567890"),
                new User(null, "Jane", "Smith", "456 Elm St", "Othertown", "CA", "67890", "0987654321"),
                new User(null, "Alice", "Johnson", "789 Oak St", "Springfield", "IL", "11111", "1111111111")
        );

        userRepository.saveAll(users);
    }

    @Test
    public void testGetAllUsers() throws Exception {
        mockMvc.perform(get("/users")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(3)))
                .andExpect(jsonPath("$[0].firstName", is("John")))
                .andExpect(jsonPath("$[0].lastName", is("Doe")))
                .andExpect(jsonPath("$[0].phoneNumber", is("1234567890")))
                .andExpect(jsonPath("$[1].firstName", is("Jane")))
                .andExpect(jsonPath("$[1].lastName", is("Smith")))
                .andExpect(jsonPath("$[1].phoneNumber", is("0987654321")))
                .andExpect(jsonPath("$[2].firstName", is("Alice")))
                .andExpect(jsonPath("$[2].lastName", is("Johnson")))
                .andExpect(jsonPath("$[2].phoneNumber", is("1111111111")));
    }

    @Test
    public void testCreateUser() throws Exception {
        User newUser = new User(null, "Bob", "Williams", "101 Pine St", "Rivertown", "TX", "22222", "2222222222");

        mockMvc.perform(post("/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(newUser)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.firstName", is("Bob")))
                .andExpect(jsonPath("$.lastName", is("Williams")))
                .andExpect(jsonPath("$.phoneNumber", is("2222222222")));
    }

    @Test
    public void testUpdateUser() throws Exception {
        User existingUser = userRepository.findAll().get(0);
        existingUser.setFirstName("UpdatedFirstName");

        mockMvc.perform(put("/users/" + existingUser.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(existingUser)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.firstName", is("UpdatedFirstName")));
    }

    @Test
    public void testDeleteUser() throws Exception {
        User existingUser = userRepository.findAll().get(0);

        mockMvc.perform(delete("/users/" + existingUser.getId())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

        mockMvc.perform(get("/users")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)));
    }
}
