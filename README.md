# Room Occupancy Dashboard

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-764ABC?logo=redux&logoColor=white)
![Ant Design](https://img.shields.io/badge/Ant_Design-0170FE?logo=antdesign&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)

Web dashboard for a camera-based **classroom people-counting** system (team project). Cameras in each room count people crossing a virtual line; the dashboard shows live occupancy against room capacity and the history over time.

## Features

- **Room overview:** current headcount vs. capacity, highlighted when a room is getting full
- **History chart:** people count over a selectable date range
- **Room management:** add and update rooms, their capacity, and attached cameras
- **Counting line editor:** draw the line on a camera snapshot that the counting model uses
- **Auth:** login with JWT, protected routes, profile page

## Tech stack

React 18 · TypeScript · Redux Toolkit · React Router · Ant Design & Ant Design Charts · Chart.js · Axios · Docker

## Project structure

```
src/
  components/Card/   Room, RoomList, RoomChart, UpdateRoom, DrawLine
  components/Table/  Tabular view of rooms
  services/          API clients (auth, user, room)
  store/             Redux slices (auth, user, room)
  types/             Room, camera, and time-series types
```

## Run locally

```bash
npm install
REACT_APP_API_URL=<backend-url> npm start
```

Or with Docker:

```bash
docker compose up --build    # http://localhost:9091
```
