package com.travelease.service;

import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import com.travelease.dto.BookingMessage;
import com.travelease.entity.Booking;
import com.travelease.entity.Invoice;
import com.travelease.exception.ResourceNotFoundException;
import com.travelease.repository.BookingRepository;
import com.travelease.repository.InvoiceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
@Slf4j
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final BookingRepository bookingRepository;

    private static final DeviceRgb BRAND_BLUE = new DeviceRgb(37, 99, 235);
    private static final DateTimeFormatter DATE_FMT =
            DateTimeFormatter.ofPattern("dd MMM yyyy");

    public byte[] generateAndSave(BookingMessage message) {
        String invoiceNumber = "INV-" + message.getBookingId() + "-"
                + System.currentTimeMillis();

        byte[] pdfBytes = buildPdf(message, invoiceNumber);

        // Save invoice record
        Booking booking = bookingRepository.findById(message.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        Invoice invoice = new Invoice();
        invoice.setBooking(booking);
        invoice.setInvoiceNumber(invoiceNumber);
        invoiceRepository.save(invoice);

        log.info("Invoice {} generated for bookingId: {}",
                invoiceNumber, message.getBookingId());

        return pdfBytes;
    }

    private byte[] buildPdf(BookingMessage message, String invoiceNumber) {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

        try (PdfDocument pdf = new PdfDocument(new PdfWriter(outputStream));
             Document document = new Document(pdf)) {

            // ── Header ────────────────────────────────────────────────────────
            Paragraph brand = new Paragraph("TravelEase")
                    .setFontSize(28)
                    .setBold()
                    .setFontColor(BRAND_BLUE)
                    .setTextAlignment(TextAlignment.CENTER);
            document.add(brand);

            document.add(new Paragraph("Booking Invoice")
                    .setFontSize(14)
                    .setFontColor(ColorConstants.GRAY)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginBottom(20));

            // ── Invoice Meta ──────────────────────────────────────────────────
            document.add(new Paragraph("Invoice Number: " + invoiceNumber)
                    .setFontSize(10)
                    .setFontColor(ColorConstants.GRAY));

            document.add(new Paragraph("Generated: " +
                    java.time.LocalDate.now().format(DATE_FMT))
                    .setFontSize(10)
                    .setFontColor(ColorConstants.GRAY)
                    .setMarginBottom(20));

            // ── Customer Info ─────────────────────────────────────────────────
            document.add(new Paragraph("Billed To")
                    .setBold()
                    .setFontSize(12)
                    .setFontColor(BRAND_BLUE));

            document.add(new Paragraph(message.getCustomerName()).setFontSize(11));
            document.add(new Paragraph(message.getCustomerEmail())
                    .setFontSize(10)
                    .setFontColor(ColorConstants.GRAY)
                    .setMarginBottom(20));

            // ── Booking Details Table ─────────────────────────────────────────
            document.add(new Paragraph("Booking Details")
                    .setBold()
                    .setFontSize(12)
                    .setFontColor(BRAND_BLUE)
                    .setMarginBottom(8));

            Table table = new Table(UnitValue.createPercentArray(new float[]{50, 50}))
                    .setWidth(UnitValue.createPercentValue(100));

            addTableRow(table, "Package", message.getPackageTitle());
            addTableRow(table, "Destination", message.getDestinationName());
            addTableRow(table, "Travel Date",
                    message.getTravelDate().format(DATE_FMT));
            addTableRow(table, "Travelers",
                    String.valueOf(message.getNumTravelers()));
            addTableRow(table, "Booking ID",
                    String.valueOf(message.getBookingId()));

            document.add(table);

            // ── Total ─────────────────────────────────────────────────────────
            document.add(new Paragraph("\nTotal Amount")
                    .setBold()
                    .setFontSize(12)
                    .setFontColor(BRAND_BLUE)
                    .setMarginTop(20));

            document.add(new Paragraph("₹ " + message.getTotalPrice())
                    .setFontSize(22)
                    .setBold()
                    .setFontColor(ColorConstants.BLACK));

            // ── Footer ────────────────────────────────────────────────────────
            document.add(new Paragraph(
                    "\nThank you for booking with TravelEase. Have a great trip!")
                    .setFontSize(10)
                    .setFontColor(ColorConstants.GRAY)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginTop(40));

        } catch (Exception e) {
            log.error("Failed to generate PDF for bookingId: {}", message.getBookingId());
            throw new RuntimeException("PDF generation failed", e);
        }

        return outputStream.toByteArray();
    }

    private void addTableRow(Table table, String label, String value) {
        table.addCell(new Cell()
                .add(new Paragraph(label).setBold().setFontSize(10))
                .setBackgroundColor(new DeviceRgb(243, 244, 246))
                .setPadding(8));
        table.addCell(new Cell()
                .add(new Paragraph(value).setFontSize(10))
                .setPadding(8));
    }
}
