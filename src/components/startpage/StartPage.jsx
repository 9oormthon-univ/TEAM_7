import React, { useState, useEffect } from 'react'
import { S } from './StartStyle';
import Start from '../../pages/start/Start';

export default function StartPage() {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showStartComponent, setShowStartComponent] = useState(false);

  const handleClick = () => {
    setIsAnimating(true);

    // 4초 후에 페이지 이동
    const timer = setTimeout(() => {
    setShowStartComponent(true);
    }, 4000);

    // 컴포넌트 언마운트 시 타이머 정리
    return () => clearTimeout(timer);
  };


  return (
    <>
            <S.BookContainer className={isAnimating ? 'animate' : ''} onClick={handleClick} >
              <S.Earth className={isAnimating ? 'animate' : ''} />
              <S.AnimateButton className={isAnimating ? 'animate' : ''}>Click Me!</S.AnimateButton>
            </S.BookContainer>
            <S.Introduce className={isAnimating ? 'animate' : ''} />
            {showStartComponent && <Start />}
            <S.LoudSpeaker className={isAnimating ? 'animate' : ''} />
              <S.ChatBox className={isAnimating ? 'animate' : ''} />
              <S.Chatting top="45.4rem" left="4rem" className={isAnimating ? 'animate' : ''}>
              <S.ChattingText>
                <S.Bold>무코</S.Bold>
                <S.Normal>가 무엇인가요?</S.Normal>
                </S.ChattingText>
                </S.Chatting>
              <S.Chatting top="49.1rem" left="6.5rem" className={isAnimating ? 'animate' : ''}>
              <S.ChattingText>
              <S.Normal>무드를 담은 바코드아트, </S.Normal>
                <S.Bold>MoOOd_barCOde</S.Bold>
                </S.ChattingText>
                </S.Chatting>
                <S.Chatting top="52rem" left="1.65rem" className={isAnimating ? 'animate' : ''}>
              <S.ChattingText >
              <S.Normal>무코는 일상의 순간들을 모아 <S.Bold>무드바코드</S.Bold>로 만들어 드립니다.</S.Normal>
                </S.ChattingText>
                </S.Chatting>
              </>
  )
}
