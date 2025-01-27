// src/pages/TrailListPage.tsx
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import TrailCardAll from "../../components/TrailCardAll_View";
import { Trail, getTrails } from "../../apis/trail";

function TrailListPage() {
  const [trails, setTrails] = useState<Trail[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastWalkwayId, setLastWalkwayId] = useState<number | undefined>(
    undefined
  );

  useEffect(() => {
    const fetchTrails = async () => {
      try {
        const fetchedTrails = await getTrails(lastWalkwayId);
        setTrails((prevTrails) => [...prevTrails, ...fetchedTrails]);
        setLoading(false);
        setLastWalkwayId(fetchedTrails[fetchedTrails.length - 1]?.walkwayId);
      } catch (err) {
        setError("Failed to fetch trails");
        setLoading(false);
      }
    };

    fetchTrails();
  }, [lastWalkwayId]);

  return (
    <Wrapper>
      {loading && <div>Loading...</div>}
      {error && <div>{error}</div>}
      {!loading && !error && (
        <List>
          {trails.map((trail) => (
            <TrailCardAll key={trail.walkwayId} trail={trail} />
          ))}
        </List>
      )}
    </Wrapper>
  );
}

export default TrailListPage;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 15px;
`;
