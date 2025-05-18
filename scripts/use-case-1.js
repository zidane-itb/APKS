import http from 'k6/http'
import { check, sleep, group } from 'k6'
import {generateUser, getRandRange} from "./util.js";

export const options = {
    stages: [
        { duration: '1m', target: 200 },
        { duration: '2m', target: 200 },
        { duration: '1m', target: 0 },
    ],
    thresholds: {
        'http_req_duration': ['p(95)<10', 'p(99)<15'],
        'checks': ['rate>0.9999'],
    }
}

const BASE_URL = 'http://localhost:5000'

export default function () {
    let hotelId
    let username
    let password

    group('Login', function () {
        const user = generateUser()
        username = user.username
        password = user.password
        const loginRes = http.get(`${BASE_URL}/user?username=${username}&password=${password}`, {
            tags: {
                name: 'login'
            }
        })

        check(loginRes, {
            'Login: status 200': (r) => r.status === 200
        })

        // think time
        sleep(1)
    })

    group('Get Recommendations', function () {
        const options = ["dis", "rate", "price"];

        const lat = (Math.random() * 180) - 90
        const lon = (Math.random() * 360) - 180;

        const featureArr = []
        // each session will get 2 recommendations with different require param
        for (let i = 0; i < 2; i++) {
            const require = options[Math.floor(Math.random() * options.length)];
            const recommendationRes = http.get(`${BASE_URL}/recommendations?lat=${lat}&lon=${lon}&require=${require}`, {
                tags: {
                    name: 'recommendation'
                }
            })

            check(recommendationRes, {
                'recommendations: status 200': (r) => r.status === 200
            })

            featureArr.push(...recommendationRes.json()['features'])
        }

        hotelId = featureArr[Math.floor(Math.random() * featureArr.length)]['id'];

        // think time
        sleep(1)
    })

    // only reserve 30% of the time
    if (Math.random() > 0.30) {
        // pacing
        sleep(2)
        return
    }

    group('Reserve', function () {
        const inDate = 19 + getRandRange(-3, 3)
        const outDate = inDate + getRandRange(1, 3)
        const availabilityRes = http.post(`${BASE_URL}/reservation?hotelId=${hotelId}&inDate=2025-05-${inDate}&outDate=2025-05-${outDate}`, {
            tags: {
                name: 'availability'
            }
        })
        check(availabilityRes, {
            'Reservation: status 200': (r) => r.status === 200,
        })

        const reservationRes = http.post(`${BASE_URL}/reservation?hotelId=${hotelId}&customerName=cornell&username=${username}&password=${password}&number=1&inDate=2025-05-${inDate}&outDate=2025-05-${outDate}`)
        check(reservationRes, {
            'Reservation: status 200': (r) => r.status === 200,
        })
    })

    // pacing
    sleep(2)
}