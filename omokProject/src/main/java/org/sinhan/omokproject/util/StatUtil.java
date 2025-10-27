package org.sinhan.omokproject.util;

/*
스탯 계산하는 util
 */
public class StatUtil {
    public static int calculateWinRate(int win, int lose){
        int total = win + lose;
        if(total == 0){ //0으로 나누는거 방지용
            return 0;
        }
        return (int) (((double)win/(double) total) * 100); //백분율로 변환
    }
}
