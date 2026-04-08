package com.hms.api.controller;

import com.hms.domain.ChatMessage;
import com.hms.infrastructure.persistence.ChatMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class CommunicationController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    /**
     * Handles real-time chat messages sent to /app/chat.sendMessage
     * Sends the message to the receiver's private queue /queue/messages
     */
    @MessageMapping("/chat.sendMessage")
    public void sendMessage(@org.springframework.lang.NonNull @Payload ChatMessage chatMessage) {
        // Persist message to DB
        chatMessageRepository.save(chatMessage);
        
        // Route to the receiver
        messagingTemplate.convertAndSend("/topic/public", chatMessage); 
        messagingTemplate.convertAndSendToUser(
            chatMessage.getReceiverId(), "/queue/messages", chatMessage);
    }

    /**
     * Handles signaling for video/voice calls (handshake/signaling)
     */
    @MessageMapping("/call.signal")
    public void handleCallSignal(@org.springframework.lang.NonNull @Payload ChatMessage signal) {
        // Signals are usually CHAT type but with specialized content (SDP/ICE)
        // or CALL_SIGNAL type
        messagingTemplate.convertAndSendToUser(
            signal.getReceiverId(), "/queue/calls", signal);
    }

    @MessageMapping("/chat.readReceipt")
    public void handleReadReceipt(@org.springframework.lang.NonNull @Payload ChatMessage receipt) {
        // Forward the read receipt to the original sender
        messagingTemplate.convertAndSendToUser(
            receipt.getReceiverId(), "/queue/read", receipt);
    }
}
