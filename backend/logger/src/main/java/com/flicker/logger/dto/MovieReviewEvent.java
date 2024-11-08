package com.flicker.logger.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class MovieReviewEvent {

    private Integer userSeq;
    private Integer movieSeq;
    private Integer reviewSeq;
    private String type; // "review" or "movie"
    private String action; // "create" or "delete"
    private Double rating;
    private Double sentimentScore;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime timestamp;
}
