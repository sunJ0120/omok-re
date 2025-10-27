package org.sinhan.omokproject.util;

import lombok.Cleanup;
import lombok.extern.log4j.Log4j2;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import java.sql.Connection;

import static org.junit.jupiter.api.Assertions.*;

/*
db connection test - success!
 */
@Log4j2
class ConnectionUtilTest{
    @Test
    void ConnectionTest() throws Exception {
        //given
        //when
        @Cleanup Connection conn = ConnectionUtil.INSTANCE.getConnection();
        //then
        log.info(conn);
        Assertions.assertNotNull(conn); //연결이 있다면 연결객체가 null이 아닐 것이다.
    }
}