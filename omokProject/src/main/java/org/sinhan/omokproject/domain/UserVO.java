package org.sinhan.omokproject.domain;

import lombok.*;

/*
원래는 VO는 테이블 별로 하나씩, 서버에서 사용하는 정보들은 DTO로 따로 빼는 것이 맞다만..
시간 관계상 & 미니 프로젝트라는 특성상 VO에 JOIN한 모든 결과를 담도록 구성한다.
그래야 개발 속도가 좀 더 빨라진다....
 */

@Data
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserVO {
    private String userId; //매핑에 주의한다. db에서는 user_id라는 스네이크 방식, 서버에서는 카멜 표기법
    private String userPW;
    private String bio;
    private int image;

    //stat 테이블에서 온 값들
    // 회원 가입시 기본값은 0이다.
    @Builder.Default
    private int win = 0;

    @Builder.Default
    private int lose = 0;

    @Builder.Default
    private int rate = 0;
}
