package org.sinhan.omokproject.domain;
import lombok.*;

@Data
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StatVO {
    private String userId;
    private int win;
    private int lose;
    private int rate;
}
