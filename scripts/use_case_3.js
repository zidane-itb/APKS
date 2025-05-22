import http from 'k6/http'
import {check, sleep, group} from 'k6'
import {getRandRange} from './util.js'

const BASE_URL = 'http://localhost:5000'

export function use_case_3() {
    group('Get Random Hotels', function () {
        const inDate = 19 + getRandRange(-3, 3)
        const outDate = inDate + 2
        let lat = 38.0235 + (Math.floor(Math.random() * 482) - 240.5) / 1000.0;
        let lon = -122.095 + (Math.floor(Math.random() * 326) - 157.0) / 1000.0;

        const rev = http.get(`${BASE_URL}/hotels?inDate=2025-06-${inDate}&outDate=2025-06-${outDate}&lat=${lat}&lon=${lon}`,
            {
                tags: {
                    name: 'getHotels'
                }
            })

        check(rev, {
            'Get Hotels: status 200': (r) => r.status === 200,
        })

        // think time
        sleep(1)
    })
}
