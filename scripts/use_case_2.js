import http from 'k6/http'
import {check, sleep, group} from 'k6'
import {generateUser, getRandRange} from "./util.js";

const BASE_URL = 'http://localhost:5000'

export function use_case_2() {
    let username
    let password

    group('login', function () {
        const user = generateUser()
        username = user.username
        password = user.password
        const loginRes = http.post(`${BASE_URL}/user?username=${username}&password=${password}`,
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

    group('recommendations', function () {
        const options = ["dis", "rate", "price"];

        const lat = (Math.random() * 180) - 90
        const lon = (Math.random() * 360) - 180;

        for (let i = 0; i < 5; i++) {
            const latAdjustment = getRandRange(-5, 5)
            const longAdjustment = getRandRange(-5, 5)
            const require = options[Math.floor(Math.random() * options.length)];
            const recommendationRes = http.get(`${BASE_URL}/recommendations?lat=${lat + latAdjustment}&lon=${lon + longAdjustment}&require=${require}`,
                {
                    tags: {
                        name: 'recommendation'
                    }
                })

            check(recommendationRes, {
                'recommendations: status 200': (r) => r.status === 200
            })
            // think time
            sleep(5)
        }
    })

    // pacing
    sleep(2)
}
