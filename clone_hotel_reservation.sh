git clone --depth 1 https://github.com/delimitrou/DeathStarBench.git
cd ./DeathStarBench || exit
rm -rf !(hotelReservation)
mv hotelReservation ..
cd ..
rm -rf ./DeathStarBench