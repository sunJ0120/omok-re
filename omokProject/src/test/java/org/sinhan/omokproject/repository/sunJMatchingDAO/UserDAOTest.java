package org.sinhan.omokproject.repository.sunJMatchingDAO;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.sinhan.omokproject.domain.UserVO;

import static org.junit.jupiter.api.Assertions.*;

class UserDAOTest {

    private UserDAO dao;

    @BeforeEach
    public void ready() {
        dao = UserDAO.INSTANCE;
    }
    @Test
    void findUserByIdTest() throws Exception {
        //given
        String userId = "sunJ"; // 테스트용으로 하드코딩된 아이디
        //when
        UserVO user = dao.findUserById(userId);
        //then
        Assertions.assertNotNull(user);
        Assertions.assertEquals(userId, user.getUserId());
    }
}