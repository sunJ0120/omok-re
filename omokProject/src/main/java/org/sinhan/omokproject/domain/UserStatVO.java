package org.sinhan.omokproject.domain;

import lombok.*;

@Data
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserStatVO {
    private int rank;
    private String userId;
    private int win;
    private int loss;
    private double rate;
    private int imageNum;
}
