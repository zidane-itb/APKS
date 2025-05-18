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

        for (let i = 0; i < 5; i++) {
            const latAdjustment = getRandRange(-5, 5)
            const longAdjustment = getRandRange(-5, 5)
            const require = options[Math.floor(Math.random() * options.length)];
            const recommendationRes = http.get(`${BASE_URL}/recommendations?lat=${lat+latAdjustment}&lon=${lon+longAdjustment}&require=${require}`, {
                tags: {
                    name: 'recommendation'
                }
            })

            check(recommendationRes, {
                'recommendations: status 200': (r) => r.status === 200
            })
        }
    })

    // pacing
    sleep(2)
}
