import http from 'k6/http'
import {check, sleep, group} from 'k6'
import {generateUser, getInAndOutDate} from "./util.js";

const BASE_URL = 'http://localhost:5000'

export function use_case_1() {
    let hotel
    let username
    let password

    group('login', function () {
        const user = generateUser()
        username = user.username
        password = user.password
        const loginRes = http.get(`${BASE_URL}/user?username=${username}&password=${password}`,
            null,
            {
                tags: {
                    name: 'login'
                }
            })

        check(loginRes, {
            'Login: status 200': (r) => r.status === 200
        })

        // think time
        sleep(2)
    })

    group('recommendations', function () {
        const options = ["dis", "rate", "price"];

        const lat = (Math.random() * 180) - 90
        const lon = (Math.random() * 360) - 180;

        const featureArr = []
        // each session will get 2 recommendations with different require param
        for (let i = 0; i < 2; i++) {
            const require = options[Math.floor(Math.random() * options.length)];
            const recommendationRes = http.get(`${BASE_URL}/recommendations?lat=${lat}&lon=${lon}&require=${require}`,
                null,
                {
                    tags: {
                        name: 'recommendation'
                    }
                })

            check(recommendationRes, {
                'recommendations: status 200': (r) => r.status === 200
            })

            featureArr.push(...recommendationRes.json()['features'])

            // think time
            sleep(5)
        }

        hotel = featureArr[Math.floor(Math.random() * featureArr.length)];
    })

    group('reserve', function () {
        const {inDate, outDate} = getInAndOutDate()
        const lat = hotel['address']['lat']
        const lon = hotel['address']['lon']
        const availabilityRes = http.post(`${BASE_URL}/hotels?lat=${lat}&lon=${lon}&inDate=2025-05-${inDate}&outDate=2025-05-${outDate}`,
            null,
            {
                tags: {
                    name: 'availability'
                }
            })
        check(availabilityRes, {
            'Reservation: status 200': (r) => r.status === 200,
        })

        const hotelId = hotel['id']
        const reservationRes = http.post(`${BASE_URL}/reservation?hotelId=${hotelId}&customerName=cornell&username=${username}&password=${password}&number=1&inDate=2025-05-${inDate}&outDate=2025-05-${outDate}`,
            null,
            {
                tags: {
                    name: 'reservation'
                }
            })
        check(reservationRes, {
            'Reservation: status 200': (r) => r.status === 200,
        })
    })

    // pacing
    sleep(10)
}


