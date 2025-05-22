import {use_case_1} from "./use_case_1.js";
import {use_case_2} from "./use_case_2.js";
import {use_case_3} from "./use_case_3.js";
import {use_case_4} from "./use_case_4.js";
import {use_case_5} from "./use_case_5.js";

const PEAK_CONCURRENT_USERS = 600
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
        use_case_4: {
            executor: 'ramping-vus',
            stages: [
                {duration: '5m', target: USE_CASE_4_PERCENTAGE * PEAK_CONCURRENT_USERS},
                {duration: '10m', target: USE_CASE_4_PERCENTAGE * PEAK_CONCURRENT_USERS},
                {duration: '2m', target: 0},
            ],
            exec: 'use_case_4_sc'
        }
    },
    thresholds: {
        /**
         *
         */
        'http_req_failed{name:reservation}': ['rate<0.01'],
        'http_req_duration{name:reservation}': ['p(95)<8', 'p(99)<15'],
        /**
         *
         */
        'http_req_failed{name:login}': ['rate<2'],
        'http_req_duration{name:login}': ['p(95)<5', 'p(99)<10'],
        /**
         *
         */
        'http_req_failed{name:availability}': ['rate<1'],
        'http_req_duration{name:availability}': ['p(95)<5', 'p(99)<10']
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

export function use_case_5_sc() {
    use_case_5()
}