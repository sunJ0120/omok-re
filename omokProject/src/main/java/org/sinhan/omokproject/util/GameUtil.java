package org.sinhan.omokproject.util;

public class GameUtil {

    private static final int BOARD_SIZE = 15;
    private static final int WIN_COUNT = 5;

    /**
     * 해당 좌표에 착수가 가능한지 확인
     */
    public static boolean isValidMove(int[][] board, int x, int y) {
        if (x < 0 || x >= BOARD_SIZE || y < 0 || y >= BOARD_SIZE) {
            return false;
        }
        return board[y][x] == 0;
    }

    /**
     * 승리 조건을 확인하는 메소드 (가로, 세로, 대각선)
     */
    public static boolean checkWin(int[][] board, int x, int y, int stone) {
        return countStones(board, x, y, 1, 0, stone) + countStones(board, x, y, -1, 0, stone) - 1 >= WIN_COUNT ||
                countStones(board, x, y, 0, 1, stone) + countStones(board, x, y, 0, -1, stone) - 1 >= WIN_COUNT ||
                countStones(board, x, y, 1, 1, stone) + countStones(board, x, y, -1, -1, stone) - 1 >= WIN_COUNT ||
                countStones(board, x, y, 1, -1, stone) + countStones(board, x, y, -1, 1, stone) - 1 >= WIN_COUNT;
    }

    /**
     * 해당 방향으로 같은 돌이 몇 개 연속하는지 센다
     */
    private static int countStones(int[][] board, int x, int y, int dx, int dy, int stone) {
        int count = 0;
        while (x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE && board[y][x] == stone) {
            count++;
            x += dx;
            y += dy;
        }
        return count;
    }
}
