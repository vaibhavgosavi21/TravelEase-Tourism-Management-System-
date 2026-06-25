package com.travelease.service;

import com.travelease.dto.ContactRequest;
import com.travelease.dto.ContactResponse;
import com.travelease.entity.ContactMessage;
import com.travelease.exception.ResourceNotFoundException;
import com.travelease.repository.ContactMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ContactService {

    private final ContactMessageRepository contactRepository;

    private ContactResponse toResponse(ContactMessage c) {
        return new ContactResponse(
                c.getId(),
                c.getName(),
                c.getEmail(),
                c.getSubject(),
                c.getMessage(),
                c.isRead(),
                c.getCreatedAt()
        );
    }

    public void submit(ContactRequest request) {
        ContactMessage msg = new ContactMessage();
        msg.setName(request.getName());
        msg.setEmail(request.getEmail());
        msg.setSubject(request.getSubject());
        msg.setMessage(request.getMessage());
        contactRepository.save(msg);
    }

    public List<ContactResponse> getAll() {
        return contactRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public ContactResponse markAsRead(Long id) {
        ContactMessage msg = contactRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Message not found with id: " + id));
        msg.setRead(true);
        return toResponse(contactRepository.save(msg));
    }

    public long getUnreadCount() {
        return contactRepository.countByIsReadFalse();
    }
}
