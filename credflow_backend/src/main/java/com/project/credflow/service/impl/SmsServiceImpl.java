package com.project.credflow.service.impl;

import com.project.credflow.service.inter.SmsService;
import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import jakarta.annotation.PostConstruct; // Import PostConstruct
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value; // Import Value
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class SmsServiceImpl implements SmsService {

    @Value("${twilio.account-sid}")
    private String accountSid;

    @Value("${twilio.auth-token}")
    private String authToken;

    @Value("${twilio.phone-number}")
    private String twilioPhoneNumber;

    // Initialize Twilio client when the service starts
    @PostConstruct
    public void initTwilio() {
        try {
            Twilio.init(accountSid, authToken);
            log.info("Twilio client initialized successfully with Account SID: {}", accountSid);
        } catch (Exception e) {
            log.error("Failed to initialize Twilio client: {}", e.getMessage(), e);
            // Consider throwing an exception here if Twilio is critical
        }
    }

    @Override
    public boolean sendSms(String recipientPhoneNumber, String messageBody) {
        if (recipientPhoneNumber == null || recipientPhoneNumber.isBlank()) {
            log.warn("Cannot send SMS: Recipient phone number is missing.");
            return false;
        }
        if (messageBody == null || messageBody.isBlank()) {
            log.warn("Cannot send SMS to {}: Message body is empty.", recipientPhoneNumber);
            return false;
        }
        // Basic validation for E.164 format (starts with '+') - more robust validation could be added
        if (!recipientPhoneNumber.startsWith("+")) {
            log.warn("Cannot send SMS: Recipient phone number '{}' does not appear to be in E.164 format (missing '+').", recipientPhoneNumber);
            return false;
        }


        try {
            PhoneNumber to = new PhoneNumber(recipientPhoneNumber);
            PhoneNumber from = new PhoneNumber(twilioPhoneNumber);

            Message message = Message.creator(to, from, messageBody).create();

            log.info("SMS initiated to {}. SID: {}", recipientPhoneNumber, message.getSid());
            // Check status (optional, usually 'queued' or 'sending' initially)
            // log.debug("SMS status for SID {}: {}", message.getSid(), message.getStatus());

            // Consider statuses like 'failed' or 'undelivered' as failure later using callbacks if needed
            return true; // Assume success if API call doesn't throw exception

        } catch (com.twilio.exception.ApiException e) {
            log.error("Failed to send SMS to {}. Twilio API Error: {} - {}", recipientPhoneNumber, e.getCode(), e.getMessage());
            // Log more details if available
            if (e.getMoreInfo() != null) {
                log.error("Twilio More Info: {}", e.getMoreInfo());
            }
            return false;
        } catch (Exception e) {
            log.error("Unexpected error sending SMS to {}: {}", recipientPhoneNumber, e.getMessage(), e);
            return false;
        }
    }
}