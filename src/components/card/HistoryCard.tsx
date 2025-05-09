import React from "react";
import styled from "styled-components";
import { walkwayHistoryType } from "src/apis/review/review.type";
import CourseImage from "../map/CourseImage";

interface HistoryCardProps {
  history: walkwayHistoryType;
  onClick?: (walkwayId: number) => void;
}

const TrailContents = styled.div`
  flex: 0 0 auto;
  width: 280px;
  height: 100%;
  background: #ffffff;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
  border-radius: 20px;
  margin-left: 7px;
  display: flex;
  align-items: center;
  padding: 10px;
  gap: 16px;
`;

const MytrailInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 8px;
  width: 60%;
  padding-right: 10px;
`;

const MytrailHeader = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  font-size: 12px;
  font-weight: 900;
`;

const MytrailContent = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 12px;
`;

const Mytrail = styled.div`
  font-size: 12px;
  color: #054630;
  font-weight: 600;
`;

const MytrailLength = styled.div`
  font-size: 40px;
  font-family: "Lalezar";
`;

const HistoryCard = ({ history, onClick }: HistoryCardProps) => (
  <TrailContents onClick={() => onClick?.(history.walkwayId)}>
    <div>
      <CourseImage
        src={history.courseImageUrl}
        alt="산책로 이미지"
        size="100px"
      />
    </div>
    <MytrailInfo>
      <MytrailHeader>
        <Mytrail>{history.date}</Mytrail>
      </MytrailHeader>
      <MytrailContent>
        <div>코스 길이</div>
        <MytrailLength>
          {history.distance}
          <span style={{ fontSize: "12px", fontFamily: "Pretendard" }}>km</span>
        </MytrailLength>
      </MytrailContent>
    </MytrailInfo>
  </TrailContents>
);

export default HistoryCard;
