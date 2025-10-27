package org.sinhan.omokproject.domain;

import lombok.*;

/*
GameVO.GameStatus status = GameVO.GameStatus.PLAYING; 라고 ENUM TYPE 사용하면 된다.

1. DB -> JAVA 문자열 변환시
GameVO.GameStatus status = GameVO.GameStatus.valueOf(rs.getString("status"));

2. 조건에 따라 상태 변경 할 때
if (status == GameVO.GameStatus.EMPTY) {
    status = GameVO.GameStatus.WAITING;
}

3. 다시 DB에 저장할 때
pstmt.setString(1, gameVO.getStatus().name());  // => 바뀐 상태인 "WAITING" 저장됨
 */

@Data
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GameVO {
    private int gameId;
    private GameStatus status;  // enum 타입으로 정의
    private String winnerId;
    private String player1;
    private String player2;

    private int[][] board;
    private int turn;

    // enum 정의
    public enum GameStatus {
        PLAYING,   // 게임 진행중
        WAITING,   // 대기중
        FINISHED,   // 종료됨
        EMPTY   // 빈 게임, 필요 없을 것 같긴한데 혹시 몰라서 넣어둠
    }
}
