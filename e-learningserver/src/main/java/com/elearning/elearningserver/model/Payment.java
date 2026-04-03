package com.elearning.elearningserver.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Data
@NoArgsConstructor
@Document(collection = "payments")
public class Payment {

    @Id
    private String id;

    private String stripePaymentIntentId;

    private long amount;

    private Date createdAt = new Date();
}