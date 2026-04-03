package com.elearning.elearningserver.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Data
@NoArgsConstructor
@Document(collection = "stats")
public class Stats {

    @Id
    private String id;

    private int users = 0;
    private int subscription = 0;
    private long views = 0;
    private Date createdAt = new Date();
}