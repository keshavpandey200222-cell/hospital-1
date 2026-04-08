package com.hms.api.controller;

import com.hms.application.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "*")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @PostMapping
    public Map<String, Object> sendMessage(@RequestBody Map<String, String> payload) {
        String userMessage = payload.get("message");
        return chatService.processMessage(userMessage);
    }
}
