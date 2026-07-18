from calculations.planets import RASHIS

# Classical Bhinnashtakavarga benefic-place tables (Brihat Parashara Hora
# Shastra). For each planet's varga, every contributor (7 planets + Lagna)
# donates a bindu in the listed houses counted from the contributor's sign.
# Row totals: Sun 48, Moon 49, Mars 39, Mercury 54, Jupiter 56, Venus 52,
# Saturn 39 — Sarvashtakavarga total 337.
BAV_TABLES = {
    'Sun': {
        'Sun': [1, 2, 4, 7, 8, 9, 10, 11],
        'Moon': [3, 6, 10, 11],
        'Mars': [1, 2, 4, 7, 8, 9, 10, 11],
        'Mercury': [3, 5, 6, 9, 10, 11, 12],
        'Jupiter': [5, 6, 9, 11],
        'Venus': [6, 7, 12],
        'Saturn': [1, 2, 4, 7, 8, 9, 10, 11],
        'Lagna': [3, 4, 6, 10, 11, 12],
    },
    'Moon': {
        'Sun': [3, 6, 7, 8, 10, 11],
        'Moon': [1, 3, 6, 7, 10, 11],
        'Mars': [2, 3, 5, 6, 9, 10, 11],
        'Mercury': [1, 3, 4, 5, 7, 8, 10, 11],
        'Jupiter': [1, 4, 7, 8, 10, 11, 12],
        'Venus': [3, 4, 5, 7, 9, 10, 11],
        'Saturn': [3, 5, 6, 11],
        'Lagna': [3, 6, 10, 11],
    },
    'Mars': {
        'Sun': [3, 5, 6, 10, 11],
        'Moon': [3, 6, 11],
        'Mars': [1, 2, 4, 7, 8, 10, 11],
        'Mercury': [3, 5, 6, 11],
        'Jupiter': [6, 10, 11, 12],
        'Venus': [6, 8, 11, 12],
        'Saturn': [1, 4, 7, 8, 9, 10, 11],
        'Lagna': [1, 3, 6, 10, 11],
    },
    'Mercury': {
        'Sun': [5, 6, 9, 11, 12],
        'Moon': [2, 4, 6, 8, 10, 11],
        'Mars': [1, 2, 4, 7, 8, 9, 10, 11],
        'Mercury': [1, 3, 5, 6, 9, 10, 11, 12],
        'Jupiter': [6, 8, 11, 12],
        'Venus': [1, 2, 3, 4, 5, 8, 9, 11],
        'Saturn': [1, 2, 4, 7, 8, 9, 10, 11],
        'Lagna': [1, 2, 4, 6, 8, 10, 11],
    },
    'Jupiter': {
        'Sun': [1, 2, 3, 4, 7, 8, 9, 10, 11],
        'Moon': [2, 5, 7, 9, 11],
        'Mars': [1, 2, 4, 7, 8, 10, 11],
        'Mercury': [1, 2, 4, 5, 6, 9, 10, 11],
        'Jupiter': [1, 2, 3, 4, 7, 8, 10, 11],
        'Venus': [2, 5, 6, 9, 10, 11],
        'Saturn': [3, 5, 6, 12],
        'Lagna': [1, 2, 4, 5, 6, 7, 9, 10, 11],
    },
    'Venus': {
        'Sun': [8, 11, 12],
        'Moon': [1, 2, 3, 4, 5, 8, 9, 11, 12],
        'Mars': [3, 5, 6, 9, 11, 12],
        'Mercury': [3, 5, 6, 9, 11],
        'Jupiter': [5, 8, 9, 10, 11],
        'Venus': [1, 2, 3, 4, 5, 8, 9, 10, 11],
        'Saturn': [3, 4, 5, 8, 9, 10, 11],
        'Lagna': [1, 2, 3, 4, 5, 8, 9, 11],
    },
    'Saturn': {
        'Sun': [1, 2, 4, 7, 8, 10, 11],
        'Moon': [3, 6, 11],
        'Mars': [3, 5, 6, 10, 11, 12],
        'Mercury': [6, 8, 9, 10, 11, 12],
        'Jupiter': [5, 6, 11, 12],
        'Venus': [6, 11, 12],
        'Saturn': [3, 5, 6, 11],
        'Lagna': [1, 3, 4, 6, 10, 11],
    },
}


def calculate_ashtakavarga(planets_data, lagna_rashi):
    """
    Full Parashari Ashtakavarga: Bhinnashtakavarga (BAV) bindus of the seven
    planets across the 12 signs, plus the Sarvashtakavarga (SAV) row.
    Returns {planet: [12 bindus, Aries..Pisces], ..., 'Sarva': [...]}.
    """
    ref_signs = {
        p: RASHIS.index(planets_data[p]['rashi'])
        for p in ('Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn')
    }
    ref_signs['Lagna'] = RASHIS.index(lagna_rashi)

    result = {}
    sarva = [0] * 12
    for varga_planet, table in BAV_TABLES.items():
        row = [0] * 12
        for contributor, places in table.items():
            base = ref_signs[contributor]
            for house in places:
                row[(base + house - 1) % 12] += 1
        result[varga_planet] = row
        sarva = [s + b for s, b in zip(sarva, row)]

    result['Sarva'] = sarva
    return result
