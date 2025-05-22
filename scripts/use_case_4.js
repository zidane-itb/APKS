import http from 'k6/http'
import {check, sleep, group} from 'k6'
import {generateUser, getRandRange} from "./util.js";
const BASE_URL = 'http://localhost:5000'

export function use_case_4() {
    let hotelId
    let username
    let password
    let inDate
    let outDate

    group('Login', function () {
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
        sleep(1)
    })

    group('Get Random Hotels', function () {
        inDate = 19 + getRandRange(-3, 3)
        outDate = inDate + 2
        const lat = 38.0235 + (Math.floor(Math.random() * 482) - 240.5) / 1000.0;
        const lon = -122.095 + (Math.floor(Math.random() * 326) - 157.0) / 1000.0;

        const randHotels = http.get(`${BASE_URL}/hotels?inDate=2025-06-${inDate}&outDate=2025-06-${outDate}&lat=${lat}&lon=${lon}`, {
            tags: {
                name: 'getHotels'
            }
        })

        check(randHotels, {
            'Get Hotels: status 200': (r) => r.status === 200,
        })

        const tHotels = randHotels.json()['features']
        const ra = Math.floor(Math.random() * tHotels.length)
        if (tHotels[ra]) {
            hotelId = tHotels[ra]['id']
        }

        // think time
        sleep(1)
    })

    if(!hotelId) {
        hotelId = Math.floor(Math.random() * 6) + 1
        sleep(1)
    }

    group('Reviews', function () {
        const reviewsHotels = http.get(`${BASE_URL}/review?hotelId=${hotelId}&username=${username}&password=${password}`,
            {
                tags: {
                    name: 'reviews'
                }
            })
        check(reviewsHotels, {
            'Get params: status 200': (r) => r.status === 200,
        })
    })

    // pacing
    sleep(2)
}