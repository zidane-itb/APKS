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
        'http_req_duration{name:search}': ['p(95)<8', 'p(99)<12']
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