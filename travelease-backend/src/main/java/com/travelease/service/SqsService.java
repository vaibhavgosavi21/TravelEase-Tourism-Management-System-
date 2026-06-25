package com.travelease.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.travelease.dto.BookingMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.sqs.SqsClient;
import software.amazon.awssdk.services.sqs.model.*;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class SqsService {

    private final SqsClient sqsClient;
    private final ObjectMapper objectMapper;

    @Value("${aws.sqs.queue-url}")
    private String queueUrl;

    @Value("${app.sqs.enabled:false}")
    private boolean sqsEnabled;

    public void sendBookingMessage(BookingMessage message) {
        if (!sqsEnabled) {
            log.info("SQS disabled. Skipping message for bookingId: {}",
                    message.getBookingId());
            return;
        }
        try {
            String messageBody = objectMapper.writeValueAsString(message);

            SendMessageRequest request = SendMessageRequest.builder()
                    .queueUrl(queueUrl)
                    .messageBody(messageBody)
                    .build();

            sqsClient.sendMessage(request);
            log.info("Booking message sent to SQS for bookingId: {}", message.getBookingId());

        } catch (Exception e) {
            // SQS failure should not break the booking flow
            log.error("Failed to send message to SQS for bookingId: {}. Error: {}",
                    message.getBookingId(), e.getMessage());
        }
    }

    public List<Message> receiveMessages() {
        ReceiveMessageRequest request = ReceiveMessageRequest.builder()
                .queueUrl(queueUrl)
                .maxNumberOfMessages(10)
                .waitTimeSeconds(5)
                .build();

        return sqsClient.receiveMessage(request).messages();
    }

    public void deleteMessage(String receiptHandle) {
        DeleteMessageRequest request = DeleteMessageRequest.builder()
                .queueUrl(queueUrl)
                .receiptHandle(receiptHandle)
                .build();

        sqsClient.deleteMessage(request);
    }
}
