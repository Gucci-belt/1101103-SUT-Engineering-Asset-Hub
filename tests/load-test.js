import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    // Simulate ramp-up of traffic from 0 to 50 users over 30s
    stages: [
        { duration: '30s', target: 20 }, // Wrap up to 20 users
        { duration: '1m', target: 50 },  // Stay at 50 users for 1 minute
        { duration: '30s', target: 0 },  // Ramp down to 0 users
    ],
};

export default function () {
    // 1. Visit Home Page
    const res = http.get('https://gucci-belt.me');
    check(res, { 'status was 200': (r) => r.status == 200 });

    // 2. Visit API (Get Assets) - Verify Backend & DB
    const resApi = http.get('https://gucci-belt.me/api/assets');
    check(resApi, { 'api status was 200': (r) => r.status == 200 });

    sleep(1);
}
