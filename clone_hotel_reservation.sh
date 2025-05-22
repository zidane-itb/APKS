git clone --depth 1 https://github.com/delimitrou/DeathStarBench.git
cd ./DeathStarBench || exit
mv hotelReservation ..
cd ..
rm -rf ./DeathStarBench
cp docker-compose.yml hotelReservation/
cp server_fe.go hotelReservation/services/frontend/server.go