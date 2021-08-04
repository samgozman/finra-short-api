import { getMonthlyPages, getLinksToFiles } from '../../src/utils/parse';

const mounths = [
    'August',
    'July',
    'June',
    'May',
    'April',
    'March',
    'February',
    'January',
    'December',
    'November',
    'October',
    'September',
];

const dayOfTheWeek = ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Monday'];

test('Finra: Should get correct URL list for each mounth', async () => {
    const list = await getMonthlyPages();
    expect(Object.keys(list).length).toBe(12);
    for (const key in list) {
        // Test each url in list
        expect(list[key]).toContain('regsho.finra.org');

        // Test keys
        const parts = key.split(' ');
        expect(parts.length).toBe(2);
        // - Check mounth name
        expect(mounths).toContain(parts[0]);
        // - Check year
        const year = Number.parseInt(parts[1]);
        expect(year).toBeLessThanOrEqual(new Date().getFullYear());
        expect(year).toBeGreaterThanOrEqual(new Date().getFullYear() - 1);
    }
});

test('Finra: Should get URL list for each day', async () => {
    const list = await getLinksToFiles('http://regsho.finra.org/regsho-Index.html');
    expect(Object.keys(list).length).toBeGreaterThan(0);
    for (const key in list) {
        // Test each url in list
        expect(list[key]).toContain('regsho.finra.org');
        expect(list[key]).toContain('.txt');

        // Test keys
        const parts = key.split(' ');
        expect(parts.length).toBe(2);
        // - Check day of the week name
        expect(dayOfTheWeek).toContain(parts[0]);
    }
});
