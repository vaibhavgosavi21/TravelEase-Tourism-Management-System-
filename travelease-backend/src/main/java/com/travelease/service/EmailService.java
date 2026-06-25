package com.travelease.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendBookingConfirmation(String toEmail, String customerName,
                                        String packageTitle, String bookingId,
                                        byte[] invoicePdf) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("Booking Confirmed – " + packageTitle + " | TravelEase");
            helper.setText(buildEmailBody(customerName, packageTitle, bookingId), true);

            // Attach the PDF invoice
            helper.addAttachment("Invoice-" + bookingId + ".pdf",
                    new ByteArrayResource(invoicePdf), "application/pdf");

            mailSender.send(message);
            log.info("Confirmation email sent to: {}", toEmail);

        } catch (MessagingException e) {
            log.error("Failed to send email to: {}. Error: {}", toEmail, e.getMessage());
        }
    }

    private String buildEmailBody(String customerName, String packageTitle, String bookingId) {
        return """
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background-color: #2563eb; padding: 24px; border-radius: 8px 8px 0 0;">
                        <h1 style="color: white; margin: 0;">TravelEase</h1>
                    </div>
                    <div style="padding: 32px; background-color: #f9fafb; border-radius: 0 0 8px 8px;">
                        <h2 style="color: #1f2937;">Booking Confirmed! 🎉</h2>
                        <p style="color: #4b5563;">Hi <strong>%s</strong>,</p>
                        <p style="color: #4b5563;">
                            Your booking for <strong>%s</strong> has been confirmed.
                            Please find your invoice attached to this email.
                        </p>
                        <div style="background: white; border-radius: 8px; padding: 16px;
                                    border-left: 4px solid #2563eb; margin: 24px 0;">
                            <p style="margin: 0; color: #6b7280;">Booking Reference</p>
                            <p style="margin: 4px 0 0; font-size: 20px; font-weight: bold;
                                      color: #1f2937;">#%s</p>
                        </div>
                        <p style="color: #4b5563;">
                            Pack your bags and get ready for an amazing experience!
                        </p>
                        <p style="color: #9ca3af; font-size: 14px; margin-top: 32px;">
                            Thank you for choosing TravelEase.
                        </p>
                    </div>
                </div>
                """.formatted(customerName, packageTitle, bookingId);
    }
}
