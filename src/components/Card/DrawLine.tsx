import React, { useEffect, useState } from "react";

import { Button, Image } from "antd";

type Point = {
    x: number;
    y: number;
}

type Line = {
    start: Point;
    end: Point;
}

type DrawLineProps = {
    onLineDraw: (start: Point, end: Point) => void;
    url: string;
    init?: Line;
}

const DrawLine: React.FC<DrawLineProps> = ({ onLineDraw, url, init }) => {
    const [points, setPoints] = useState<Point[]>([]);
    const [line, setLine] = useState<Line | null>(init || null);

    console.log("Init:", init)

    const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setPoints(prevPoints => {
            if (prevPoints.length === 1) {
                const newLine = { start: prevPoints[0], end: { x, y } };
                setLine(newLine);
                onLineDraw(newLine.start, newLine.end);
                return [];
            } else {
                return [{ x, y }];
            }
        });
    }

    useEffect(() => {
        if (init) {
            setLine(init);
        }
    }, [init])

    return (
        <div>
            <div style={{
                position: 'relative',
                width: '1000px',
                height: '500px',
                display: 'inline-block'
            }}
                onClick={handleClick}>
                {line && (
                    <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 2 }} >
                        <line
                            x1={line.start.x}
                            y1={line.start?.y}
                            x2={line.end?.x}
                            y2={line.end?.y}
                            stroke="#a2fca2"
                            strokeWidth="3"
                        />
                    </svg>
                )}
                <Image
                width='1000px'
                height='500px'
                style={{zIndex:1, position: 'relative'}}
                preview={false}
                src={url}/>
            </div>
        </div>
    );
}

export default DrawLine