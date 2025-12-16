-- 사용자 테이블
CREATE TABLE IF NOT EXISTS User (
    user_id           BIGINT PRIMARY KEY AUTO_INCREMENT, -- H2의 자동 증가 키
    username          VARCHAR(50) NOT NULL UNIQUE,      -- 로그인 ID (고유)
    nickname          VARCHAR(50) NOT NULL,             -- 게임 내 표시 이름
    password_hash     VARCHAR(100) NOT NULL,            -- 비밀번호 해시
    created_at        TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    win_count         INT DEFAULT 0,
    loss_count        INT DEFAULT 0,
    draw_count        INT DEFAULT 0
);

-- 게임 방 테이블
CREATE TABLE IF NOT EXISTS GameRoom (
    room_id           BIGINT PRIMARY KEY AUTO_INCREMENT,
    title             VARCHAR(100) NOT NULL,
    room_status       VARCHAR(20) NOT NULL,             -- 예: 'WAITING', 'PLAYING', 'FINISHED'
    created_by_id     BIGINT NOT NULL,                  -- 방 생성자
    created_at        TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (created_by_id) REFERENCES User(user_id) ON DELETE CASCADE
);

-- 방 참여자 테이블 (GameRoom과 User의 M:N 관계 해소)
CREATE TABLE IF NOT EXISTS RoomParticipant (
    room_participant_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    room_id           BIGINT NOT NULL,
    user_id           BIGINT NOT NULL,
    player_role       VARCHAR(20) NOT NULL,             -- 예: 'BLACK', 'WHITE', 'SPECTATOR'

    -- 한 방에 한 사용자는 한 번만 참여 가능
    UNIQUE (room_id, user_id),

    FOREIGN KEY (room_id) REFERENCES GameRoom(room_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE
);

-- 게임 기록 테이블 (게임 종료 시 저장)
CREATE TABLE IF NOT EXISTS GameHistory (
    history_id        BIGINT PRIMARY KEY AUTO_INCREMENT,
    room_id           BIGINT NOT NULL,
    start_time        TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time          TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    winner_id         BIGINT,                           -- 승자 ID (무승부 시 NULL)
    loser_id          BIGINT,                           -- 패자 ID (무승부 시 NULL)
    game_rule         VARCHAR(30) NOT NULL,             -- 예: 'STANDARD', 'RENJU'

    FOREIGN KEY (room_id) REFERENCES GameRoom(room_id) ON DELETE RESTRICT, -- 방이 삭제되어도 기록은 남김
    FOREIGN KEY (winner_id) REFERENCES User(user_id) ON DELETE SET NULL,  -- 사용자 삭제 시 승자/패자 기록은 NULL로 남김
    FOREIGN KEY (loser_id) REFERENCES User(user_id) ON DELETE SET NULL
);

-- 수(手) 기록 테이블 (게임의 전체 수순)
CREATE TABLE IF NOT EXISTS MoveRecord (
    move_id           BIGINT PRIMARY KEY AUTO_INCREMENT,
    history_id        BIGINT NOT NULL,
    move_number       INT NOT NULL,                     -- 몇 번째 수인가
    player_id         BIGINT NOT NULL,
    x_coord           INT NOT NULL,                     -- 돌이 놓인 X 좌표
    y_coord           INT NOT NULL,                     -- 돌이 놓인 Y 좌표
    move_time         TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    UNIQUE (history_id, move_number), -- 한 게임의 같은 순서에 두 번의 수가 있을 수 없음

    FOREIGN KEY (history_id) REFERENCES GameHistory(history_id) ON DELETE CASCADE,
    FOREIGN KEY (player_id) REFERENCES User(user_id) ON DELETE RESTRICT
);