package org.sinhan.omokproject.repository;

import lombok.extern.log4j.Log4j2;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.sinhan.omokproject.domain.UserVO;

/*
loginDAO가 알맞게 돌아가고 있는지 보기 위한 test
 */
@Log4j2
class LoginDAOTest {
    private LoginDAO dao;

    @BeforeEach
    public void ready(){
        dao = LoginDAO.INSTANCE;
    }

    @Test
    @DisplayName("알맞은 로그인 아이디, 비번이 들어갔을 경우 결과를 확인")
    void getUserByIdAndPasswordCorrectTest() throws Exception {
        //given
        String userId = "pyh123";
        String userPw = "1214";
        //when
        UserVO vo = dao.getUserByIdAndPassword(userId, userPw);
        //then
        log.info("vo 객체 확인 : {}", vo.toString());
        Assertions.assertEquals(userId, vo.getUserId());
    }

    @Test
    @DisplayName("아이디, 비번 중 하나라도 틀릴경우 null을 retutn 하는지 체크")
    void getUserByIdAndPasswordFailTest() throws Exception {
        //given
        String userId = "sunJ";
        String userPw = "pass0000";
        //when
        UserVO vo = dao.getUserByIdAndPassword(userId, userPw);
        //then
        Assertions.assertNull(vo);
    }

    @Test
    @DisplayName("회원가입 DAO 테스트")
    void signUpTest() throws Exception {
        //given
        String userId = "testUserrrr";
        String userPw=  "testPass";
        String bio = "테스트 유저입니다.";
        int image = 4;

        UserVO vo = UserVO.builder()
                .userId(userId)
                .userPW(userPw)
                .bio(bio)
                .image(image)
                .build();

        //when
        int cnt = dao.insertUser(vo);
        log.info("회원가입 된 유저 값 : {}", vo);
        //then
        Assertions.assertEquals(cnt, 2);
    }
}