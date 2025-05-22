import {use_case_1} from "./use_case_1.js";
import {use_case_2} from "./use_case_2.js";
import {use_case_3} from "./use_case_3.js";
import {use_case_4} from "./use_case_4.js";

const TOTAL_USERS = 5000
const PEAK_CONCURRENT_USERS = 0.6 * TOTAL_USERS
const USE_CASE_1_PERCENTAGE = 0.2
const USE_CASE_2_PERCENTAGE = 0.45
const USE_CASE_3_PERCENTAGE = 0.3
const USE_CASE_4_PERCENTAGE = 0.05

export const options = {
    scenarios: {
        use_case_1: {
            executor: 'ramping-vus',
            stages: [
                {duration: '5m', target: USE_CASE_1_PERCENTAGE * PEAK_CONCURRENT_USERS},
                {duration: '10m', target: USE_CASE_1_PERCENTAGE * PEAK_CONCURRENT_USERS},
                {duration: '2m', target: 0},
            ],
            exec: 'use_case_1_sc'
        },
        use_case_2: {
            executor: 'ramping-vus',
            stages: [
                {duration: '5m', target: USE_CASE_2_PERCENTAGE * PEAK_CONCURRENT_USERS},
                {duration: '10m', target: USE_CASE_2_PERCENTAGE * PEAK_CONCURRENT_USERS},
                {duration: '2m', target: 0},
            ],
            exec: 'use_case_2_sc'
        },
        use_case_3: {
            executor: 'ramping-vus',
            stages: [
                {duration: '5m', target: USE_CASE_3_PERCENTAGE * PEAK_CONCURRENT_USERS},
                {duration: '10m', target: USE_CASE_3_PERCENTAGE * PEAK_CONCURRENT_USERS},
                {duration: '2m', target: 0},
            ],
            exec: 'use_case_3_sc'
        },
        // use_case_4: {
        //     executor: 'ramping-vus',
        //     stages: [
        //         {duration: '5m', target: USE_CASE_4_PERCENTAGE * PEAK_CONCURRENT_USERS},
        //         {duration: '10m', target: USE_CASE_4_PERCENTAGE * PEAK_CONCURRENT_USERS},
        //         {duration: '2m', target: 0},
        //     ],
        //     exec: 'use_case_4_sc'
        // }
    },
    thresholds: {
        /**
         * Fitur reservation memiliki failure rate di bawah 0.1% serta response time di bawah 15 milliseconds
         * untuk persentil ke-95 dan 25 milliseconds untuk persentil ke-99.
         */
        'http_req_failed{name:reservation}': ['rate<0.001'],
        'http_req_duration{name:reservation}': ['p(95)<15', 'p(99)<25'],
        /**
         * Fitur login memiliki failure rate di bawah 2% serta response time di bawah 10 milliseconds untuk
         * persentil ke-95 dan 15 milliseconds untuk persentil ke-99.
         */
        'http_req_failed{name:login}': ['rate<0.02'],
        'http_req_duration{name:login}': ['p(95)<10', 'p(99)<15'],
        /**
         * Fitur availability memiliki failure rate di bawah 1% serta response time di bawah 8 milliseconds
         * untuk persentil ke-95 dan 12 milliseconds untuk persentil ke-99.
         */
        'http_req_failed{name:availability}': ['rate<0.01'],
        'http_req_duration{name:availability}': ['p(95)<8', 'p(99)<12']
    }
};

export function use_case_1_sc() {
    use_case_1()
}

export function use_case_2_sc() {
    use_case_2()
}

export function use_case_3_sc() {
    use_case_3()
}

export function use_case_4_sc() {
    use_case_4()
}