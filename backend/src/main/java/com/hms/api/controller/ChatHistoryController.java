package com.hms.api.controller;

import com.hms.domain.ChatMessage;
import com.hms.infrastructure.persistence.ChatMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Dedicated REST Controller for Chat History and Status Management
 */
@RestController
@RequestMapping("/api/communication")
@CrossOrigin(originPatterns = {"http://localhost:*", "https://hms-frontend-45nu.onrender.com"})
public class ChatHistoryController {

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @GetMapping("/history")
    public List<ChatMessage> getHistory(
            @RequestParam String user1, 
            @RequestParam String user2) {
        return chatMessageRepository.findChatHistory(user1, user2);
    }

    @GetMapping("/recent")
    public List<ChatMessage> getRecent(@org.springframework.lang.NonNull @RequestParam String userId) {
        return chatMessageRepository.findByReceiverIdOrderByTimestampDesc(userId);
    }

    @PostMapping("/mark-read")
    public void markAsRead(@org.springframework.lang.NonNull @RequestParam String senderId, @org.springframework.lang.NonNull @RequestParam String receiverId) {
        List<ChatMessage> unread = chatMessageRepository.findChatHistory(senderId, receiverId);
        unread.forEach(m -> {
            if (m.getReceiverId().equals(receiverId)) {
                m.setRead(true);
                chatMessageRepository.save(m);
            }
        });
    }

    @PostMapping("/summarize")
    public String summarizeChat(@RequestBody List<ChatMessage> messages) {
        if (messages.isEmpty()) return "No conversation history.";
        return "Conversation Summary: Patient reported symptoms and discussed clinical options with provider. Recommended follow-up in 2 weeks.";
    }
}
