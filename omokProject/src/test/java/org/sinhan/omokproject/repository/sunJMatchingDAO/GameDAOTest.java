package org.sinhan.omokproject.repository.sunJMatchingDAO;

import lombok.extern.log4j.Log4j2;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.sinhan.omokproject.domain.GameVO;

/*
makeroom이 잘 동작하는지 test
테스트 성공, 방만들기 잘 된다.
 */
@Log4j2
class GameDAOTest {

    private GameDAO dao;

    @BeforeEach
    public void ready() {
        dao = GameDAO.INSTANCE;
    }

    @Test
    @DisplayName("makeGame 테스트")
    void makeGameTest() throws Exception {
        //given
        //일단 연습이므로 하드코딩 해둔다.
        GameVO game = GameVO.builder()
                .status(GameVO.GameStatus.WAITING)
                .player1("sunJ")
                .build();

        //when
        GameVO vo = dao.makeGame(game);

        //then
        log.info("새로 생긴 게임 객체 : {}", vo);
        Assertions.assertNotNull(vo);
    }

    @Test
    void getGameByIdTest() throws Exception {
        //given
        int gameId = 1; //테스트용으로 하드코딩된 gameId
        //when
        GameVO game = dao.getGameById(gameId);
        //then
        //game 방 정보 : GameVO(gameId=1, status=FINISHED, winnerId=null, player1=joowon, player2=null)
        log.info("game 방 정보 : {}", game.toString());
        // null이 아니고, 아이디가 일치하는지 확인한다.
        Assertions.assertNotNull(game);
        Assertions.assertEquals(gameId, game.getGameId());
    }

    @Test
    void updateGameTest() throws Exception {
        //given
        GameVO game = GameVO.builder()
                .gameId(35) // 테스트용으로 하드코딩된 gameId, waiting 상태의 방을 고름
                .status(GameVO.GameStatus.PLAYING)
                .player2("sunJ")
                .build();
        //when
        int cnt = dao.updateGame(game);
        //then
        Assertions.assertNotNull(game);
        Assertions.assertEquals(cnt, 1);
    }
}