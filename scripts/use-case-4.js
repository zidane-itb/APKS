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
    let inDate
    let outDate

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

    group('Get Random Hotels', function () {
        inDate = 19 + getRandRange(-3, 3)
        outDate = inDate + 2
        const lat = 38.0235 + (Math.floor(Math.random() * 482) - 240.5) / 1000.0;
        const lon = -122.095 + (Math.floor(Math.random() * 326) - 157.0) / 1000.0;

        const randHotels = http.get(`${BASE_URL}/hotels?inDate=2025-06-${inDate}&outDate=2025-06-${outDate}&lat=${lat}&lon=${lon}`,{
            tags: {
                name: 'getHotels'
            }
        })

        check(randHotels, {
            'Get Hotels: status 200': (r) => r.status === 200,
        })

        const tHotels = randHotels.json()['features']
        const ra = Math.floor(Math.random() * tHotels.length)
        if(tHotels[ra]){
            hotelId = tHotels[ra]['id']
        }

        // think time
        sleep(1)
    })

    group('Reserve', function () {
        const availabilityRes = http.post(`${BASE_URL}/reservation?hotelId=${hotelId}&inDate=2025-06-${inDate}&outDate=2025-06-${outDate}`, {
            tags: {
                name: 'availability'
            }
        })
        check(availabilityRes, {
            'Reservation: status 200': (r) => r.status === 200,
        })

        const reservationRes = http.post(`${BASE_URL}/reservation?hotelId=${hotelId}&customerName=cornell&username=${username}&password=${password}&number=1&inDate=2015-04-${inDate}&outDate=2015-04-${outDate}`)
        check(reservationRes, {
            'Reservation: status 200': (r) => r.status === 200,
        })
    })

    // pacing
    sleep(2)
}