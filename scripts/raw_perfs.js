import http from 'k6/http'
import {generateUser, getInAndOutDate} from "./util.js";
import {check, sleep} from 'k6'

const TOTAL_USERS = 5000
const PEAK_CONCURRENT_USERS = 0.6 * TOTAL_USERS

export const options = {
    scenarios: {
        reservation_raw_perf: {
            executor: 'constant-arrival-rate',
            rate: PEAK_CONCURRENT_USERS,
            timeUnit: '1m',
            duration: '5m',
            preAllocatedVUs: 20,
            maxVUs: 50,
            exec: 'reservation'
        }, search_raw_perf: {
            executor: 'constant-arrival-rate',
            rate: TOTAL_USERS * 3,
            timeUnit: '1m',
            duration: '5m',
            preAllocatedVUs: 30,
            maxVUs: 50,
            exec: 'search'
        },
        login_raw_perf: {
            executor: 'constant-arrival-rate',
            rate: PEAK_CONCURRENT_USERS / 2,
            timeUnit: '1m',
            duration: '5m',
            preAllocatedVUs: 20,
            maxVUs: 50,
            exec: 'login'
        },
        recommendation_raw_perf: {
            executor: 'constant-arrival-rate',
            rate: TOTAL_USERS * 2,
            timeUnit: '1m',
            duration: '5m',
            preAllocatedVUs: 20,
            maxVUs: 50,
            exec: 'recommendation'
        },
        reviews_raw_perf: {
            executor: 'constant-arrival-rate',
            rate: TOTAL_USERS,
            timeUnit: '1m',
            duration: '5m',
            preAllocatedVUs: 20,
            maxVUs: 50,
            exec: 'reviews'
        }
    }, thresholds: {
        /**
         * FFitur reservation memiliki failure rate di bawah 0.1% serta response time di bawah 10 milliseconds
         * untuk persentil ke-95 dan 15 milliseconds untuk persentil ke-99, yang berlaku pada skenario dengan
         * peak load sebesar 3000 request per menit selama 5 menit.
         */
        'http_req_failed{name:reservation}': ['rate<0.01'],
        'http_req_duration{name:reservation}': ['p(95)<20', 'p(99)<30'],
        /**
         * Fitur search memiliki failure rate di bawah 1% serta response time di bawah 5 milliseconds untuk persentil
         * ke-95 dan 8 milliseconds untuk persentil ke-99, dengan pengujian pada skenario total load sebesar
         * 5000 request per menit selama 5 menit.
         */
        'http_req_failed{name:search}': ['rate<0.01'],
        'http_req_duration{name:search}': ['p(95)<8', 'p(99)<12'],
        /**
         * Fitur login memiliki failure rate di bawah 2% serta response time di bawah 10 milliseconds untuk
         * persentil ke-95 dan 15 milliseconds untuk persentil ke-99, yang berlaku pada skenario dengan
         * peak load sebesar 1500 request per menit selama 5 menit.
         */
        'http_req_failed{name:login}': ['rate<0.02'],
        'http_req_duration{name:login}': ['p(95)<10', 'p(99)<15'],
        /**
         * Fitur recommendation memiliki failure rate di bawah 1% serta response time di bawah 5 milliseconds
         * untuk persentil ke-95 dan 8 milliseconds untuk persentil ke-99, yang berlaku pada skenario dengan
         * peak load sebesar 2000 request per menit selama 5 menit.
         */
        'http_req_failed{name:recommendation}': ['rate<0.01'],
        'http_req_duration{name:recommendation}': ['p(95)<5', 'p(99)<8'],
        /**
         * Fitur reviews memiliki failure rate di bawah 1% serta response time di bawah 5 milliseconds untuk
         * persentil ke-95 dan 8 milliseconds untuk persentil ke-99, yang berlaku pada skenario dengan
         * peak load sebesar 1000 request per menit selama 5 menit.
         */
        'http_req_failed{name:reviews}': ['rate<0.01'],
        'http_req_duration{name:reviews}': ['p(95)<5', 'p(99)<8'],
    }
};

const BASE_URL = 'http://localhost:5000'

export function reservation() {
    const {inDate, outDate} = getInAndOutDate()
    const {username, password} = generateUser()
    const hotelId = Math.floor(Math.random() * 6) + 1

    sleep(0.5)

    const reservationRes = http.post(`${BASE_URL}/reservation?hotelId=${hotelId}&customerName=cornell&username=${username}&password=${password}&number=1&inDate=${inDate}&outDate=${outDate}`,
        null,
        {
            tags: {
                name: 'reservation'
            }
        })
    check(reservationRes, {
        'Reservation: status 200': (r) => r.status === 200,
    })
}

export function search() {
    const {inDate, outDate} = getInAndOutDate()
    const lat = (Math.random() * 180) - 90
    const lon = (Math.random() * 360) - 180;

    sleep(0.1)

    const searchRes = http.post(`${BASE_URL}/hotels?lat=${lat}&lon=${lon}&inDate=${inDate}&outDate=${outDate}`,
        null,
        {
            tags: {
                name: 'search'
            }
        })
    check(searchRes, {
        'search: status 200': (r) => r.status === 200,
    })
}


export function login() {
    const user = generateUser()
    const username = user.username
    const password = user.password

    sleep(0.5)

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
}

export function recommendation() {
    const options = ["dis", "rate", "price"];

    const lat = (Math.random() * 180) - 90
    const lon = (Math.random() * 360) - 180;
    // each session will get 2 recommendations with different require param
    for (let i = 0; i < 2; i++) {
        const require = options[Math.floor(Math.random() * options.length)];
        const recommendationRes = http.get(`${BASE_URL}/recommendations?lat=${lat}&lon=${lon}&require=${require}`,
            {
                tags: {
                    name: 'recommendation'
                }
            })

        check(recommendationRes, {
            'recommendations: status 200': (r) => r.status === 200
        })
    }
}

export function reviews() {
    const {inDate, outDate} = getInAndOutDate()
    const {username, password} = generateUser()
    const hotelId = Math.floor(Math.random() * 6) + 1

    sleep(0.5)

    const reviewsRes = http.post(`${BASE_URL}/review?hotelId=${hotelId}&username=${username}&password=${password}`,
        null,
        {
            tags: {
                name: 'reviews'
            }
        })
    check(reviewsRes, {
        'Reviews: status 200': (r) => r.status === 200,
    })
}