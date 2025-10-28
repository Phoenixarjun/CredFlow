package com.project.credflow.service.inter;

public interface SmsService {


    boolean sendSms(String recipientPhoneNumber, String messageBody);
}