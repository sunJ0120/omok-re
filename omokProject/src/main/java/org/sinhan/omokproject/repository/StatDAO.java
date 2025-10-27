package org.sinhan.omokproject.repository;

import lombok.Cleanup;
import org.sinhan.omokproject.util.ConnectionUtil;

import java.sql.Connection;
import java.sql.PreparedStatement;

public enum StatDAO {
    INSTANCE;

    public void updateStat(String userId, int win, int lose, int rate) {
        String sql = "UPDATE STAT SET win = ?, lose = ?, rate = ? WHERE user_id = ?";

        try {
            @Cleanup Connection conn = ConnectionUtil.INSTANCE.getConnection();
            @Cleanup PreparedStatement pstmt = conn.prepareStatement(sql);
            pstmt.setInt(1, win);
            pstmt.setInt(2, lose); // ✅ 여기 오타 수정!
            pstmt.setInt(3, rate);
            pstmt.setString(4, userId);

            pstmt.executeUpdate();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
