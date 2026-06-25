package com.travelease.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.travelease.dto.BookingMessage;
import com.travelease.entity.Booking;
import com.travelease.exception.ResourceNotFoundException;
import com.travelease.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.sqs.model.Message;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookingConsumer {

    private final SqsService sqsService;
    private final InvoiceService invoiceService;
    private final EmailService emailService;
    private final BookingRepository bookingRepository;
    private final ObjectMapper objectMapper;

    @Value("${app.sqs.enabled:false}")
    private boolean sqsEnabled;

    // Runs every 10 seconds
    @Scheduled(fixedDelay = 10000)
    public void processBookingMessages() {
        if (!sqsEnabled) return;
        List<Message> messages = sqsService.receiveMessages();

        for (Message message : messages) {
            try {
                BookingMessage bookingMessage =
                        objectMapper.readValue(message.body(), BookingMessage.class);

                log.info("Processing booking message for bookingId: {}",
                        bookingMessage.getBookingId());

                // Step 1: Generate PDF invoice
                byte[] invoicePdf = invoiceService.generateAndSave(bookingMessage);

                // Step 2: Send confirmation email with invoice
                emailService.sendBookingConfirmation(
                        bookingMessage.getCustomerEmail(),
                        bookingMessage.getCustomerName(),
                        bookingMessage.getPackageTitle(),
                        String.valueOf(bookingMessage.getBookingId()),
                        invoicePdf
                );

                // Step 3: Update booking status to CONFIRMED
                updateBookingStatus(bookingMessage.getBookingId());

                // Step 4: Delete message from SQS
                sqsService.deleteMessage(message.receiptHandle());

                log.info("Booking {} processed successfully", bookingMessage.getBookingId());

            } catch (Exception e) {
                log.error("Failed to process message: {}. Error: {}",
                        message.messageId(), e.getMessage());
                // Message stays in queue → SQS will retry after visibility timeout
            }
        }
    }

    private void updateBookingStatus(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Booking not found: " + bookingId));

        if (booking.getStatus() == Booking.Status.PENDING) {
            booking.setStatus(Booking.Status.CONFIRMED);
            bookingRepository.save(booking);
        }
    }
}
