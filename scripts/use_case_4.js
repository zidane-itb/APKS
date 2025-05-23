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
    let hotel

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

    group('recommendations', function () {
            const options = ["dis", "rate", "price"];
    
            const lat = (Math.random() * 180) - 90
            const lon = (Math.random() * 360) - 180;
    
            const featureArr = []
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
    
                featureArr.push(...recommendationRes.json()['features'])
    
                // think time
                sleep(5)
            }
    
            hotel = featureArr[Math.floor(Math.random() * featureArr.length)];
    })

    if(!hotel['id']) {
        hotelId = Math.floor(Math.random() * 6) + 1
        sleep(1)
    }else {
        hotelId = hotel['id']
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