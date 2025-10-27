package org.sinhan.omokproject.repository.sunJMatchingDAO;

import lombok.Cleanup;
import org.checkerframework.checker.units.qual.C;
import org.sinhan.omokproject.domain.UserVO;
import org.sinhan.omokproject.util.ConnectionUtil;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

/*
이 부분 join 해서 가져와야 한다!!!
 */
public enum UserDAO {
    INSTANCE;

    public UserVO findUserById(String userId) {
        String sql = "SELECT *\n" +
                "FROM USER AS u\n" +
                "JOIN STAT AS s\n" +
                "ON u.user_id = s.user_id\n" +
                "WHERE u.user_id = ?";

        UserVO user = null;
        try{
            @Cleanup Connection conn = ConnectionUtil.INSTANCE.getConnection();
            @Cleanup PreparedStatement pstmt = conn.prepareStatement(sql);
            pstmt.setString(1, userId);
            @Cleanup ResultSet rs = pstmt.executeQuery();

            if(rs.next()){
                user = UserVO.builder()
                        .userId(rs.getString("user_id"))
                        .userPW(rs.getString("user_password"))
                        .bio(rs.getString("bio"))
                        .image(rs.getInt("image"))
                        .win(rs.getInt("win"))
                        .lose(rs.getInt("lose"))
                        .rate(rs.getInt("rate"))
                        .build();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return user;
    }
}
